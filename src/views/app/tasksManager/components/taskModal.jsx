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

import { systemNotif, fetchTasks } from "../../../../redux/actions";
import { actionsEnum, typesEnum } from "../../../../redux/notifications/enums";
import { objectEquals } from "../../helpers/data.helpers";

import { updateTask, deleteTask } from "../../../../api/tasks";
import { Fab, Grid } from "@material-ui/core";

import { DeleteSharp } from "@material-ui/icons";

class CreateTaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: this.props.item,
      exposedTask: this.props.item,
      errors: {},
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
    const { errors, exposedTask } = this.state;

    if (JSON.stringify(errors) !== "{}") return;

    const { id } = exposedTask;

    try {
      const task = await updateTask(id, exposedTask);
      this.setState({
        task,
        exposedTask: task,
      });

      // update the task
      this.props.fetchTasks();

      this.props.systemNotif(actionsEnum.PUSH, typesEnum.SUCCESS, "Updated");

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

  isUpdated = () => {
    const { task: originalOne, exposedTask, errors } = this.state;

    return (
      !objectEquals(exposedTask, originalOne) && JSON.stringify(errors) === "{}"
    );
  };

  havePermission = (action) => {
    if (this.props.connectedUser && this.props.connectedUser.role === "Admin")
      return true;
    return false;
  };

  resetChange = () => {
    this.setState({
      exposedTask: this.state.task,
    });
  };

  delete = async () => {

    if(!window.confirm(" Press Ok to delete this task")){
      return
    }

    try{
      await deleteTask(this.state.exposedTask.id);
      // update the task
      this.props.fetchTasks();
      this.props.systemNotif(actionsEnum.PUSH, typesEnum.SUCCESS, "Updated");

      this.props.onClose();
    } catch ({ status, errMessage }) {
      this.props.systemNotif(actionsEnum.PUSH, typesEnum.ERROR, errMessage);
    }
  };

  render() {
    const { show, onClose } = this.props;
    const { errors } = this.state;
    const {
      title,
      description,
      category,
      priority,
      deadline,
    } = this.state.exposedTask;

    const isAdmin = this.havePermission();

    return (
      <Modal
        isOpen={show}
        size="lg"
        toggle={onClose}
        overlayClassName={"overlay"}
      >
        <ModalHeader toggle={onClose}>
          <Grid
            container
            direction={"row"}
            alignItems="center"
            justify="space-around"
            style={{
              width: "100%",
            }}
          >
            <Grid item xs={isAdmin ? 10 : 12}>
              Task details
            </Grid>
            <Grid item xs={2}>
              {isAdmin && (
                <Fab
                  size="small"
                  onClick={this.delete}
                >
                  {" "}
                  <DeleteSharp style={{ color: "#8a2913" }} />{" "}
                </Fab>
              )}
            </Grid>
          </Grid>
        </ModalHeader>
        <ModalBody>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => {
              this.handelChange(e.target.value, "title", () =>
                this.lenghtValidator(e.target.value, "title", 4, 35)
              );
            }}
            style={{ backgroundColor: "rgba(0,0,0,0)" }}
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
          <DatePicker
            type="date"
            value={Moment(deadline).format("DD / MM / yy")}
            onChange={(v) => {
              this.handelChange(new Date(v), "deadline");
            }}
            style={{ color: "whitesmoke" }}
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
            <Button color="secondary" outline onClick={this.resetChange}>
              Reset
            </Button>
            <Button
              color="primary"
              disabled={!(JSON.stringify(errors) === "{}")}
              onClick={this.submit}
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
  fetchTasks,
})(CreateTaskForm);
