import { Member, Publication, Event, Equipment, Document, Meeting, MembershipRequest, Partner, Convention, Notification, TimelineEvent } from './types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    firstName: 'Prof. Helen',
    lastName: 'Vance',
    email: 'helen.vance@university.edu',
    phone: '+1 (555) 019-2831',
    role: 'ADMIN',
    academicTitle: 'Professor',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    institution: 'State Institute of Technology',
    biography: 'Helen Vance is the Director of the Advanced Systems Lab. She has over 20 years of research experience in distributed systems, reliable computing, and blockchain architectures. She has served as general chair for global IEEE/ACM conferences and acts as a senior academic advisor.',
    researchInterests: ['Distributed Systems', 'Blockchain Consensus', 'Fault Tolerance', 'Cloud Infrastructures'],
    teamId: 't1',
    publicationsIds: ['p1', 'p3'],
    mandates: ['Lab Director (2022 - Present)', 'IEEE Section Chair', 'Department Head (2018 - 2021)'],
    isActive: true,
    joinedDate: '2016-09-01'
  },
  {
    id: 'm2',
    firstName: 'Dr. Arthur',
    lastName: 'Pendelton',
    email: 'arthur.pendelton@university.edu',
    phone: '+1 (555) 014-9844',
    role: 'MEMBER',
    academicTitle: 'Researcher',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    institution: 'State Institute of Technology',
    biography: 'Arthur Pendelton is a senior researcher specializing in intelligent computing and reinforcement learning. His work focuses on applying neurological-inspired neural nets to real-time industrial robotics and edge automation.',
    researchInterests: ['Reinforcement Learning', 'Edge AI', 'Adaptive Control Systems', 'Neural Signal Processing'],
    teamId: 't2',
    publicationsIds: ['p2', 'p4'],
    mandates: ['AI Group Lead (2024 - Present)', 'Safety Board Coordinator'],
    isActive: true,
    joinedDate: '2020-02-15'
  },
  {
    id: 'm3',
    firstName: 'Clara',
    lastName: 'Dupont',
    email: 'clara.dupont@university.edu',
    phone: '+1 (555) 017-3843',
    role: 'MEMBER',
    academicTitle: 'PhD Student',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    institution: 'State Institute of Technology',
    originLaboratory: 'Sorbonne Research Informatics',
    biography: 'Clara is a fourth-year PhD Candidate co-advised by Prof. Helen Vance. Her doctoral dissertation explores sub-second consensus overhead boundaries in heavy geo-replicated environments using partial ordering graphs.',
    researchInterests: ['Consensus Overhead', 'DAG-based Ledger', 'Network Virtualization'],
    teamId: 't1',
    publicationsIds: ['p1', 'p5'],
    mandates: ['PhD Representative'],
    isActive: true,
    joinedDate: '2022-10-01'
  },
  {
    id: 'm4',
    firstName: 'Dr. Sarah',
    lastName: 'Hwang',
    email: 'sarah.hwang@university.edu',
    phone: '+1 (555) 012-3211',
    role: 'MEMBER',
    academicTitle: 'Associate Member',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    institution: 'Global Advanced Bio-Tech Lab',
    originLaboratory: 'Bio-Computing Solutions INC',
    biography: 'Sarah is an associate industry partner member bringing computational structures into functional Genomics. She consults on scaling genetic sequencers using cloud pipelines.',
    researchInterests: ['Computational Genomics', 'Parallel Pipelines', 'Big-Data Bioinformatics'],
    teamId: 't3',
    publicationsIds: ['p6'],
    mandates: ['Industry Liaison'],
    isActive: true,
    joinedDate: '2023-05-12'
  },
  {
    id: 'm5',
    firstName: 'Dr. Raymond',
    lastName: 'Cortez',
    email: 'raymond.cortez@university.edu',
    phone: '+1 (555) 011-8822',
    role: 'MEMBER',
    academicTitle: 'Professor',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    institution: 'State Institute of Technology',
    biography: 'Professor Raymond Cortez heads the Computational Biology and Genomic Algorithms Research Team. He is famous for pioneering early string alignment heuristics used in multi-core matching systems.',
    researchInterests: ['Genomic Heuristics', 'High-Performance Computing', 'Algorithm Design'],
    teamId: 't3',
    publicationsIds: ['p6', 'p7'],
    mandates: ['Bioinformatics Group Lead (2019 - Present)'],
    isActive: true,
    joinedDate: '2015-01-10'
  },
  {
    id: 'm6',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.v@university.edu',
    phone: '+1 (555) 013-4411',
    role: 'MEMBER',
    academicTitle: 'Permanent Member',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    institution: 'State Institute of Technology',
    biography: 'Marcus leads cybersecurity audits and focuses on cryptographic verification of server software and container micro-kernels.',
    researchInterests: ['Micro-kernel Verification', 'Secure Sandboxing', 'Zero-Trust Architectures'],
    teamId: 't1',
    publicationsIds: [],
    mandates: ['Lab CIO', 'Infrastructure Architect'],
    isActive: false, // inactive demonstration
    joinedDate: '2018-11-20'
  },
  {
    id: 'm7',
    firstName: 'Jean-Luc',
    lastName: 'Picard',
    email: 'j.picard@laboratory.edu',
    phone: '+1 (555) 091-7788',
    role: 'VISITOR',
    academicTitle: 'Visitor',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    institution: 'Star-Fleet Research Institute',
    biography: 'Jean-Luc is a visiting emeritus research fellow observing automated autonomous agents and decision-making matrices under extreme real-time stress profiles.',
    researchInterests: ['Autonomous Coordination', 'Real-Time Heuristics', 'Crisis Informatics'],
    teamId: 't2',
    publicationsIds: [],
    mandates: ['Honorary Scholar (Fall 2026)'],
    isActive: true,
    joinedDate: '2026-03-01'
  }
];

export const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: 'p1',
    title: 'Decentralized Consensus Graph Optimization for Under-Segmented Optical Networks',
    authors: ['Prof. Helen Vance', 'Clara Dupont'],
    journal: 'IEEE Transactions on Network and Service Management',
    doi: '10.1109/TNSM.2025.109845',
    year: 2025,
    abstract: 'This paper introduces a decentralized consensus graph optimization technique designed for low-latency optical routing configurations. By introducing sub-DAG partial states, we prove that local synchronization latency can be reduced by up to 43% under heavy dynamic loads.',
    category: 'Journal',
    pdfUrl: '#'
  },
  {
    id: 'p2',
    title: 'Adversarial Reinforcement Learning in Extreme Off-Road Autonomous Formations',
    authors: ['Dr. Arthur Pendelton', 'Liam O\'connor'],
    conference: 'International Conference on Robotics and Automation (ICRA)',
    doi: '10.1109/ICRA.2024.99281',
    year: 2024,
    abstract: 'We explore cooperative physical safety layouts within a multi-drone off-road swarm task. Employing minimax deep Q-networks enables resilient spatial configurations despite simulated sensor network jamming and dynamic wind disruptions.',
    category: 'Conference',
    pdfUrl: '#'
  },
  {
    id: 'p3',
    title: 'A Survey of Zero-Knowledge Proof Architectures for Secure Sharded Ledgers',
    authors: ['Prof. Helen Vance'],
    journal: 'ACM Computing Surveys',
    doi: '10.1145/3819283.3819290',
    year: 2024,
    abstract: 'A comprehensive review of cryptographic zero-knowledge frameworks, assessing proof size overhead, mathematical bounds, memory costs, and general applicability in modern sharded layer-1 distributed ledgers.',
    category: 'Journal',
    pdfUrl: '#'
  },
  {
    id: 'p4',
    title: 'Ultra-low Latency Inference Engines for Smart Manufacturing Edge Convergers',
    authors: ['Dr. Arthur Pendelton', 'Prof. Helen Vance'],
    conference: 'IEEE International Conference on Edge Computing',
    doi: '10.1109/EDGE.2023.12345',
    year: 2023,
    abstract: 'Edge servers monitoring complex metal forge presses require prompt control loops. This paper addresses sub-millisecond INT8 quantized pruning models yielding highly efficient local inferences.',
    category: 'Conference',
    pdfUrl: '#'
  },
  {
    id: 'p5',
    title: 'Exploring DAG-based Cryptographic Consensus Safety Under Eclipse Attack Profiles',
    authors: ['Clara Dupont', 'Prof. Helen Vance'],
    conference: 'Symposium on Reliable Distributed Systems (SRDS)',
    doi: '10.1109/SRDS.2025.34567',
    year: 2025,
    abstract: 'An empirical stress-test analysis of decentralized DAG network topologies showing a robust self-healing sequence that mitigates routing eclipse attacks without central coordinators.',
    category: 'Conference',
    pdfUrl: '#'
  },
  {
    id: 'p6',
    title: 'Parallel Genomic Sequence Alignment via SIMD Vectorization on Heterogeneous Clusters',
    authors: ['Dr. Sarah Hwang', 'Dr. Raymond Cortez'],
    journal: 'Bioinformatics (Oxford Press)',
    doi: '10.1093/bioinformatics/btad891',
    year: 2024,
    abstract: 'We present a highly optimized GPU-assisted vectorized alignment algorithm designed for short-read sequences. The proposed algorithm leverages instruction-level parallelism to double the throughput compared to modern state-of-the-art baselines.',
    category: 'Journal',
    pdfUrl: '#'
  },
  {
    id: 'p7',
    title: 'Heuristics for Dynamic Structural Matching of Viral Spike Glycoproteins',
    authors: ['Dr. Raymond Cortez'],
    conference: 'ACM Conference on Bioinformatics and Computational Biology',
    doi: '10.1145/BCB.2023.9902',
    year: 2023,
    abstract: 'We detail interactive folding graphs that capture spatial alignment metrics faster than fully physical thermodynamic calculations, allowing real-time candidate screening against mutation libraries.',
    category: 'Conference',
    pdfUrl: '#'
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'The Great Distributed Ledger Breakthrough Summit 2026',
    type: 'Conference',
    date: '2026-07-20',
    time: '09:00',
    location: 'Auditorium A, Science Center',
    description: 'An international research summit dedicated to scalability margins in modern layer-1 proof systems. Featuring absolute world leaders on cryptographic consensus.',
    speaker: 'Prof. Helen Vance, state and international guests',
    registeredParticipants: ['clara.dupont@university.edu', 'raymond.cortez@university.edu', 'external-guest1@gmail.com'],
    attendedParticipants: [],
    maxParticipants: 150
  },
  {
    id: 'e2',
    title: 'Reinforcement Learning in Robotics & Cyber-Physical Swarms',
    type: 'Seminar',
    date: '2026-06-15',
    time: '14:30',
    location: 'Meeting Room 204C, Engineering Wing',
    description: 'A deep-dive technical seminar exploring how off-road robotics swarms learn to navigate uncharted caverns via temporal-difference learning frameworks.',
    speaker: 'Dr. Arthur Pendelton',
    registeredParticipants: ['clara.dupont@university.edu', 'j.picard@laboratory.edu', 'test@test.com'],
    attendedParticipants: ['clara.dupont@university.edu', 'j.picard@laboratory.edu'],
    maxParticipants: 40
  },
  {
    id: 'e3',
    title: 'PhD Dissertation defense: Scalability Margins in High Dynamic Congestion Ledgers',
    type: 'PhD Defense',
    date: '2026-09-18',
    time: '10:00',
    location: 'Graduation Hall 1, Main Campus',
    description: 'Doctoral Defense of candidate Clara Dupont under supervision of Prof. Helen Vance. Jury members contain distinguished scholars from Sorbonne, Oxford and MIT.',
    speaker: 'Clara Dupont',
    registeredParticipants: ['helen.vance@university.edu', 'raymond.cortez@university.edu', 'clara.dupont@university.edu'],
    attendedParticipants: [],
    maxParticipants: 100
  },
  {
    id: 'e4',
    title: 'Genomics Pipeline Design & High Throughput Flow Cells Workshop',
    type: 'Workshop',
    date: '2026-08-04',
    time: '13:00',
    location: 'Bio-Informatics Sandbox Lab, Room 102',
    description: 'A hands-on coding workshop exploring SIMD architectures and modern sequencing data parsing modules written in Rust & C++.',
    speaker: 'Dr. Raymond Cortez & Dr. Sarah Hwang',
    registeredParticipants: ['helen.vance@university.edu', 'clara.dupont@university.edu'],
    attendedParticipants: [],
    maxParticipants: 15
  }
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq1',
    name: 'Supercomputing Cluster Node (64-Core, 1TB ECC RAM, 4x NVIDIA H100)',
    serialNumber: 'SCCN-H100-99818',
    category: 'Computing',
    status: 'Assigned',
    assignedTo: 'Dr. Arthur Pendelton',
    location: 'Server Room 4A, Physics Wing',
    description: 'Ultra-high throughput computing block designated for large-sample neural model pre-training and evolutionary genetic simulations.',
    assignedDate: '2025-01-10',
    returnDate: '2027-01-10'
  },
  {
    id: 'eq2',
    name: 'Illumina NextSeq 2000 DNA Sequencing System',
    serialNumber: 'ILLM-NS2K-44211',
    category: 'Imaging',
    status: 'Available',
    location: 'Clean Wet-Lab 12, Chemistry Complex',
    description: 'Modern benchtop sequencer with high throughput flow cell capabilities, designated for joint research with bio-engineering partners.'
  },
  {
    id: 'eq3',
    name: 'High Frequency Impedance Network Analyzer',
    serialNumber: 'HF-NET-ANA-1100',
    category: 'Measurement',
    status: 'Maintenance',
    location: 'Calibration Cabin B, Electrical Suite',
    description: 'RF tuning and circuit logic analyzer. Out of service for annual calibration diagnostics and firmware updates by certified technicians.'
  },
  {
    id: 'eq4',
    name: 'Edge Swarm Field Drones (6 Units - Autonomous Hexacopters)',
    serialNumber: 'SWARM-DR-HEX6',
    category: 'Other',
    status: 'Assigned',
    assignedTo: 'Dr. Arthur Pendelton',
    location: 'Outdoor Field Hangar 3',
    description: 'Custom carbon fiber drone squad with onboard Nvidia Jetson Orin Nano modules for decentralized real-time swarm orchestration.',
    assignedDate: '2026-03-12',
    returnDate: '2026-09-01'
  },
  {
    id: 'eq5',
    name: 'Optical Interconnection Testbed (4-Channel DWDM)',
    serialNumber: 'OITB-DWDM-5',
    category: 'Measurement',
    status: 'Available',
    location: 'Photonics Lab 309, Engineering Wing',
    description: 'High-speed fiber-optic evaluation sandbox. Accommodates experimental decentralized packet routing switches.'
  }
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'd1',
    name: 'Annual_Research_Report_2025_Final.pdf',
    category: 'Research',
    version: '1.2',
    uploadedBy: 'Prof. Helen Vance',
    uploadedAt: '2026-01-15',
    size: '4.8 MB',
    history: [
      { version: '1.2', date: '2026-01-15', by: 'Prof. Helen Vance', changes: 'Merged and proofread genomic team metrics.' },
      { version: '1.1', date: '2026-01-08', by: 'Dr. Arthur Pendelton', changes: 'Added AI group updates and drone swarm photographs.' },
      { version: '1.0', date: '2025-12-20', by: 'Prof. Helen Vance', changes: 'Created initial template outline.' }
    ]
  },
  {
    id: 'd2',
    name: 'Security_Regulations_Clean-Wet-Lab_v4.pdf',
    category: 'Administrative',
    version: '4.0',
    uploadedBy: 'Marcus Vance',
    uploadedAt: '2024-03-10',
    size: '1.2 MB',
    history: [
      { version: '4.0', date: '2024-03-10', by: 'Marcus Vance', changes: 'Included hazard steps for the new Illumina sequencer reagents.' }
    ]
  },
  {
    id: 'd3',
    name: 'Strategic_Board_Meeting_Minutes_May_2026.docx',
    category: 'Minutes',
    version: '1.0',
    uploadedBy: 'Prof. Helen Vance',
    uploadedAt: '2026-05-18',
    size: '340 KB',
    history: [
      { version: '1.0', date: '2026-05-18', by: 'Prof. Helen Vance', changes: 'Documented budget allocations and PhD thesis review dates.' }
    ]
  },
  {
    id: 'd4',
    name: 'ACM_IEEE_Template_CS_Lab_Version.zip',
    category: 'Template',
    version: '2.1',
    uploadedBy: 'Clara Dupont',
    uploadedAt: '2025-11-02',
    size: '1.1 MB',
    history: [
      { version: '2.1', date: '2025-11-02', by: 'Clara Dupont', changes: 'Removed outdated hyperref conflict fields.' }
    ]
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'mt1',
    title: 'Lab Strategy & Research Board Alignment',
    date: '2026-06-12',
    time: '10:00',
    location: 'Strategic Board Room, Engineering Wing',
    agenda: '1. General budget summary and upcoming capital equipment requests.\n2. Review of PhD student milestones and thesis schedules.\n3. Final preparations for the upcoming Distributed Consensus Summit.',
    minutes: 'Not submitted yet. Session is scheduled for next Friday.',
    attendees: ['Prof. Helen Vance', 'Dr. Arthur Pendelton', 'Dr. Raymond Cortez', 'Clara Dupont'],
    organizer: 'Prof. Helen Vance'
  },
  {
    id: 'mt2',
    title: 'Algorithmic Bio-Genomic Sync & Industry Update',
    date: '2026-06-25',
    time: '11:00',
    location: 'Collaborative Lab 102 / Zoom Host',
    agenda: '1. Progress report on the SIMD sequence matching compiler.\n2. Update on joint data governance conventions with Bio-Computing Solutions INC.\n3. Preparation of hardware requirements for summer sequencing campaigns.',
    minutes: '',
    attendees: ['Dr. Raymond Cortez', 'Dr. Sarah Hwang'],
    organizer: 'Dr. Raymond Cortez'
  },
  {
    id: 'mt3',
    title: 'Autonomous Swarm Field Test Coordination Meeting',
    date: '2026-05-30',
    time: '09:30',
    location: 'Outdoor Field Hangar 3',
    agenda: '1. Setup battery replacement cycle metrics.\n2. Review airspace permissions map from Civil Aviation authority.\n3. Confirm emergency remote descent procedures.',
    minutes: 'A complete flight run log has been archived. Swarms effectively avoided pre-set boundaries. Communication ping dropped only once. Batteries averaged 22 minutes flight time.',
    attendees: ['Dr. Arthur Pendelton', 'Jean-Luc Picard'],
    organizer: 'Dr. Arthur Pendelton'
  }
];

export const INITIAL_REQUESTS: MembershipRequest[] = [
  {
    id: 'rq1',
    firstName: 'Sven',
    lastName: 'Gunderson',
    email: 'sven.gunderson@nordictech.no',
    academicTitle: 'PhD Student',
    cvFileName: 'Sven_Gunderson_CV_2026.pdf',
    motivation: 'I am extremely interested in doing my PhD research under Prof. Helen Vance. My Masters thesis focused on gossip protocols, and I wish to explore high-congestion scaling bounds using topological DAG clusters. I would love to join your prominent lab.',
    status: 'Pending',
    submittedAt: '2026-06-08'
  },
  {
    id: 'rq2',
    firstName: 'Dr. Evelyn',
    lastName: 'Richards',
    email: 'evelyn.richards@mit.edu',
    academicTitle: 'Researcher',
    cvFileName: 'Evelyn_Richards_Research_CV.pdf',
    motivation: 'I seek a joint research placement for the upcoming spring term to study Genomics pipeline parallelization with Dr. Raymond Cortez. I will be bringing custom sequencing samples from Boston.',
    status: 'Approved',
    submittedAt: '2026-05-20'
  },
  {
    id: 'rq3',
    firstName: 'Ahmad',
    lastName: 'Al-Farsi',
    email: 'ahmad.farsi@gulfscience.qa',
    academicTitle: 'Visitor',
    cvFileName: 'CF_Ahmad_AlFarsi_Resume.pdf',
    motivation: 'Desiring to observe edge computing heuristics for automatic wind farm dynamic tuning. Hoping to tour the field hangar for 2 weeks in Fall.',
    status: 'Rejected',
    submittedAt: '2026-04-12'
  }
];

export const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'pr1',
    name: 'State Informatics Foundation',
    type: 'Research Center',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ec2c6c64a6d5?w=80',
    description: 'A federal foundation dedicated to funding computer science advancements, secure cloud networks, and high-performance engineering hardware across state universities.',
    activeConventionsCount: 2,
    contactPerson: 'Director Allison Mercer'
  },
  {
    id: 'pr2',
    name: 'Bio-Computing Solutions INC',
    type: 'Enterprise',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80',
    description: 'A global bio-tech company focused on producing state-of-the-art sequencing and DNA analysis hardware, pipeline virtualization, and disease pattern tracking engines.',
    activeConventionsCount: 1,
    contactPerson: 'Dr. Gregory House, VP of Clinical Solutions'
  },
  {
    id: 'pr3',
    name: 'Sorbonne Research Informatics',
    type: 'University',
    logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=80',
    description: 'An elite Parisian university co-sponsoring doctoral study streams, joint publications, and student exchange flights for distributed ledger research programs.',
    activeConventionsCount: 1,
    contactPerson: 'Prof. Pierre-Louis Lions'
  }
];

export const INITIAL_CONVENTIONS: Convention[] = [
  {
    id: 'c1',
    partnerId: 'pr1',
    partnerName: 'State Informatics Foundation',
    title: 'High-Throughput Quantum Consensus Sandboxes (Contract #QCS-2024)',
    startDate: '2024-09-01',
    endDate: '2027-09-01',
    budget: '$750,000 USD',
    scope: 'Covers physical hardware purchase (like the H100 GPU nodes) and funding for two full-time PhD candidate salaries (including Clara Dupont).',
    status: 'Active'
  },
  {
    id: 'c2',
    partnerId: 'pr2',
    partnerName: 'Bio-Computing Solutions INC',
    title: 'SIMD Vector Analysis on High Output Flow Cells Accord',
    startDate: '2025-01-15',
    endDate: '2026-07-15',
    budget: '$320,000 USD',
    scope: 'Joint development and code sharing agreement. Lab gets early-access sequencing equipment for computational genomic evaluations.',
    status: 'Active'
  },
  {
    id: 'c3',
    partnerId: 'pr3',
    partnerName: 'Sorbonne Research Informatics',
    title: 'Doctoral Exchange Accord & Shared GPU Allocation Agreement',
    startDate: '2022-10-01',
    endDate: '2025-10-01',
    budget: '$50,000 EUR',
    scope: 'Enables annual travel allowances for doctoral students presenting papers at IEEE/ACM symposia in Paris and Stanford.',
    status: 'Expired'
  },
  {
    id: 'c4',
    partnerId: 'pr1',
    partnerName: 'State Informatics Foundation',
    title: 'Collaborative Decentralized Airspace Navigation Frameworks',
    startDate: '2026-05-01',
    endDate: '2028-05-01',
    budget: '$450,000 USD',
    scope: 'Developing automated mathematical collision avoidance corridors on onboard Jetson chips.',
    status: 'Active'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'New Membership Application Submitted',
    message: 'Sven Gunderson applied for a PhD Student position, expressing target alignment with Prof. Vance.',
    date: '2026-06-08',
    read: false,
    type: 'request'
  },
  {
    id: 'n2',
    title: 'Equipment Maintenance Reminder',
    message: 'The High Frequency Impedance Network Analyzer is currently marked in Maintenance status.',
    date: '2026-06-05',
    read: false,
    type: 'equipment'
  },
  {
    id: 'n3',
    title: 'New Publication Added',
    message: 'Prof. Helen Vance and Clara Dupont published: "Decentralized Consensus Graph Optimization..." in IEEE TNSM.',
    date: '2026-05-28',
    read: true,
    type: 'publication'
  },
  {
    id: 'n4',
    title: 'Meeting Attendance Summary Archived',
    message: 'Dr. Arthur Pendelton updated minutes and participant attendance logs for the Field Test on May 30th.',
    date: '2026-05-30',
    read: true,
    type: 'system'
  }
];

export const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl1',
    date: '2026-06-08',
    title: 'PhD Student Request received',
    description: 'Sven Gunderson submitted Motivation Letter and CV seeking doctoral candidacy guidance under Prof. Helen Vance.',
    category: 'MemberArrival'
  },
  {
    id: 'tl2',
    date: '2026-05-28',
    title: 'New breakthrough consensus publication',
    description: 'Paper coauthored by Prof. Helen Vance and Clara Dupont published in top-tier IEEE TNSM journal.',
    category: 'Publication'
  },
  {
    id: 'tl3',
    date: '2026-03-12',
    title: 'H100 GPU Node Assignment',
    description: 'Supercomputing node officially assigned to Arthur Pendelton for drone swarm neural optimization algorithms.',
    category: 'Milestone'
  },
  {
    id: 'tl4',
    date: '2026-03-01',
    title: 'Visitor Arrival: Emeritus scholar Picard',
    description: 'Emeritus scholar Jean-Luc Picard of Star-Fleet Research arrived for automatic swarm observations.',
    category: 'MemberArrival'
  },
  {
    id: 'tl5',
    date: '2025-11-02',
    title: 'ACM/IEEE Academic Latex Template Published',
    description: 'Version 2.1 templates compiled and verified for laboratory-wide publishing by Clara Dupont.',
    category: 'Mandate'
  },
  {
    id: 'tl6',
    date: '2025-01-10',
    title: 'Vance Appointed Lab Director',
    description: 'Prof. Helen Vance formally assumes the multi-year administrative and strategic mandate for the entire Lab.',
    category: 'Mandate'
  }
];

export const RESEARCH_TEAMS = [
  {
    id: 't1',
    name: 'Distributed Systems & Ledger Protocols Group (DSLP)',
    leader: 'Prof. Helen Vance',
    leaderId: 'm1',
    description: 'Exploring consensus architectures, DAG transaction models, reliable ledger sharding, fault tolerance bounds, and optical packet routing graphs.',
    projects: [
      { name: 'Ultra-Scale DAG Ledger Protocols', status: 'Ongoing', budget: '$400K' },
      { name: 'High Resolution Optical Packet Switches', status: 'Ongoing', budget: '$350K' },
      { name: 'Zero-Knowledge Proof Footprint Compression', status: 'Completed', budget: '$120K' }
    ],
    memberCount: 3,
    projectsCount: 3
  },
  {
    id: 't2',
    name: 'Autonomous Swarms & Edge Artificial Intelligence',
    leader: 'Dr. Arthur Pendelton',
    leaderId: 'm2',
    description: 'Studying extreme physical navigation algorithms, minimax deep reinforcement learning, outdoor network jamming mitigations, and low-power hardware compile loops.',
    projects: [
      { name: 'Hexacopter Obstacle Escape Maps', status: 'Ongoing', budget: '$250K' },
      { name: 'Low-latency Jetson Tensor Pruning compilers', status: 'Ongoing', budget: '$200K' }
    ],
    memberCount: 2,
    projectsCount: 2
  },
  {
    id: 't3',
    name: 'Computational Biology & Genomic Algorithms (CBGA)',
    leader: 'Dr. Raymond Cortez',
    leaderId: 'm5',
    description: 'Developing high-concurrency SIMD string alignment tools, real-time spike glycoprotein mutation matches, and biological workflow abstractions on cloud clusters.',
    projects: [
      { name: 'SIMD Flow-Cell Alignment Heuristic compilers', status: 'Ongoing', budget: '$320K' },
      { name: 'Dynamic spike fold graph matches', status: 'Completed', budget: '$180K' }
    ],
    memberCount: 2,
    projectsCount: 2
  }
];
