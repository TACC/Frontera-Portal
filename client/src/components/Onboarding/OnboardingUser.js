import React, { useEffect, useCallback, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LoadingSpinner } from '_common';
import { Button } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import { Pill } from '_common';
import './OnboardingUser.scss';

function OnboardingEvent({ event }) {
  return <div>{`${event.time} - ${event.message}`}</div>;
}

OnboardingEvent.propTypes = {
  event: PropTypes.shape({
    time: PropTypes.string,
    message: PropTypes.string
  }).isRequired
};

OnboardingEvent.defaultProps = {};

function OnboardingStatus({ step }) {
  const [ isSending, setIsSending ] = useState(false);
  const actionCallback = useCallback(
    (action) => {
      console.log(action);
      setIsSending(true);
    },
    [isSending, setIsSending]
  );
  const isStaff = useSelector(
    state => state.authenticatedUser.user ? state.authenticatedUser.user.isStaff : false
  );
  let type = '';
  switch (step.state) {
    case 'processing':
    case 'pending': 
      type = 'normal';
      break;
    case 'failed':
      type = 'danger';
      break;
    case 'staffwait':
    case 'userwait':
      type = 'alert';
      break;
    case 'completed':
      type = 'success';
      break;
    default:
      type ='normal';
  }
  if ('customStatus' in step) {
    return <Pill type={type}>{step.customStatus}</Pill>;
  }
  switch (step.state) {
    case 'pending':
      return <Pill type={type}>Preparing</Pill>;
    case 'staffwait':
      return (
        isStaff
          ? <span className='onboarding-status__actions'>
              <Button 
                color="link" 
                disabled={isSending}
                onClick={() => actionCallback("staff_approve")}>
                <h6>{step.staffApprove}</h6>
              </Button>
              <Button
                color="link"
                disabled={isSending}
                onClick={() => actionCallback("staff_deny")}>
                <h6>{step.staffDeny}</h6>
              </Button>
              {isSending
                ? <LoadingSpinner placement='inline' />
                : null}
          </span>
          : <Pill type='normal'>Waiting for Staff Approval</Pill>
      );
    case 'userwait':
      return <span className='onboarding-status__actions'>
          <Button
            color="link"
            disabled={isSending}
            onClick={() => actionCallback("user_confirm")}>
            <h6>{step.clientAction}</h6>
          </Button>
          {isSending
            ? <LoadingSpinner placement='inline' />
            : null}
        </span>
    case 'failed':
      return <Pill type={type}>Unsuccessful</Pill>;
    case 'completed':
      return <Pill type={type}>Completed</Pill>;
    case 'processing':
      return (
        <span className='onboarding_status__actions'>
          <Pill type={type}>Processing</Pill>
          <LoadingSpinner placement='inline' />
        </span>
      );
    default:
      return <span>{step.state}</span>
  }
}

OnboardingStatus.propTypes = {
  step: PropTypes.shape({
    state: PropTypes.string,
    customStatus: PropTypes.string
  }).isRequired
};

OnboardingStatus.defaultProps = {};

function OnboardingStep({ step }) {
  return (
    <div className="onboarding-step">
      <div className="onboarding-step__name">{step.displayName}</div>
      <div className="onboarding-step__description">{step.description}</div>
      <div>
        <OnboardingStatus step={step} />
      </div>
    </div>
  );
}

OnboardingStep.propTypes = {
  step: PropTypes.shape({
    state: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
    userConfirm: PropTypes.string,
    staffApprove: PropTypes.string,
    staffDeny: PropTypes.string,
    customStatus: PropTypes.string,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.string,
        message: PropTypes.string
      })
    )
  }).isRequired
};

OnboardingStep.defaultProps = {};

function OnboardingUser() {
  const { params } = useRouteMatch();
  const dispatch = useDispatch();
  const user = useSelector(state => state.onboarding.user);
  const isStaff = useSelector(
    state => state.authenticatedUser.user ? state.authenticatedUser.user.isStaff : false
  );
  const loading = useSelector(state => state.onboarding.user.loading);
  const error = useSelector(state => state.onboarding.user.error);

  useEffect(() => {
    dispatch({
      type: 'FETCH_ONBOARDING_ADMIN_INDIVIDUAL_USER',
      payload: {
        user: params.username || ''
      }
    });
    dispatch({
      type: 'FETCH_AUTHENTICATED_USER'
    });
  }, [dispatch, params]);

  if (loading) {
    return (
      <div data-testid="loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div>Unable to retrieve your onboarding steps</div>;
  }

  return (
    <div className='onboarding'>
      {isStaff ? (
        <div className='onboarding__title'>
          Onboarding Administration for {user.username} - {user.lastName},{' '}
          {user.firstName}
        </div>
      ) : (
        <div className='onboarding__title'>
          The following steps must be completed before accessing the portal
        </div>
      )}
      <div className='onboarding__container'>
        {user.steps.map(step => (
          <OnboardingStep step={step} key={uuidv4()} />
        ))}
        <div className='onboarding__access'>
          {user.setupComplete ? (
            <Button href="/workbench/">Access Dashboard</Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

OnboardingUser.propTypes = {};

OnboardingUser.defaultProps = {};

export default OnboardingUser;
