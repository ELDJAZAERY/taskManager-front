import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TopNav from "../routes/navs/Topnav";
import Sidebar from "../routes/navs/Sidebar";
import Footer from "../routes/navs/Footer";

class AppLayout extends Component {
  render() {
    const { containerClassnames, loginUser = {} } = this.props;

    if (loginUser && loginUser.role === "Admin")
      return (
        <div id="app-container" className={containerClassnames}>
          <TopNav history={this.props.history} />
          <Sidebar />
          <main
            style={
              this.props.history &&
              this.props.history.location.pathname.includes("map")
                ? {
                    marginLeft: 0,
                    marginTop: "101px",
                    minWidth: "100%",
                    minHeight: "100%",
                  }
                : {}
            }
          >
            {this.props.children}
          </main>
          <Footer />
        </div>
      );
    else
      return (
        <React.Fragment>
          <div id="app-container" className={containerClassnames}>
            {loginUser && <TopNav history={this.props.history} />}
            <main
              style={
                this.props.history &&
                this.props.history.location.pathname.includes("map")
                  ? {
                      marginLeft: 0,
                      marginTop: "101px",
                      minWidth: "100%",
                      minHeight: "100%",
                    }
                  : {}
              }
            >
              {this.props.children}
            </main>
          </div>
        </React.Fragment>
      );
  }
}

const mapStateToProps = ({ menu, authUser }) => {
  const { user: loginUser } = authUser;
  const { containerClassnames } = menu;
  return { containerClassnames, loginUser };
};
const mapActionToProps = {};

export default withRouter(
  connect(mapStateToProps, mapActionToProps)(AppLayout)
);
