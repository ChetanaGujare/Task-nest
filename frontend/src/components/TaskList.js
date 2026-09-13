import TaskItem from './TaskItem';

export default function TaskList({ tasks, filter, onToggle, onDelete }) {
    const filtered = tasks.filter(t => {
        if (filter === 'pending') return !t.completed;
        if (filter === 'done') return !!t.completed;
        return true;
    });

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