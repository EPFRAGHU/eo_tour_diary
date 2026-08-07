import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('auth_token', 'demo-token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-epfo-navy text-white shadow-md mb-1">
            <Shield className="w-6 h-6 text-epfo-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground">EPFO Officer Portal</h2>
          <p className="text-xs text-muted-foreground">Sign in with your official EPFO credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground">Official Email ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="officer@epfindia.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-epfo-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Sign In to Tour Diary</span>
            <ArrowRight className="w-4 h-4 text-epfo-accent" />
          </button>
        </form>

        <div className="text-center border-t border-border pt-4 text-xs text-muted-foreground">
          Don't have an officer account?{' '}
          <Link to="/register" className="font-bold text-epfo-accent hover:underline">
            Register Officer Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
