import React, { useState } from 'react';
import { 
  Users, Search, Filter, Trash, Edit, Check, CheckCircle, 
  X, ShieldAlert, Plus, Mail, Phone, Calendar, Award, 
  MapPin, Edit3, Image, Lock, UserX, UserCheck
} from 'lucide-react';
import { Member, AcademicTitle } from '../types';

interface MembersAndProfileProps {
  currentFaculty: { id: string; email: string; firstName: string; lastName: string; role: 'ADMIN' | 'MEMBER'; title: string };
  members: Member[];
  onUpdateMembers: (newMembers: Member[]) => void;
  selectedMemberIdForPublicView?: string;
  onClearSelectedMemberId?: () => void;
}

export default function MembersAndProfile({
  currentFaculty,
  members,
  onUpdateMembers,
  selectedMemberIdForPublicView,
  onClearSelectedMemberId
}: MembersAndProfileProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'profile-editor'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [titleFilter, setTitleFilter] = useState<'All' | AcademicTitle>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Selected Member for extensive Profile review
  const [reviewedMember, setReviewedMember] = useState<Member | null>(
    selectedMemberIdForPublicView ? (members.find(m => m.id === selectedMemberIdForPublicView) || null) : null
  );

  // Edit Member Modal State (For administrator edit)
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form Fields for Private Profile Editor (For logged user)
  const currentFacultyMember = members.find(m => m.id === currentFaculty.id) || members[0];
  const [bioInput, setBioInput] = useState(currentFacultyMember?.biography || '');
  const [phoneInput, setPhoneInput] = useState(currentFacultyMember?.phone || '');
  const [emailInput, setEmailInput] = useState(currentFacultyMember?.email || '');
  const [interestsInput, setInterestsInput] = useState(currentFacultyMember?.researchInterests.join(', ') || '');
  const [newTagVal, setNewTagVal] = useState('');
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleToggleActiveState = (memberId: string) => {
    const updated = members.map(m => {
      if (m.id === memberId) {
        return { ...m, isActive: !m.isActive };
      }
      return m;
    });
    onUpdateMembers(updated);
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you absolutely sure you want to retire this faculty profile?')) {
      const updated = members.filter(m => m.id !== memberId);
      onUpdateMembers(updated);
      if (reviewedMember?.id === memberId) {
        setReviewedMember(null);
      }
    }
  };

  const handleAdminUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const updated = members.map(m => {
      if (m.id === editingMember.id) {
        return editingMember;
      }
      return m;
    });
    onUpdateMembers(updated);
    if (reviewedMember?.id === editingMember.id) {
      setReviewedMember(editingMember);
    }
    setEditingMember(null);
  };

  const handleUserSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedInterests = interestsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    const updated = members.map(m => {
      if (m.id === currentFaculty.id) {
        return {
          ...m,
          email: emailInput,
          phone: phoneInput,
          biography: bioInput,
          researchInterests: updatedInterests
        };
      }
      return m;
    });
    onUpdateMembers(updated);
    setProfileSuccessMsg('Private Faculty profile archives updated successfully.');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  const handleUserSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Passwords do not match.');
      return;
    }
    setPasswordSuccessMsg('Faculty Account access key updated.');
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordSuccessMsg(''), 4000);
  };

  // Filter Members Logic
  const filtered = members.filter(m => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.researchInterests.some(ri => ri.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTitle = titleFilter === 'All' ? true : m.academicTitle === titleFilter;
    const matchesStatus = statusFilter === 'All' 
      ? true 
      : statusFilter === 'Active' ? m.isActive : !m.isActive;

    return matchesSearch && matchesTitle && matchesStatus;
  });

  // Pages
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedMembers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div id="members-mgmt-viewport" className="space-y-8 animate-fade-in">
      {/* Sub navigation Tabs */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-1">
        <div className="flex space-x-6">
          <button
            id="members-tab-list"
            onClick={() => { setActiveTab('list'); onClearSelectedMemberId?.(); }}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'list' && !reviewedMember
                ? 'border-blue-600 text-[#1E40AF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Members Directory ({members.length})
          </button>
          
          <button
            id="members-tab-editor"
            onClick={() => { setActiveTab('profile-editor'); setReviewedMember(null); }}
            className={`pb-3 text-sm font-bold border-b-2 transition ${
              activeTab === 'profile-editor'
                ? 'border-blue-600 text-[#1E40AF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Faculty Profile Settings
          </button>
        </div>
      </div>

      {/* VIEW 1: MEMBERS DIRECTORY LIST (OR SINGLE FACULTY DETAILED PROFILE VIEW) */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          
          {/* PROFILE DETAILED DRAWER SCREEN */}
          {reviewedMember ? (
            <div id="individual-biography-card" className="bg-white p-8 rounded-2xl border border-slate-250 shadow-xs space-y-8 animate-fade-in">
              <button 
                id="close-profile-btn"
                onClick={() => { setReviewedMember(null); onClearSelectedMemberId?.(); }} 
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center font-bold"
              >
                <X className="w-4 h-4 mr-1.5" /> Back to Members List
              </button>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <img 
                  referrerPolicy="no-referrer"
                  src={reviewedMember.photoUrl} 
                  alt={reviewedMember.lastName} 
                  className="w-28 h-28 rounded-full border-4 border-slate-100 object-cover bg-slate-50 flex-shrink-0"
                />
                <div className="space-y-4 flex-grow">
                  <div className="space-y-1">
                    <span className="text-xs bg-blue-100 text-[#1E40AF] px-2.5 py-0.5 rounded font-bold">{reviewedMember.academicTitle}</span>
                    <h3 className="text-3xl font-black text-slate-900">{reviewedMember.firstName} {reviewedMember.lastName}</h3>
                    <p className="text-sm text-slate-500 font-medium">{reviewedMember.institution}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                    <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-slate-400" /> {reviewedMember.email}</p>
                    <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-slate-400" /> {reviewedMember.phone || 'Unavailable'}</p>
                    {reviewedMember.originLaboratory && (
                      <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-slate-400" /> Origin: {reviewedMember.originLaboratory}</p>
                    )}
                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-400" /> Joined lab directory on {reviewedMember.joinedDate}</p>
                  </div>
                </div>
              </div>

              {/* Bio Details */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Biography & Empirical Directives</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">{reviewedMember.biography || 'No biographical outline published.'}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Research Fields / Interests</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {reviewedMember.researchInterests.map((ri, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-700 py-1 px-3 rounded-full font-medium">
                        {ri}
                      </span>
                    ))}
                  </div>
                </div>

                {reviewedMember.mandates.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-400 text-xs tracking-wider uppercase">Active & Past Mandates</h4>
                    <div className="flex flex-wrap gap-2">
                      {reviewedMember.mandates.map((mand, i) => (
                        <div key={i} className="flex items-center text-xs text-slate-700 bg-amber-50 border border-amber-200 py-1 px-3 rounded">
                          <Award className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                          <span>{mand}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dynamic Directory Searching and Filtering bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search members, publications, interests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-xs border rounded-lg w-full bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 border-slate-300"
                  />
                </div>

                <div className="flex space-x-2 text-xs font-semibold text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span>Academic Status:</span>
                  </div>
                  <select 
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value as any)}
                    className="border bg-white rounded px-2.5 py-1 text-xs"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Professor">Professor</option>
                    <option value="Researcher">Researcher</option>
                    <option value="PhD Student">PhD Student</option>
                    <option value="Visitor">Visitor</option>
                    <option value="Associate Member">Associate Member</option>
                    <option value="Permanent Member">Permanent Member</option>
                  </select>
                </div>

                <div className="flex space-x-2 text-xs font-semibold text-slate-600">
                  <span>Activation:</span>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="border bg-white rounded px-2.5 py-1 text-xs"
                  >
                    <option value="All">All Profiles</option>
                    <option value="Active">Active Only</option>
                    <option value="Inactive">Inactive Only</option>
                  </select>
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-250 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                        <th className="p-4">Faculty Name / Details</th>
                        <th className="p-4">Registered Email</th>
                        <th className="p-4">Academic Status</th>
                        <th className="p-4">Verification</th>
                        <th className="p-4 text-right">Directory Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {paginatedMembers.map(member => (
                        <tr key={member.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 flex items-center space-x-3">
                            <img 
                              referrerPolicy="no-referrer"
                              src={member.photoUrl} 
                              className="w-10 h-10 rounded-full border bg-slate-50 object-cover" 
                              alt="avatar"
                            />
                            <div>
                              <strong className="text-slate-900 block font-bold text-sm hover:text-blue-600 cursor-pointer" onClick={() => setReviewedMember(member)}>
                                {member.firstName} {member.lastName}
                              </strong>
                              <span className="text-[10px] text-slate-500">{member.institution}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 font-mono">{member.email}</td>
                          <td className="p-4">
                            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded text-[10px]">
                              {member.academicTitle}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              id={`toggle-active-btn-${member.id}`}
                              disabled={currentFaculty.role !== 'ADMIN'}
                              onClick={() => handleToggleActiveState(member.id)}
                              className={`flex items-center space-x-1 font-bold text-[10px] px-2 py-1 rounded transition ${
                                member.isActive 
                                  ? 'bg-green-50 text-green-700 hover:bg-green-100/50' 
                                  : 'bg-red-50 text-red-600 hover:bg-red-100/50'
                              }`}
                            >
                              {member.isActive ? (
                                <><UserCheck className="w-3.5 h-3.5" /> <span>Active</span></>
                              ) : (
                                <><UserX className="w-3.5 h-3.5" /> <span>Suspended</span></>
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            <button 
                              id={`review-profile-table-btn-${member.id}`}
                              onClick={() => setReviewedMember(member)} 
                              className="text-blue-600 hover:underline font-bold"
                            >
                              Review Bio
                            </button>
                            {currentFaculty.role === 'ADMIN' && (
                              <>
                                <button 
                                  id={`edit-member-btn-${member.id}`}
                                  onClick={() => setEditingMember(member)} 
                                  className="text-slate-500 hover:text-slate-900"
                                >
                                  <Edit className="w-4 h-4 inline" />
                                </button>
                                <button 
                                  id={`delete-member-btn-${member.id}`}
                                  onClick={() => handleDeleteMember(member.id)} 
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <Trash className="w-4 h-4 inline" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}

                      {paginatedMembers.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-slate-400">
                            No directory matches locate those parameters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination */}
                {totalPages > 1 && (
                  <div className="bg-slate-50 py-3 px-4 flex justify-between items-center border-t border-slate-250 text-xs">
                    <span className="text-slate-500">Showing page <strong>{currentPage}</strong> of {totalPages} ({filtered.length} matching rows)</span>
                    <div className="flex space-x-2">
                      <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="px-2.5 py-1 border rounded bg-white text-slate-700 text-xs hover:bg-slate-50 disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="px-2.5 py-1 border rounded bg-white text-slate-700 text-xs hover:bg-slate-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EDIT MEMBER DIALOG / MODAL SUBSECTION */}
          {editingMember && (
            <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border p-6 w-full max-w-lg space-y-6 shadow-xl animate-scale-up">
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-bold text-slate-900 text-base">Administrative Profile Editor</h4>
                  <button onClick={() => setEditingMember(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
                </div>

                <form onSubmit={handleAdminUpdateMember} className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label>First Name</label>
                      <input 
                        type="text" 
                        required 
                        value={editingMember.firstName} 
                        onChange={(e) => setEditingMember({ ...editingMember, firstName: e.target.value })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>Last Name</label>
                      <input 
                        type="text" 
                        required 
                        value={editingMember.lastName} 
                        onChange={(e) => setEditingMember({ ...editingMember, lastName: e.target.value })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label>Faculty Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={editingMember.email} 
                      onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label>Academic Status</label>
                      <select 
                        value={editingMember.academicTitle} 
                        onChange={(e) => setEditingMember({ ...editingMember, academicTitle: e.target.value as AcademicTitle })}
                        className="w-full border bg-white rounded p-2 text-xs outline-none"
                      >
                        <option value="Professor">Professor</option>
                        <option value="Researcher">Researcher</option>
                        <option value="PhD Student">PhD Student</option>
                        <option value="Visitor">Visitor</option>
                        <option value="Associate Member">Associate Member</option>
                        <option value="Permanent Member">Permanent Member</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label>Contact Phone</label>
                      <input 
                        type="text" 
                        value={editingMember.phone} 
                        onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label>Faculty Institution</label>
                    <input 
                      type="text" 
                      required 
                      value={editingMember.institution} 
                      onChange={(e) => setEditingMember({ ...editingMember, institution: e.target.value })}
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Empirical Biography</label>
                    <textarea 
                      rows={3} 
                      value={editingMember.biography} 
                      onChange={(e) => setEditingMember({ ...editingMember, biography: e.target.value })}
                      className="w-full border rounded p-2 text-xs bg-slate-50 outline-none resize-none"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2 border-t">
                    <button 
                      type="button" 
                      onClick={() => setEditingMember(null)}
                      className="flex-1 py-2 text-slate-700 bg-slate-105 hover:bg-slate-100 border rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-2 text-white bg-blue-600 hover:bg-blue-700 font-bold rounded text-xs"
                    >
                      Save Admin Corrections
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* VIEW 2: LOGGED-IN Private Profile Editor */}
      {activeTab === 'profile-editor' && (
        <div id="private-profile-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Update Personal Academic Profile Details</h3>
            
            {profileSuccessMsg && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center text-xs">
                <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleUserSaveProfile} className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label>Faculty Registered Email</label>
                  <input 
                    type="email" 
                    value={emailInput} 
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full border rounded p-2.5 text-xs bg-slate-50 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label>Contact Phone</label>
                  <input 
                    type="text" 
                    value={phoneInput} 
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full border rounded p-2.5 text-xs bg-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label>Faculty Interests Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  value={interestsInput} 
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder="e.g. Distributed Consensus, Edge AI, Cryptographic proofs"
                  className="w-full border rounded p-2.5 text-xs bg-slate-50 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 font-medium">Define your empirical directives so visitors can search for you.</p>
              </div>

              <div className="space-y-1">
                <label>Empirical Narrative Biography</label>
                <textarea 
                  rows={5} 
                  value={bioInput} 
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full border rounded p-2.5 text-xs bg-slate-50 focus:outline-none resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="bg-[#1E40AF] text-white hover:bg-blue-700 py-2.5 px-6 rounded font-bold text-xs uppercase tracking-wider"
              >
                Commit profile changes
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Password security settings */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center"><Lock className="w-4 h-4 mr-2 text-slate-400" /> Account Password Security</h4>
              
              {passwordSuccessMsg && (
                <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs rounded">
                  {passwordSuccessMsg}
                </div>
              )}

              <form onSubmit={handleUserSavePassword} className="space-y-3 text-xs font-semibold text-slate-600">
                <div className="space-y-1">
                  <label>Current Key</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full border rounded p-2 text-xs bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label>Prospective New Key</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full border rounded p-2 text-xs bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label>Confirm Key</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full border rounded p-2 text-xs bg-slate-50"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 py-2 rounded text-xs uppercase font-bold"
                >
                  Configure new key
                </button>
              </form>
            </div>

            {/* Profile image change preview mockup */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-center">
              <h4 className="font-bold text-slate-900 text-sm text-left">Faculty Photo</h4>
              <div className="flex justify-center">
                <img 
                  referrerPolicy="no-referrer"
                  src={currentFacultyMember?.photoUrl} 
                  className="w-24 h-24 rounded-full border bg-slate-50 object-cover" 
                  alt="Avatar user"
                />
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-slate-500 font-medium">Supported formats: JPEG, PNG. Max file allocation: 2 MB.</p>
                <button className="text-blue-600 hover:underline font-bold flex items-center justify-center mx-auto space-x-1.5 pt-1">
                  <Image className="w-4 h-4" />
                  <span>Configure prospective photo</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
