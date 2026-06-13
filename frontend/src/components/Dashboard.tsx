import { useState } from 'react';
import { 
  Users, BookOpen, Calendar, ShieldCheck, 
  ChevronRight, AlertTriangle, Bell, Clock, 
  TrendingUp, BarChart2, Plus, ArrowRight, UserCheck, Play, Layers
} from 'lucide-react';
import { Member, Publication, Event, Equipment, MembershipRequest, Notification, TimelineEvent } from '../types';

interface DashboardProps {
  currentFaculty: { id: string; email: string; firstName: string; lastName: string; role: 'ADMIN' | 'MEMBER'; title: string };
  members: Member[];
  publications: Publication[];
  events: Event[];
  equipment: Equipment[];
  requests: MembershipRequest[];
  notifications: Notification[];
  timeline: TimelineEvent[];
  onNavigate: (page: string) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onMarkNotificationRead: (notifId: string) => void;
}

export default function Dashboard({
  currentFaculty,
  members,
  publications,
  events,
  equipment,
  requests,
  notifications,
  timeline,
  onNavigate,
  onApproveRequest,
  onRejectRequest,
  onMarkNotificationRead
}: DashboardProps) {
  
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const unreadNotifs = notifications.filter(n => !n.read);

  // Counts
  const totalMembers = members.length;
  const activeMembersCount = members.filter(m => m.isActive).length;
  const totalPubs = publications.length;
  const totalEventsCount = events.length;
  const totalEquipCount = equipment.length;
  const assignedEquipCount = equipment.filter(eq => eq.status === 'Assigned').length;
  const maintenanceEquipCount = equipment.filter(eq => eq.status === 'Maintenance').length;

  // Render Admin Dashboard
  const renderAdminDashboard = () => (
    <div id="admin-summary-grid" className="space-y-8 animate-fade-in">
      {/* Primary Analytics Counters */}
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Director Management Command Center</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Faculty Members', count: activeMembersCount, total: totalMembers, sub: 'Registered members in directory', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Peer Publications', count: totalPubs, total: null, sub: 'Indexed scholarly works', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { label: 'Conferences & Seminars', count: totalEventsCount, total: null, sub: 'Planned university events', icon: Calendar, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Assigned Scientific Assets', count: assignedEquipCount, total: totalEquipCount, sub: `${maintenanceEquipCount} nodes under tune-up`, icon: Layers, color: 'text-amber-600 bg-amber-50 border-amber-100' }
        ].map((counter, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">{counter.label}</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-slate-900 font-mono">{counter.count}</span>
                {counter.total !== null && <span className="text-xs font-semibold text-slate-400 font-mono">/ {counter.total} max</span>}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{counter.sub}</p>
            </div>
            <div className={`p-3 rounded-xl border ${counter.color}`}>
              <counter.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Publications Performance Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* custom simulated visual charts */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-250 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Publications and Event Metrics (Annual Velocity)</h4>
              <p className="text-xs text-slate-500">Comparing scholarly outputs against symposia schedules.</p>
            </div>
            <BarChart2 className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="pt-4 h-64 flex flex-col justify-between">
            {/* Custom SVG/CSS bar graph */}
            <div className="flex items-end justify-around h-44 pb-2 border-b border-slate-200">
              {[
                { year: '2022', pubs: 18, events: 4, height1: 'h-2/5', height2: 'h-1/5' },
                { year: '2023', pubs: 26, events: 6, height1: 'h-3/5', height2: 'h-2/5' },
                { year: '2024', pubs: 34, events: 8, height1: 'h-4/5', height2: 'h-3/5' },
                { year: '2025', pubs: 48, events: 11, height1: 'h-[95%]', height2: 'h-[50%]' },
                { year: '2026 (Est)', pubs: 52, events: 14, height1: 'h-[100%]', height2: 'h-[65%]' }
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center w-16 text-center group cursor-pointer">
                  <div className="flex space-x-1.5 h-36 items-end w-full px-2">
                    {/* Publication Bar */}
                    <div className={`w-full bg-[#1E40AF] ${bar.height1} rounded-t transition-all group-hover:bg-blue-700 relative`}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {bar.pubs} pubs
                      </span>
                    </div>
                    {/* Event Bar */}
                    <div className={`w-full bg-[#3B82F6] ${bar.height2} rounded-t transition-all group-hover:bg-blue-400 relative`}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {bar.events} events
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 mt-2 font-mono">{bar.year}</span>
                </div>
              ))}
            </div>

            {/* Legends */}
            <div className="flex justify-center space-x-6 text-[11px] font-medium text-slate-500">
              <span className="flex items-center"><span className="w-3 h-3 bg-[#1E40AF] rounded mr-1.5 inline-block" /> Peer-reviewed Publications</span>
              <span className="flex items-center"><span className="w-3 h-3 bg-[#3B82F6] rounded mr-1.5 inline-block" /> Academic Events & Symposia</span>
            </div>
          </div>
        </div>

        {/* Pending Membership requests */}
        <div id="pending-applications-board" className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Applications Queue</h4>
                <p className="text-[11px] text-slate-500">Faculty membership requests pending.</p>
              </div>
              <span className="text-xs bg-amber-100 font-bold text-amber-800 py-0.5 px-2 rounded-full font-mono">{pendingRequests.length}</span>
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto">
              {pendingRequests.map(req => (
                <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold text-slate-900 text-xs">{req.firstName} {req.lastName}</h5>
                      <span className="text-[10px] text-[#1E40AF] bg-blue-50 font-bold tracking-tight rounded px-1.5 py-0.5">{req.academicTitle}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">{req.submittedAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">"{req.motivation}"</p>
                  
                  <div className="flex space-x-1.5 pt-1">
                    <button
                      id={`approve-req-btn-${req.id}`}
                      onClick={() => onApproveRequest(req.id)}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold py-1 rounded transition text-center"
                    >
                      Approve
                    </button>
                    <button
                      id={`reject-req-btn-${req.id}`}
                      onClick={() => onRejectRequest(req.id)}
                      className="flex-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-[10px] font-bold py-1 rounded border border-slate-200 transition text-center"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}

              {pendingRequests.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  <p className="font-medium">All applications fully processed.</p>
                  <p className="text-[10px] text-slate-500 mt-1">Visitors can apply via the portal registration gateway.</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('requests')}
            className="w-full text-center text-xs text-blue-600 hover:underline font-bold mt-4 pt-3 border-t border-slate-100 flex items-center justify-center space-x-1"
          >
            <span>Manage All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notifications and Timeline split section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notifications list */}
        <div id="dashboard-notifications-scroller" className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Notifications Center</h4>
              <p className="text-xs text-slate-500">Direct real-time alerts.</p>
            </div>
            {unreadNotifs.length > 0 && (
              <span className="text-[11px] bg-red-100 text-red-800 font-bold font-mono px-2 py-0.5 rounded-full">
                {unreadNotifs.length} unread
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-3 rounded-lg text-xs flex justify-between items-start border transition ${
                  notif.read ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-blue-50/30 border-blue-100'
                }`}
              >
                <div className="space-y-1 pr-6">
                  <h5 className={`font-semibold text-slate-900 ${!notif.read && 'text-blue-900'}`}>{notif.title}</h5>
                  <p className="text-slate-600">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block font-mono">{notif.date}</span>
                </div>
                {!notif.read && (
                  <button
                    id={`notif-read-btn-${notif.id}`}
                    onClick={() => onMarkNotificationRead(notif.id)}
                    className="text-[10px] font-bold text-blue-600 hover:underline shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Milestone and Timeline tracker */}
        <div id="academic-milestones" className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Academic Activity Logs</h4>
              <p className="text-xs text-slate-500">Registry milestone events.</p>
            </div>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {timeline.slice(0, 5).map((evt, idx) => (
              <div key={evt.id} className="relative flex space-x-3 items-start text-xs">
                {/* Visual Timeline connector */}
                {idx < 4 && <span className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-slate-200" />}
                <div className="w-5 h-5 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <strong className="text-slate-950 font-bold">{evt.title}</strong>
                    <span className="text-[9px] text-slate-400 font-mono">{evt.date}</span>
                  </div>
                  <p className="text-slate-600 break-words leading-relaxed">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Member Dashboard (Research Faculty)
  const renderMemberDashboard = () => {
    // Filter member assets
    const ownPublications = publications.slice(0, 3); // realistic mock representation
    const registeredSchedules = events.filter(e => e.registeredParticipants.includes('clara.dupont@university.edu') || e.registeredParticipants.includes('test@test.com') || e.registeredParticipants.length > 1);

    return (
      <div id="member-summary" className="space-y-8 animate-fade-in">
        {/* Profile Card Summary & Actions */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E40AF] text-white p-8 rounded-2xl border border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center">
            <img 
              referrerPolicy="no-referrer"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" 
              alt="Faculty Avatar"
              className="w-20 h-20 rounded-full border-4 border-white/20 bg-slate-50 object-cover"
            />
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs text-blue-300 font-bold uppercase tracking-wider block">{currentFaculty.title} Portal</span>
              <h3 className="text-2xl font-black text-white">{currentFaculty.firstName} {currentFaculty.lastName}</h3>
              <p className="text-xs text-slate-300">{currentFaculty.email} | Research Division t2</p>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col space-y-2">
            <button
              id="dashboard-edit-profile-btn"
              onClick={() => onNavigate('profile')}
              className="bg-white text-slate-900 font-bold text-xs py-2 px-4 rounded-lg hover:bg-slate-100 transition shadow-xs text-center"
            >
              Update Faculty Bio Files
            </button>
            <button
              id="dashboard-new-publication-btn"
              onClick={() => onNavigate('publications')}
              className="bg-transparent text-white border border-white/30 font-semibold text-xs py-2 px-4 rounded-lg hover:bg-white/10 transition text-center"
            >
              Index Academic Publication
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Member Workouts & Publications */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Scholarly Works Overview</h4>
                <p className="text-xs text-slate-500">Our latest coauthored publications database files in system.</p>
              </div>
              <button 
                onClick={() => onNavigate('publications')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Add new publication
              </button>
            </div>

            <div className="space-y-4">
              {ownPublications.map(pub => (
                <div key={pub.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2 hover:bg-slate-100 transition">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded font-mono uppercase">{pub.category}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {pub.id}</span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">{pub.title}</h5>
                  <p className="text-xs text-slate-500">Coauthors: {pub.authors.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Member Calendar Register */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Upcoming Registrations</h4>
                  <p className="text-[11px] text-slate-500">Seminars and reviews slated.</p>
                </div>
                <Calendar className="w-5 h-5 text-[#1E40AF]" />
              </div>

              <div className="space-y-3">
                {registeredSchedules.map(evt => (
                  <div key={evt.id} className="flex space-x-3 items-start text-xs p-2 bg-slate-50 rounded border border-slate-100">
                    <div className="bg-blue-100 text-[#1E40AF] px-2.5 py-1.5 rounded text-center font-mono font-black shrink-0">
                      {evt.date.split('-')[2]}
                    </div>
                    <div className="space-y-0.5">
                      <strong className="text-slate-900">{evt.title}</strong>
                      <p className="text-slate-500 text-[10px]">{evt.time} UTC | {evt.location}</p>
                    </div>
                  </div>
                ))}

                {registeredSchedules.length === 0 && (
                  <p className="text-slate-400 text-center py-6 text-xs">No imminent event registrations registered.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('events')}
              className="w-full text-center text-xs text-blue-600 hover:underline font-bold border-t border-slate-100 pt-3"
            >
              Browse Public Events Calendar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="general-dashboard-view" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">LIAS Lab Information Terminal</h2>
          <p className="text-xs text-slate-500">Welcome back, <strong className="text-slate-800">{currentFaculty.firstName} {currentFaculty.lastName}</strong> ({currentFaculty.role} permissions level).</p>
        </div>
        <div className="text-xs text-slate-400 font-mono font-medium bg-slate-100 px-3 py-1.5 rounded border">
          System Time: 2026-06-09 UTC
        </div>
      </div>

      {currentFaculty.role === 'ADMIN' ? renderAdminDashboard() : renderMemberDashboard()}
    </div>
  );
}
