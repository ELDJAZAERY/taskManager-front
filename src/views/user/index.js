import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import UserLayout from '../../views/app/layout/UserLayout';

const Login = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './login')
);

const Register = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './register')
);

const ForgotPass = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './forgot-password')
);

const SendConfirmationMail = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './send-confirmatoin-mail')
);

const ConfirmMail = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './confirmMail')
);

const ResetPassword = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './reset-password')
);

const User = ({ match }) => {
  return (
    <UserLayout>
      <Suspense fallback={<div className='loading' />}>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/login`} />
          <Route
            path={`${match.url}/login`}
            render={props => <Login {...props} />}
          />
          <Route
            path={`${match.url}/register`}
            render={props => <Register {...props} />}
          />
          <Route
            path={`${match.url}/forgot-password`}
            render={props => <ForgotPass {...props} />}
          />
          <Route
            path={`${match.url}/send-mail`}
            render={props => <SendConfirmationMail {...props} />}
          />
          <Route
            path={`${match.url}/confirm-mail`}
            render={props => <ConfirmMail {...props} />}
          />
          <Route
            path={`${match.url}/reset-password`}
            render={props => <ResetPassword {...props} />}
          />
          <Redirect to='/error' />
        </Switch>
      </Suspense>
    </UserLayout>
  );
};

export default User;
