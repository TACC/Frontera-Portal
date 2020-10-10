import React from 'react';
import { render } from '@testing-library/react';
import Section from './Section';

export const PARAMETER_CLASS_MAP = {
  contentShouldScroll: 'should-scroll'
};
export const PARAMETERS = [...Object.keys(PARAMETER_CLASS_MAP)];

describe('Section', () => {
  describe('elements and classes', () => {
    it('renders elements with appropriate roles', () => {
      const { getByRole } = render(<Section header="Header" content={<p>Content</p>} />);
      // WARNING: Only one `main` is allowed per page
      expect(getByRole('main').textContent).toEqual('Content');
      // NOTE: Technically (https://www.w3.org/TR/html-aria/#el-header), the `header` should not have a role, but `aria-query` recognizes it as a banner (https://github.com/A11yance/aria-query/pull/59)
      expect(getByRole('banner').textContent).toEqual('Header');
      expect(getByRole('heading').textContent).toEqual('Header');
    });
  });

  describe('content and classses', () => {
    it('renders all passed content and classes', () => {
      const { container, getByText } = render(
        <Section
          header="Header"
          headerClassName="header-test"
          content={<p>Content</p>}
          contentClassName="content-test"
          // sidebar={<nav>Sidebar</nav>}
          // sidebarClassName="sidebar-test"
          actions={<button type="button">Action</button>}
          message={<span>Message</span>} />
      );
      expect(getByText('Header')).toBeTruthy();
      expect(container.querySelectorAll('.header-test')).toBeTruthy();
      expect(getByText('Content')).toBeTruthy();
      expect(container.querySelectorAll('.content-test')).toBeTruthy();
      // expect(getByText('Sidebar')).toBeTruthy();
      // expect(container.querySelectorAll('.sidebar-test')).toBeTruthy();
      expect(getByText('Action')).toBeTruthy();
      expect(getByText('Message')).toBeTruthy();
    });
  });

  describe('parameter class names', () => {
    it.each(PARAMETERS)('renders accurate class for boolean parameter "%s"', parameter => {
      const parameterObj = {[parameter]: true};
      const { container } = render(
        <Section
          header="Header"
          content="Content"
          {...parameterObj}>
          Thing
        </Section>
      );
      const className = PARAMETER_CLASS_MAP[parameter];

      expect(container.querySelector(`[class*="${className}"]`)).toBeTruthy();
    });
  });
});
