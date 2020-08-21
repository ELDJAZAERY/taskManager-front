import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { IntlProvider } from "react-intl";
import AppLocale from "./lang";
import { getDirection } from "./helpers/Utils";

import NotificationContainer from "./components/common/react-notifications/NotificationContainer";
import { NotificationManager } from "./components/common/react-notifications";
import { systemNotif } from "./redux/actions";
import { actionsEnum, typesEnum } from "./redux/notifications/enums";

const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ "./views")
);
const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ "./views/app")
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ "./views/user")
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ "./views/error")
);

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/user",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }
  }

  componentDidUpdate() {
    this.notificatoinHandler();
  }

  // Notificatoin System Handler
  notificatoinHandler = () => {
    const { success, warning, error, systemNotif } = this.props;

    if (error) {
      let { title, message, status } = error;

      if (status === 401)
        // Session Expired
        return this.sessionExpire();

      if (status === 429)
        // TOO MANY REQUESTS
        return this.tooManyRequests();

      NotificationManager.error(message, title, 7 * 1000, null, null, "");

      systemNotif(actionsEnum.CLEAR, typesEnum.ERROR);
    }

    if (success) {
      const { title, message } = success;

      NotificationManager.success(message, title, 1 * 1000, null, null, "");

      systemNotif(actionsEnum.CLEAR, typesEnum.SUCCESS);
    }

    if (warning) {
      const { title, message } = warning;

      NotificationManager.warning(message, title, 5 * 1000, null, null, "");

      systemNotif(actionsEnum.CLEAR, typesEnum.WARNING);
    }
  };

  // Session expire Handler
  sessionExpire = () => {
    const message = "Session expire, login again";
    NotificationManager.error(
      message,
      "Authentication Error",
      7 * 1000,
      null,
      null,
      ""
    );

    systemNotif(actionsEnum.CLEAR, typesEnum.ERROR);
    window.location.href = "/user/login";
  };

  // TOO Many Request Handler
  tooManyRequests = () => {
    const message = "Too Many Requests, Please wait a few minutes";
    NotificationManager.error(
      message,
      "Limit Edition",
      60 * 1000,
      null,
      null,
      ""
    );

    systemNotif(actionsEnum.CLEAR, typesEnum.ERROR);
  };

  render() {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <NotificationContainer />
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <AuthRoute
                    path="/app"
                    authUser={loginUser}
                    component={ViewApp}
                  />
                  <Route
                    path="/user"
                    render={(props) => <ViewUser {...props} />}
                  />
                  <Route
                    path="/error"
                    exact
                    render={(props) => <ViewError {...props} />}
                  />
                  <Route
                    path="/"
                    exact
                    render={(props) => <ViewMain {...props} />}
                  />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, settings, notificatoins }) => {
  const { user: loginUser } = authUser;
  const { locale } = settings;

  const { success, warning, error } = notificatoins;

  return { loginUser, locale, success, warning, error };
};

const mapActionsToProps = {
  systemNotif,
};

export default connect(mapStateToProps, mapActionsToProps)(App);
