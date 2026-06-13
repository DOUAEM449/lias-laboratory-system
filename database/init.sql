-- =============================================================================
-- LIAS — Laboratory Information & Administration System
-- PostgreSQL 16 · Database Initialization Script
-- =============================================================================
-- Principle: "Never lose history."
-- Every significant change is recorded. Nothing is hard-deleted.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- EXTENSIONS
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- trigram indexes for full-text search

-- -----------------------------------------------------------------------------
-- CUSTOM ENUM TYPES
-- -----------------------------------------------------------------------------

-- Member lifecycle status
CREATE TYPE member_status AS ENUM (
    'permanent',    -- Official lab member
    'associated',   -- Researcher from another lab, collaborating
    'phd',          -- PhD student
    'retired',      -- Ended career, account frozen
    'former'        -- Left the lab, account deactivated
);

-- Governance / access roles (stored in roles table, enum for mandate context)
CREATE TYPE mandate_scope AS ENUM (
    'laboratory',   -- Lab-wide mandate (director, vice-director)
    'team'          -- Team-scoped mandate (team leader)
);

-- Publication types
CREATE TYPE publication_type AS ENUM (
    'journal_article',
    'conference_paper',
    'book_chapter',
    'thesis',
    'technical_report',
    'preprint',
    'other'
);

-- Event types
CREATE TYPE event_type AS ENUM (
    'conference',
    'seminar',
    'workshop',
    'meeting',
    'other'
);

-- Document types
CREATE TYPE document_type AS ENUM (
    'report',
    'program',
    'attestation',
    'administrative',
    'funding_request',
    'minutes',           -- procès-verbal
    'annual_report',
    'other'
);

-- Equipment status
CREATE TYPE equipment_status AS ENUM (
    'available',
    'assigned',
    'under_maintenance',
    'decommissioned'
);

-- Membership request workflow states
CREATE TYPE request_status AS ENUM (
    'pending',
    'under_review',
    'approved',
    'rejected'
);

-- Equipment request workflow states
CREATE TYPE equipment_request_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'fulfilled'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'event',
    'validation',
    'new_publication',
    'new_document',
    'equipment_request',
    'membership_request',
    'general'
);

-- Convention / collaboration status
CREATE TYPE convention_status AS ENUM (
    'draft',
    'active',
    'expired',
    'terminated'
);

-- Message / discussion thread scope
CREATE TYPE discussion_scope AS ENUM (
    'direct',       -- Between two members
    'team',         -- Team-wide channel
    'event'         -- Tied to a specific event
);

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. MEMBERS
--    Single table for all member types (permanent, associated, phd, retired,
--    former). Status transitions are tracked in member_status_history.
-- -----------------------------------------------------------------------------

CREATE TABLE members (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Authentication
    email               VARCHAR(255)    NOT NULL,
    password_hash       TEXT            NOT NULL,

    -- Personal information
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    phone               VARCHAR(30),
    bio                 TEXT,
    photo_url           TEXT,
    birthdate           DATE,

    -- Academic / professional information
    hire_date           DATE,
    institution         VARCHAR(255),
    origin_lab          VARCHAR(255),   -- For associated members
    interests           TEXT[],         -- Array of research interest tags

    -- Status & access
    status              member_status   NOT NULL DEFAULT 'permanent',
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
                                        -- FALSE for retired / former members

    -- Audit timestamps
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deactivated_at      TIMESTAMPTZ,    -- Set when is_active → FALSE

    -- Constraints
    CONSTRAINT members_email_unique         UNIQUE (email),
    CONSTRAINT members_email_format         CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    CONSTRAINT members_deactivated_logic    CHECK (
        is_active = TRUE OR deactivated_at IS NOT NULL
    )
);

COMMENT ON TABLE  members                 IS 'All lab members: permanent, associated, PhD, retired, former.';
COMMENT ON COLUMN members.interests       IS 'Denormalized array for fast search; normalized tags can be added later.';
COMMENT ON COLUMN members.is_active       IS 'FALSE for retired/former members. Accounts are never deleted.';

-- -----------------------------------------------------------------------------
-- 2. MEMBER STATUS HISTORY
--    Audit trail for every status change. Immutable rows — never updated.
-- -----------------------------------------------------------------------------

CREATE TABLE member_status_history (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID            NOT NULL,
    old_status      member_status,                      -- NULL on first record (account creation)
    new_status      member_status   NOT NULL,
    reason          TEXT,
    changed_by      UUID,                               -- NULL = system / self-registration
    changed_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_msh_member     FOREIGN KEY (member_id)   REFERENCES members (id) ON DELETE RESTRICT,
    CONSTRAINT fk_msh_changed_by FOREIGN KEY (changed_by)  REFERENCES members (id) ON DELETE SET NULL
);

COMMENT ON TABLE member_status_history IS 'Immutable audit log of every member status transition.';

-- -----------------------------------------------------------------------------
-- 3. ROLES
--    Lookup table for named roles (Director, Vice-Director, Team Leader, etc.)
--    permission_level drives access-control logic in the application layer.
-- -----------------------------------------------------------------------------

CREATE TABLE roles (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(100)    NOT NULL,
    description         TEXT,
    permission_level    SMALLINT        NOT NULL DEFAULT 0
                                        CHECK (permission_level >= 0 AND permission_level <= 100),

    CONSTRAINT roles_name_unique UNIQUE (name)
);

COMMENT ON COLUMN roles.permission_level IS '0 = basic member, 100 = super-admin. Application enforces ACL.';

-- Seed canonical roles
INSERT INTO roles (name, description, permission_level) VALUES
    ('Administrator',   'Full system access',                               100),
    ('Director',        'Lab director — validates memberships and reports',  90),
    ('Vice-Director',   'Assists the director',                              80),
    ('Team Leader',     'Responsible for a research team',                   60),
    ('Member',          'Standard lab member',                               10);

-- -----------------------------------------------------------------------------
-- 4. TEAMS
--    Research teams within the laboratory.
--    leader_id is a convenience denorm; authority is formally held via mandates.
-- -----------------------------------------------------------------------------

CREATE TABLE teams (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150)    NOT NULL,
    description     TEXT,
    leader_id       UUID,           -- Current team leader (also in mandates)
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT teams_name_unique    UNIQUE (name),
    CONSTRAINT fk_teams_leader      FOREIGN KEY (leader_id) REFERENCES members (id) ON DELETE SET NULL
);

COMMENT ON COLUMN teams.leader_id IS 'Denormalized shortcut. Authoritative record is in mandates table.';

-- =============================================================================
-- TEMPORAL / JUNCTION TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 5. MEMBER TEAM AFFILIATIONS
--    Resolves M:N between members and teams with full temporal tracking.
--    A member who leaves and rejoins gets separate rows.
-- -----------------------------------------------------------------------------

CREATE TABLE member_team_affiliations (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID            NOT NULL,
    team_id         UUID            NOT NULL,
    start_date      DATE            NOT NULL,
    end_date        DATE,           -- NULL = currently active
    is_current      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_mta_member    FOREIGN KEY (member_id)  REFERENCES members (id) ON DELETE RESTRICT,
    CONSTRAINT fk_mta_team      FOREIGN KEY (team_id)    REFERENCES teams   (id) ON DELETE RESTRICT,
    CONSTRAINT mta_dates_order  CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT mta_current_logic CHECK (
        (is_current = TRUE  AND end_date IS NULL) OR
        (is_current = FALSE AND end_date IS NOT NULL)
    )
);

COMMENT ON TABLE member_team_affiliations IS 'Full history of member ↔ team membership periods.';

-- Prevent overlapping active affiliations for the same member in the same team
CREATE UNIQUE INDEX idx_mta_one_active_per_team
    ON member_team_affiliations (member_id, team_id)
    WHERE is_current = TRUE;

-- -----------------------------------------------------------------------------
-- 6. MANDATES
--    Time-bounded governance role assignments.
--    Scope: laboratory-wide (director) or team-specific (team leader).
-- -----------------------------------------------------------------------------

CREATE TABLE mandates (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID            NOT NULL,
    role_id         UUID            NOT NULL,
    team_id         UUID,           -- NULL for lab-wide mandates
    scope           mandate_scope   NOT NULL DEFAULT 'laboratory',
    start_date      DATE            NOT NULL,
    end_date        DATE,           -- NULL = current mandate
    is_current      BOOLEAN         NOT NULL DEFAULT TRUE,
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_mandates_member   FOREIGN KEY (member_id)  REFERENCES members (id) ON DELETE RESTRICT,
    CONSTRAINT fk_mandates_role     FOREIGN KEY (role_id)    REFERENCES roles   (id) ON DELETE RESTRICT,
    CONSTRAINT fk_mandates_team     FOREIGN KEY (team_id)    REFERENCES teams   (id) ON DELETE RESTRICT,
    CONSTRAINT mandates_dates_order CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT mandates_team_scope  CHECK (
        (scope = 'team'        AND team_id IS NOT NULL) OR
        (scope = 'laboratory'  AND team_id IS NULL)
    ),
    CONSTRAINT mandates_current_logic CHECK (
        (is_current = TRUE  AND end_date IS NULL) OR
        (is_current = FALSE AND end_date IS NOT NULL)
    )
);

COMMENT ON TABLE mandates IS 'Complete history of governance role assignments with start/end dates.';

-- One active mandate per role per scope target
CREATE UNIQUE INDEX idx_mandates_one_active_lab
    ON mandates (role_id)
    WHERE is_current = TRUE AND scope = 'laboratory';

CREATE UNIQUE INDEX idx_mandates_one_active_team
    ON mandates (role_id, team_id)
    WHERE is_current = TRUE AND scope = 'team';

-- =============================================================================
-- SCIENTIFIC MANAGEMENT
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 7. PUBLICATIONS
-- -----------------------------------------------------------------------------

CREATE TABLE publications (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT                NOT NULL,
    pub_year        SMALLINT            NOT NULL CHECK (pub_year > 1900 AND pub_year <= 2100),
    journal         VARCHAR(255),
    conference      VARCHAR(255),
    doi             VARCHAR(255),
    pdf_url         TEXT,
    abstract        TEXT,
    pub_type        publication_type    NOT NULL DEFAULT 'journal_article',
    submitted_by    UUID,               -- Member who added this record
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT publications_doi_unique  UNIQUE (doi),
    CONSTRAINT fk_pub_submitted_by      FOREIGN KEY (submitted_by) REFERENCES members (id) ON DELETE SET NULL,
    CONSTRAINT publications_venue_check CHECK (
        journal IS NOT NULL OR conference IS NOT NULL
    )  -- At least one publication venue must be specified
);

-- -----------------------------------------------------------------------------
-- 8. PUBLICATION AUTHORS
--    Junction resolving M:N between publications and members.
--    author_name handles external co-authors not in the system.
-- -----------------------------------------------------------------------------

CREATE TABLE publication_authors (
    id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id  UUID    NOT NULL,
    member_id       UUID,                   -- NULL for external authors
    author_name     VARCHAR(255) NOT NULL,  -- Always stored for display
    author_order    SMALLINT NOT NULL CHECK (author_order > 0),

    CONSTRAINT fk_pa_publication    FOREIGN KEY (publication_id)    REFERENCES publications (id) ON DELETE CASCADE,
    CONSTRAINT fk_pa_member         FOREIGN KEY (member_id)         REFERENCES members      (id) ON DELETE SET NULL,
    CONSTRAINT pa_order_unique      UNIQUE (publication_id, author_order)
);

COMMENT ON COLUMN publication_authors.member_id     IS 'NULL for external authors not registered in LIAS.';
COMMENT ON COLUMN publication_authors.author_name   IS 'Stored for all authors for consistent display, even internal ones.';

-- =============================================================================
-- EVENTS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 9. EVENTS
--    Self-referential parent_event_id tracks recurring editions of the same
--    event series (e.g. "Annual Workshop 2023", "Annual Workshop 2024").
-- -----------------------------------------------------------------------------

CREATE TABLE events (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255)    NOT NULL,
    event_type      event_type      NOT NULL DEFAULT 'seminar',
    description     TEXT,
    location        VARCHAR(255),
    start_date      DATE            NOT NULL,
    end_date        DATE,
    parent_event_id UUID,           -- NULL = top-level event or series root
    created_by      UUID,
    is_archived     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_events_parent     FOREIGN KEY (parent_event_id)   REFERENCES events   (id) ON DELETE SET NULL,
    CONSTRAINT fk_events_created_by FOREIGN KEY (created_by)        REFERENCES members  (id) ON DELETE SET NULL,
    CONSTRAINT events_dates_order   CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT events_no_self_ref   CHECK (parent_event_id <> id)
);

COMMENT ON COLUMN events.parent_event_id IS 'Links an edition to its series root for recurring events.';

-- Event participants (M:N)
CREATE TABLE event_participants (
    event_id        UUID    NOT NULL,
    member_id       UUID    NOT NULL,
    registered_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (event_id, member_id),
    CONSTRAINT fk_ep_event  FOREIGN KEY (event_id)  REFERENCES events   (id) ON DELETE CASCADE,
    CONSTRAINT fk_ep_member FOREIGN KEY (member_id) REFERENCES members  (id) ON DELETE CASCADE
);

-- =============================================================================
-- DOCUMENT ARCHIVE
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 10. DOCUMENTS
--     Self-referential parent_doc_id implements versioning chains.
--     Versions are never deleted; the latest is determined by version number
--     or created_at within the same parent chain.
-- -----------------------------------------------------------------------------

CREATE TABLE documents (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255)    NOT NULL,
    doc_type        document_type   NOT NULL DEFAULT 'administrative',
    description     TEXT,
    file_url        TEXT            NOT NULL,
    version         SMALLINT        NOT NULL DEFAULT 1 CHECK (version > 0),
    parent_doc_id   UUID,           -- NULL = first version
    team_id         UUID,           -- NULL = lab-wide document
    event_id        UUID,           -- NULL = not tied to an event
    uploaded_by     UUID,
    is_archived     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_doc_parent        FOREIGN KEY (parent_doc_id) REFERENCES documents (id) ON DELETE RESTRICT,
    CONSTRAINT fk_doc_team          FOREIGN KEY (team_id)       REFERENCES teams     (id) ON DELETE SET NULL,
    CONSTRAINT fk_doc_event         FOREIGN KEY (event_id)      REFERENCES events    (id) ON DELETE SET NULL,
    CONSTRAINT fk_doc_uploaded_by   FOREIGN KEY (uploaded_by)   REFERENCES members   (id) ON DELETE SET NULL,
    CONSTRAINT doc_no_self_ref      CHECK (parent_doc_id <> id)
);

COMMENT ON COLUMN documents.parent_doc_id IS 'Versioning chain root. NULL on first upload.';
COMMENT ON COLUMN documents.version       IS 'Incremented by the application when a new version is uploaded.';

-- =============================================================================
-- EQUIPMENT
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 11. EQUIPMENT
--     Current inventory. assigned_to is a denormalized shortcut;
--     full history is in equipment_assignments.
-- -----------------------------------------------------------------------------

CREATE TABLE equipment (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255)        NOT NULL,
    description         TEXT,
    serial_number       VARCHAR(100),
    acquisition_date    DATE,
    status              equipment_status    NOT NULL DEFAULT 'available',
    assigned_to         UUID,               -- Current assignee (denorm)
    is_available        BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT equipment_serial_unique      UNIQUE (serial_number),
    CONSTRAINT fk_equipment_assigned_to     FOREIGN KEY (assigned_to) REFERENCES members (id) ON DELETE SET NULL,
    CONSTRAINT equipment_availability_logic CHECK (
        (status = 'available'   AND is_available = TRUE  AND assigned_to IS NULL) OR
        (status = 'assigned'    AND is_available = FALSE AND assigned_to IS NOT NULL) OR
        (status IN ('under_maintenance', 'decommissioned'))
    )
);

-- -----------------------------------------------------------------------------
-- 12. EQUIPMENT ASSIGNMENTS (History)
--     Full audit trail. A new row is inserted on every assignment.
--     returned_at = NULL means currently assigned.
-- -----------------------------------------------------------------------------

CREATE TABLE equipment_assignments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id    UUID        NOT NULL,
    member_id       UUID        NOT NULL,
    assigned_by     UUID,       -- Admin who approved the assignment
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    returned_at     TIMESTAMPTZ,
    notes           TEXT,

    CONSTRAINT fk_ea_equipment      FOREIGN KEY (equipment_id)  REFERENCES equipment (id) ON DELETE RESTRICT,
    CONSTRAINT fk_ea_member         FOREIGN KEY (member_id)     REFERENCES members   (id) ON DELETE RESTRICT,
    CONSTRAINT fk_ea_assigned_by    FOREIGN KEY (assigned_by)   REFERENCES members   (id) ON DELETE SET NULL,
    CONSTRAINT ea_dates_order       CHECK (returned_at IS NULL OR returned_at >= assigned_at)
);

-- Prevent duplicate active assignments for the same equipment
CREATE UNIQUE INDEX idx_ea_one_active_assignment
    ON equipment_assignments (equipment_id)
    WHERE returned_at IS NULL;

-- -----------------------------------------------------------------------------
-- 13. EQUIPMENT REQUESTS
--     Member requests for equipment. equipment_id may be NULL (generic request).
-- -----------------------------------------------------------------------------

CREATE TABLE equipment_requests (
    id              UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID                        NOT NULL,
    equipment_id    UUID,                       -- NULL = requesting unspecified equipment
    description     TEXT                        NOT NULL,
    status          equipment_request_status    NOT NULL DEFAULT 'pending',
    reviewed_by     UUID,
    reviewed_at     TIMESTAMPTZ,
    notes           TEXT,
    created_at      TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_er_member         FOREIGN KEY (member_id)     REFERENCES members   (id) ON DELETE RESTRICT,
    CONSTRAINT fk_er_equipment      FOREIGN KEY (equipment_id)  REFERENCES equipment (id) ON DELETE SET NULL,
    CONSTRAINT fk_er_reviewed_by    FOREIGN KEY (reviewed_by)   REFERENCES members   (id) ON DELETE SET NULL,
    CONSTRAINT er_review_logic      CHECK (
        (status = 'pending' AND reviewed_by IS NULL AND reviewed_at IS NULL) OR
        (status <> 'pending')
    )
);

-- =============================================================================
-- MEMBERSHIP REQUESTS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 14. MEMBERSHIP REQUESTS
--     Pre-member workflow: submit → review → approve/reject.
--     member_id is populated only after approval and account creation.
-- -----------------------------------------------------------------------------

CREATE TABLE membership_requests (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name              VARCHAR(100)    NOT NULL,
    last_name               VARCHAR(100)    NOT NULL,
    email                   VARCHAR(255)    NOT NULL,
    phone                   VARCHAR(30),
    institution             VARCHAR(255),
    cv_url                  TEXT            NOT NULL,
    motivation_letter_url   TEXT            NOT NULL,
    status                  request_status  NOT NULL DEFAULT 'pending',
    reviewed_by             UUID,           -- Director / admin who acted
    member_id               UUID,           -- Populated after approval
    notes                   TEXT,
    submitted_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    reviewed_at             TIMESTAMPTZ,

    CONSTRAINT fk_mr_reviewed_by    FOREIGN KEY (reviewed_by)   REFERENCES members (id) ON DELETE SET NULL,
    CONSTRAINT fk_mr_member         FOREIGN KEY (member_id)     REFERENCES members (id) ON DELETE SET NULL,
    CONSTRAINT mr_email_format      CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    CONSTRAINT mr_review_logic      CHECK (
        (status = 'pending'      AND reviewed_by IS NULL  AND reviewed_at IS NULL)  OR
        (status = 'under_review' AND reviewed_by IS NOT NULL) OR
        (status IN ('approved', 'rejected') AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)
    ),
    CONSTRAINT mr_member_only_on_approval CHECK (
        member_id IS NULL OR status = 'approved'
    )
);

-- =============================================================================
-- MEETINGS & MINUTES (PV)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 15. MEETINGS
--     Stores agenda, scheduled time, PV upload, and team scope.
-- -----------------------------------------------------------------------------

CREATE TABLE meetings (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255) NOT NULL,
    scheduled_at    TIMESTAMPTZ  NOT NULL,
    agenda          TEXT,
    team_id         UUID,        -- NULL = full-lab meeting
    minutes_url     TEXT,        -- Uploaded procès-verbal
    created_by      UUID,
    is_archived     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_meetings_team         FOREIGN KEY (team_id)    REFERENCES teams   (id) ON DELETE SET NULL,
    CONSTRAINT fk_meetings_created_by   FOREIGN KEY (created_by) REFERENCES members (id) ON DELETE SET NULL
);

-- Meeting attendees (M:N)
CREATE TABLE meeting_attendees (
    meeting_id  UUID    NOT NULL,
    member_id   UUID    NOT NULL,
    attended    BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (meeting_id, member_id),
    CONSTRAINT fk_ma_meeting    FOREIGN KEY (meeting_id)    REFERENCES meetings (id) ON DELETE CASCADE,
    CONSTRAINT fk_ma_member     FOREIGN KEY (member_id)     REFERENCES members  (id) ON DELETE CASCADE
);

-- =============================================================================
-- CONVENTIONS & COLLABORATIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 16. PARTNERS
--     External organizations the lab collaborates with.
-- -----------------------------------------------------------------------------

CREATE TABLE partners (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255)    NOT NULL,
    country     VARCHAR(100),
    website     TEXT,
    description TEXT,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT partners_name_unique UNIQUE (name)
);

-- -----------------------------------------------------------------------------
-- 17. CONVENTIONS
--     Formal agreements with external partners.
-- -----------------------------------------------------------------------------

CREATE TABLE conventions (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255)        NOT NULL,
    partner_id      UUID                NOT NULL,
    status          convention_status   NOT NULL DEFAULT 'draft',
    start_date      DATE,
    end_date        DATE,
    description     TEXT,
    document_id     UUID,               -- Associated signed document
    created_by      UUID,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_conv_partner      FOREIGN KEY (partner_id)    REFERENCES partners   (id) ON DELETE RESTRICT,
    CONSTRAINT fk_conv_document     FOREIGN KEY (document_id)   REFERENCES documents  (id) ON DELETE SET NULL,
    CONSTRAINT fk_conv_created_by   FOREIGN KEY (created_by)    REFERENCES members    (id) ON DELETE SET NULL,
    CONSTRAINT conv_dates_order     CHECK (end_date IS NULL OR end_date >= start_date)
);

-- =============================================================================
-- INTERNAL COMMUNICATION
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 18. DISCUSSIONS (Thread roots)
--     Scoped to: direct (DM), team channel, or event.
-- -----------------------------------------------------------------------------

CREATE TABLE discussions (
    id          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255),
    scope       discussion_scope    NOT NULL DEFAULT 'direct',
    team_id     UUID,               -- Set when scope = 'team'
    event_id    UUID,               -- Set when scope = 'event'
    created_by  UUID,
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_disc_team         FOREIGN KEY (team_id)    REFERENCES teams   (id) ON DELETE CASCADE,
    CONSTRAINT fk_disc_event        FOREIGN KEY (event_id)   REFERENCES events  (id) ON DELETE CASCADE,
    CONSTRAINT fk_disc_created_by   FOREIGN KEY (created_by) REFERENCES members (id) ON DELETE SET NULL,
    CONSTRAINT disc_scope_team_check  CHECK (scope <> 'team'  OR team_id  IS NOT NULL),
    CONSTRAINT disc_scope_event_check CHECK (scope <> 'event' OR event_id IS NOT NULL)
);

-- Direct message participants (M:N for 'direct' scope)
CREATE TABLE discussion_participants (
    discussion_id   UUID    NOT NULL,
    member_id       UUID    NOT NULL,

    PRIMARY KEY (discussion_id, member_id),
    CONSTRAINT fk_dp_discussion FOREIGN KEY (discussion_id) REFERENCES discussions (id) ON DELETE CASCADE,
    CONSTRAINT fk_dp_member     FOREIGN KEY (member_id)     REFERENCES members     (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 19. MESSAGES
--     Individual messages within a discussion thread.
-- -----------------------------------------------------------------------------

CREATE TABLE messages (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id   UUID        NOT NULL,
    sender_id       UUID,
    content         TEXT        NOT NULL CHECK (LENGTH(TRIM(content)) > 0),
    is_deleted      BOOLEAN     NOT NULL DEFAULT FALSE,     -- Soft delete only
    sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    edited_at       TIMESTAMPTZ,

    CONSTRAINT fk_msg_discussion    FOREIGN KEY (discussion_id) REFERENCES discussions (id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_sender        FOREIGN KEY (sender_id)     REFERENCES members     (id) ON DELETE SET NULL
);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 20. NOTIFICATIONS
--     Push notifications to individual members.
-- -----------------------------------------------------------------------------

CREATE TABLE notifications (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID                NOT NULL,
    type            notification_type   NOT NULL DEFAULT 'general',
    title           VARCHAR(255)        NOT NULL,
    body            TEXT,
    is_read         BOOLEAN             NOT NULL DEFAULT FALSE,
    -- Polymorphic reference (app resolves based on type)
    ref_table       VARCHAR(100),       -- e.g. 'events', 'publications'
    ref_id          UUID,               -- ID of the referenced record
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notif_member FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE
);

-- =============================================================================
-- ANNUAL REPORT SUPPORT
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 21. ANNUAL REPORTS
--     Metadata records for generated annual reports.
--     The actual PDF is stored in documents table (doc_type = 'annual_report').
-- -----------------------------------------------------------------------------

CREATE TABLE annual_reports (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    report_year     SMALLINT    NOT NULL CHECK (report_year > 1900 AND report_year <= 2100),
    document_id     UUID,       -- Link to the generated PDF in documents table
    generated_by    UUID,
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes           TEXT,

    CONSTRAINT ar_year_unique       UNIQUE (report_year),
    CONSTRAINT fk_ar_document       FOREIGN KEY (document_id)   REFERENCES documents (id) ON DELETE SET NULL,
    CONSTRAINT fk_ar_generated_by   FOREIGN KEY (generated_by)  REFERENCES members   (id) ON DELETE SET NULL
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- --- members ---
CREATE INDEX idx_members_status         ON members (status);
CREATE INDEX idx_members_is_active      ON members (is_active);
CREATE INDEX idx_members_last_name      ON members (last_name);
CREATE INDEX idx_members_email          ON members (email);
-- Trigram index for full-text search on names
CREATE INDEX idx_members_first_trgm     ON members USING gin (first_name gin_trgm_ops);
CREATE INDEX idx_members_last_trgm      ON members USING gin (last_name  gin_trgm_ops);

-- --- member_status_history ---
CREATE INDEX idx_msh_member_id          ON member_status_history (member_id);
CREATE INDEX idx_msh_changed_at         ON member_status_history (changed_at DESC);

-- --- member_team_affiliations ---
CREATE INDEX idx_mta_member_id          ON member_team_affiliations (member_id);
CREATE INDEX idx_mta_team_id            ON member_team_affiliations (team_id);
CREATE INDEX idx_mta_is_current         ON member_team_affiliations (is_current) WHERE is_current = TRUE;

-- --- mandates ---
CREATE INDEX idx_mandates_member_id     ON mandates (member_id);
CREATE INDEX idx_mandates_role_id       ON mandates (role_id);
CREATE INDEX idx_mandates_is_current    ON mandates (is_current) WHERE is_current = TRUE;

-- --- publications ---
CREATE INDEX idx_pub_year               ON publications (pub_year DESC);
CREATE INDEX idx_pub_type               ON publications (pub_type);
CREATE INDEX idx_pub_submitted_by       ON publications (submitted_by);
CREATE INDEX idx_pub_title_trgm         ON publications USING gin (title gin_trgm_ops);

-- --- publication_authors ---
CREATE INDEX idx_pa_publication_id      ON publication_authors (publication_id);
CREATE INDEX idx_pa_member_id           ON publication_authors (member_id) WHERE member_id IS NOT NULL;

-- --- events ---
CREATE INDEX idx_events_start_date      ON events (start_date DESC);
CREATE INDEX idx_events_type            ON events (event_type);
CREATE INDEX idx_events_parent          ON events (parent_event_id) WHERE parent_event_id IS NOT NULL;
CREATE INDEX idx_events_archived        ON events (is_archived) WHERE is_archived = FALSE;
CREATE INDEX idx_events_title_trgm      ON events USING gin (title gin_trgm_ops);

-- --- documents ---
CREATE INDEX idx_docs_type              ON documents (doc_type);
CREATE INDEX idx_docs_team_id           ON documents (team_id);
CREATE INDEX idx_docs_event_id          ON documents (event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_docs_parent            ON documents (parent_doc_id) WHERE parent_doc_id IS NOT NULL;
CREATE INDEX idx_docs_archived          ON documents (is_archived) WHERE is_archived = FALSE;
CREATE INDEX idx_docs_title_trgm        ON documents USING gin (title gin_trgm_ops);

-- --- equipment ---
CREATE INDEX idx_equip_status           ON equipment (status);
CREATE INDEX idx_equip_available        ON equipment (is_available) WHERE is_available = TRUE;
CREATE INDEX idx_equip_assigned_to      ON equipment (assigned_to) WHERE assigned_to IS NOT NULL;

-- --- equipment_assignments ---
CREATE INDEX idx_ea_equipment_id        ON equipment_assignments (equipment_id);
CREATE INDEX idx_ea_member_id           ON equipment_assignments (member_id);
CREATE INDEX idx_ea_active              ON equipment_assignments (equipment_id) WHERE returned_at IS NULL;

-- --- equipment_requests ---
CREATE INDEX idx_er_member_id           ON equipment_requests (member_id);
CREATE INDEX idx_er_status              ON equipment_requests (status);

-- --- membership_requests ---
CREATE INDEX idx_mr_status              ON membership_requests (status);
CREATE INDEX idx_mr_submitted_at        ON membership_requests (submitted_at DESC);

-- --- meetings ---
CREATE INDEX idx_meetings_scheduled     ON meetings (scheduled_at DESC);
CREATE INDEX idx_meetings_team          ON meetings (team_id);

-- --- notifications ---
CREATE INDEX idx_notif_member_unread    ON notifications (member_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notif_created_at       ON notifications (created_at DESC);

-- --- discussions / messages ---
CREATE INDEX idx_disc_scope             ON discussions (scope);
CREATE INDEX idx_disc_team_id           ON discussions (team_id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_msg_discussion_id      ON messages (discussion_id, sent_at DESC);

-- --- conventions ---
CREATE INDEX idx_conv_partner_id        ON conventions (partner_id);
CREATE INDEX idx_conv_status            ON conventions (status);

-- =============================================================================
-- TRIGGERS — updated_at auto-maintenance
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply to all tables with updated_at
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'members', 'teams', 'mandates', 'publications',
        'events', 'equipment', 'equipment_requests',
        'membership_requests', 'meetings', 'conventions'
    ]
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();',
            t, t
        );
    END LOOP;
END;
$$;

-- =============================================================================
-- TRIGGER — member_status_history auto-insert
--   Automatically logs a row whenever members.status changes.
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_log_member_status_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO member_status_history (member_id, old_status, new_status, changed_at)
        VALUES (
            NEW.id,
            CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.status END,
            NEW.status,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_members_status_history
    AFTER INSERT OR UPDATE OF status ON members
    FOR EACH ROW EXECUTE FUNCTION fn_log_member_status_change();

-- =============================================================================
-- TRIGGER — sync equipment.is_available when assignment changes
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_sync_equipment_availability()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    -- On new assignment (returned_at IS NULL → equipment is taken)
    IF TG_OP = 'INSERT' AND NEW.returned_at IS NULL THEN
        UPDATE equipment
        SET status = 'assigned', is_available = FALSE, assigned_to = NEW.member_id
        WHERE id = NEW.equipment_id;

    -- On return (returned_at set → equipment is free)
    ELSIF TG_OP = 'UPDATE' AND OLD.returned_at IS NULL AND NEW.returned_at IS NOT NULL THEN
        UPDATE equipment
        SET status = 'available', is_available = TRUE, assigned_to = NULL
        WHERE id = NEW.equipment_id;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_equipment_assignments_sync
    AFTER INSERT OR UPDATE OF returned_at ON equipment_assignments
    FOR EACH ROW EXECUTE FUNCTION fn_sync_equipment_availability();

-- =============================================================================
-- VIEWS — convenience queries
-- =============================================================================

-- Current active members with their current team
CREATE VIEW v_active_members AS
SELECT
    m.id,
    m.first_name,
    m.last_name,
    m.email,
    m.status,
    m.institution,
    t.name AS current_team
FROM members m
LEFT JOIN member_team_affiliations mta ON mta.member_id = m.id AND mta.is_current = TRUE
LEFT JOIN teams t ON t.id = mta.team_id
WHERE m.is_active = TRUE;

-- Current governance mandates
CREATE VIEW v_current_mandates AS
SELECT
    m.id AS member_id,
    m.first_name,
    m.last_name,
    r.name AS role_name,
    r.permission_level,
    man.scope,
    t.name AS team_name,
    man.start_date
FROM mandates man
JOIN members m ON m.id = man.member_id
JOIN roles   r ON r.id = man.role_id
LEFT JOIN teams t ON t.id = man.team_id
WHERE man.is_current = TRUE;

-- Publications with author list
CREATE VIEW v_publications_with_authors AS
SELECT
    p.id,
    p.title,
    p.pub_year,
    p.pub_type,
    p.journal,
    p.conference,
    p.doi,
    STRING_AGG(pa.author_name, ', ' ORDER BY pa.author_order) AS authors
FROM publications p
JOIN publication_authors pa ON pa.publication_id = p.id
GROUP BY p.id;

-- Equipment inventory with current holder
CREATE VIEW v_equipment_inventory AS
SELECT
    e.id,
    e.name,
    e.serial_number,
    e.status,
    e.is_available,
    m.first_name || ' ' || m.last_name AS assigned_to_name,
    ea.assigned_at AS assignment_date
FROM equipment e
LEFT JOIN members m ON m.id = e.assigned_to
LEFT JOIN equipment_assignments ea ON ea.equipment_id = e.id AND ea.returned_at IS NULL;

-- Pending membership requests
CREATE VIEW v_pending_membership_requests AS
SELECT
    id,
    first_name,
    last_name,
    email,
    institution,
    submitted_at,
    status
FROM membership_requests
WHERE status IN ('pending', 'under_review')
ORDER BY submitted_at ASC;

-- =============================================================================
-- END OF SCRIPT
-- =============================================================================
