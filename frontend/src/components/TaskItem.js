import { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
    const [busy, setBusy] = useState(false);

    const handleToggle = async () => {
        setBusy(true);
        await onToggle(task.id, !task.completed);
        setBusy(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this task?')) return;
        setBusy(true);
        await onDelete(task.id);
        setBusy(false);
    };

    return (
        <li className="list-group-item d-flex align-items-center gap-3">
            <input
                type="checkbox"
                className="form-check-input"
                checked={!!task.completed}
                onChange={handleToggle}
                disabled={busy}
                style={{ width: 20, height: 20, cursor: 'pointer' }}
            />
            <div className="flex-grow-1">
                <span className={`fw-semibold ${task.completed ? 'task-done' : ''}`}>
                    {task.title}
                </span>
                {task.completed ? (
                    <span className="badge bg-success ms-2">Done</span>
                ) : (
                    <span className="badge bg-warning text-dark ms-2">In Progress</span>
                )}
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete} disabled={busy}>
                <i className="bi bi-x-lg"></i>
            </button>
        </li>
    );
}