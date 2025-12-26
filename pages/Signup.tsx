
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockBackend } from '../services/apiService';
import { User } from '../types';

interface SignupProps {
  onSignupSuccess: (user: User) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = mockBackend.signup({ name, email, password });
      onSignupSuccess(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-indigo-950/20 via-zinc-950 to-zinc-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold italic text-3xl shadow-2xl shadow-indigo-600/30 mx-auto mb-6">L</div>
          <h1 className="text-3xl font-black tracking-tight text-white">Start Creating</h1>
          <p className="text-zinc-500 mt-2">Join Lumina and get 5 free credits</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          <p className="text-[10px] text-zinc-500 leading-relaxed">
            By signing up, you agree to our Terms of Service and Privacy Policy. You'll receive occasional product updates.
          </p>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
