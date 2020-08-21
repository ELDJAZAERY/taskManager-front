import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';

import { NotificationManager } from '../../../components/common/react-notifications';
import { connect } from 'react-redux';
import Breadcrumb from '../../../containers/navs/Breadcrumb';

class Page extends Component {
  componentDidMount() {
    this.onFetchData();
  }

  componentDidUpdate() {
    if (this.props.error) {
      const messageError = this.props.error;
      const title = messageError.startsWith('Session expire')
        ? 'Authentication error'
        : 'Partner Error';
      NotificationManager.warning(
        this.props.error,
        title,
        7 * 1000,
        null,
        null,
        ''
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
          <Colxx xxs='12'>
            <Breadcrumb heading='menu.partners-list' match={this.props.match} />
            <Separator className='mb-5' />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs='12' className='mb-4'>
            <p> Page Boiler </p>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {};

export default connect(mapStateToProps, {})(Page);
