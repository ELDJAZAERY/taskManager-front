import React from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';

export default class CustomModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    };
  }

  render() {
    const {
      isOpen = true,
      toggleFunc = () => {},
      body = '',
      cancelFunc = () => {},
      submitFunc = () => {
        // alert
        alert(' --- Submited --- ');
      },
      titleId = 'modal.title',
      submitMessageId = 'modal.submit',
      cancelMessageId = 'modal.cancel'
    } = this.props;

    return (
      <React.Fragment>
        <Modal
          isOpen={isOpen}
          toggle={() => {
            this.setState({ isOpen: !this.state.isOpen });
          }}
        >
          <ModalHeader toggle={toggleFunc}>
            <IntlMessages id={titleId} />
          </ModalHeader>
          <ModalBody>{body}</ModalBody>
          <ModalFooter>
            <Button
              color='primary'
              onClick={() => {
                submitFunc();
                this.setState({ isOpen: false });
              }}
            >
              <IntlMessages id={submitMessageId} />
            </Button>{' '}
            <Button
              color='secondary'
              onClick={() => {
                cancelFunc();
                this.setState({ isOpen: false });
              }}
            >
              <IntlMessages id={cancelMessageId} />
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}
