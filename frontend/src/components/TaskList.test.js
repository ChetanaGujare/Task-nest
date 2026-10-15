import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

describe('TaskList Component', () => {
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();

    const mockTasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
        { id: 3, title: 'Task 3', completed: false },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all tasks when filter is "all"', () => {
        render(
            <TaskList tasks={mockTasks} filter="all" onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
        expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    test('shows only pending tasks when filter is "pending"', () => {
        render(
            <TaskList tasks={mockTasks} filter="pending" onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
        expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    test('shows only completed tasks when filter is "done"', () => {
        render(
            <TaskList tasks={mockTasks} filter="done" onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
        expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
    });

    test('shows empty message when no tasks match filter', () => {
        render(
            <TaskList tasks={[]} filter="all" onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
});