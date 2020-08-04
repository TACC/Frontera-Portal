import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect';
import NotificationToast from './Toast';
import { initialState as notifications } from '../../redux/reducers/notifications.reducers';

const mockStore = configureStore();

const exampleToasts = [
  {
    pk: '1',
    extra: {
      name: 'RStudio-Stampede2-1.1.423u4_2020-08-04T22:55:35-dcvserver',
      status: 'RUNNING',
    },
  },
  {
    pk: '2',
    extra: {
      name: 'RStudio-Stampede2-1.1.423u4_2020-08-04T22:55:35-dcvserver',
      status: 'FINISHED',
    },
  },
];

function renderToastComponent(store) {
  return render(
    <Provider store={store}>
      <NotificationToast />
    </Provider>
  );
}

describe('Notification Toast', () => {
  it('shows no toast on init', () => {
    const { queryByRole } = renderToastComponent(
      mockStore({ notifications: notifications })
    );
    expect(queryByRole('alert')).toBeNull();
  });

  it('shows first toast in array', () => {
    const { queryByRole } = renderToastComponent(
      mockStore({
        notifications: {
          ...notifications,
          list: {
            ...notifications.list,
            toasts: exampleToasts,
          },
        },
      })
    );
    expect(queryByRole('alert')).toBeDefined();
    expect(queryByRole('alert')).toHaveTextContent(/RStudio-S...cvserver is now running/);
    expect(queryByRole('alert')).not.toHaveTextContent(/RStudio-S...cvserver finished successfully/);
  });
});
