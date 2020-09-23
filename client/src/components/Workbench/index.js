import { hot } from 'react-hot-loader/root';
import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Workbench from './Workbench';
import ManageAccount from '../ManageAccount';
import * as ROUTES from '../../constants/routes';
import TicketUnauthenticatedCreate from '../Tickets/TicketUnauthenticatedCreate';

function AppRouter() {
  return (
    <Router>
      <Route path="/accounts/profile" component={ManageAccount} />
      <Route path={ROUTES.WORKBENCH} component={Workbench} />
      <Route path="/tickets/new" component={TicketUnauthenticatedCreate} />
      <Redirect from="/accounts" to="/accounts/profile" />
    </Router>
  );
}

export default hot(AppRouter);
