import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TaskNest application', () => {
    render(<App />);
    const elements = screen.queryAllByText(/login|register|welcome|tasknest/i);
    expect(elements.length).toBeGreaterThan(0);
});