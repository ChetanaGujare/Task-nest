import { useState } from 'react';

export default function TaskForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        await onAdd(title.trim());
        setTitle('');
        setLoading(false);
    };

    return (
        <form className="input-group mb-4" onSubmit={handleSubmit}>
            <input
                type="text"
                className="form-control"
                placeholder="Add a new task…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button className="btn btn-gradient px-4" type="submit" disabled={loading}>
                <i className="bi bi-plus-lg me-1"></i> Add
            </button>
        </form>
    );
}