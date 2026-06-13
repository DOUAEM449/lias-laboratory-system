import React, { useState } from 'react';
import { 
  Users, Layers, FileText, Settings, Upload, CheckCircle, 
  X, AlertTriangle, Play, HelpCircle, ArrowRight, UserCheck, 
  Trash, Search, Calendar, Folder, ShieldCheck, ChevronRight
} from 'lucide-react';
import { MembershipRequest, Partner, Document, Equipment, Member } from '../types';
import { RESEARCH_TEAMS } from '../data';

interface AdministrativeModulesProps {
  currentFaculty: { id: string; email: string; firstName: string; lastName: string; role: 'ADMIN' | 'MEMBER'; title: string };
  requests: MembershipRequest[];
  onUpdateRequests: (newReqs: MembershipRequest[]) => void;
  members: Member[];
  onUpdateMembers: (newMembers: Member[]) => void;
  documents: Document[];
  onUpdateDocuments: (newDocs: Document[]) => void;
  equipmentList: Equipment[];
  onUpdateEquipment: (newEquip: Equipment[]) => void;
  onNavigate: (page: string) => void;
}

export default function AdministrativeModules({
  currentFaculty,
  requests,
  onUpdateRequests,
  members,
  onUpdateMembers,
  documents,
  onUpdateDocuments,
  equipmentList,
  onUpdateEquipment,
  onNavigate
}: AdministrativeModulesProps) {
  const [activeModule, setActiveModule] = useState<'requests' | 'teams' | 'documents' | 'equipment'>('requests');

  // Requests Module State
  const [reqFilter, setReqFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Documents Module State
  const [docSearch, setDocSearch] = useState('');
  const [docCat, setDocCat] = useState<'All' | 'Research' | 'Administrative' | 'Minutes' | 'Template'>('All');
  const [showDocModal, setShowDocModal] = useState<Document | null>(null);
  
  // Document Upload Sim
  const [uploadForm, setUploadForm] = useState({ name: '', category: 'Research' as any, size: '1.2 MB' });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Equipment Module State
  const [equipCategory, setEquipCategory] = useState<'All' | 'Computing' | 'Measurement' | 'Imaging' | 'Other'>('All');
  const [equipStatus, setEquipStatus] = useState<'All' | 'Available' | 'Assigned' | 'Maintenance' | 'Retired'>('All');
  const [showReserveModal, setShowReserveModal] = useState<Equipment | null>(null);
  const [reserveForm, setReserveForm] = useState({ memberName: `${currentFaculty.firstName} ${currentFaculty.lastName}`, returnDate: '2026-12-31' });
  const [reserveSuccess, setReserveSuccess] = useState(false);

  // Approve request & append as active member helper
  const handleApproveRequest = (reqId: string) => {
    const target = requests.find(r => r.id === reqId);
    if (!target) return;

    // 1. Update request status to Approved
    const updatedReqs = requests.map(r => r.id === reqId ? { ...r, status: 'Approved' as const } : r);
    onUpdateRequests(updatedReqs);

    // 2. Insert into members array
    const brandNewMember: Member = {
      id: 'm_gen_' + Date.now(),
      firstName: target.firstName,
      lastName: target.lastName,
      email: target.email,
      phone: '+1 (555) 000-0000',
      role: 'MEMBER',
      academicTitle: target.academicTitle,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // Default placeholder avatar
      institution: 'State Institute of Technology',
      biography: target.motivation,
      researchInterests: ['Distributed Systems', 'Quantum Consensuses'],
      publicationsIds: [],
      mandates: ['Newly Approved Scholar (2026)'],
      isActive: true,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    onUpdateMembers([...members, brandNewMember]);
  };

  const handleRejectRequest = (reqId: string) => {
    const updatedReqs = requests.map(r => r.id === reqId ? { ...r, status: 'Rejected' as const } : r);
    onUpdateRequests(updatedReqs);
  };

  // Upload simulater
  const handleUploadDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name) return;

    const newDoc: Document = {
      id: 'd_gen_' + Date.now(),
      name: uploadForm.name.endsWith('.pdf') || uploadForm.name.endsWith('.zip') || uploadForm.name.endsWith('.docx') ? uploadForm.name : uploadForm.name + '.pdf',
      category: uploadForm.category,
      version: '1.0',
      uploadedBy: `${currentFaculty.firstName} ${currentFaculty.lastName}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: uploadForm.size,
      history: [
        { version: '1.0', date: new Date().toISOString().split('T')[0], by: `${currentFaculty.firstName} ${currentFaculty.lastName}`, changes: 'Initial system deposition.' }
      ]
    };

    onUpdateDocuments([newDoc, ...documents]);
    setUploadSuccess(true);
    setUploadForm({ name: '', category: 'Research', size: '1.2 MB' });
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  // Equipment Reservation
  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReserveModal) return;

    const updated = equipmentList.map(eq => {
      if (eq.id === showReserveModal.id) {
        return {
          ...eq,
          status: 'Assigned' as const,
          assignedTo: reserveForm.memberName,
          assignedDate: new Date().toISOString().split('T')[0],
          returnDate: reserveForm.returnDate
        };
      }
      return eq;
    });

    onUpdateEquipment(updated);
    setReserveSuccess(true);
    setTimeout(() => {
      setReserveSuccess(false);
      setShowReserveModal(null);
    }, 2000);
  };

  const handleReturnEquipment = (eqId: string) => {
    const updated = equipmentList.map(eq => {
      if (eq.id === eqId) {
        return {
          ...eq,
          status: 'Available' as const,
          assignedTo: undefined,
          assignedDate: undefined,
          returnDate: undefined
        };
      }
      return eq;
    });
    onUpdateEquipment(updated);
  };

  const filteredRequests = requests.filter(r => {
    if (reqFilter === 'All') return true;
    return r.status === reqFilter;
  });

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(docSearch.toLowerCase()) || d.uploadedBy.toLowerCase().includes(docSearch.toLowerCase());
    const matchesCat = docCat === 'All' ? true : d.category === docCat;
    return matchesSearch && matchesCat;
  });

  const filteredEquip = equipmentList.filter(eq => {
    const matchesCategory = equipCategory === 'All' ? true : eq.category === equipCategory;
    const matchesStatus = equipStatus === 'All' ? true : eq.status === equipStatus;
    return matchesCategory && matchesStatus;
  });

  const ongoingProjectsList = RESEARCH_TEAMS.flatMap(t => t.projects);

  return (
    <div id="admin-operational-panel" className="space-y-8 animate-fade-in">
      
      {/* Sub tabs controllers */}
      <div id="operational-sub-tabs" className="flex flex-wrap gap-2.5 bg-slate-100 p-1.5 rounded-lg border text-xs font-semibold text-slate-600 w-fit">
        {[
          { id: 'requests', label: 'Review Applications' },
          { id: 'teams', label: 'Teams Metrics' },
          { id: 'documents', label: 'Document Registry' },
          { id: 'equipment', label: 'Hardware Assets' }
        ].map(mod => (
          <button
            key={mod.id}
            id={`sub-tab-admin-${mod.id}`}
            onClick={() => setActiveModule(mod.id as any)}
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

      {/* MODULE 1: MEMBERSHIP REQUEST PANEL */}
      {activeModule === 'requests' && (
        <div id="membership-requests-dashboard" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Entrance Registers & Placements</h3>
              <p className="text-xs text-slate-500">Visitor applicants can submit CV files and motivation lines to seek active status credentials.</p>
            </div>

            <div className="flex space-x-1 border rounded bg-white p-0.5 text-xs">
              {['All', 'Pending', 'Approved', 'Rejected'].map(state => (
                <button
                  key={state}
                  onClick={() => setReqFilter(state as any)}
                  className={`px-3 py-1 rounded transition ${
                    reqFilter === state ? 'bg-slate-900 text-white font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map(req => (
              <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 hover:border-slate-300 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{req.firstName} {req.lastName}</h4>
                    <span className="text-[10px] text-blue-700 bg-blue-50 font-bold px-2 py-0.5 rounded mt-1 inline-block">
                      {req.academicTitle}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded font-mono uppercase ${
                    req.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    req.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-2">
                  <p className="font-medium">Applicant Contact: <strong className="text-slate-800 font-mono">{req.email}</strong></p>
                  <p className="bg-slate-50 p-3 rounded italic leading-relaxed border border-slate-100">"{req.motivation}"</p>
                  <p className="text-slate-500 flex items-center font-mono text-[10px]"><FileText className="w-4 h-4 mr-1 text-slate-400" /> Lodged CV: {req.cvFileName}</p>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex space-x-2 pt-2 border-t border-slate-100 text-xs">
                    <button
                      id={`approve-btn-${req.id}`}
                      disabled={currentFaculty.role !== 'ADMIN'}
                      onClick={() => handleApproveRequest(req.id)}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition flex items-center justify-center disabled:opacity-50"
                    >
                      Approve Profile
                    </button>
                    <button
                      id={`reject-btn-${req.id}`}
                      disabled={currentFaculty.role !== 'ADMIN'}
                      onClick={() => handleRejectRequest(req.id)}
                      className="flex-1 bg-slate-105 hover:bg-red-50 hover:text-red-700 text-slate-700 border rounded py-2 transition disabled:opacity-50 font-bold"
                    >
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="col-span-full bg-white text-center py-12 text-slate-400 font-medium text-xs border rounded-xl">
                No entrance applications match current filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 2: TEAMS MANAGEMENT */}
      {activeModule === 'teams' && (
        <div id="teams-mgmt-dashboard" className="space-y-8 animate-fade-in">
          <div>
            <h3 className="text-lg font-black text-slate-900">Coordinated Research Teams & Capital Projects</h3>
            <p className="text-xs text-slate-500">Tracking primary group managers, active projects directories, and capital allocations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESEARCH_TEAMS.map(team => {
              const teamMembers = members.filter(m => m.teamId === team.id);

              return (
                <div key={team.id} className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
                  <div className="p-6 space-y-4">
                    <span className="text-[10px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-bold font-mono">ID: {team.id.toUpperCase()}</span>
                    <h4 className="font-extrabold text-slate-950 text-base leading-snug">{team.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">Head Director: <strong className="text-[#1E40AF]">{team.leader}</strong></p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{team.description}</p>
                  </div>

                  <div className="bg-slate-50 p-6 border-t border-slate-150 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active Members In Directory</span>
                      <span className="bg-blue-100 text-[#1E40AF] px-2 py-0.5 rounded font-bold">{teamMembers.length}</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {teamMembers.map(tm => (
                        <div key={tm.id} className="flex justify-between items-center text-[11px] text-slate-700">
                          <span className="hover:underline cursor-pointer" onClick={() => onNavigate('members')}>{tm.firstName} {tm.lastName}</span>
                          <span className="text-[10px] text-slate-450">{tm.academicTitle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Capital Projects Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
            <h4 className="font-bold text-slate-900 text-sm border-l-4 border-[#1E40AF] pl-3">Ongoing Academic Research Projects</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-250 text-slate-500 font-bold text-[10px] tracking-wider">
                    <th className="p-3">Project Title</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Capital Budget Allocation</th>
                    <th className="p-3 text-right">Research Directives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {ongoingProjectsList.map((proj, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 font-semibold text-slate-900">{proj.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          proj.status === 'Ongoing' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                        }`}>{proj.status}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono">{proj.budget}</td>
                      <td className="p-3 text-right text-[#1E40AF] cursor-pointer hover:underline" onClick={() => onNavigate('members')}>Review Head</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: DOCUMENT MANAGEMENT */}
      {activeModule === 'documents' && (
        <div id="documents-hub" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Document Registry</h3>
              <p className="text-xs text-slate-500">Repository containing research indices, safety guidelines, board session minutes, and latex templates.</p>
            </div>

            <div className="relative w-full md:w-64 text-xs font-semibold">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search repository files..."
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded bg-white w-full outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left list */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest border-b pb-2">
                <span>File Name / Author</span>
                <span>Actions</span>
              </div>

              <div className="space-y-3">
                {filteredDocs.map(doc => (
                  <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center hover:border-slate-300 transition">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 text-[#1E40AF] p-2.5 rounded">
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{doc.name}</h4>
                        <p className="text-[10px] text-slate-450">Uploaded by: <strong className="text-slate-800">{doc.uploadedBy}</strong> on {doc.uploadedAt} | Volume: {doc.size}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 text-xs font-bold">
                      <button 
                        id={`review-history-btn-${doc.id}`}
                        onClick={() => setShowDocModal(doc)}
                        className="text-[#1E40AF] hover:underline"
                      >
                        History Versions ({doc.history.length})
                      </button>
                      <span className="text-slate-300">|</span>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert('Database retrieval token logged - downloading ' + doc.name); }} className="text-slate-700 hover:underline">Download</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right upload simulator */}
            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center"><Upload className="w-4 h-4 mr-2 text-[#1E40AF]" /> Upload Document</h4>
              
              {uploadSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded">
                  Scholarly file deposited successfully!
                </div>
              )}

              <form onSubmit={handleUploadDocumentSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
                <div className="space-y-1">
                  <label>Document Title</label>
                  <input 
                    type="text" 
                    required 
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    placeholder="e.g. Thesis_Final_Consensus_Clara.pdf"
                    className="w-full border rounded p-2 text-xs bg-slate-50 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label>Category</label>
                  <select 
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as any })}
                    className="w-full border bg-white rounded p-2 text-xs outline-none"
                  >
                    <option value="Research">Research Manuscript</option>
                    <option value="Administrative">Administrative Regulation</option>
                    <option value="Minutes">Meeting Minutes</option>
                    <option value="Template">Latex/Word Template</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label>File Allocation Size</label>
                  <input 
                    type="text" 
                    required 
                    value={uploadForm.size}
                    onChange={(e) => setUploadForm({ ...uploadForm, size: e.target.value })}
                    className="w-full border rounded p-2 text-xs bg-slate-50 outline-none font-mono"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#1E40AF] text-white hover:bg-blue-700 py-2.5 font-bold rounded text-xs uppercase"
                >
                  Deposit file
                </button>
              </form>
            </div>

          </div>

          {/* VIEW VERSION HISTORY DIALOG MODAL */}
          {showDocModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border p-6 w-full max-w-lg space-y-6 shadow-xl">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Version Control Archives</h4>
                    <p className="text-[11px] text-slate-500">{showDocModal.name}</p>
                  </div>
                  <button onClick={() => setShowDocModal(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
                </div>

                <div className="space-y-4">
                  {showDocModal.history.map((hist, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs relative space-y-1">
                      <span className="absolute top-3 right-3 text-[10px] font-mono bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full font-bold">
                        v{hist.version}
                      </span>
                      <strong className="text-slate-900 block font-bold text-xs">Remark: {hist.changes}</strong>
                      <p className="text-[10px] text-slate-450 mt-1">Edited by: <strong className="text-slate-700">{hist.by}</strong> on {hist.date}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowDocModal(null)}
                  className="w-full bg-slate-900 text-white font-bold py-2 rounded text-xs uppercase"
                >
                  Close Version Registry
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODULE 4: EQUIPMENT INVENTORY */}
      {activeModule === 'equipment' && (
        <div id="equipment-inventory" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">High-End Scientific Equipment</h3>
              <p className="text-xs text-slate-500">Inventory of computing nodes, sequencers, RF Calibration scanners, and flight hexagonal swarms.</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <select 
                value={equipCategory}
                onChange={(e) => setEquipCategory(e.target.value as any)}
                className="border bg-white rounded p-1"
              >
                <option value="All">All Categories</option>
                <option value="Computing">Computing Nodes</option>
                <option value="Measurement">Measurement Hardware</option>
                <option value="Imaging">Sequencing/Imaging</option>
                <option value="Other">Other Assets</option>
              </select>

              <select 
                value={equipStatus}
                onChange={(e) => setEquipStatus(e.target.value as any)}
                className="border bg-white rounded p-1"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquip.map(eq => (
              <div key={eq.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-slate-100 text-slate-700 py-0.5 px-2 rounded font-mono font-medium">{eq.serialNumber}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      eq.status === 'Available' ? 'bg-green-100 text-green-800' :
                      eq.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                      eq.status === 'Maintenance' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {eq.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{eq.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{eq.description}</p>
                  
                  <div className="text-[11px] text-slate-500 font-medium space-y-1">
                    <p>Location: <strong className="text-slate-700">{eq.location}</strong></p>
                    {eq.assignedTo && <p>Assigned to: <strong className="text-slate-800">{eq.assignedTo}</strong></p>}
                    {eq.returnDate && <p>Expect return: <strong className="text-slate-800 font-mono">{eq.returnDate}</strong></p>}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-105 flex justify-end space-x-2 text-xs">
                  {eq.status === 'Available' ? (
                    <button
                      id={`reserve-asset-btn-${eq.id}`}
                      onClick={() => { setShowReserveModal(eq); setReserveSuccess(false); }}
                      className="bg-blue-600 hover:bg-blue-500 font-bold text-white py-1.5 px-4 rounded text-xs uppercase"
                    >
                      Request/Reserve Asset
                    </button>
                  ) : eq.status === 'Assigned' && eq.assignedTo === `${currentFaculty.firstName} ${currentFaculty.lastName}` || currentFaculty.role === 'ADMIN' ? (
                    <button
                      id={`return-asset-btn-${eq.id}`}
                      onClick={() => handleReturnEquipment(eq.id)}
                      className="bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold border rounded py-1.5 px-4"
                    >
                      Release/Return Asset
                    </button>
                  ) : (
                    <span className="text-slate-400 font-medium italic">Asset Occupied</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* REQUEST RESERVE MODAL DIALOG */}
          {showReserveModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border p-6 w-full max-w-md space-y-6 shadow-xl">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Submit Asset Allocation Request</h4>
                    <p className="text-[11px] text-slate-500">{showReserveModal.name}</p>
                  </div>
                  <button onClick={() => setShowReserveModal(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700" /></button>
                </div>

                {reserveSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center text-xs">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                    <span>Resource reserved! State updated to 'Assigned'.</span>
                  </div>
                ) : (
                  <form onSubmit={handleReserveSubmit} className="space-y-4 text-xs font-semibold text-slate-600">
                    <div className="space-y-1">
                      <label>Requesting Scholar (Designee Name)</label>
                      <input 
                        type="text" 
                        required 
                        value={reserveForm.memberName}
                        onChange={(e) => setReserveForm({ ...reserveForm, memberName: e.target.value })}
                        className="w-full border rounded p-2 text-xs bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label>Target Return Date</label>
                      <input 
                        type="date" 
                        required 
                        value={reserveForm.returnDate}
                        onChange={(e) => setReserveForm({ ...reserveForm, returnDate: e.target.value })}
                        className="w-full border rounded p-2 text-xs bg-slate-50 font-mono"
                      />
                    </div>

                    <div className="p-3 bg-blue-50/50 text-blue-900 text-xs rounded border border-blue-100">
                      I guarantee to assume complete hazard safety precautions per cleanroom guidelines.
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-[#1E40AF] text-white hover:bg-blue-700 py-2.5 font-bold rounded text-xs uppercase"
                    >
                      Authorize instant allocation reservation
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
