import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Tasks = React.lazy(() =>
  import(/* webpackChunkName: "start" */ './tasks')
);

const OwnerPanel = ({ match }) => (
  <Suspense fallback={<div className='loading' />}>
    <Switch>
      <Route
        path={`${match.url}/`}
        render={props => <Tasks {...props} />}
      />
      <Redirect to='/error' />
    </Switch>
  </Suspense>
);

export default OwnerPanel;
