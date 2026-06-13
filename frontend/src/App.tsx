import { useState, useEffect } from 'react';
import { 
  Building, GraduationCap, Users, BookOpen, Calendar, 
  Layers, Settings, ChevronRight, Mail, Phone, MapPin, 
  Menu, Bell, LogOut, Check, Search, Trash2, ShieldCheck, 
  FolderArchive, Inbox, CalendarDays, Award
} from 'lucide-react';

import { 
  Member, Publication, Event, Equipment, Document, 
  Meeting, MembershipRequest, Partner, Convention, 
  Announcement, Notification, TimelineEvent, UserRole, AcademicTitle 
} from './types';

import { 
  INITIAL_MEMBERS, INITIAL_PUBLICATIONS, INITIAL_EVENTS, 
  INITIAL_EQUIPMENT, INITIAL_DOCUMENTS, INITIAL_MEETINGS, 
  INITIAL_REQUESTS, INITIAL_PARTNERS, INITIAL_CONVENTIONS, 
  INITIAL_NOTIFICATIONS, INITIAL_TIMELINE 
} from './data';

import PublicWebsite from './components/PublicWebsite';
import AuthPages from './components/AuthPages';
import Dashboard from './components/Dashboard';
import MembersAndProfile from './components/MembersAndProfile';
import AdministrativeModules from './components/AdministrativeModules';
import AcademicModules from './components/AcademicModules';

export default function App() {
  // Global Database state to enable absolute interactive unity
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('lias_members_db');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [publications, setPublications] = useState<Publication[]>(() => {
    const saved = localStorage.getItem('lias_pubs_db');
    return saved ? JSON.parse(saved) : INITIAL_PUBLICATIONS;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('lias_events_db');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [equipmentList, setEquipmentList] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('lias_equip_db');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('lias_docs_db');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('lias_meetings_db');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [requests, setRequests] = useState<MembershipRequest[]>(() => {
    const saved = localStorage.getItem('lias_reqs_db');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('lias_notifs_db');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem('lias_timeline_db');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE;
  });

  // Partners directory (static reference)
  const [partners] = useState<Partner[]>(INITIAL_PARTNERS);

  // Persistence Synchronisation
  useEffect(() => {
    localStorage.setItem('lias_members_db', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('lias_pubs_db', JSON.stringify(publications));
  }, [publications]);

  useEffect(() => {
    localStorage.setItem('lias_events_db', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('lias_equip_db', JSON.stringify(equipmentList));
  }, [equipmentList]);

  useEffect(() => {
    localStorage.setItem('lias_docs_db', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('lias_meetings_db', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('lias_reqs_db', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('lias_notifs_db', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lias_timeline_db', JSON.stringify(timeline));
  }, [timeline]);

  // Auth & Session state
  const [activeUser, setActiveUser] = useState<{ id: string; email: string; firstName: string; lastName: string; role: UserRole; title: AcademicTitle } | null>(null);

  // Navigation system routing page aliases
  // public | login | register | dashboard | members | operations | academic | profile
  const [currentPage, setCurrentPage] = useState<string>('public');

  // Trigger member highlight callback
  const [selectedMemberIdForPublicView, setSelectedMemberIdForPublicView] = useState<string | undefined>(undefined);

  // Notification panel toggle status
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  // User profile options menu toggle status
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Log a dynamic notification alert helper
  const addSystemNotification = (title: string, message: string, type: 'request' | 'publication' | 'event' | 'equipment' | 'system') => {
    const brandNew: Notification = {
      id: 'n_gen_' + Date.now(),
      title,
      message,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type
    };
    setNotifications([brandNew, ...notifications]);
  };

  // Log a new timeline event helper
  const addTimelineLog = (title: string, description: string, category: 'MemberArrival' | 'MemberDeparture' | 'Mandate' | 'Publication' | 'Event' | 'Milestone') => {
    const brandNew: TimelineEvent = {
      id: 't_gen_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      title,
      description,
      category
    };
    setTimeline([brandNew, ...timeline]);
  };

  // Approved visitor placement
  const handleApproveRequest = (requestId: string) => {
    const target = requests.find(r => r.id === requestId);
    if (!target) return;

    // 1. Update request
    const approvedList = requests.map(r => r.id === requestId ? { ...r, status: 'Approved' as const } : r);
    setRequests(approvedList);

    // 2. Append member
    const newMemberId = 'm_gen_' + Date.now();
    const brandNewMember: Member = {
      id: newMemberId,
      firstName: target.firstName,
      lastName: target.lastName,
      email: target.email,
      phone: '+1 (555) 001-2000',
      role: 'MEMBER',
      academicTitle: target.academicTitle,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // Female avatar default placeholder
      institution: 'State Institute of Technology',
      biography: `Approved research scholar joining the laboratory group under direct supervisory sponsorship. Target focus motivation: ${target.motivation}`,
      researchInterests: ['Distributed Systems', 'Fault Tolerance'],
      publicationsIds: [],
      mandates: [`Newly Appointed scholar (${new Date().getFullYear()})`],
      isActive: true,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setMembers([...members, brandNewMember]);

    // 3. Log System outputs
    addSystemNotification(
      'Faculty Member Approved',
      `${target.firstName} ${target.lastName} has been added to our registered directory as ${target.academicTitle}.`,
      'request'
    );
    addTimelineLog(
      `New Scholar: ${target.firstName} ${target.lastName}`,
      `Formally approved and joined our staff directory as PhD / Researcher academic personnel.`,
      'MemberArrival'
    );
  };

  const handleRejectRequest = (requestId: string) => {
    const target = requests.find(r => r.id === requestId);
    if (!target) return;

    const rejectedList = requests.map(r => r.id === requestId ? { ...r, status: 'Rejected' as const } : r);
    setRequests(rejectedList);

    addSystemNotification('Applicant Profile Retired', `Decision for applicant ${target.firstName} recorded.`, 'request');
  };

  const handleCreateMembershipRequest = (payload: { firstName: string; lastName: string; email: string; title: AcademicTitle; cvFileName: string; motivation: string }) => {
    const brandNew: MembershipRequest = {
      id: 'rq_gen_' + Date.now(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      academicTitle: payload.title,
      cvFileName: payload.cvFileName,
      motivation: payload.motivation,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setRequests([brandNew, ...requests]);

    addSystemNotification(
      'Placement Request Registered',
      `${payload.firstName} ${payload.lastName} submitted placement registry CV documentation.`,
      'request'
    );
    addTimelineLog(
      `Applied: ${payload.firstName} ${payload.lastName}`,
      `Lodged motivation letter and CV requesting dynamic laboratory access.`,
      'MemberArrival'
    );
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleCustomLoginSuccess = (user: { id: string; email: string; firstName: string; lastName: string; role: UserRole; title: AcademicTitle }) => {
    setActiveUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setActiveUser(null);
    setCurrentPage('public');
  };

  // Count unread
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div id="lia-system-application" className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* SECTION A: PUBLIC PATHS */}
      {currentPage === 'public' && (
        <PublicWebsite 
          members={members}
          publications={publications}
          events={events}
          partners={partners}
          onNavigate={(page) => {
            if (page === 'login' || page === 'register') {
              setCurrentPage(page);
            } else {
              setCurrentPage('public');
            }
          }}
          onSelectMember={(memberId) => {
            setSelectedMemberIdForPublicView(memberId);
            if (activeUser) {
              setCurrentPage('members');
            } else {
              // Highlight selected profile directly in members list
              setCurrentPage('members');
            }
          }}
        />
      )}

      {currentPage === 'login' && (
        <AuthPages 
          initialPage="login"
          onNavigate={(page) => setCurrentPage(page)}
          onLoginSuccess={handleCustomLoginSuccess}
          onAddMembershipRequest={handleCreateMembershipRequest}
        />
      )}

      {currentPage === 'register' && (
        <AuthPages 
          initialPage="register"
          onNavigate={(page) => setCurrentPage(page)}
          onLoginSuccess={handleCustomLoginSuccess}
          onAddMembershipRequest={handleCreateMembershipRequest}
        />
      )}

      {/* SECTION B: INTERNAL AUTHORIZED PORTAL ENGINE */}
      {activeUser !== null && currentPage !== 'public' && currentPage !== 'login' && currentPage !== 'register' && (
        <div id="authorized-portal-container" className="flex min-h-screen">
          
          {/* 1. LEFT SIDEBAR NAVIGATION */}
          <aside id="portal-sidebar font-semibold" className="w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
            <div className="space-y-8">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/20">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white font-black text-sm tracking-widest leading-none">LIAS</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">Lab Portal</p>
                </div>
              </div>

              {/* Navigation Actions */}
              <nav id="sidebar-nav" className="px-3 space-y-1.5 text-xs font-bold text-slate-400">
                <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Console Portal</p>
                
                {[
                  { id: 'dashboard', label: 'Information Terminal', icon: Building, roleReq: 'All' },
                  { id: 'members', label: 'Members Directory', icon: Users, roleReq: 'All' },
                  
                  { id: 'operations', label: 'Operations & Assets', icon: Layers, roleReq: 'All' },
                  { id: 'academic', label: 'Academic Workspace', icon: BookOpen, roleReq: 'All' },
                  { id: 'profile', label: 'My Profile Settings', icon: Settings, roleReq: 'All' }
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`sidebar-link-${item.id}`}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setSelectedMemberIdForPublicView(undefined); // Reset view highlighter
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg transition duration-150 uppercase tracking-wider ${
                      currentPage === item.id 
                        ? 'bg-blue-600/10 text-white font-extrabold border-l-4 border-blue-500 rounded-l-none' 
                        : 'hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Sidebar User Block & Logout */}
            <div className="p-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-slate-700 text-slate-350 flex items-center justify-center rounded-full font-black text-xs border border-slate-500">
                  {activeUser.firstName[0]}
                </div>
                <div className="truncate max-w-[140px] space-y-0.5">
                  <h4 className="text-white font-bold text-xs truncate leading-tight">{activeUser.firstName} {activeUser.lastName}</h4>
                  <span className="text-[10px] text-slate-500 font-bold tracking-tight block uppercase">{activeUser.title}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  id="nav-to-public-btn"
                  onClick={() => setCurrentPage('public')}
                  className="w-full text-center hover:text-white text-slate-400 text-[10px] py-1 border border-slate-700 hover:bg-white/5 rounded font-bold"
                >
                  View Public
                </button>
                <button
                  id="nav-logout-btn"
                  onClick={handleLogout}
                  className="w-full text-center hover:text-white text-red-400 text-[10px] py-1 border border-slate-705 bg-red-900/10 hover:bg-red-900/20 rounded font-bold flex items-center justify-center space-x-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Exit</span>
                </button>
              </div>
            </div>
          </aside>

          {/* 2. MAIN CONTENT REGION */}
          <div id="mains-container" className="flex-grow flex flex-col min-w-0">
            
            {/* TOP HEADER PANELS */}
            <header id="internal-header" className="bg-white h-16 border-b border-slate-200 px-6 flex justify-between items-center shadow-xs">
              
              {/* Breadcrumbs Indicator */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                <span className="cursor-pointer hover:text-slate-900" onClick={() => setCurrentPage('dashboard')}>LIAS Internal Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span className="text-slate-900 uppercase font-black tracking-widest">{currentPage} workspace</span>
              </div>

              {/* Header Widgets (Search, Notifications dropdown, User dropdown triggers) */}
              <div className="flex items-center space-x-5">
                
                {/* Search overlay mockup */}
                <div className="relative hidden md:block w-48 text-xs font-semibold">
                  <Search className="absolute left-2.5 top-2 h-3.5 h-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search systems..."
                    className="pl-8 pr-3 py-1.5 rounded-md border text-xs bg-slate-50 border-slate-200 focus:outline-none w-full"
                    onClick={() => {
                      if (currentPage !== 'members') {
                        setCurrentPage('members');
                      }
                    }}
                  />
                </div>

                {/* Notifications Bell with unread counter */}
                <div className="relative">
                  <button 
                    id="header-notif-bell-btn"
                    onClick={() => { setNotifDropdownOpen(!notifDropdownOpen); setUserMenuOpen(false); }}
                    className="p-2 hover:bg-slate-100 rounded-full relative transition text-slate-650"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white font-black text-[9px] rounded-full scale-100 flex items-center justify-center font-mono">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* NOTIFICATION CENTER DROPDOWN DIRECT DIALOG */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl border border-slate-250 shadow-xl z-50 py-3 space-y-3">
                      <div className="px-4 flex justify-between items-center border-b pb-2 text-xs">
                        <strong className="font-bold text-slate-900">Direct Notifications</strong>
                        {unreadCount > 0 && (
                          <button 
                            id="mark-all-read-btn"
                            onClick={() => { handleMarkAllNotificationsRead(); setNotifDropdownOpen(false); }}
                            className="text-[10px] text-blue-600 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-1.5 px-1">
                        {notifications.length === 0 ? (
                          <p className="text-center py-6 text-xs text-slate-400 font-medium">No alerts flagged.</p>
                        ) : (
                          notifications.slice(0, 4).map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => { handleMarkNotificationRead(n.id); setNotifDropdownOpen(false); }}
                              className={`p-2.5 rounded-lg text-[11px] cursor-pointer hover:bg-slate-50 transition border ${
                                n.read ? 'bg-white border-transparent' : 'bg-blue-50/20 border-blue-100'
                              }`}
                            >
                              <strong className="font-bold text-slate-900 block">{n.title}</strong>
                              <p className="text-slate-650 line-clamp-2 mt-0.5">{n.message}</p>
                              <span className="text-[9px] text-slate-400 block font-mono mt-1">{n.date}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="text-center pt-2 border-t text-xs">
                        <button 
                          onClick={() => { setCurrentPage('dashboard'); setNotifDropdownOpen(false); }}
                          className="text-[#1E40AF] hover:underline font-bold"
                        >
                          Show Dashboard Alerts
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile menu shortcut */}
                <div className="relative">
                  <div 
                    id="header-user-menu-btn"
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifDropdownOpen(false); }}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50/50 p-1.5 rounded-lg transition"
                  >
                    <div className="w-7 h-7 bg-[#1E40AF] text-white rounded-full flex items-center justify-center font-black text-[11px]">
                      {activeUser.firstName[0]}
                    </div>
                    <span className="text-slate-700 font-bold text-xs hidden md:inline">{activeUser.firstName} {activeUser.lastName}</span>
                  </div>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-2 text-xs text-slate-600 font-semibold">
                      <button 
                        onClick={() => { setCurrentPage('profile'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Personal Profile Bio
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('academic'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Academic Works
                      </button>
                      <div className="border-t my-1"></div>
                      <button 
                        onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 hover:text-red-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </header>

            {/* MAIN WORKSPACE WRAPPER */}
            <main className="flex-grow p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
              
              {currentPage === 'dashboard' && (
                <Dashboard 
                  currentFaculty={activeUser}
                  members={members}
                  publications={publications}
                  events={events}
                  equipment={equipmentList}
                  requests={requests}
                  notifications={notifications}
                  timeline={timeline}
                  onNavigate={(page) => setCurrentPage(page)}
                  onApproveRequest={handleApproveRequest}
                  onRejectRequest={handleRejectRequest}
                  onMarkNotificationRead={handleMarkNotificationRead}
                />
              )}

              {currentPage === 'members' && (
                <MembersAndProfile 
                  currentFaculty={activeUser}
                  members={members}
                  onUpdateMembers={setMembers}
                  selectedMemberIdForPublicView={selectedMemberIdForPublicView}
                  onClearSelectedMemberId={() => setSelectedMemberIdForPublicView(undefined)}
                />
              )}

              {currentPage === 'operations' && (
                <AdministrativeModules 
                  currentFaculty={activeUser}
                  requests={requests}
                  onUpdateRequests={setRequests}
                  members={members}
                  onUpdateMembers={setMembers}
                  documents={documents}
                  onUpdateDocuments={setDocuments}
                  equipmentList={equipmentList}
                  onUpdateEquipment={setEquipmentList}
                  onNavigate={(page) => setCurrentPage(page)}
                />
              )}

              {currentPage === 'academic' && (
                <AcademicModules 
                  currentFaculty={activeUser}
                  publications={publications}
                  onUpdatePublications={setPublications}
                  events={events}
                  onUpdateEvents={setEvents}
                  meetings={meetings}
                  onUpdateMeetings={setMeetings}
                  members={members}
                  onNavigate={(page) => setCurrentPage(page)}
                />
              )}

              {currentPage === 'profile' && (
                <MembersAndProfile 
                  currentFaculty={activeUser}
                  members={members}
                  onUpdateMembers={setMembers}
                  selectedMemberIdForPublicView={undefined}
                />
              )}

            </main>
          </div>

        </div>
      )}

    </div>
  );
}
