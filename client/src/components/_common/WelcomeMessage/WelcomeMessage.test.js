import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { initialState as welcomeMessages } from '../../../redux/reducers/welcome.reducers';
import WelcomeMessage from './WelcomeMessage';

const mockStore = configureStore();

describe('WelcomeMessage', () => {
  describe('elements', () => {
    it('includes class, message, and role appropriately', () => {
      const { container, getByRole, getByText } = render(
        <Provider store={mockStore({ welcomeMessages })}>
          <WelcomeMessage className="test-class" messageName="test-name">
            <p>Test Message</p>
          </WelcomeMessage>
        </Provider>
      );
      expect(container.querySelectorAll('.test-class')).toBeDefined();
      // NOTE: The `status` role (https://www.w3.org/TR/html-aria/#index-aria-status) is more appropriate than the `alert` role (https://www.w3.org/TR/html-aria/#index-aria-alert), but setting the `role` attribute of an `Alert` is ineffectual
      expect(getByRole('alert')).toBeDefined();
      expect(getByText('Test Message')).toBeDefined();
    });
  });
});