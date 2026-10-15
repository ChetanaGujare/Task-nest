import '@testing-library/jest-dom';

// Functional fetch mock that always resolves
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, data: [] }),
    })
);