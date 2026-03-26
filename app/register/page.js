'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { authAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') === 'LANDLORD' ? 'LANDLORD' : 'TENANT';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: defaultRole });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      const { confirmPassword, ...payload } = form;
      const data = await authAPI.register(payload);
      login(data);
      router.push(form.role === 'LANDLORD' ? '/dashboard' : '/listings');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon"><MdApartment size={28} /></div>
          <h2>Create Account</h2>
          <p>Join Nairobi Vacant Houses today</p>
        </div>

        {/* Role Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { val: 'TENANT', label: '🏠 I am a Tenant', desc: 'Looking for a house' },
            { val: 'LANDLORD', label: '🏢 I am a Landlord', desc: 'I want to list property' },
          ].map(({ val, label, desc }) => (
            <button
              key={val}
              type="button"
              onClick={() => update('role', val)}
              style={{
                padding: '12px 10px', borderRadius: 'var(--radius)', border: `2px solid ${form.role === val ? 'var(--primary)' : 'var(--border)'}`,
                background: form.role === val ? 'var(--primary-light)' : 'var(--white)',
                cursor: 'pointer', textAlign: 'center', transition: 'var(--transition)',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: form.role === val ? 'var(--primary)' : 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input" style={{ paddingLeft: 38 }}
                type="text" placeholder="John Kamau"
                value={form.name} onChange={(e) => update('name', e.target.value)}
                required minLength={2}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input" style={{ paddingLeft: 38 }}
                type="email" placeholder="your@email.com"
                value={form.email} onChange={(e) => update('email', e.target.value)}
                required autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number {form.role === 'LANDLORD' && <span className="required">*</span>}</label>
            <div style={{ position: 'relative' }}>
              <FiPhone style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input" style={{ paddingLeft: 38 }}
                type="tel" placeholder="+254712345678"
                value={form.phone} onChange={(e) => update('phone', e.target.value)}
                required={form.role === 'LANDLORD'}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="form-input" style={{ paddingLeft: 38, paddingRight: 38 }}
                  type={showPw ? 'text' : 'password'} placeholder="Min 6 characters"
                  value={form.password} onChange={(e) => update('password', e.target.value)}
                  required minLength={6}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password <span className="required">*</span></label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="form-input" style={{ paddingLeft: 38 }}
                  type="password" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 4 }}>
            <FiUser /> {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
