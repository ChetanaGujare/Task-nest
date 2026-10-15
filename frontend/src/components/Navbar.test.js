import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { AuthProvider } from '../context/AuthContext';

describe('Navbar Component', () => {
    test('renders TaskNest brand', () => {
        render(
            <AuthProvider>
                <Navbar />
            </AuthProvider>
        );
        expect(screen.getByText(/tasknest/i)).toBeInTheDocument();
    });
});