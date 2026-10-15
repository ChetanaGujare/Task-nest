import { render, screen } from '@testing-library/react';
import Stats from './Stats';

describe('Stats Component', () => {
    test('shows 0 for empty task list', () => {
        render(<Stats tasks={[]} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    test('calculates stats correctly for mixed tasks', () => {
        const tasks = [
            { id: 1, title: 'A', completed: true },
            { id: 2, title: 'B', completed: false },
            { id: 3, title: 'C', completed: true },
            { id: 4, title: 'D', completed: false },
        ];
        render(<Stats tasks={tasks} />);

        // ✅ Fixed: Use getAllByText since "2" appears multiple times
        expect(screen.getByText('4')).toBeInTheDocument();         // Total
        expect(screen.getAllByText('2').length).toBeGreaterThan(0); // Done + Pending
        expect(screen.getByText('50%')).toBeInTheDocument();       // Percentage
    });

    test('shows 100% when all tasks completed', () => {
        const tasks = [
            { id: 1, title: 'A', completed: true },
            { id: 2, title: 'B', completed: true },
        ];
        render(<Stats tasks={tasks} />);
        expect(screen.getByText('100%')).toBeInTheDocument();
    });

    test('shows 0% when no tasks completed', () => {
        const tasks = [
            { id: 1, title: 'A', completed: false },
            { id: 2, title: 'B', completed: false },
        ];
        render(<Stats tasks={tasks} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });
});