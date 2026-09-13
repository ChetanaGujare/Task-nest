import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg bg-white shadow-sm mb-4">
            <div className="container">
                <a className="navbar-brand fw-bold gradient-text" href="/">
                    <i className="bi bi-list-check me-1"></i> TaskNest
                </a>
                {user && (
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted small">
                            Hi, <strong>{user.username}</strong>
                        </span>
                        <button className="btn btn-sm btn-outline-danger" onClick={logout}>
                            <i className="bi bi-box-arrow-right me-1"></i> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}