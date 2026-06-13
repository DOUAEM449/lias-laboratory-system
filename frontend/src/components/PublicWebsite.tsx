import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Calendar, Users, Briefcase, 
  Mail, Phone, MapPin, Building, ArrowRight, ExternalLink, 
  ChevronRight, MessageSquare, Award, CheckCircle, Search, Clock
} from 'lucide-react';
import { Member, Publication, Event, Partner } from '../types';
import { RESEARCH_TEAMS } from '../data';

interface PublicWebsiteProps {
  members: Member[];
  publications: Publication[];
  events: Event[];
  partners: Partner[];
  onNavigate: (page: string) => void;
  onSelectMember: (memberId: string) => void;
}

export default function PublicWebsite({
  members,
  publications,
  events,
  partners,
  onNavigate,
  onSelectMember
}: PublicWebsiteProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'teams' | 'directory' | 'publications' | 'events' | 'partners' | 'contact'>('home');
  const [directorySearch, setDirectorySearch] = useState('');
  const [pubFilter, setPubFilter] = useState<'All' | 'Journal' | 'Conference'>('All');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  const activeMembersOnly = members.filter(m => m.isActive);

  // Stats
  const totalPublications = publications.length;
  const totalPermanent = members.filter(m => m.academicTitle === 'Professor' || m.academicTitle === 'Permanent Member').length;
  const totalPhD = members.filter(m => m.academicTitle === 'PhD Student').length;
  const totalEvents = events.length;

  const currentYear = new Date().getFullYear();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const filteredMembers = activeMembersOnly.filter(m => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(directorySearch.toLowerCase()) || 
                          m.researchInterests.some(ri => ri.toLowerCase().includes(directorySearch.toLowerCase()));
    return matchesSearch;
  });

  const displayPubs = pubFilter === 'All' 
    ? publications 
    : publications.filter(p => p.category === pubFilter);

  // Render Sub-sections
  return (
    <div id="public-website-root" className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Academy Banner Headers */}
      <header id="public-header" className="bg-[#0F172A] text-white py-3 px-6 shadow-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><Building className="w-3.5 h-3.5 mr-1 text-blue-400" /> State Institute of Technology</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-blue-400" /> contact-lias@sit.edu</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Accredited Academic Cluster</span>
            <button 
              id="header-login-btn"
              onClick={() => onNavigate('login')} 
              className="bg-blue-600 text-white font-medium px-3 py-1 rounded hover:bg-blue-500 transition duration-150"
            >
              Sign In to Lab Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main Public Navigation */}
      <nav id="public-nav" className="bg-white sticky top-0 z-40 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-[#1E40AF] p-2.5 rounded-lg text-white">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-[#0F172A] font-bold text-xl leading-none">LIAS</h1>
              <p className="text-xs text-slate-500 tracking-wider uppercase font-semibold mt-0.5">Advanced Systems Laboratory</p>
            </div>
          </div>

          <div id="nav-tabs" className="hidden lg:flex items-center space-x-1 font-medium text-slate-600">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Laboratory' },
              { id: 'teams', label: 'Research Teams' },
              { id: 'directory', label: 'Members Directory' },
              { id: 'publications', label: 'Publications' },
              { id: 'events', label: 'Events' },
              { id: 'partners', label: 'Partners & Affiliates' },
              { id: 'contact', label: 'Contact' }
            ].map(tab => (
              <button
                key={tab.id}
                id={`tab-nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-md transition text-sm ${
                  activeTab === tab.id 
                    ? 'text-blue-600 bg-slate-100 font-semibold border-b-2 border-blue-600 rounded-b-none' 
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Access Mobile Toggle Indicator */}
          <div className="lg:hidden flex space-x-1">
            <select 
              id="mobile-nav-select"
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded border border-slate-300 font-medium"
            >
              <option value="home">Home</option>
              <option value="about">About Laboratory</option>
              <option value="teams">Research Teams</option>
              <option value="directory">Members Directory</option>
              <option value="publications">Publications</option>
              <option value="events">Events</option>
              <option value="partners">Partners</option>
              <option value="contact">Contact</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Page Content Streamer */}
      <main className="flex-grow">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div id="home-view" className="space-y-16 pb-16">
            {/* Elegant Hero Banner */}
            <section className="bg-gradient-to-br from-[#0F172A] via-[#1E40AF] to-[#0F172A] text-white py-20 px-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/45 via-transparent to-transparent"></div>
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-7 space-y-6">
                  <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-blue-400/20 inline-block">
                    Pioneering Tomorrow's Digital Infrastructures
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    Laboratory of Intelligent and Algorithmic Systems
                  </h2>
                  <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                    SIT Advanced Systems Lab is dedicated to world-class fundamental and applied research in distributed networks, adaptive consensus computing, extreme weather biome metrics, and high-intensity bio-computing formulations.
                  </p>
                  <div className="pt-4 flex flex-wrap gap-4">
                    <button 
                      id="hero-directory-btn"
                      onClick={() => setActiveTab('directory')} 
                      className="bg-white text-slate-900 font-medium px-6 py-3 rounded-lg hover:bg-slate-100 transition shadow-lg flex items-center"
                    >
                      Explore Directory <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    <button 
                      id="hero-conventions-btn"
                      onClick={() => setActiveTab('about')}
                      className="bg-transparent text-white border border-slate-500 font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition"
                    >
                      Research Mandates
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Active Researchers', count: members.filter(m => m.isActive).length, icon: Users, color: 'text-blue-400' },
                    { label: 'Peer Publications', count: publications.length, icon: BookOpen, color: 'text-green-400' },
                    { label: 'Annual Symposia', count: events.length, icon: Calendar, color: 'text-amber-400' },
                    { label: 'Contract Affiliates', count: partners.length, icon: Briefcase, color: 'text-purple-400' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-2xl font-bold font-mono text-white">{stat.count}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-tight font-medium uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Core Laboratory Presentation */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-950 mb-4 border-l-4 border-blue-600 pl-4">Laboratory Mission Statement</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Founded and built on academic rigor, LIAS serves to bridge raw theoretical computer science with heavy industrial physical execution. We supply the software engineering guidelines, computational frameworks, and algorithm design protocols that allow edge swarms, state informatics databases, and biological sequence mapping flow cells to excel under stress.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <h4 className="font-semibold text-slate-900 flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-blue-600" /> Academic Excellence</h4>
                    <p className="text-xs text-slate-500 mt-1">Regular features in journals with top impact factors (IEEE, ACM, Springer).</p>
                  </div>
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <h4 className="font-semibold text-slate-900 flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-blue-600" /> Hardware Co-Design</h4>
                    <p className="text-xs text-slate-500 mt-1">High-end computing arrays configured with state-of-the-art accelerators.</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600"
                  alt="Laboratory Setting" 
                  className="rounded-xl shadow-xl w-full h-80 object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg hidden md:block max-w-sm">
                  <p className="italic text-sm font-medium">"Bridging the boundaries of consensus limits, computational biology heuristics, and reliable swarms."</p>
                  <p className="text-xs text-blue-200 mt-2 font-semibold">- Executive Research Committee</p>
                </div>
              </div>
            </section>

            {/* Research Areas Showcase */}
            <section className="bg-slate-100 py-16 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h3 className="text-3xl font-extrabold text-slate-950">Primary Research Directives</h3>
                  <p className="text-slate-600 mt-2">Integrating algorithmic systems design across three core groups.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {RESEARCH_TEAMS.map(team => (
                    <div key={team.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition">
                      <div className="space-y-4">
                        <span className="text-xs bg-blue-100 text-[#1E40AF] px-2.5 py-1 rounded font-semibold uppercase tracking-wider">{team.name.split(' ')[0]} DIRECTIVE</span>
                        <h4 className="text-lg font-bold text-slate-900 leading-snug">{team.name}</h4>
                        <p className="text-sm text-slate-600">{team.description}</p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                        <span>Group Lead: <strong className="text-slate-800">{team.leader}</strong></span>
                        <button 
                          onClick={() => setActiveTab('teams')} 
                          className="text-[#1E40AF] hover:underline flex items-center font-medium"
                        >
                          View projects <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Latest Publications & Latest Events Previews */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Publication Highlight */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Featured Publications</h3>
                  <button 
                    onClick={() => setActiveTab('publications')}
                    className="text-sm text-[#1E40AF] hover:underline font-medium"
                  >
                    View All {publications.length} works
                  </button>
                </div>
                <div className="space-y-4">
                  {publications.slice(0, 2).map(pub => (
                    <div key={pub.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs hover:shadow-sm transition">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">{pub.category}</span>
                      <h4 className="text-base font-semibold text-slate-900 mt-2 hover:text-[#1E40AF] cursor-pointer">
                        {pub.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Authors: {pub.authors.join(', ')}</p>
                      {pub.journal && <p className="text-xs italic text-slate-400 mt-0.5">{pub.journal} ({pub.year})</p>}
                      {pub.conference && <p className="text-xs italic text-slate-400 mt-0.5">{pub.conference} ({pub.year})</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Highlight */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Upcoming Activities</h3>
                  <button 
                    onClick={() => setActiveTab('events')}
                    className="text-sm text-[#1E40AF] hover:underline font-medium"
                  >
                    Calendar view
                  </button>
                </div>
                <div className="space-y-4">
                  {events.slice(0, 2).map(evt => (
                    <div key={evt.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs hover:shadow-sm transition flex gap-4">
                      <div className="bg-blue-50 text-blue-600 p-3 rounded h-fit text-center font-mono flex flex-col justify-center min-w-[64px]">
                        <span className="text-lg font-bold">{evt.date.split('-')[2]}</span>
                        <span className="text-xs font-semibold uppercase">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold uppercase">{evt.type}</span>
                        <h4 className="text-base font-semibold text-slate-900 leading-tight">{evt.title}</h4>
                        <p className="text-xs text-slate-500 flex items-center mt-1"><MapPin className="w-3 h-3 mr-1 text-slate-400" /> {evt.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Partnership Logotypes Banner */}
            <section className="bg-white border-y border-slate-200 py-10">
              <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Institutional Cooperations & Conventions</p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-80 hover:opacity-100 transition">
                  {partners.map(partner => (
                    <div key={partner.id} className="flex items-center space-x-2 text-slate-500 cursor-pointer" onClick={() => setActiveTab('partners')}>
                      <div className="w-10 h-10 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center font-bold text-slate-400 p-1">
                        <img referrerPolicy="no-referrer" src={partner.logoUrl} alt={partner.name} className="object-contain w-full h-full" />
                      </div>
                      <span className="font-semibold text-sm hover:text-slate-900">{partner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: ABOUT */}
        {activeTab === 'about' && (
          <div id="about-view" className="max-w-4xl mx-auto px-6 py-12 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded">STATE INSTITUTE OF TECHNOLOGY</span>
              <h2 className="text-3xl font-bold text-slate-950">About LIAS Laboratory</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                The Laboratory of Intelligent and Algorithmic Systems (LIAS) is a prominent, world-class hub established within the Faculty of Information Sciences and Engineering. Our objective is to generate formal mathematical verification patterns and translate them into direct low-level application architectures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 relative shadow-xs">
                <h4 className="font-bold text-slate-900 mb-2">Fundamental Science</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We look closely at distributed ledger limits, topological graphs, and quantum consensus. By mapping cryptographic proofs to sharded database environments, we build bounds that guarantee consistency regardless of geographic transit delays.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 relative shadow-xs">
                <h4 className="font-bold text-slate-900 mb-2">Applied Engineering</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our swarms laboratory hosts multi-hexacopter real-time physical obstacles avoidance algorithms. With SIMD vectorized short-read compilations, bio-reagents, and high-frequency analytical network scanners, our team proves theories in active university cleanrooms.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-slate-950">Laboratory Governing Directives</h3>
              <ul className="space-y-3 font-medium text-sm text-slate-700">
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2.5 text-blue-600 mt-0.5" /> High-frequency peer publications in world publications databases.</li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2.5 text-blue-600 mt-0.5" /> Strict academic standards enforcing replication models.</li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2.5 text-blue-600 mt-0.5" /> Supporting PhD thesis research tracks with modern computing devices.</li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2.5 text-blue-600 mt-0.5" /> Integrating real-world industrial biotechnology and military automation conventions.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: TEAMS */}
        {activeTab === 'teams' && (
          <div id="teams-view" className="max-w-6xl mx-auto px-6 py-12 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-950">Active Research Teams</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm">
                Primary mathematical and applied modules managed under rigorous university guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {RESEARCH_TEAMS.map(team => (
                <div key={team.id} className="bg-white rounded-xl border border-slate-250 shadow-xs flex flex-col justify-between overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded w-fit uppercase">
                      {team.id.toUpperCase()} Research Unit
                    </div>
                    <h3 className="text-lg font-bold text-slate-950">{team.name}</h3>
                    <p className="text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
                      Coordinated under: <strong className="text-slate-800">{team.leader}</strong>
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed">{team.description}</p>
                  </div>

                  <div className="bg-slate-50 p-6 border-t border-slate-150 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Approved Projects</h4>
                    <div className="space-y-2">
                      {team.projects.map((proj, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="text-slate-700 font-medium truncate max-w-[200px]">{proj.name}</span>
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            proj.status === 'Ongoing' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>{proj.status} ({proj.budget})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DIRECTORY */}
        {activeTab === 'directory' && (
          <div id="directory-view" className="max-w-6xl mx-auto px-6 py-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-950">Laboratory Members Directory</h2>
                <p className="text-slate-500 text-sm">Active permanent members, researchers, and PhD candidates of the SIT suite.</p>
              </div>

              {/* Advanced Interactive Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search name or research interest..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-300 shadow-xs"
                />
              </div>
            </div>

            {/* List Members with instant interactive callback to Profile details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(member => (
                <div 
                  key={member.id} 
                  className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition duration-150"
                >
                  <div className="flex items-start space-x-4">
                    <img 
                      referrerPolicy="no-referrer"
                      src={member.photoUrl} 
                      alt={member.lastName}
                      className="w-14 h-14 rounded-full border bg-slate-100 object-cover"
                    />
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => onSelectMember(member.id)}>
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm font-semibold w-fit">{member.academicTitle}</p>
                      <p className="text-[11px] text-slate-500">{member.institution}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed">
                    {member.biography}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Research Focus</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.researchInterests.map((interest, i) => (
                        <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    id={`view-profile-btn-${member.id}`}
                    onClick={() => {
                      onSelectMember(member.id);
                      onNavigate('members'); // redirect view action
                    }} 
                    className="text-xs text-blue-600 font-semibold hover:underline mt-4 flex items-center self-end pt-1"
                  >
                    View Faculty Profile <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              ))}

              {filteredMembers.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400 text-sm">
                  No laboratory members match the keyword "{directorySearch}".
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PUBLICATIONS */}
        {activeTab === 'publications' && (
          <div id="publications-view" className="max-w-4xl mx-auto px-6 py-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-950">Scientific Archives & Publications</h2>
                <p className="text-slate-500 text-sm">Peer-reviewed journals, international symposia, preprints, and review indexes.</p>
              </div>

              {/* Simple selector filters */}
              <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-lg border text-xs text-slate-600 font-medium">
                {['All', 'Journal', 'Conference'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPubFilter(cat as any)}
                    className={`px-3 py-1.5 rounded transition ${
                      pubFilter === cat ? 'bg-white text-slate-950 shadow-sm font-semibold' : 'hover:text-slate-900'
                    }`}
                  >
                    {cat}s
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {displayPubs.map(pub => (
                <div key={pub.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {pub.category} - {pub.year}
                    </span>
                    {pub.doi && (
                      <span className="text-[10px] text-blue-600 bg-blue-50 py-0.5 px-2 rounded hover:underline cursor-pointer font-mono">
                        DOI: {pub.doi}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 mt-3 leading-snug">
                    {pub.title}
                  </h3>

                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    Authors: {pub.authors.join(', ')}
                  </p>

                  {pub.journal && (
                    <p className="text-xs italic text-[#1E40AF] mt-0.5">
                      Published in {pub.journal}
                    </p>
                  )}
                  {pub.conference && (
                    <p className="text-xs italic text-[#1E40AF] mt-0.5">
                      Presented at {pub.conference}
                    </p>
                  )}

                  <div className="mt-3 bg-slate-50 p-4 rounded-lg text-xs text-slate-600 leading-relaxed border border-slate-100">
                    <strong className="text-slate-800 block mb-1">Abstract Summary:</strong>
                    {pub.abstract}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EVENTS */}
        {activeTab === 'events' && (
          <div id="events-view" className="max-w-4xl mx-auto px-6 py-12 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-950">Academic Events Calendars</h2>
              <p className="text-slate-500 text-sm">International breakthrough conferences, high-integrity seminars, and public doctoral dissertations.</p>
            </div>

            <div className="space-y-6">
              {events.map(evt => (
                <div key={evt.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-3 bg-[#0F172A] text-white p-6 flex flex-col justify-center items-center text-center">
                    <span className="text-4xl font-extrabold font-mono tracking-tighter text-blue-400">
                      {evt.date.split('-')[2]}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider mt-1">
                      {new Date(evt.date).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] mt-4 bg-white/20 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                      {evt.type}
                    </span>
                  </div>

                  <div className="md:col-span-9 p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{evt.title}</h3>
                      {evt.speaker && <p className="text-xs text-[#1E40AF] font-semibold mt-1">Host/Speaker: {evt.speaker}</p>}
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {evt.location}</span>
                      <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {evt.time} UTC</span>
                      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold font-mono">
                        {evt.registeredParticipants.length} Registered
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PARTNERS */}
        {activeTab === 'partners' && (
          <div id="partners-view" className="max-w-4xl mx-auto px-6 py-12 space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-950">Partnerships & Collaborations</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We work in synchronization with governmental foundations, state computing sectors, and leading bio-tech clinical enterprises.
              </p>
            </div>

            <div className="space-y-8">
              {partners.map(partner => (
                <div key={partner.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 shadow-xs">
                  <div className="w-20 h-20 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 flex items-center justify-center p-2 self-center">
                    <img referrerPolicy="no-referrer" src={partner.logoUrl} alt={partner.name} className="object-contain w-full h-full" />
                  </div>
                  <div className="space-y-3 flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{partner.name}</h3>
                        <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                          Type: {partner.type}
                        </span>
                      </div>
                      <span className="text-xs text-green-600 bg-green-50 font-bold px-3 py-1 rounded">
                        {partner.activeConventionsCount} Active Conventions
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{partner.description}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      Primary Contact Representative: <strong className="text-slate-800">{partner.contactPerson}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: CONTACT */}
        {activeTab === 'contact' && (
          <div id="contact-view" className="max-w-5xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-950">Connect With LIAS</h2>
                  <p className="text-slate-500 text-sm mt-1">Get in touch for collaborative studies, PhD candidacies, or corporate software projects.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-lg border border-blue-100">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Laboratory Location</h4>
                      <p className="text-xs text-slate-600 mt-0.5">SIT Engineering Wing, Level 5, Suite 501-A, University Boulevard, NY 10023</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-lg border border-blue-100">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Direct Email</h4>
                      <p className="text-xs text-slate-600 mt-0.5">contact-lias@sit.edu</p>
                      <p className="text-xs text-slate-600">office-director-vance@sit.edu</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-lg border border-blue-100">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Administrative Liaison</h4>
                      <p className="text-xs text-slate-600 mt-0.5">+1 (555) 019-2811 (General Office)</p>
                      <p className="text-xs text-slate-500">Mon-Fri 09:00 - 17:00 EST</p>
                    </div>
                  </div>
                </div>

                {/* Visitor Application Prompt Callout */}
                <div className="bg-slate-900 text-white p-6 rounded-xl space-y-3">
                  <h4 className="font-bold text-sm">Hoping to work with us?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If you are an associate member, professor, researcher or visitor hoping to join our teams, sign up or submit an online Membership Request via our admin panel.
                  </p>
                  <button 
                    id="contact-membership-btn"
                    onClick={() => {
                      onNavigate('register');
                    }}
                    className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded font-semibold text-white transition flex items-center"
                  >
                    Submit Membership Request <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 text-lg mb-6">Send an Inquiry Message</h3>
                
                {contactSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center space-x-3 text-xs">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <strong className="font-semibold block">Message Transmitted Successfully!</strong>
                      Academic coordinates successfully lodged. Representative will follow up over email.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Name</label>
                        <input 
                          type="text" 
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full border rounded-md p-2.5 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 border-slate-300" 
                          placeholder="e.g. Dr. Jane Doe"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full border rounded-md p-2.5 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 border-slate-300" 
                          placeholder="e.g. jane.doe@mit.edu"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Inquiry Subject</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full border rounded-md p-2.5 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 border-slate-300" 
                        placeholder="e.g. Post-doctoral consensus studies collaboration proposal"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Inquiry Details</label>
                      <textarea 
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full border rounded-md p-2.5 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 border-slate-300 resize-none" 
                        placeholder="Detail proposal objectives, target personnel, and timeline boundaries..."
                      />
                    </div>

                    <button 
                      id="contact-form-submit-btn"
                      type="submit" 
                      className="w-full bg-[#1E40AF] text-white hover:bg-blue-700 font-bold py-2.5 text-xs rounded transition uppercase tracking-wider"
                    >
                      Transmit Academic Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer id="public-footer" className="bg-[#0F172A] text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-lg">LIAS Systems</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              State Institute of Technology Laboratory for algorithmic, highly durable networks, high throughput molecular sequencing data compilers, and robotic swarm configurations.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Research Streams</h4>
            <div className="flex flex-col space-y-1 text-xs">
              <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('teams')}>Distributed Consensus DSLP</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('teams')}>Autonomous Drone Edge AI</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab('teams')}>Computational Bio Algorithms CBGA</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Internal Access Portal</h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-500 leading-tight">Access reports, reserve computing servers, manage peer reviews or upload minutes:</p>
              <button 
                id="footer-signin-btn"
                onClick={() => onNavigate('login')} 
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center"
              >
                Sign In to Faculty Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>

          <div className="space-y-3 col-span-1">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Address</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              SIT Science Building West, Level 5<br />
              110 University Square Blvd<br />
              New York, NY 10023, USA
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {currentYear} State Institute of Technology. All academic replica parameters reserved.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => setActiveTab('about')}>Mandates</span>
            <span className="hover:text-slate-300 cursor-pointer">Syllabus Access</span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => setActiveTab('contact')}>Contact Admin</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
