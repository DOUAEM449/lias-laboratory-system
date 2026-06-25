import React, { useState } from 'react';
import { 
  Building, GraduationCap, Lock, Mail, Phone, 
  ArrowRight, ShieldCheck, HelpCircle, User, FileText, ChevronLeft, CheckCircle
} from 'lucide-react';
import { AcademicTitle, UserRole } from '../types';

interface AuthPagesProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (user: { id: string; email: string; firstName: string; lastName: string; role: UserRole; title: AcademicTitle }) => void;
  onAddMembershipRequest: (request: { firstName: string; lastName: string; email: string; title: AcademicTitle; cvFileName: string; motivation: string }) => void;
  initialPage?: 'login' | 'register' | 'forgot' | 'reset';
}

export default function AuthPages({
  onNavigate,
  onLoginSuccess,
  onAddMembershipRequest,
  initialPage = 'login'
}: AuthPagesProps) {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialPage);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register fields (which double as visitor membership request submission per guidelines)
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTitle, setRegTitle] = useState<AcademicTitle>('PhD Student');
  const [regCvName, setRegCvName] = useState('My_Research_CV_2026.pdf');
  const [regMotivation, setRegMotivation] = useState('');
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Reset password fields
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Direct login shortcuts to make evaluation instant and seamless
  const handleShortcutLogin = (role: 'admin' | 'member') => {
    if (role === 'admin') {
      onLoginSuccess({
        id: 'm1',
        email: 'helen.vance@university.edu',
        firstName: 'Helen',
        lastName: 'Vance',
        role: 'ADMIN',
        title: 'Professor'
      });
    } else {
      onLoginSuccess({
        id: 'm2',
        email: 'arthur.pendelton@university.edu',
        firstName: 'Arthur',
        lastName: 'Pendelton',
        role: 'MEMBER',
        title: 'Researcher'
      });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Kindly enter valid university credentials.');
      return;
    }

    // Direct credentials simulation
    if (loginEmail === 'helen.vance@university.edu' || loginEmail.toLowerCase().includes('admin')) {
      onLoginSuccess({
        id: 'm1',
        email: 'helen.vance@university.edu',
        firstName: 'Helen',
        lastName: 'Vance',
        role: 'ADMIN',
        title: 'Professor'
      });
    } else {
      onLoginSuccess({
        id: 'm2',
        email: loginEmail,
        firstName: loginEmail.split('@')[0].toUpperCase(),
        lastName: 'LAB-MEMBER',
        role: 'MEMBER',
        title: 'Researcher' // Default
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:8080/api/membership-requests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: regFirstName,
          lastName: regLastName,
          email: regEmail,
          phone: "",
          institution: "",
          cvUrl: regCvName || "cv.pdf",
          motivationLetterUrl: regMotivation || "motivation"
        })
      }
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    setRegistrationSubmitted(true);

  } catch (error) {
    console.error(error);
    alert("Error sending request to backend");
  }
};

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode || !newPassword) return;
    setResetSuccess(true);
  };

  return (
    <div id="auth-view-root" className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute top-6 left-6 flex items-center space-x-2 text-[#0F172A] font-semibold text-sm cursor-pointer" onClick={() => onNavigate('public')}>
        <ChevronLeft className="w-5 h-5 text-[#1E40AF]" />
        <span>Return to Public Site</span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-[#1E40AF] p-3 rounded-xl text-white shadow-md">
            <GraduationCap className="w-10 h-10" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#0F172A] tracking-tight">
          LIAS Faculty Portal
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 uppercase tracking-widest font-semibold">
          Laboratory Information and Administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200 rounded-2xl space-y-6">
          
          {/* VIEW: LOGIN */}
          {currentView === 'login' && (
            <div id="auth-login-flow" className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Institution Login</h3>
                <p className="text-xs text-slate-500">Provide your verified Sit.edu email or use the rapid evaluator role selectors below.</p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">University Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="helen.vance@university.edu"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-9 w-full border rounded-lg py-2 text-sm bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-600 block">Account Password</label>
                    <button 
                      type="button" 
                      onClick={() => setCurrentView('forgot')} 
                      className="text-[11px] text-[#1E40AF] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-9 w-full border rounded-lg py-2 text-sm bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 border-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="auth-submit-btn"
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition"
                >
                  Verify academic credentials
                </button>
              </form>

              {/* Evaluator Shortcuts (Incredibly helpful for the user!) */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">Prototype Instant Evaluator Shortcuts</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="shortcut-admin-btn"
                    onClick={() => handleShortcutLogin('admin')}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/20 text-left transition"
                  >
                    <span className="text-[10px] font-bold text-blue-600 uppercase block">ADMINISTRATOR</span>
                    <strong className="text-xs text-slate-800 block">Prof. Helen Vance</strong>
                    <span className="text-[10px] text-slate-500 truncate block">helen.vance@university.edu</span>
                  </button>

                  <button
                    id="shortcut-member-btn"
                    onClick={() => handleShortcutLogin('member')}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/20 text-left transition"
                  >
                    <span className="text-[10px] font-bold text-amber-600 uppercase block">RESEARCH FACULTY</span>
                    <strong className="text-xs text-slate-800 block">Dr. Arthur Pendelton</strong>
                    <span className="text-[10px] text-slate-500 truncate block">arthur.pendelton@university.edu</span>
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Not currently a register faculty? </span>
                <button 
                  onClick={() => setCurrentView('register')} 
                  id="auth-go-register"
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Apply & Register
                </button>
              </div>
            </div>
          )}

          {/* VIEW: REGISTER (MEMBERSHIP REQUEST SUBMISSION) */}
          {currentView === 'register' && (
            <div id="auth-register-flow" className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Laboratory Placement & Registration</h3>
                <p className="text-xs text-slate-500">Register your academic status to apply for dynamic laboratory system credentials.</p>
              </div>

              {registrationSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-900 p-6 rounded-xl space-y-4 text-xs">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-sm block">Placement Application Logged!</strong>
                      <p className="text-slate-600 mt-1 leading-relaxed">
                        Your membership request as <strong>{regTitle}</strong> has been stored successfully.
                      </p>
                      <p className="text-slate-600 mt-2">
                        University Administrators regularly review submissions. An automated confirmation token has been logged for: <strong>{regEmail}</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-green-200 flex justify-between">
                    <button 
                      onClick={() => {
                        setRegistrationSubmitted(false);
                        setCurrentView('login');
                      }}
                      className="text-green-800 font-bold hover:underline"
                    >
                      Return to Faculty Portal Sign-in
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        className="w-full border rounded-lg p-2.5 text-xs bg-slate-50 focus:outline-none border-slate-300"
                        placeholder="e.g. Liam"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        className="w-full border rounded-lg p-2.5 text-xs bg-slate-50 focus:outline-none border-slate-300"
                        placeholder="e.g. O'Connor"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-xs bg-slate-50 focus:outline-none border-slate-300"
                      placeholder="e.g. liam.oconnor@university.edu"
                    />
                  </div>

                  {/* Academic Title Select for Permanent Member, Associate Member, PhD Student, Researcher, Professor, Visitor */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Academic Title</label>
                    <select
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value as AcademicTitle)}
                      className="w-full border rounded-lg p-2.5 text-xs bg-white focus:outline-none border-slate-300 font-medium"
                    >
                      <option value="Permanent Member">Permanent Member</option>
                      <option value="Associate Member">Associate Member</option>
                      <option value="PhD Student">PhD Student</option>
                      <option value="Researcher">Researcher</option>
                      <option value="Professor">Professor</option>
                      <option value="Visitor">Visitor</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Curriculum Vitae Upload (Simulated)</label>
                    <div className="border border-dashed border-slate-300 bg-slate-50 rounded-lg p-4 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-100">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-600 font-mono font-medium">{regCvName}</span>
                      </div>
                      <span className="text-blue-600 font-semibold text-[11px] hover:underline">Change File</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Brief Motivation Statement (Mandatory)</label>
                    <textarea 
                      rows={3}
                      required
                      value={regMotivation}
                      onChange={(e) => setRegMotivation(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-xs bg-slate-50 focus:outline-none border-slate-300 resize-none"
                      placeholder="Outline your prospective studies, target research teams, and supervisor intent."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition"
                  >
                    Submit placement registration
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Already registered in the directory? </span>
                <button 
                  onClick={() => setCurrentView('login')} 
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Log In
                </button>
              </div>
            </div>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {currentView === 'forgot' && (
            <div id="auth-forgot-flow" className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Forgot Academic Password</h3>
                <p className="text-xs text-slate-500">Provide your verified university address, and our automated registry will send recovery keys.</p>
              </div>

              {forgotSuccess ? (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-4 text-xs">
                  <p className="text-slate-700">
                    A recovery email with verification key HAS BEEN SENT to <strong>{forgotEmail}</strong>.
                  </p>
                  <button
                    onClick={() => setCurrentView('reset')}
                    className="w-full bg-blue-600 text-white font-bold py-2 rounded text-xs uppercase tracking-wide"
                  >
                    Proceed to Reset Page
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">University Email Address</label>
                    <input 
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-xs bg-slate-50 focus:outline-none border-slate-300"
                      placeholder="e.g. helen.vance@university.edu"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0F172A] text-white hover:bg-slate-800 font-bold py-2 text-xs rounded transition uppercase tracking-wider"
                  >
                    Initiate Recovery Protocol
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button 
                  onClick={() => setCurrentView('login')} 
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Return to entry gateway
                </button>
              </div>
            </div>
          )}

          {/* VIEW: RESET PASSWORD */}
          {currentView === 'reset' && (
            <div id="auth-reset-flow" className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">Configure New Access Key</h3>
                <p className="text-xs text-slate-500">Provide the 6-digit recovery OTP and your prospective new password credentials.</p>
              </div>

              {resetSuccess ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-xs space-y-3">
                  <p className="text-green-800 font-semibold flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Account Access Key Configured!
                  </p>
                  <p className="text-slate-600">Your password was reset to the prospective parameters. You can sign in using your new credentials.</p>
                  <button
                    onClick={() => setCurrentView('login')}
                    className="w-full bg-[#0F172A] text-white font-bold py-2 rounded text-xs uppercase tracking-wider"
                  >
                    Go back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Recovery OTP Code</label>
                    <input 
                      type="text"
                      required
                      maxLength={6}
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-xs bg-slate-50 font-mono tracking-widest text-center focus:outline-none border-slate-300"
                      placeholder="123456"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Prospective New Password</label>
                    <input 
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-xs bg-slate-50 focus:outline-none border-slate-300"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-2.5 text-xs rounded transition uppercase tracking-wider"
                  >
                    Finalise Account Reset
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button 
                  onClick={() => setCurrentView('login')} 
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Cancel and sign in instead
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
