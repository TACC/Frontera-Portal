import React, { useEffect } from 'react';
import { Route, Switch, useRouteMatch, Redirect } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../Dashboard';
import Allocations from '../Allocations';
import Applications from '../Applications';
import UIPatterns from '../UIPatterns';
import Sidebar from '../Sidebar';
import DataFiles from '../DataFiles';
import History from '../History';
import DemoListing from '../DemoListing';
import * as ROUTES from '../../constants/routes';
import NotificationToast from '../Toasts';
import './Workbench.scss';

function Workbench() {
  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  // Show some entries only in local development
  const isDebug = useSelector(state =>
    state.workbench.status ? state.workbench.status.debug : false
  );
  const showUIPatterns = isDebug;
  // Get systems and any other initial data we need from the backend
  useEffect(() => {
    dispatch({ type: 'FETCH_WELCOME' });
    dispatch({ type: 'FETCH_SYSTEMS' });
    dispatch({ type: 'FETCH_AUTHENTICATED_USER' });
    dispatch({ type: 'FETCH_WORKBENCH' });
    dispatch({ type: 'GET_ALLOCATIONS' });
    dispatch({ type: 'GET_APPS' });
    dispatch({ type: 'GET_APP_START' });
    dispatch({ type: 'GET_JOBS', params: { offset: 0 } });
    dispatch({ type: 'FETCH_NOTIFICATIONS' });
  }, []);

  const welcomeMessages = useSelector(state => state.welcomeMessages);

  const onDismissWelcome = section => {
    const newMessagesState = {
      ...welcomeMessages,
      [section]: false
    };
    dispatch({ type: 'SAVE_WELCOME', payload: newMessagesState });
  };

  return (
    <div className="workbench-wrapper">
      <NotificationToast />
      <Sidebar />
      <div className="workbench-content">
        <Switch>
          <Route path={`${path}${ROUTES.DASHBOARD}`}>
            <Alert
              isOpen={welcomeMessages.dashboard}
              toggle={() => onDismissWelcome('dashboard')}
              color="secondary"
              className="welcomeMessage"
            >
              This page allows you to monitor your job status, get help with
              tickets, and view the status of the High Performance Computing
              (HPC) systems.
            </Alert>
          </Route>
          <Route path={`${path}${ROUTES.DATA}`}>
            <Alert
              isOpen={welcomeMessages.datafiles}
              toggle={() => onDismissWelcome('datafiles')}
              color="secondary"
              className="welcomeMessage"
            >
              This page allows you to upload and manage your files.
            </Alert>
          </Route>
          <Route path={`${path}${ROUTES.APPLICATIONS}`}>
            <Alert
              isOpen={welcomeMessages.applications}
              toggle={() => onDismissWelcome('applications')}
              color="secondary"
              className="welcomeMessage"
            >
              This page allows you to submit jobs to the HPC systems or access
              Cloud services using a variety of applications.
            </Alert>
          </Route>
          <Route path={`${path}${ROUTES.ALLOCATIONS}`}>
            <Alert
              isOpen={welcomeMessages.allocations}
              toggle={() => onDismissWelcome('allocations')}
              color="secondary"
              className="welcomeMessage"
            >
              This page allows you to monitor the status of allocations on the
              HPC systems and view a breakdown of team usage.
            </Alert>
          </Route>
          <Route path={`${path}${ROUTES.HISTORY}`}>
            <Alert
              isOpen={welcomeMessages.history}
              toggle={() => onDismissWelcome('history')}
              color="secondary"
              className="welcomeMessage"
            >
              This page allows you to monitor a log of all previous job
              submissions.
            </Alert>
          </Route>
        </Switch>
        <Switch>
          <Route path={`${path}${ROUTES.DASHBOARD}`}>
            <Dashboard />
          </Route>
          <Route path={`${path}${ROUTES.DATA}`}>
            <DataFiles />
          </Route>
          <Route
            path={`${path}${ROUTES.APPLICATIONS}`}
            component={Applications}
          />
          <Route path={`${path}${ROUTES.DEMO}`}>
            <DemoListing name="Alice" />
          </Route>
          <Route
            path={`${path}${ROUTES.ALLOCATIONS}`}
            component={Allocations}
          />
          <Route path={`${path}${ROUTES.HISTORY}`} component={History} />
          {showUIPatterns && (
            <Route path={`${path}${ROUTES.UI}`} component={UIPatterns} />
          )}
          <Redirect from={`${path}`} to={`${path}${ROUTES.DASHBOARD}`} />
        </Switch>
      </div>
    </div>
  );
}

export default Workbench;
