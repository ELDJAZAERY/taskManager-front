import React from "react";
import Modal from "react-modal";

const AddTask = ({ show, onClose }) => {
  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      className={"taskModal"}
      overlayClassName={"overlay"}
    >
      <div className={"close-btn-ctn"}>
        <h1 style={{ flex: "1 90%" }}></h1>
        <button
          className="close-btn"
          onClick={onClose}
          style={{ cursor: "pointer", color: "red" }}
        >
          X
        </button>
      </div>
      ADD Task
    </Modal>
  );
};

export default AddTask;
