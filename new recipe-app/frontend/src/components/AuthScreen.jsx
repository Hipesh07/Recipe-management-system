import React, { useState } from 'react';
import { login, signup } from '../auth.js';

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await signup({ email, name, password });
      }
      onAuthenticated();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span className="app-header__mark">🍳</span>
          <h1>The Recipe Box</h1>
          <p>your kitchen, catalogued</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => { setMode('login'); setError(null); }}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => { setMode('signup'); setError(null); }}
          >
            Sign up
          </button>
        </div>

        {error && <div className="banner banner--error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="field">
              <span>Name</span>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Jamie Oliver" required />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <label className="field">
            <span>Password</span>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} required />
          </label>

          <button className="btn btn--primary auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="auth-hint">Try the demo account: <code>demo@example.com</code> / <code>password123</code></p>
        )}
      </div>
    </div>
  );
}
