import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import SuperoTask from './supero-task';
import SuperoTaskDetail from './supero-task-detail';
import SuperoTaskUpdate from './supero-task-update';
import SuperoTaskDeleteDialog from './supero-task-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={SuperoTaskUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={SuperoTaskUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={SuperoTaskDetail} />
      <ErrorBoundaryRoute path={match.url} component={SuperoTask} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={SuperoTaskDeleteDialog} />
  </>
);

export default Routes;
