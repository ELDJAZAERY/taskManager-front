import React, { useState } from "react";
import { connect } from "react-redux";
import { Fab } from "@material-ui/core";
import { Add } from "@material-ui/icons";

import CreateTaskForm from './CreateTaskForm'

const Col = ({ status, isOver, children, connectedUser }) => {
  const className = isOver ? " highlight-region" : "";

  const [show, setShow] = useState(false);

  const onOpen = () => setShow(true);

  const onClose = () => setShow(false);

  if (
    status &&
    status.status === "Backlog" &&
    connectedUser &&
    connectedUser.role === "Admin"
  )
    return (
      <React.Fragment>
        <div className={`column${className}`}>
          <Fab style={{
              float:  "right",
              marginTop: "-50px",
              marginBottom: "15px",
          }} size="small" onClick={onOpen} placeholder="Add task">
            <Add style={{ color: "blue", fontSize: "30px" }} />
          </Fab>

          {children}
        </div>
        <CreateTaskForm onClose={onClose} show={show} />
      </React.Fragment>
    );

  return <div className={`column${className}`}>{children}</div>;
};

const mapStateToProps = ({ authUser }) => {
  const { user: connectedUser } = authUser;
  return { connectedUser };
};

export default connect(mapStateToProps, {})(Col);
