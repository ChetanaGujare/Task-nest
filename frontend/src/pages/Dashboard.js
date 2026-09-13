import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Stats from '../components/Stats';
import { todoAPI } from '../api/api';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await todoAPI.getAll();
            setTasks(data.data.map(t => ({ ...t, completed: t.completed === 1 || t.completed === true })));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (title) => {
        try {
            await todoAPI.create({ title });
            await loadTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggle = async (id, completed) => {
        try {
            await todoAPI.update(id, { completed });
            setTasks(tasks.map(t => (t.id === id ? { ...t, completed } : t)));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await todoAPI.delete(id);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Delete ALL tasks?')) return;
        try {
            await Promise.all(tasks.map(t => todoAPI.delete(t.id)));
            setTasks([]);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleReview = () => {
        const done = tasks.filter(t => t.completed).length;
        if (tasks.length === 0) alert('📝 No tasks yet. Add some!');
        else if (done === tasks.length) alert('🎉 Amazing! All tasks completed!');
        else alert(`📊 You've completed ${done} out of ${tasks.length} tasks!`);
    };

    return (
        <div className="app-container">
            <Stats tasks={tasks} />

            <ul className="nav nav-pills mb-3 gap-2">
                {['all', 'pending', 'done'].map(f => (
                    <li className="nav-item" key={f}>
                        <button
                            className={`nav-link ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-3">
                        <i className="bi bi-list-task text-primary me-2"></i> My Tasks
                    </h5>

                    {error && <div className="alert alert-danger py-2 small">{error}</div>}

                    <TaskForm onAdd={handleAdd} />

                    {loading ? (
                        <div className="text-center py-4 text-muted">
                            <div className="spinner-border spinner-border-sm me-2"></div>
                            Loading tasks…
                        </div>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            filter={filter}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                        />
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
                        <button className="btn btn-outline-danger btn-sm" onClick={handleClearAll}>
                            <i className="bi bi-trash me-1"></i> Clear All
                        </button>
                        <button className="btn btn-dark" onClick={handleReview}>
                            <i className="bi bi-hand-thumbs-up me-1"></i> I've Reviewed
                            <span className="badge bg-light text-dark ms-2">
                                {tasks.filter(t => t.completed).length}/{tasks.length}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-center text-muted small mt-4">
                &copy; 2026 TaskNest. All rights reserved.
            </p>
        </div>
    );
}