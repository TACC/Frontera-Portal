import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';
import './InputCopy.module.scss';

const InputCopy = ({ value, placeholder, className }) => {
  const [copied, setCopied] = useState(false);
  const onChange = e => {
    // Swallow keyboard events on the Input control, but
    // still allow selecting the text. readOnly property of
    // Input is not adequate for this purpose because it
    // prevents text selection
    e.preventDefault();
  };
  const onCopy = () => {
    setCopied(true);
  };
  return (
    <div className={className} styleName="root">
      <div styleName="controls">
        <Input
          type="text"
          placeholder={placeholder || undefined}
          value={value || undefined}
          onChange={onChange}
          readOnly={!value}
        />
        <CopyToClipboard text={value} onCopy={onCopy}>
          <Button disabled={!value}>Copy</Button>
        </CopyToClipboard>
      </div>
      <div styleName="copy-status">{copied ? <>Copied!</> : undefined}</div>
    </div>
  );
};

InputCopy.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

InputCopy.defaultProps = {
  value: null,
  placeholder: null,
  className: null
};

export default InputCopy;
