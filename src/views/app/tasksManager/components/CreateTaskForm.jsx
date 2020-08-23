import React from "react";
import { connect } from "react-redux";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Select from "react-select";

import Moment from "moment";

import CustomSelectInput from "../../../../components/common/CustomSelectInput";

import { CATEGORIES, PRIORITIES } from "../data";

import { systemNotif } from "../../../../redux/actions";
import { actionsEnum, typesEnum } from "../../../../redux/notifications/enums";
import { createTask } from "../../../../api/tasks";

const initialState = {
  title: "",
  description: "",
  category: "",
  priority: "",
  deadline: new Date(),
  errors: {
    title: "",
    category: "",
    priority: "",
  },
};

class CreateTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  handelChange = (value, tag, validateFunc = () => {}) => {
    let [error, validateValue] = validateFunc(value) || [undefined, value];

    this.setState({
      [tag]: validateValue,
      errors: {
        ...this.state.errors,
        [tag]: error,
      },
    });
  };

  lenghtValidator = (value, tag, min, max) => {
    let length = value.length;
    if (length < min)
      return [`Enter a ${tag} with at least ${min} characters`, value];
    if (length >= max)
      return [`Enter a ${tag} with at most ${max} characters`, this.state[tag]];

    return [undefined, value];
  };

  submit = async () => {
    const {
      errors,
      title,
      description,
      category,
      priority,
      deadline,
    } = this.state;

    if (JSON.stringify(errors) !== "{}") return;

    const task = {
      title,
      description,
      category,
      priority,
      deadline,
    };

    try {
      const response = await createTask(task);

      this.props.systemNotif(
        actionsEnum.PUSH,
        typesEnum.SUCCESS,
        "Task created"
      );

      this.setState({
        state: initialState
      })
      
      this.props.onClose();
    } catch ({ status, errMessage }) {
      this.props.systemNotif(actionsEnum.PUSH, typesEnum.ERROR, errMessage);
    }
  };

  selectedValue = (value, selecter = "category") => {
    if (selecter === "category") {
      for (let cat of CATEGORIES) {
        if (cat.value === value) return cat;
      }
    } else {
      for (let prot of PRIORITIES) {
        if (prot.value === value) return prot;
      }
    }

    return undefined;
  };

  render() {
    const { show, onClose } = this.props;
    const {
      errors,
      title,
      description,
      category,
      priority,
      deadline,
    } = this.state;

    return (
      <Modal
        isOpen={show}
        size="lg"
        toggle={onClose}
        overlayClassName={"overlay"}
      >
        <ModalHeader toggle={onClose}>Create Task</ModalHeader>
        <ModalBody>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => {
              this.handelChange(e.target.value, "title", () =>
                this.lenghtValidator(e.target.value, "title", 4, 35)
              );
            }}
          />
          {errors.title && (
            <div className="invalid-feedback d-block">{errors.title}</div>
          )}

          <Label className="mt-4">Category</Label>
          <Select
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-name"
            value={this.selectedValue(category)}
            onChange={(selected) => {
              this.handelChange(selected.value, "category");
            }}
            options={CATEGORIES}
          />

          <Label className="mt-4">Priority</Label>
          <Select
            components={{ Input: CustomSelectInput }}
            className="react-select"
            classNamePrefix="react-select"
            name="form-field-name"
            value={this.selectedValue(priority)}
            onChange={(selected) => {
              this.handelChange(selected.value, "priority");
            }}
            options={PRIORITIES}
          />

          <Label className="mt-4">Deadline</Label>
          <DatePicker
            type="date"
            value={Moment(deadline).format("DD / MM / yy")}
            onChange={(v) => {
              this.handelChange(new Date(v), "deadline");
            }}
            style={{ color: "whitesmoke" }}
          />

          <Label className="mt-4">Description</Label>
          <Input
            type="textarea"
            value={description}
            style={{
              backgroundColor: "rgba(0,0,0,0)",
              minHeight: "13vw",
            }}
            onChange={(e) => {
              this.handelChange(e.target.value, "description");
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!(JSON.stringify(errors) === "{}")}
            onClick={this.submit}
          >
            Submit
          </Button>{" "}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = ({ partners }) => {};

export default connect(mapStateToProps, {
  systemNotif,
})(CreateTaskForm);
