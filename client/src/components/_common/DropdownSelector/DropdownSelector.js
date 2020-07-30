import React from 'react';
import PropTypes from 'prop-types';
import { Input as BootstrapInput } from 'reactstrap';

import './DropdownSelector.module.css';

export const TYPES = ['', 'single', 'multiple'];
export const DEFAULT_TYPE = 'single';

// RFE: Support `options` object prop and require either `options` or `children` prop:
//      - https://stackoverflow.com/a/49682510/11817077
//      - https://stackoverflow.com/a/52661344/11817077
//      - https://www.npmjs.com/package/react-either-property
//      - "customProp" at https://reactjs.org/docs/typechecking-with-proptypes.html#proptypes

const DropdownSelector = ({ type, ...props }) => {
  const canSelectMany = type === 'multiple';

  return (
    <BootstrapInput
      // FAQ: This is a one-off, so it does not belong in `.eslintrc`
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      type="select"
      styleName="container"
      multiple={canSelectMany}
      data-testid="selector"
      // The ARIA role for a `<select>` is implicit (and depends on `<select>` attributes)
      // SEE: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#Technical_summary
    />
  );
};
DropdownSelector.propTypes = {
  /** Selector type */
  type: PropTypes.oneOf(TYPES)
  /** Options (as children, like Reactstrap) */
  // FAQ: Limiting and documenting this has become a rabbit hole; help welcome — Wes B
  // children: PropTypes.any.isRequired
};
DropdownSelector.defaultProps = {
  type: DEFAULT_TYPE
};

export default DropdownSelector;
