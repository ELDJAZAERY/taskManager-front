import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";

import { NotificationManager } from "../../../components/common/react-notifications";
import { connect } from "react-redux";

import Homepage from "./pages/Homepage";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import "./style/index.css";

class Page extends Component {
  componentDidMount() {
    this.onFetchData();
  }

  componentDidUpdate() {
    if (this.props.error) {
      const messageError = this.props.error;
      const title = messageError.startsWith("Session expire")
        ? "Authentication error"
        : "Partner Error";
      NotificationManager.warning(
        this.props.error,
        title,
        7 * 1000,
        null,
        null,
        ""
      );
    }
  }

  componentWillUnmount() {
    this.onClearData();
  }

  onFetchData = () => {};

  onClearData = () => {};

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <DndProvider backend={Backend}>
              <Homepage />
            </DndProvider>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {};

export default connect(mapStateToProps, {})(Page);
