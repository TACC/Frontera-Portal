import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Message, * as MSG from './Message';

const TEST_CONTENT = '…';
const TEST_TYPE = 'info';
const TEST_SCOPE = 'inline';

function testClassnamesByType(type, getByRole, getByTestId) {
  const root = getByRole('status');
  const icon = getByRole('img'); // WARNING: Relies on `Icon`
  const text = getByTestId('text');
  const iconName = MSG.TYPE_MAP[type].iconName;
  const modifierClassName = MSG.TYPE_MAP[type].className;
  expect(root.className).toMatch('container');
  expect(root.className).toMatch(new RegExp(modifierClassName));
  expect(icon.className).toMatch(iconName);
  expect(text.className).toMatch('text');
}

describe('Message', () => {
  it.each(MSG.TYPES)('has correct text for type %s', type => {
    const { getByTestId } = render(
      <Message
        type={type}
        scope={TEST_SCOPE}
      >
        {TEST_CONTENT}
      </Message>
    );
    expect(getByTestId('text').textContent).toEqual(TEST_CONTENT);
  });

  describe('elements', () => {
    it.each(MSG.TYPES)('include icon when type is %s', type => {
      const { getByRole } = render(
        <Message
          type={type}
          scope={TEST_SCOPE}
        >
          {TEST_CONTENT}
        </Message>
      );
      expect(getByRole('img')).toBeDefined(); // WARNING: Relies on `Icon`
    });
    it.each(MSG.TYPES)('include text when type is %s', type => {
      const { getByTestId } = render(
        <Message
          type={type}
          scope={TEST_SCOPE}
        >
          {TEST_CONTENT}
        </Message>
      );
      expect(getByTestId('text')).toBeDefined();
    });
    test('include button when message is dismissible', () => {
      const { getByRole } = render(
        <Message
          type={TEST_TYPE}
          scope="section"
          canDismiss
        >
          {TEST_CONTENT}
        </Message>
      );
      expect(getByRole('button')).not.toEqual(null);
    });
    test('invisible when isVisible is false', () => {
      const { queryByRole } = render(
        <Message
          type={TEST_TYPE}
          scope="section"
          isVisible={false}
        >
          {TEST_CONTENT}
        </Message>
      );
      expect(queryByRole('button')).not.toBeInTheDocument();
    });
    it.todo('appears when isVisible changes from true to false');
    // FAQ: This feature works, but I could not unit test it — Wesley B
    // it('appears when isVisible changes from true to false', async () => {
    //   let isVisible = false;
    //   const { findByRole, queryByRole } = render(
    //     <Message
    //       type={TEST_TYPE}
    //       scope="section"
    //       isVisible={isVisible}
    //     >
    //       {TEST_CONTENT}
    //     </Message>
    //   );
    //   expect(queryByRole('button')).toBeNull();
    //   const button = await findByRole('button');
    //   isVisible = true;
    //   expect(button).toBeDefined();
    // });
    it.todo('dissapear when dismissed');
    // FAQ: This feature works, but I could not unit test it — Wesley B
  });

  describe('className', () => {
    it.each(MSG.TYPES)('is accurate when type is %s', type => {
      const { getByRole, getByTestId } = render(
        <Message
          type={type}
          scope={TEST_SCOPE}
        >
          {TEST_CONTENT}
        </Message>
      );

      testClassnamesByType(type, getByRole, getByTestId);
    });
    it.each(MSG.SCOPES)('has accurate className when scope is "%s"', scope => {
      const { getByRole, getByTestId } = render(
        <Message
          type={TEST_TYPE}
          scope={scope}
        >
          {TEST_CONTENT}
        </Message>
      );
      const root = getByRole('status');
      const modifierClassName = MSG.SCOPE_MAP[scope || MSG.DEFAULT_SCOPE];

      testClassnamesByType(TEST_TYPE, getByRole, getByTestId);
      expect(root.className).toMatch(new RegExp(modifierClassName));
    });
  });
});
