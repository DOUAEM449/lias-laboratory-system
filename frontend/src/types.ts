export type UserRole = 'ADMIN' | 'MEMBER' | 'VISITOR';

export type AcademicTitle = 'Professor' | 'PhD Student' | 'Researcher' | 'Associate Member' | 'Visitor' | 'Permanent Member';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  academicTitle: AcademicTitle;
  photoUrl: string;
  institution: string;
  originLaboratory?: string;
  biography: string;
  researchInterests: string[];
  teamId?: string;
  publicationsIds: string[];
  mandates: string[];
  isActive: boolean;
  joinedDate: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[]; // string of names or ids
  journal?: string;
  conference?: string;
  doi?: string;
  year: number;
  abstract: string;
  pdfUrl?: string;
  category: 'Journal' | 'Conference' | 'Book Chapter' | 'Preprint';
}

export interface Event {
  id: string;
  title: string;
  type: 'Conference' | 'Workshop' | 'Seminar' | 'PhD Defense';
  date: string;
  time: string;
  location: string;
  description: string;
  speaker?: string;
  registeredParticipants: string[]; // list of emails or userIds
  attendedParticipants: string[]; // list of emails or userIds for attendance tracking
  maxParticipants?: number;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: 'Computing' | 'Measurement' | 'Imaging' | 'Reagents' | 'Other';
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
  assignedTo?: string; // Member Name/ID
  location: string;
  description: string;
  assignedDate?: string;
  returnDate?: string;
}

export interface Document {
  id: string;
  name: string;
  category: 'Research' | 'Administrative' | 'Minutes' | 'Template' | 'Other';
  version: string;
  uploadedBy: string; // Member Name
  uploadedAt: string;
  size: string;
  history: {
    version: string;
    date: string;
    by: string;
    changes: string;
  }[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  agenda: string;
  minutes?: string;
  attendees: string[]; // member IDs or Names
  organizer: string;
}

export interface MembershipRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  academicTitle: AcademicTitle;
  cvFileName: string;
  motivation: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  type: 'University' | 'Enterprise' | 'Research Center';
  logoUrl: string;
  description: string;
  activeConventionsCount: number;
  contactPerson: string;
}

export interface Convention {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  startDate: string;
  endDate: string;
  budget: string;
  scope: string;
  status: 'Active' | 'Expired' | 'Under Review';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'request' | 'publication' | 'event' | 'equipment' | 'system';
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'MemberArrival' | 'MemberDeparture' | 'Mandate' | 'Publication' | 'Event' | 'Milestone';
}
