import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner, Message, Paginator } from '_common';
import './OnboardingAdmin.module.scss';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import { onboardingUserPropType } from './OnboardingPropTypes';
import OnboardingEventLogModal from './OnboardingEventLogModal';
import OnboardingStatus from './OnboardingStatus';
import OnboardingAdminSearchbar from './OnboardingAdminSearchbar';

const OnboardingApproveActions = ({ callback }) => {
  return (
    <div styleName="approve-container">
      <Button
        className="c-button--secondary"
        styleName="approve"
        // eslint-disable-next-line standard/no-callback-literal
        onClick={() => callback('staff_approve')}
      >
        <FontAwesomeIcon icon={faCheck} />
        <>Approve</>
      </Button>
      <Button
        className="c-button--secondary"
        styleName="approve"
        // eslint-disable-next-line standard/no-callback-literal
        onClick={() => callback('staff_deny')}
      >
        <FontAwesomeIcon icon={faTimes} />
        <>Deny</>
      </Button>
    </div>
  );
};

OnboardingApproveActions.propTypes = {
  callback: PropTypes.func.isRequired
};

const OnboardingResetLinks = ({ callback, disableSkip }) => {
  return (
    <div styleName="reset">
      <Button
        color="link"
        styleName="action-link"
        // eslint-disable-next-line standard/no-callback-literal
        onClick={() => callback('reset')}
      >
        Reset
      </Button>
      <>|</>
      <Button
        color="link"
        styleName="action-link"
        disabled={disableSkip}
        // eslint-disable-next-line standard/no-callback-literal
        onClick={() => callback('complete')}
      >
        Skip
      </Button>
    </div>
  );
};

OnboardingResetLinks.propTypes = {
  callback: PropTypes.func.isRequired,
  disableSkip: PropTypes.bool
};

OnboardingResetLinks.defaultProps = {
  disableSkip: false
};

const OnboardingAdminListUser = ({ user, viewLogCallback }) => {
  const dispatch = useDispatch();
  const actionCallback = useCallback(
    (step, username, action) => {
      dispatch({
        type: 'POST_ONBOARDING_ACTION',
        payload: {
          step,
          action,
          username
        }
      });
    },
    [dispatch]
  );

  return (
    <tr styleName="user">
      <td>
        <div styleName="name">{`${user.firstName} ${user.lastName}`}</div>
      </td>
      <td>
        {user.steps.map(step => (
          <div
            key={uuidv4()}
            styleName={step.state === 'staffwait' ? 'staffwait' : ''}
          >
            {step.displayName}
          </div>
        ))}
      </td>
      <td>
        {user.steps.map(step => (
          <div
            key={uuidv4()}
            styleName={`status ${
              step.state === 'staffwait' ? 'staffwait' : ''
            }`}
          >
            <OnboardingStatus step={step} />
          </div>
        ))}
      </td>
      <td>
        {user.steps.map(step => (
          <div
            key={uuidv4()}
            styleName={step.state === 'staffwait' ? 'staffwait' : ''}
          >
            {step.state === 'staffwait' && (
              <OnboardingApproveActions
                callback={action =>
                  actionCallback(step.step, user.username, action)
                }
              />
            )}
          </div>
        ))}
      </td>
      <td>
        {user.steps.map(step => (
          <div
            key={uuidv4()}
            styleName={step.state === 'staffwait' ? 'staffwait' : ''}
          >
            <OnboardingResetLinks
              callback={action =>
                actionCallback(step.step, user.username, action)
              }
              disableSkip={step.state === 'completed'}
            />
          </div>
        ))}
      </td>
      <td>
        {user.steps.map(step => (
          <div
            key={uuidv4()}
            styleName={step.state === 'staffwait' ? 'staffwait' : ''}
          >
            <Button
              color="link"
              styleName="action-link"
              onClick={() => viewLogCallback(user, step)}
            >
              View Log
            </Button>
          </div>
        ))}
      </td>
    </tr>
  );
};

OnboardingAdminListUser.propTypes = {
  user: onboardingUserPropType.isRequired,
  viewLogCallback: PropTypes.func.isRequired
};

const OnboardingAdminList = ({ users, viewLogCallback }) => {
  return (
    <table styleName="users">
      <thead>
        <tr>
          <th>User</th>
          <th>Step</th>
          <th>Status</th>
          <th>Administrative Actions</th>
          <th>&nbsp;</th>
          <th>Log</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <OnboardingAdminListUser
            user={user}
            key={user.username}
            viewLogCallback={viewLogCallback}
          />
        ))}
      </tbody>
    </table>
  );
};

OnboardingAdminList.propTypes = {
  users: PropTypes.arrayOf(onboardingUserPropType).isRequired,
  viewLogCallback: PropTypes.func.isRequired
};

const OnboardingAdmin = () => {
  const dispatch = useDispatch();
  const [eventLogModalParams, setEventLogModalParams] = useState(null);

  const { users, offset, limit, total, query, loading, error } = useSelector(
    state => state.onboarding.admin
  );

  const paginationCallback = useCallback(
    page => {
      dispatch({
        type: 'FETCH_ONBOARDING_ADMIN_LIST',
        payload: {
          offset: (page - 1) * limit,
          limit,
          query
        }
      });
    },
    [offset, limit, query]
  );

  const viewLogCallback = useCallback(
    (user, step) => {
      setEventLogModalParams({ user, step });
    },
    [setEventLogModalParams]
  );

  const toggleViewLogModal = useCallback(() => {
    setEventLogModalParams();
  }, [setEventLogModalParams]);

  useEffect(() => {
    dispatch({
      type: 'FETCH_ONBOARDING_ADMIN_LIST',
      payload: { offset, limit, query: null }
    });
  }, [dispatch, offset, limit]);

  const current = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);
  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <Message type="warn">Unable to access Onboarding administration</Message>
    );
  }
  return (
    <div styleName="root">
      <div styleName="container">
        <div styleName="container-header">
          <h5>Administrator Controls</h5>
          <OnboardingAdminSearchbar />
        </div>
        {users.length === 0 && (
          <div styleName="no-users-placeholder">
            <Message type="warn">No users to show.</Message>
          </div>
        )}
        <div styleName="user-container">
          {users.length > 0 && (
            <OnboardingAdminList
              users={users}
              viewLogCallback={viewLogCallback}
            />
          )}
        </div>
        {users.length > 0 && (
          <div styleName="paginator-container">
            <Paginator
              current={current}
              pages={pages}
              callback={paginationCallback}
            />
          </div>
        )}
        {eventLogModalParams && (
          <OnboardingEventLogModal
            params={eventLogModalParams}
            toggle={toggleViewLogModal}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingAdmin;
