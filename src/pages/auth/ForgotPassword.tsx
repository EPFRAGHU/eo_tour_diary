import React, { useState } from 'react';
import { Shield, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-epfo-navy text-white shadow-md mb-1">
            <Shield className="w-6 h-6 text-epfo-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Reset Password</h2>
          <p className="text-xs text-muted-foreground">
            Enter your registered EPFO email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-foreground">Reset Link Dispatched</h3>
            <p className="text-xs text-muted-foreground">
              A secure password reset link has been sent to <span className="font-semibold">{email}</span>.
            </p>
            <div className="pt-2">
              <Link to="/login" className="text-xs font-bold text-epfo-accent hover:underline">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
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

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all"
            >
              Send Password Reset Link
            </button>
          </form>
        )}

        <div className="text-center border-t border-border pt-4 text-xs text-muted-foreground">
          <Link to="/login" className="inline-flex items-center gap-1 font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
