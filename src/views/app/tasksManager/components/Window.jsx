import React from "react";
import { ModalHeader, ModalBody, Modal } from "reactstrap";

import { getIcon } from '../helper'

const Window = ({ show, onClose, item }) => {
  return (
    <Modal
      isOpen={show}
      size="lg"
      toggle={onClose}
      overlayClassName={"overlay"}
    >
      <ModalHeader toggle={onClose}>{item.title}</ModalHeader>
      <ModalBody>
        <div>
          <h2>Description</h2>
          <p>{item.content}</p>
          <h2>Status</h2>
          <p>
            {getIcon(item)}{" "}
            {`${item.status.charAt(0).toUpperCase()}${item.status.slice(1)}`}
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Window;
