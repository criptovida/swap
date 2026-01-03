import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ChevronLeftIcon, MailIcon, LockClosedIcon, UserIcon, GoogleIcon, AppleIcon } from './icons';

interface AuthPageProps {
  initialTab: 'login' | 'signup';
  onBackToLanding: () => void;
}

const SocialButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button
    disabled
    className="w-full flex items-center justify-center space-x-2 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={() => alert('Social login is not implemented yet.')}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const OrDivider: React.FC = () => (
  <div className="flex items-center my-6">
    <div className="flex-grow border-t border-gray-200"></div>
    <span className="flex-shrink mx-4 text-xs font-medium text-gray-400">OR</span>
    <div className="flex-grow border-t border-gray-200"></div>
  </div>
);

const AuthInput: React.FC<{ id: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; icon: React.ReactNode; required?: boolean; disabled?: boolean; }> = 
({ id, type, value, onChange, placeholder, icon, required = true, disabled = false }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
        </div>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required={required}
            disabled={disabled}
        />
    </div>
);

const AuthPage: React.FC<AuthPageProps> = ({ initialTab, onBackToLanding }) => {
  const [view, setView] = useState<'login' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFormState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setError('');
    setMessage('');
  };
  
  const handleViewChange = (newView: 'login' | 'signup') => {
    resetFormState();
    setView(newView);
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            data: {
                full_name: fullName.trim()
            }
        }
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Success! Please check your email for a confirmation link.');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    }
    // onAuthStateChange in App.tsx will handle redirect on success
    setLoading(false);
  };

  return (
    <div 
      className="w-full max-w-sm bg-white p-6 md:p-8 rounded-2xl shadow-lg relative flex flex-col justify-center"
      style={{ height: '644px' }}
    >
      <button onClick={onBackToLanding} className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Back to landing page">
        <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
      </button>

      {view === 'signup' ? (
        // --- SIGN UP VIEW ---
        <div>
          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Start your secure crypto journey.</p>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
          <form onSubmit={handleSignUp} className="space-y-4">
             <AuthInput 
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                icon={<UserIcon className="w-5 h-5 text-gray-400" />}
                disabled={loading}
             />
             <AuthInput 
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                icon={<MailIcon className="w-5 h-5 text-gray-400" />}
                disabled={loading}
             />
             <AuthInput 
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                disabled={loading}
             />
             <AuthInput 
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                disabled={loading}
             />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-300 transition-colors"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <OrDivider />
          <div className="space-y-3">
            <SocialButton icon={<GoogleIcon className="w-5 h-5" />} label="Continue with Google" />
            <SocialButton icon={<AppleIcon className="w-5 h-5" />} label="Continue with Apple" />
          </div>
           <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <button onClick={() => handleViewChange('login')} className="font-semibold text-blue-600 hover:underline">
              Log In
            </button>
          </p>
        </div>
      ) : (
        // --- LOGIN VIEW ---
        <div>
          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Sign in to access your wallet.</p>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <AuthInput 
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                icon={<MailIcon className="w-5 h-5 text-gray-400" />}
                disabled={loading}
            />
            <AuthInput 
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                disabled={loading}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-300 transition-colors"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
           <OrDivider />
          <div className="space-y-3">
            <SocialButton icon={<GoogleIcon className="w-5 h-5" />} label="Continue with Google" />
            <SocialButton icon={<AppleIcon className="w-5 h-5" />} label="Continue with Apple" />
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <button onClick={() => handleViewChange('signup')} className="font-semibold text-blue-600 hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
