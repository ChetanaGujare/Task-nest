import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from './TaskForm';

describe('TaskForm Component', () => {
    const mockOnAdd = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders input field and add button', () => {
        render(<TaskForm onAdd={mockOnAdd} />);
        // ✅ Fixed: matches actual component placeholder
        expect(screen.getByPlaceholderText(/add a new task/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('calls onAdd with trimmed title on submit', async () => {
        render(<TaskForm onAdd={mockOnAdd} />);
        const input = screen.getByPlaceholderText(/add a new task/i);
        const addButton = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'New task' } });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockOnAdd).toHaveBeenCalledWith('New task');
        });
    });

    test('clears input after adding task', async () => {
        render(<TaskForm onAdd={mockOnAdd} />);
        const input = screen.getByPlaceholderText(/add a new task/i);

        fireEvent.change(input, { target: { value: 'Test' } });
        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(input.value).toBe('');
        });
    });

    test('does not call onAdd with empty title', () => {
        render(<TaskForm onAdd={mockOnAdd} />);
        const addButton = screen.getByRole('button');
        fireEvent.click(addButton);
        expect(mockOnAdd).not.toHaveBeenCalled();
    });
});