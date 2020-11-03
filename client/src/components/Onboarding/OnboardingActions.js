import React, { useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingSpinner, Message } from '_common';
import { Button } from 'reactstrap';
import { stepPropType } from './OnboardingPropTypes';
import './OnboardingActions.module.scss';

const OnboardingActions = ({ step }) => {
  const dispatch = useDispatch();
  const actionCallback = useCallback((action, username) => {
    dispatch({
      type: 'POST_ONBOARDING_ACTION',
      payload: {
        step: step.step,
        action,
        username
      }
    });
  });
  const isStaff = useSelector(state =>
    state.authenticatedUser.user ? state.authenticatedUser.user.isStaff : false
  );
  const isSending = useSelector(
    state =>
      state.onboarding.action.loading &&
      state.onboarding.action.step === step.step
  );
  const error = useSelector(state => state.onboarding.action.error);
  const actionStep = useSelector(state => state.onboarding.action.step);
  const { params } = useRouteMatch();
  const authUsername = useSelector(state =>
    state.authenticatedUser.user ? state.authenticatedUser.user.username : ''
  );

  const hasSendingError = actionStep === step.step && error;

  // If the route loaded shows we are viewing a different user
  // (such as an admin viewing a user) then pull the username for
  // actions from the route. Otherwise, use the username of whomever is logged in
  const username = params.username || authUsername;

  if (hasSendingError) {
    return (
      <Message type="warn" className="appDetail-error">
        We were unable to perform this action.
      </Message>
    );
  }

  return (
    <span styleName="root">
      {isStaff && step.state === 'staffwait' ? (
        <span>
          <Button
            color="link"
            styleName="action"
            disabled={isSending}
            onClick={() => actionCallback('staff_approve', username)}
          >
            <h6>{step.staffApprove}</h6>
          </Button>
          <Button
            color="link"
            styleName="action"
            disabled={isSending}
            onClick={() => actionCallback('staff_deny', username)}
          >
            <h6>{step.staffDeny}</h6>
          </Button>
        </span>
      ) : null}
      {step.state === 'userwait' ? (
        <Button
          color="link"
          styleName="action"
          disabled={isSending}
          onClick={() => actionCallback('user_confirm', username)}
        >
          <h6>{step.userConfirm}</h6>
        </Button>
      ) : null}
      {isSending ? <LoadingSpinner placement="inline" /> : null}
    </span>
  );
};

OnboardingActions.propTypes = {
  step: stepPropType.isRequired
};

OnboardingActions.defaultProps = {};

export default OnboardingActions;
