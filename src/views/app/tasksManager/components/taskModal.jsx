import React from "react";
import { connect, ReactReduxContext } from "react-redux";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";

import Select from "react-select";

import CustomSelectInput from "../../../../components/common/CustomSelectInput";

import { CATEGORIES, PRIORITIES } from "../data";

import { systemNotif } from "../../../../redux/actions";
import { actionsEnum, typesEnum } from "../../../../redux/notifications/enums";
import { objectEquals } from "../../helpers/data.helpers";

class CreateTaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: this.props.item,
      exposedTask: this.props.item,
      errors: {
      },
    };
  }

  handelChange = (value, tag, validateFunc = () => {}) => {
    let [error, validateValue] = validateFunc(value) || [undefined, value];

    this.setState({
      exposedTask: { ...this.state.exposedTask, [tag]: validateValue },
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
      // const response = await addPartner(partner);
      const message = "";
      this.props.systemNotif(actionsEnum.PUSH, typesEnum.SUCCESS, message);

      this.props.dataListRender();
      this.props.toggleModal();
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

  isUpdated = () => {
    const { task: originalOne, exposedTask, errors } = this.state;

    console.log(errors)
    return (
      !objectEquals(exposedTask, originalOne) && JSON.stringify(errors) === "{}"
    );
  };

  havePermission = (action) => {
    if (this.props.connectedUser && this.props.connectedUser.role === "Admin")
      return true;
    return false;
  };

  render() {
    const { show, onClose } = this.props;
    const { errors } = this.state
    const {
      title,
      description,
      category,
      priority,
      deadline,
    } = this.state.exposedTask;

    const isAdmin = this.havePermission()

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
            style={{ backgroundColor: 'rgba(0,0,0,0)' }}
            disabled={!isAdmin}
          />
          {errors.title && (
            <div className="invalid-feedback d-block">{errors.title}</div>
          )}

          <Label className="mt-4">Category</Label>
          {isAdmin ? (
            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select"
              classNamePrefix="react-select"
              name="form-field-name"
              value={this.selectedValue(category, "category")}
              onChange={(selected) => {
                this.handelChange(selected.value, "category");
              }}
              options={CATEGORIES}
            />
          ) : (
            <Input
              value={category}
              style={{
                backgroundColor: "rgba(0,0,0,0)",
              }}
              disabled={true}
            />
          )}

          <Label className="mt-4">Priority</Label>
          {isAdmin ? (
            <Select
              components={{ Input: CustomSelectInput }}
              className="react-select"
              classNamePrefix="react-select"
              name="form-field-name"
              value={this.selectedValue(priority, "priority")}
              onChange={(selected) => {
                this.handelChange(selected.value, "priority");
              }}
              options={PRIORITIES}
            />
          ) : (
            <Input
              value={priority}
              style={{
                backgroundColor: "rgba(0,0,0,0)",
              }}
              disabled={true}
            />
          )}

          <Label className="mt-4">Deadline</Label>
          <Input
            type={"date"}
            value={deadline}
            onChange={(e) => {
              this.handelChange(e.target.value, "deadline");
            }}
            style={{ backgroundColor: 'rgba(0,0,0,0)' }}
            disabled={!isAdmin}
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
            disabled={!isAdmin}
          />
        </ModalBody>
        {this.isUpdated() && (
          <ModalFooter>
            <Button color="secondary" outline onClick={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={!(JSON.stringify(errors) === "{}")}
              onClick={this.submitPartner}
            >
              Submit
            </Button>{" "}
          </ModalFooter>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user: connectedUser } = authUser;
  return { connectedUser };
};

export default connect(mapStateToProps, {
  systemNotif,
})(CreateTaskForm);
