import React, { Component } from "react";
import { injectIntl } from "react-intl";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  changeLocale,
} from "../../../../redux/actions";

import {
  menuHiddenBreakpoint,
  searchPath,
  localeOptions,
} from "../../../../constants/defaultValues";

import { MobileMenuIcon, MenuIcon } from "../../../../components/svg";

import { getDirection, setDirection } from "../../helpers/Utils";

class TopNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isInFullScreen: false,
      searchKeyword: "",
    };
  }

  handleRoute = (local) => {
    if (!this.props.history) return;

    this.props.history.push(local);
  };

  handleChangeLocale = (locale, direction) => {
    this.props.changeLocale(locale);

    const currentDirection = getDirection().direction;
    if (direction !== currentDirection) {
      setDirection(direction);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  isInFullScreen = () => {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
  };

  handleSearchIconClick = (e) => {
    if (window.innerWidth < menuHiddenBreakpoint) {
      let elem = e.target;
      if (!e.target.classList.contains("search")) {
        if (e.target.parentElement.classList.contains("search")) {
          elem = e.target.parentElement;
        } else if (
          e.target.parentElement.parentElement.classList.contains("search")
        ) {
          elem = e.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains("mobile-view")) {
        this.search();
        elem.classList.remove("mobile-view");
        this.removeEventsSearch();
      } else {
        elem.classList.add("mobile-view");
        this.addEventsSearch();
      }
    } else {
      this.search();
    }
  };

  addEventsSearch = () => {
    document.addEventListener("click", this.handleDocumentClickSearch, true);
  };

  removeEventsSearch = () => {
    document.removeEventListener("click", this.handleDocumentClickSearch, true);
  };

  handleDocumentClickSearch = (e) => {
    let isSearchClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains("navbar") ||
        e.target.classList.contains("simple-icon-magnifier"))
    ) {
      isSearchClick = true;
      if (e.target.classList.contains("simple-icon-magnifier")) {
        this.search();
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains("search")
    ) {
      isSearchClick = true;
    }

    if (!isSearchClick) {
      const input = document.querySelector(".mobile-view");
      if (input && input.classList) input.classList.remove("mobile-view");
      this.removeEventsSearch();
      this.setState({
        searchKeyword: "",
      });
    }
  };

  handleSearchInputChange = (e) => {
    this.setState({
      searchKeyword: e.target.value,
    });
  };

  handleSearchInputKeyPress = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  search = () => {
    this.props.history.push(searchPath + "/" + this.state.searchKeyword);
    this.setState({
      searchKeyword: "",
    });
  };

  toggleFullScreen = () => {
    const isInFullScreen = this.isInFullScreen();

    var docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    this.setState({
      isInFullScreen: !isInFullScreen,
    });
  };

  handleLogout = () => {
    this.props.logoutUser(this.props.history);
  };

  menuButtonClick = (e, menuClickCount, containerClassnames) => {
    e.preventDefault();

    setTimeout(() => {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
    }, 350);
    this.props.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.props.selectedMenuHasSubItems
    );
  };

  mobileMenuButtonClick = (e, containerClassnames) => {
    e.preventDefault();
    this.props.clickOnMobileMenu(containerClassnames);
  };

  render() {
    const {
      containerClassnames,
      menuClickCount,
      locale,
      username = "",
      role,
    } = this.props;
    return (
      <nav className="navbar fixed-top">
        <div className="d-flex align-items-center navbar-left">
          {role === "Admin" && (
            <React.Fragment>
              <NavLink
                to="#"
                location={{}}
                className="menu-button d-none d-md-block"
                onClick={(e) =>
                  this.menuButtonClick(e, menuClickCount, containerClassnames)
                }
              >
                <MenuIcon />
              </NavLink>
              <NavLink
                to="#"
                location={{}}
                className="menu-button-mobile d-xs-block d-sm-block d-md-none"
                onClick={(e) =>
                  this.mobileMenuButtonClick(e, containerClassnames)
                }
              >
                <MobileMenuIcon />
              </NavLink>
            </React.Fragment>
          )}

          <div className="d-inline-block"></div>
        </div>
        <div className="navbar-right">
          <div className="header-icons d-inline-block align-middle">
            <button
              className="header-icon btn btn-empty d-none d-sm-inline-block"
              type="button"
              id="fullScreenButton"
              onClick={this.toggleFullScreen}
            >
              {this.state.isInFullScreen ? (
                <i className="simple-icon-size-actual d-block" />
              ) : (
                <i className="simple-icon-size-fullscreen d-block" />
              )}
            </button>
          </div>
          <div className="user d-inline-block">
            <UncontrolledDropdown className="dropdown-menu-right">
              <DropdownToggle className="p-0" color="empty">
                <div className="h2 p-1">
                  <i className="glyph-icon iconsminds-business-man" />
                  <div className="class-name h5">{username}</div>
                </div>
              </DropdownToggle>
              <DropdownMenu className="mt-3" right>
                <DropdownItem
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleRoute("/app/profile")}
                >
                  Account
                </DropdownItem>
                <DropdownItem divider />
                {this.props.role === "Admin" && (
                  <React.Fragment>
                    <DropdownItem
                      style={{ cursor: "pointer" }}
                      onClick={() => this.handleRoute("/app/dashboard/users")}
                    >
                      Users
                    </DropdownItem>
                    <DropdownItem divider />
                  </React.Fragment>
                )}
                <DropdownItem
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleRoute("/app/tasks")}
                >
                  Tasks
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleLogout()}
                >
                  Sign out
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ menu, settings, authUser = {} }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  const { locale } = settings;
  const { user = {} } = authUser;
  const username = user.identificator || "";
  const role = user.role || "";

  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    username,
    role,
  };
};

export default injectIntl(
  connect(mapStateToProps, {
    setContainerClassnames,
    clickOnMobileMenu,
    logoutUser,
    changeLocale,
  })(TopNav)
);
