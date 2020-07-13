import React from 'react';
import { render } from '@testing-library/react';
import Message, { TYPE_ICON_MAP } from './Message';

const CONTENT = '…';
const TYPE = 'info';

function testClassnamesByType(type, getByTestId) {
  const root = getByTestId('message');
  const icon = getByTestId('icon'); // WARNING: Relies on `Icon`
  const text = getByTestId('text');
  const modifierClassnamePattern = new RegExp(`is-${type}`);
  const iconName = TYPE_ICON_MAP[type].name;
  expect(root.className).toMatch('container');
  expect(root.className).toMatch(modifierClassnamePattern);
  expect(icon.className).toMatch(iconName);
  expect(text.className).toMatch('text');
}

describe('Message', () => {
  it('has correct text', () => {
    const { getByTestId } = render(<Message type={TYPE}>{CONTENT}</Message>);
    const text = getByTestId('text');
    expect(text.textContent).toEqual(CONTENT);
  });

  describe('set of expected elements', () => {
    it('includes icon', () => {
      const { getByTestId } = render(<Message type={TYPE}>{CONTENT}</Message>);
      const icon = getByTestId('icon'); // WARNING: Relies on `Icon`
      expect(icon).toBeDefined();
    });
    it('includes text', () => {
      const { getByTestId } = render(<Message type={TYPE}>{CONTENT}</Message>);
      const text = getByTestId('text');
      expect(text).toBeDefined();
    });
  });
  
  describe('classNames', () => {
    describe('are accurate when type is:', () => {
      test('"info"', () => {
        const type = 'info';
        const { getByTestId } = render(<Message type={type}>…</Message>);
        testClassnamesByType(type, getByTestId);
      });
      test('"success"', () => {
        const type = 'success';
        const { getByTestId } = render(<Message type={type}>…</Message>);
        testClassnamesByType(type, getByTestId);
      });
      test('"warn"', () => {
        const type = 'warn';
        const { getByTestId } = render(<Message type={type}>…</Message>);
        testClassnamesByType(type, getByTestId);
      });
      test('"error"', () => {
        const type = 'error';
        const { getByTestId } = render(<Message type={type}>…</Message>);
        testClassnamesByType(type, getByTestId);
      });
    });
  });
});
