import { useMemo, memo } from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, filter, onToggle, onDelete }) {
    // Memoize filtered list
    const filtered = useMemo(() => {
        if (filter === 'pending') return tasks.filter(t => !t.completed);
        if (filter === 'done') return tasks.filter(t => t.completed);
        return tasks;
    }, [tasks, filter]);

    if (filtered.length === 0) {
        const msg =
            filter === 'done' ? 'No completed tasks yet.' :
            filter === 'pending' ? 'All tasks are completed! 🎉' :
            'No tasks yet — add one above!';
        return (
            <li className="list-group-item text-center text-muted py-5">
                <i className="bi bi-emoji-smile fs-2 d-block mb-2"></i>
                <p className="mb-0">{msg}</p>
            </li>
        );
    }

    return (
        <ul className="list-group list-group-flush mb-3">
            {filtered.map(task => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
        </ul>
    );
}

// Memoize component
export default memo(TaskList);