import React, { useState } from 'react';
import { 
  BookOpen, Calendar, HelpCircle, Plus, CheckCircle, 
  Trash, Edit, Search, FileText, BarChart2, PlusCircle, 
  Clock, MapPin, X, Check, Save, Printer, Award, FileSpreadsheet, Users, GraduationCap
} from 'lucide-react';
import { Publication, Event, Meeting, Member } from '../types';

interface AcademicModulesProps {
  currentFaculty: { id: string; email: string; firstName: string; lastName: string; role: 'ADMIN' | 'MEMBER'; title: string };
  publications: Publication[];
  onUpdatePublications: (newPubs: Publication[]) => void;
  events: Event[];
  onUpdateEvents: (newEvents: Event[]) => void;
  meetings: Meeting[];
  onUpdateMeetings: (newMeetings: Meeting[]) => void;
  members: Member[];
  onNavigate: (page: string) => void;
}

export default function AcademicModules({
  currentFaculty,
  publications,
  onUpdatePublications,
  events,
  onUpdateEvents,
  meetings,
  onUpdateMeetings,
  members,
  onNavigate
}: AcademicModulesProps) {
  const [activeModule, setActiveModule] = useState<'publications' | 'events' | 'meetings' | 'reports'>('publications');

  // Publication State
  const [pubSearch, setPubSearch] = useState('');
  const [showAddPubModal, setShowAddPubModal] = useState(false);
  const [newPubForm, setNewPubForm] = useState({
    title: '', authors: '', journal: '', conference: '', doi: '', year: 2026, abstract: '', category: 'Journal' as any
  });

  // Events State
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    title: '', type: 'Seminar' as any, date: '2026-08-15', time: '14:00', location: 'Meeting Room 204C', description: '', speaker: '', maxParticipants: 50
  });
  
  // Attendance tracking state (holds active event for roster checking)
  const [trackedEvent, setTrackedEvent] = useState<Event | null>(null);

  // Meetings State
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [newMeetingForm, setNewMeetingForm] = useState({
    title: '', date: '2026-06-20', time: '10:00', location: 'Strategic Board Room', agenda: '', organizer: `${currentFaculty.firstName} ${currentFaculty.lastName}`
  });
  const [editingMeetingMinutes, setEditingMeetingMinutes] = useState<Meeting | null>(null);
  const [minutesText, setMinutesText] = useState('');

  // Save publication helper
  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubForm.title || !newPubForm.authors) return;

    const authorsList = newPubForm.authors.split(',').map(a => a.trim()).filter(Boolean);
    const added: Publication = {
      id: 'p_gen_' + Date.now(),
      title: newPubForm.title,
      authors: authorsList,
      journal: newPubForm.category === 'Journal' ? newPubForm.journal : undefined,
      conference: newPubForm.category === 'Conference' ? newPubForm.conference : undefined,
      doi: newPubForm.doi || '10.1109/LIAS.' + Math.floor(Math.random() * 90000 + 10000),
      year: Number(newPubForm.year),
      abstract: newPubForm.abstract,
      category: newPubForm.category,
      pdfUrl: '#'
    };

    onUpdatePublications([added, ...publications]);
    setShowAddPubModal(false);
    setNewPubForm({ title: '', authors: '', journal: '', conference: '', doi: '', year: 2026, abstract: '', category: 'Journal' });
  };

  const handleDeletePublication = (pubId: string) => {
    if (confirm('Verify: delete this scholarly work index record?')) {
      onUpdatePublications(publications.filter(p => p.id !== pubId));
    }
  };

  // Add event helper
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title) return;

    const added: Event = {
      id: 'e_gen_' + Date.now(),
      title: newEventForm.title,
      type: newEventForm.type,
      date: newEventForm.date,
      time: newEventForm.time,
      location: newEventForm.location,
      description: newEventForm.description,
      speaker: newEventForm.speaker || undefined,
      registeredParticipants: [],
      attendedParticipants: [],
      maxParticipants: Number(newEventForm.maxParticipants)
    };

    onUpdateEvents([added, ...events]);
    setShowAddEventModal(false);
    setNewEventForm({ title: '', type: 'Seminar', date: '2026-08-15', time: '14:00', location: 'Meeting Room 204C', description: '', speaker: '', maxParticipants: 50 });
  };

  // Toggle register to event for testing user
  const handleToggleRegisterEvent = (eventId: string) => {
    const userEmail = currentFaculty.email;
    const updated = events.map(e => {
      if (e.id === eventId) {
        const isRegistered = e.registeredParticipants.includes(userEmail);
        const registeredParticipants = isRegistered 
          ? e.registeredParticipants.filter(p => p !== userEmail) 
          : [...e.registeredParticipants, userEmail];
        return { ...e, registeredParticipants };
      }
      return e;
    });
    onUpdateEvents(updated);
    // Sync tracked event
    if (trackedEvent && trackedEvent.id === eventId) {
      setTrackedEvent(updated.find(e => e.id === eventId) || null);
    }
  };

  // Attendance checking check-ins
  const handleToggleAttendanceCheckIn = (eventId: string, participantEmail: string) => {
    const updated = events.map(e => {
      if (e.id === eventId) {
        const isAttended = e.attendedParticipants.includes(participantEmail);
        const attendedParticipants = isAttended
          ? e.attendedParticipants.filter(p => p !== participantEmail)
          : [...e.attendedParticipants, participantEmail];
        return { ...e, attendedParticipants };
      }
      return e;
    });
    onUpdateEvents(updated);
    if (trackedEvent && trackedEvent.id === eventId) {
      setTrackedEvent(updated.find(e => e.id === eventId) || null);
    }
  };

  // Create meetings helper
  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingForm.title) return;

    const added: Meeting = {
      id: 'mt_gen_' + Date.now(),
      title: newMeetingForm.title,
      date: newMeetingForm.date,
      time: newMeetingForm.time,
      location: newMeetingForm.location,
      agenda: newMeetingForm.agenda,
      organizer: newMeetingForm.organizer,
      attendees: ['Prof. Helen Vance', 'Dr. Arthur Pendelton', 'Clara Dupont'] // default realistic mockup attendees
    };

    onUpdateMeetings([added, ...meetings]);
    setShowAddMeetingModal(false);
    setNewMeetingForm({ title: '', date: '2026-06-20', time: '10:00', location: 'Strategic Board Room', agenda: '', organizer: `${currentFaculty.firstName} ${currentFaculty.lastName}` });
  };

  // Minutes writer
  const handleSaveMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeetingMinutes) return;

    const updated = meetings.map(m => {
      if (m.id === editingMeetingMinutes.id) {
        return { ...m, minutes: minutesText };
      }
      return m;
    });

    onUpdateMeetings(updated);
    setEditingMeetingMinutes(null);
    setMinutesText('');
  };

  // Filter pubs
  const filteredPubs = publications.filter(p => {
    const titleMatch = p.title.toLowerCase().includes(pubSearch.toLowerCase());
    const authorMatch = p.authors.some(a => a.toLowerCase().includes(pubSearch.toLowerCase()));
    return titleMatch || authorMatch;
  });

  // Simple statistics count
  const journalCount = publications.filter(p => p.category === 'Journal').length;
  const confCount = publications.filter(p => p.category === 'Conference').length;
  const bookCount = publications.filter(p => p.category === 'Book Chapter' || p.category === 'Preprint').length;

  return (
    <div id="academic-operations-viewport" className="space-y-8 animate-fade-in">
      
      {/* Sub tabs controllers */}
      <div id="academic-sub-tabs" className="flex flex-wrap gap-2.5 bg-slate-100 p-1.5 rounded-lg border text-xs font-semibold text-slate-600 w-fit">
        {[
          { id: 'publications', label: 'Index Publications' },
          { id: 'events', label: 'Events & Attendance' },
          { id: 'meetings', label: 'Minutes & Meetings' },
          { id: 'reports', label: 'Annual Reports PDF' }
        ].map(mod => (
          <button
            key={mod.id}
            id={`sub-tab-academic-${mod.id}`}
            onClick={() => { setActiveModule(mod.id as any); setTrackedEvent(null); }}
            className={`px-4 py-2 rounded-md transition ${
              activeModule === mod.id 
                ? 'bg-white text-slate-950 shadow-xs font-bold' 
                : 'hover:text-slate-950 hover:bg-white/40'
            }`}
          >
            {mod.label}
          </button>
        ))}
      </div>

      {/* MODULE 1: PUBLICATIONS */}
      {activeModule === 'publications' && (
        <div id="publications-indexing" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Publications Indexing</h3>
              <p className="text-xs text-slate-500">Record, search, and edit peer-reviewed works within international science archives.</p>
            </div>

            <div className="flex gap-2 items-center w-full md:w-auto">
              <div className="relative flex-grow md:w-64 text-xs font-semibold">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Lookup title or authors..."
                  value={pubSearch}
                  onChange={(e) => setPubSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border rounded bg-white w-full outline-none"
                />
              </div>

              <button
                id="add-pub-master-btn"
                onClick={() => setShowAddPubModal(true)}
                className="bg-[#1E40AF] text-white hover:bg-blue-700 py-2 px-4 rounded text-xs uppercase font-extrabold flex items-center shrink-0"
              >
                <Plus className="w-4 h-4 mr-1" /> Log Work
              </button>
            </div>
          </div>

          {/* Quick Stats Chart mockup widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Journal Articles Indexed', count: journalCount, desc: 'High Impact Journals', color: 'h-1/2' },
              { label: 'Conference Manuscripts', count: confCount, desc: 'IEEE/ACM Symposia', color: 'h-2/3' },
              { label: 'Academic Preprints & Books', count: bookCount, desc: 'Preprints/Chapters', color: 'h-1/4' },
              { label: 'Total Output Volume', count: publications.length, desc: 'Active records', color: 'h-full' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">{stat.label}</span>
                  <strong className="text-2xl font-black text-slate-900 font-mono block mt-1">{stat.count}</strong>
                  <span className="text-[10px] text-slate-500 italic mt-0.5 block">{stat.desc}</span>
                </div>
                <BookOpen className="w-7 h-7 text-blue-100 flex-shrink-0" />
              </div>
            ))}
          </div>

          {/* Table List of publications */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-250 text-slate-500 font-bold uppercase text-[9px] tracking-widest">
                    <th className="p-4">Publications Details</th>
                    <th className="p-4">Scholarly Authors</th>
                    <th className="p-4">Year</th>
                    <th className="p-4">Identifier DOI</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                  {filteredPubs.map(pub => (
                    <tr key={pub.id} className="hover:bg-slate-50/20">
                      <td className="p-4 max-w-sm">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">{pub.category}</span>
                        <strong className="text-slate-900 block font-bold text-xs mt-1.5">{pub.title}</strong>
                        {pub.journal && <span className="text-[11px] italic text-[#1E40AF] mt-0.5 block">Journal: {pub.journal}</span>}
                        {pub.conference && <span className="text-[11px] italic text-[#1E40AF] mt-0.5 block">Conference: {pub.conference}</span>}
                      </td>
                      <td className="p-4 text-[#0F172A]">{pub.authors.join(', ')}</td>
                      <td className="p-4 font-mono">{pub.year}</td>
                      <td className="p-4 font-mono text-slate-500">{pub.doi}</td>
                      <td className="p-4 text-right space-x-1.5">
                        <button 
                          id={`pub-delete-btn-${pub.id}`}
                          onClick={() => handleDeletePublication(pub.id)}
                          className="text-red-400 hover:text-red-600 font-bold"
                        >
                          <Trash className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD PUBLICATION MODAL DIALOG */}
          {showAddPubModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border p-6 w-full max-w-lg space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-bold text-slate-900 text-sm">Index New Scholarly Manuscript</h4>
                  <button onClick={() => setShowAddPubModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
                </div>

                <form onSubmit={handleAddPublication} className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="space-y-1">
                    <label>Publication Title</label>
                    <input 
                      type="text" required value={newPubForm.title}
                      onChange={(e) => setNewPubForm({ ...newPubForm, title: e.target.value })}
                      placeholder="e.g. Robust Cryptographic consensus safety boundaries"
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Authors list (Comma separated)</label>
                    <input 
                      type="text" required value={newPubForm.authors}
                      onChange={(e) => setNewPubForm({ ...newPubForm, authors: e.target.value })}
                      placeholder="e.g. Prof. Helen Vance, Clara Dupont"
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label>Category</label>
                      <select 
                        value={newPubForm.category}
                        onChange={(e) => setNewPubForm({ ...newPubForm, category: e.target.value as any })}
                        className="w-full border bg-white rounded p-2 text-xs outline-none"
                      >
                        <option value="Journal">Journal Article</option>
                        <option value="Conference">Conference Manuscript</option>
                        <option value="Book Chapter">Book Chapter</option>
                        <option value="Preprint">Research Preprint</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label>Publication Year</label>
                      <input 
                        type="number" required value={newPubForm.year}
                        onChange={(e) => setNewPubForm({ ...newPubForm, year: Number(e.target.value) })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none font-mono"
                      />
                    </div>
                  </div>

                  {newPubForm.category === 'Journal' ? (
                    <div className="space-y-1">
                      <label>Journal Name</label>
                      <input 
                        type="text" required value={newPubForm.journal}
                        onChange={(e) => setNewPubForm({ ...newPubForm, journal: e.target.value })}
                        placeholder="e.g. IEEE Transactions on Networks"
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label>Conference Symposia Name</label>
                      <input 
                        type="text" required value={newPubForm.conference}
                        onChange={(e) => setNewPubForm({ ...newPubForm, conference: e.target.value })}
                        placeholder="e.g. ACM Conference on Bioinformatics"
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label>Digital Object Identifier (DOI) - Optional</label>
                    <input 
                      type="text" value={newPubForm.doi}
                      onChange={(e) => setNewPubForm({ ...newPubForm, doi: e.target.value })}
                      placeholder="e.g. 10.1109/ICRA.2026.331"
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Scholarly Abstract Details</label>
                    <textarea 
                      rows={4} required value={newPubForm.abstract}
                      onChange={(e) => setNewPubForm({ ...newPubForm, abstract: e.target.value })}
                      placeholder="Enter a brief paragraph outlining the paper methodology bounds, findings and contribution limits..."
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1E40AF] text-white hover:bg-blue-700 py-2.5 font-bold rounded text-xs uppercase"
                  >
                    Authorize and Index record
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 2: EVENTS & ATTENDANCE */}
      {activeModule === 'events' && (
        <div id="events-attendance-tracker" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900">Events and Attendance Tracking</h3>
              <p className="text-xs text-slate-500">Coordinate conferences, workshops, and PhD Dissertations. Track student attendance rosters.</p>
            </div>

            <button
              id="add-event-master-btn"
              onClick={() => setShowAddEventModal(true)}
              className="bg-[#1E40AF] text-white hover:bg-blue-700 py-2 px-4 rounded text-xs uppercase font-extrabold flex items-center shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" /> Plan Event
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left list */}
            <div className="lg:col-span-8 space-y-4">
              {events.map(evt => {
                const userEmail = currentFaculty.email;
                const isRegistered = evt.registeredParticipants.includes(userEmail);

                return (
                  <div key={evt.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold py-0.5 px-2 rounded-full uppercase tracking-wider">{evt.type}</span>
                        <h4 className="font-extrabold text-slate-950 text-base leading-snug">{evt.title}</h4>
                        {evt.speaker && <p className="text-xs text-blue-700 font-semibold">Liaison Host: {evt.speaker}</p>}
                      </div>

                      <div className="text-right text-xs font-mono text-slate-400">
                        {evt.date} | {evt.time} UTC
                      </div>
                    </div>

                    <p className="text-xs text-slate-650 leading-relaxed font-semibold">{evt.description}</p>
                    
                    <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Participants: <strong className="text-slate-800 font-mono">{evt.registeredParticipants.length} registered</strong></span>
                      
                      <div className="space-x-2">
                        <button
                          id={`toggle-register-evt-${evt.id}`}
                          onClick={() => handleToggleRegisterEvent(evt.id)}
                          className={`font-extrabold py-1 px-3.5 rounded text-[11px] transition uppercase ${
                            isRegistered 
                              ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600' 
                              : 'bg-[#1E40AF] text-white hover:bg-blue-700'
                          }`}
                        >
                          {isRegistered ? 'Withdraw Registration' : 'Register Participancy'}
                        </button>

                        <button 
                          id={`track-attendance-btn-${evt.id}`}
                          onClick={() => setTrackedEvent(evt)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-1 px-3.5 rounded text-[11px] uppercase"
                        >
                          Roster checklist
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right attendance checklist roster */}
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center"><Users className="w-5 h-5 mr-2 text-[#1E40AF]" /> Attendance Check-in</h4>

              {trackedEvent ? (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <strong className="text-xs text-slate-900 block leading-snug">{trackedEvent.title}</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Roster Ratios: {trackedEvent.attendedParticipants.length} attended / {trackedEvent.registeredParticipants.length} registered</span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {/* Map other members as simulation if registeredParticipants is empty */}
                    {trackedEvent.registeredParticipants.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400 font-medium">No registrations yet.<br />Click 'Register Participancy' to join.</p>
                    ) : (
                      trackedEvent.registeredParticipants.map(participant => {
                        const isChecked = trackedEvent.attendedParticipants.includes(participant);

                        return (
                          <div key={participant} className="flex justify-between items-center p-2.5 bg-slate-50 rounded border text-xs">
                            <span className="truncate max-w-[150px] font-mono font-medium text-slate-700">{participant}</span>
                            
                            <button
                              id={`toggle-checkin-${participant}`}
                              onClick={() => handleToggleAttendanceCheckIn(trackedEvent.id, participant)}
                              className={`flex items-center space-x-1 font-bold text-[10px] py-1 px-3.5 rounded border transition ${
                                isChecked 
                                  ? 'bg-green-600 border-green-600 text-white' 
                                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {isChecked ? <><Check className="w-3 h-3" /> <span>Attended</span></> : <span>Mark Present</span>}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button 
                    onClick={() => setTrackedEvent(null)}
                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Deselect Event
                  </button>
                </div>
              ) : (
                <p className="text-center py-12 text-slate-400 text-xs font-medium">Select 'Roster checklist' on any active event to configure user check-ins.</p>
              )}
            </div>

          </div>

          {/* ADD EVENT MODAL */}
          {showAddEventModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border p-6 w-full max-w-md space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-bold text-slate-900 text-sm">Schedule Academic Event</h4>
                  <button onClick={() => setShowAddEventModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
                </div>

                <form onSubmit={handleAddEvent} className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="space-y-1">
                    <label>Event Name</label>
                    <input 
                      type="text" required value={newEventForm.title}
                      onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                      placeholder="e.g. Quantum cryptographer guest seminar"
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label>Type</label>
                      <select 
                        value={newEventForm.type}
                        onChange={(e) => setNewEventForm({ ...newEventForm, type: e.target.value as any })}
                        className="w-full border bg-white rounded p-2 text-xs outline-none"
                      >
                        <option value="Conference">Breakthrough Conference</option>
                        <option value="Workshop">Technical Workshop</option>
                        <option value="Seminar">Scholarly Seminar</option>
                        <option value="PhD Defense">PhD Thesis Defense</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label>Max Seats List</label>
                      <input 
                        type="number" required value={newEventForm.maxParticipants}
                        onChange={(e) => setNewEventForm({ ...newEventForm, maxParticipants: Number(e.target.value) })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label>Date</label>
                      <input 
                        type="date" required value={newEventForm.date}
                        onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>Opening Time (UTC)</label>
                      <input 
                        type="time" required value={newEventForm.time}
                        onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label>Campus Location / Auditorium</label>
                    <input 
                      type="text" required value={newEventForm.location}
                      onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                      placeholder="e.g. Space Building, Auditorium B"
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Principal Speaker (If applicable)</label>
                    <input 
                      type="text" value={newEventForm.speaker}
                      onChange={(e) => setNewEventForm({ ...newEventForm, speaker: e.target.value })}
                      placeholder="e.g. Prof. Pierre-Louis Lions"
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Executive Description Outline</label>
                    <textarea 
                      rows={3} required value={newEventForm.description}
                      onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1E40AF] text-white hover:bg-blue-700 py-2.5 font-bold rounded text-xs uppercase"
                  >
                    Publish and open registration
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODULE 3: MEETINGS PLANNER */}
      {activeModule === 'meetings' && (
        <div id="meetings-minutes-manager" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900">Academic Board Meetings</h3>
              <p className="text-xs text-slate-500">Plan strategic boards, configure meeting agendas, and write official session minutes.</p>
            </div>

            <button
              id="add-meeting-master-btn"
              onClick={() => setShowAddMeetingModal(true)}
              className="bg-[#1E40AF] text-white hover:bg-blue-700 py-2 px-4 rounded text-xs uppercase font-extrabold flex items-center shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" /> Schedule Meeting
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left list */}
            <div className="lg:col-span-8 space-y-4">
              {meetings.map(meet => (
                <div key={meet.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-950 text-base leading-snug">{meet.title}</h4>
                      <p className="text-xs text-slate-450">Convened under: <strong className="text-slate-800">{meet.organizer}</strong></p>
                    </div>

                    <div className="text-right text-xs text-slate-400 font-mono">
                      {meet.date} | {meet.time} UTC
                    </div>
                  </div>

                  <div className="text-xs text-slate-650 space-y-2 leading-relaxed">
                    <p><strong className="text-slate-900">Agenda Directives:</strong></p>
                    <pre className="whitespace-pre-wrap bg-slate-50 p-3 rounded font-sans border border-slate-100">{meet.agenda}</pre>
                  </div>

                  {meet.minutes ? (
                    <div className="p-3 bg-blue-50/20 text-xs border border-blue-100 rounded-lg space-y-1">
                      <p><strong className="text-blue-900">Official Session Minutes Recorded:</strong></p>
                      <p className="text-slate-650 italic leading-relaxed">"{meet.minutes}"</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50/50 text-xs border border-amber-200 rounded-lg flex justify-between items-center">
                      <span className="text-amber-800 font-medium">Session minutes pending documentation.</span>
                      <button
                        id={`write-minutes-btn-${meet.id}`}
                        onClick={() => { setEditingMeetingMinutes(meet); setMinutesText(''); }}
                        className="bg-slate-900 text-white font-bold py-1 px-3.5 rounded text-[10px] uppercase hover:bg-slate-800"
                      >
                        Document Minutes
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right meeting metadata instructions */}
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Governing Standards</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Per university regulation v4.1, all general strategic committees must publish completed agendas minimum 72 hours beforehand. Minutes must be logged within 48 hours post-convocation.
              </p>
            </div>

          </div>

          {/* MINUTES WRITER DIALOG FORM */}
          {editingMeetingMinutes && (
            <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border p-6 w-full max-w-lg space-y-6 shadow-xl">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Write Official Minutes</h4>
                    <p className="text-[11px] text-slate-500">{editingMeetingMinutes.title}</p>
                  </div>
                  <button onClick={() => setEditingMeetingMinutes(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
                </div>

                <form onSubmit={handleSaveMinutes} className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="space-y-1">
                    <label>Recorded Proceedings Narrative</label>
                    <textarea 
                      rows={6} required value={minutesText}
                      onChange={(e) => setMinutesText(e.target.value)}
                      placeholder="e.g. Committee voted unanimously to authorize 2026 sequencing reagents budget. Clara Dupont thesis rehearsal verified for September..."
                      className="w-full border rounded p-2.5 text-xs bg-slate-50 outline-none resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1E40AF] text-white hover:bg-blue-700 py-2.5 font-bold rounded text-xs uppercase"
                  >
                    Archive and publish minutes file
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ADD MEETING MODAL */}
          {showAddMeetingModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border p-6 w-full max-w-md space-y-6 shadow-xl">
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-bold text-slate-900 text-sm font-black">Plan Board Session</h4>
                  <button onClick={() => setShowAddMeetingModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
                </div>

                <form onSubmit={handleAddMeeting} className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="space-y-1">
                    <label>Session Title Name</label>
                    <input 
                      type="text" required value={newMeetingForm.title}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, title: e.target.value })}
                      placeholder="e.g. DSLP research group monthly feedback align"
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label>Target Date</label>
                      <input 
                        type="date" required value={newMeetingForm.date}
                        onChange={(e) => setNewMeetingForm({ ...newMeetingForm, date: e.target.value })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>Opening Time (UTC)</label>
                      <input 
                        type="time" required value={newMeetingForm.time}
                        onChange={(e) => setNewMeetingForm({ ...newMeetingForm, time: e.target.value })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label>Strategic Location / Zoom link</label>
                    <input 
                      type="text" required value={newMeetingForm.location}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, location: e.target.value })}
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Agenda Items (One per row)</label>
                    <textarea 
                      rows={4} required value={newMeetingForm.agenda}
                      onChange={(e) => setNewMeetingForm({ ...newMeetingForm, agenda: e.target.value })}
                      placeholder="1. Review GPU parameters allocation.&#10;2. Grade visitor Sven's motivation thesis target suitability."
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1E40AF] text-white hover:bg-blue-700 py-2.5 font-bold rounded text-xs uppercase"
                  >
                    Archive agenda and convene board
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODULE 4: ANNUAL REPORTS */}
      {activeModule === 'reports' && (
        <div id="annual-analytic-reports" className="space-y-6">
          <div className="flex justify-between items-center text-xs font-semibold">
            <div>
              <h3 className="text-lg font-black text-slate-900">Annual Analytical Reports Portal</h3>
              <p className="text-xs text-slate-500">Official printable research outputs, student counts, and strategic milestones index.</p>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-slate-905 hover:bg-slate-800 text-white font-extrabold py-2 px-4 rounded text-xs uppercase flex items-center"
            >
              <Printer className="w-4 h-4 mr-1.5" /> Print Report File
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-300 p-8 space-y-8 shadow-xs max-w-4xl mx-auto text-xs text-slate-700 font-medium leading-relaxed">
            
            {/* Printable Report Header */}
            <div className="text-center space-y-2 border-b-2 border-slate-950 pb-6">
              <GraduationCap className="w-12 h-12 mx-auto text-[#1E40AF]" />
              <h4 className="text-xl font-bold text-slate-950 tracking-tight">STATE INSTITUTE OF TECHNOLOGY</h4>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black">LIAS - Laboratory of Intelligent and Algorithmic Systems</p>
              <p className="text-[11px] text-slate-400 font-mono">Archived Code Referencing: SIT-LIAS-2026-FNY</p>
            </div>

            {/* Stats Ratios summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded border text-center space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">In-house Faculty Scholars</span>
                <strong className="text-3xl font-mono font-black text-slate-950 block">{members.length}</strong>
                <p className="text-[10px] text-slate-500 font-semibold">{members.filter(m => m.academicTitle === 'Professor').length} Professor advisors</p>
              </div>

              <div className="p-4 bg-slate-50 rounded border text-center space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Scholarly Works Volume</span>
                <strong className="text-3xl font-mono font-black text-slate-950 block">{publications.length}</strong>
                <p className="text-[10px] text-slate-500 font-semibold">{journalCount} peer journals | {confCount} symposia works</p>
              </div>

              <div className="p-4 bg-slate-50 rounded border text-center space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Planned Events Slated</span>
                <strong className="text-3xl font-mono font-black text-slate-950 block">{events.length}</strong>
                <p className="text-[10px] text-slate-500 font-semibold">{events.filter(e => e.type === 'PhD Defense').length} phd defenses</p>
              </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-4">
              <h5 className="font-bold text-slate-950 text-sm border-b pb-2">1. Executive Overview</h5>
              <p className="text-slate-600 leading-relaxed font-semibold">
                Our State Computing cluster node average calculations compute load reached a peak index velocity of 89.4% during neural-net swarm training. Publications indexed to core databases increased on absolute terms by 22.4% over previous reporting limits. Primary funding parameters sourced from the State Initiative grant currently support three full-time PhD candidates.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <h5 className="font-bold text-slate-950 text-sm border-b pb-2">2. Registered Active Faculty</h5>
              <div className="space-y-2">
                {members.slice(0, 4).map(m => (
                  <div key={m.id} className="flex justify-between border-b border-dashed pb-2 text-[11px]">
                    <div>
                      <strong className="text-slate-900 font-bold">{m.firstName} {m.lastName}</strong>
                      <span className="text-slate-500"> ({m.academicTitle})</span>
                    </div>
                    <span className="font-mono text-slate-500">{m.email}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h5 className="font-bold text-slate-950 text-sm border-b pb-2">3. Strategic Outlook & Directives</h5>
              <p className="text-slate-600 leading-relaxed font-semibold">
                We intend to expand dry sequencing calibrations with our regional partnerships (Bio-Computing Solutions INC) to map larger sequence alignment heuristics. Additional high-density drones are slated for autumn purchase.
              </p>
            </div>

            {/* Signatures */}
            <div className="pt-12 flex justify-between text-slate-500 italic max-w-md mx-auto text-center">
              <div>
                <p className="border-t border-slate-400 pt-1">Prof. Helen Vance</p>
                <p className="text-[10px] not-italic text-slate-400 font-semibold uppercase font-mono">Laboratory Director</p>
              </div>
              <div>
                <p className="border-t border-slate-400 pt-1">Dr. Arthur Pendelton</p>
                <p className="text-[10px] not-italic text-slate-400 font-semibold uppercase font-mono">Senior Scientist Coordinator</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
