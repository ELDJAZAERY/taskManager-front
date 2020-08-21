import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from './layout/AppLayout';

const AdminPanel = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './dashboard')
);

const Profile = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './account/profile')
);

class App extends Component {
  render() {
    const { match, loginUser } = this.props;

    const isAdmin = loginUser.role === 'Admin';

    const homePage = isAdmin ? 'dashboard' : 'profile';

    return (
      <AppLayout>
        <div className='dashboard-wrapper'>
          <Suspense fallback={<div className='loading' />}>
            <Switch>
              <Redirect
                exact
                from={`${match.url}/`}
                to={`${match.url}/${homePage}`}
              />
              {isAdmin && (
                <Route
                  path={`${match.url}/dashboard`}
                  render={props => <AdminPanel {...props} />}
                />
              )}
              <Route
                path={`${match.url}/profile`}
                render={props => <Profile {...props} />}
              />
              <Redirect to='/error' />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}

const mapStateToProps = ({ menu, authUser }) => {
  const { user: loginUser } = authUser;
  const { containerClassnames } = menu;
  return { containerClassnames, loginUser };
};

export default withRouter(connect(mapStateToProps)(App));
