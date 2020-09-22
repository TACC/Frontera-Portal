import React from 'react';
import renderComponent from 'utils/testing';
import configureStore from 'redux-mock-store';
import TicketCreateForm from './TicketCreateForm';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore();
const initialMockState = {
  creating: false,
  creatingSuccess: false,
  createdTicketId: null,
  creatingError: false,
  creatingErrorMessage: null
};

const exampleAuthenticatedUser = {
  first_name: 'Max',
  username: 'mmunstermann',
  last_name: 'Munstermann',
  email: 'max@munster.mann',
  oauth: {
    expires_in: 14400,
    scope: 'default'
  },
  isStaff: false
};

function renderTicketsCreateForm(store, authenticatedUser) {}

describe('TicketCreateForm', () => {
  it('renders form for un-authenticated users', () => {
    const store = mockStore({
      ticketCreate: {
        ...initialMockState
      }
    });

    const { getAllByText } = renderComponent(<TicketCreateForm />, store);
    expect(getAllByText(/Explain your steps/)).toBeDefined();
  });

  it('renders form with authenticated user information', () => {
    const store = mockStore({
      ticketCreate: {
        ...initialMockState
      }
    });

    const { getAllByText, getByDisplayValue } = renderComponent(
      <TicketCreateForm authenticatedUser={exampleAuthenticatedUser} />,
      store
    );
    expect(getByDisplayValue(/Max/)).toBeInTheDocument();
    expect(getByDisplayValue(/Munstermann/)).toBeInTheDocument();
    expect(getByDisplayValue(/max@munster.mann/)).toBeInTheDocument();
    expect(getAllByText(/Explain your steps/)).toBeDefined();
  });

  it('renders spinner when creating a ticket', () => {
    const store = mockStore({
      ticketCreate: {
        ...initialMockState,
        creating: true
      }
    });

    const { getByTestId } = renderComponent(
      <TicketCreateForm authenticatedUser={exampleAuthenticatedUser} />,
      store
    );
    expect(getByTestId('creating-spinner'));
  });

  it('renders a ticket create ID upon success', () => {
    const store = mockStore({
      ticketCreate: {
        ...initialMockState,
        creatingSuccess: true,
        createdTicketId: 1234
      }
    });

    const { getByText } = renderComponent(
      <TicketCreateForm authenticatedUser={exampleAuthenticatedUser} />,
      store
    );
    expect(getByText(/1234/)).toBeDefined();
  });

  it('renders a ticket creation error', () => {
    const store = mockStore({
      ticketCreate: {
        ...initialMockState,
        creatingError: true,
        creatingErrorMessage: 'Mock error'
      }
    });

    const { getByText } = renderComponent(
      <TicketCreateForm authenticatedUser={exampleAuthenticatedUser} />,
      store
    );
    expect(getByText(/Mock error/)).toBeDefined();
  });
});
