import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const UsersList = React.lazy(() =>
  import(/* webpackChunkName: "start" */ './users')
);

const UserAccount = React.lazy(() =>
  import(/* webpackChunkName: "start" */ './users/account')
);

const OwnerPanel = ({ match }) => (
  <Suspense fallback={<div className='loading' />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/users`} />
      <Route
        exact
        path={`${match.url}/users`}
        render={props => <UsersList {...props} />}
      />
      <Route
        path={`${match.url}/users/account/:identificator`}
        render={props => <UserAccount {...props} />}
      />
      <Redirect to='/error' />
    </Switch>
  </Suspense>
);
export default OwnerPanel;
