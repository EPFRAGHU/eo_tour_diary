import React, { useState } from 'react';
import { Shield, User, Mail, Lock, Building, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: 'Enforcement Officer (EO/AO)',
    officeRegion: 'RO Mumbai (Bandra)',
    password: '',
  });

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
          <h2 className="text-xl font-bold text-foreground">Register Officer Profile</h2>
          <p className="text-xs text-muted-foreground">Setup your EO/AO or APFC account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                required
                placeholder="Shri Rajesh Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground">Official Email ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="rajesh.sharma@epfindia.gov.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground">Regional Office</label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                required
                placeholder="RO Mumbai (Bandra)"
                value={formData.officeRegion}
                onChange={(e) => setFormData({ ...formData, officeRegion: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Create Officer Account</span>
            <ArrowRight className="w-4 h-4 text-epfo-accent" />
          </button>
        </form>

        <div className="text-center border-t border-border pt-4 text-xs text-muted-foreground">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-epfo-accent hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
