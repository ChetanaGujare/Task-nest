import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem';

describe('TaskItem Component', () => {
    const mockTask = { id: 1, title: 'Test Task', completed: false };
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders task title correctly', () => {
        render(
            <TaskItem task={mockTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    test('shows "In Progress" badge for incomplete task', () => {
        render(
            <TaskItem task={mockTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    test('shows "Done" badge for completed task', () => {
        const completedTask = { ...mockTask, completed: true };
        render(
            <TaskItem task={completedTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        expect(screen.getByText('Done')).toBeInTheDocument();
    });

    test('checkbox is checked for completed task', () => {
        const completedTask = { ...mockTask, completed: true };
        render(
            <TaskItem task={completedTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    test('calls onToggle when checkbox is clicked', () => {
        render(
            <TaskItem task={mockTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockOnToggle).toHaveBeenCalledWith(1, true);
    });

    test('calls onDelete when delete button is clicked and confirmed', () => {
        global.confirm = jest.fn(() => true);
        render(
            <TaskItem task={mockTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />
        );
        const deleteBtn = screen.getByTitle('Delete task');
        fireEvent.click(deleteBtn);
        expect(mockOnDelete).toHaveBeenCalledWith(1);
    });
});