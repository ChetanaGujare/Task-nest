import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validators } from '../api/api';
import '../App.css';

export default function AuthModal() {
    const { login, register } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        // ✅ Basic client-side sanitization (limit length)
        const value = e.target.value.slice(0, 200);
        setForm({ ...form, [e.target.name]: value });
    };

    const validate = () => {
        const usernameCheck = validators.username(form.username);
        if (usernameCheck !== true) return usernameCheck;

        if (isRegister) {
            const emailCheck = validators.email(form.email);
            if (emailCheck !== true) return emailCheck;
        }

        const passwordCheck = validators.password(form.password);
        if (passwordCheck !== true) return passwordCheck;

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationResult = validate();
        if (validationResult !== true) {
            setError(validationResult);
            return;
        }

        setLoading(true);
        try {
            if (isRegister) {
                await register(form.username, form.email, form.password);
            } else {
                await login(form.username, form.password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-card">
                <h3 className="fw-bold gradient-text text-center mb-4">
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h3>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            name="username"
                            className="form-control"
                            placeholder="Username (3-30 chars)"
                            value={form.username}
                            onChange={handleChange}
                            required
                            maxLength={30}
                            minLength={3}
                            pattern="[a-zA-Z0-9_]+"
                            title="Only letters, numbers, and underscores"
                        />
                    </div>
                    {isRegister && (
                        <div className="mb-3">
                            <input
                                name="email"
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                maxLength={120}
                            />
                        </div>
                    )}
                    <div className="mb-3">
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Password (min 6 chars)"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            maxLength={100}
                        />
                    </div>
                    <button type="submit" className="btn btn-gradient w-100 mb-3" disabled={loading}>
                        {loading ? 'Please wait…' : isRegister ? 'Register' : 'Login'}
                    </button>
                </form>
                <p className="text-center small mb-0">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        className="btn btn-link p-0 fw-semibold text-decoration-none"
                        onClick={() => { setIsRegister(!isRegister); setError(''); }}
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
}