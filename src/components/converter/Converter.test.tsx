import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Converter from './Converter';

test('renders a button', () => {
    render(<Converter />)
    const button = screen.getByText('Convert');
    expect(button).toBeInTheDocument();
});

const mEventSourceInstance = {
    addEventListener: jest.fn(),
};
const mEventSource = jest.fn(() => mEventSourceInstance);

// @ts-expect-error
global.EventSource = mEventSource;

test('handles click', () => {
    render(<Converter />);
    userEvent.click(screen.getByText('Convert'));
    expect(screen.getByText('Converting... 0 %')).toBeInTheDocument();
})