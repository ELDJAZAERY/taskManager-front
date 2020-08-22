import React, { Fragment, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import TaskModal from "./taskModal";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { CardTitle } from "reactstrap";
import { Grid } from "@material-ui/core";

import Moment from "moment";

import { getIcon } from '../helper';

const Item = ({ item, index, moveItem, status }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "task",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoveredRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
      const mousePosition = monitor.getClientOffset();
      const hoverClientY = mousePosition.y - hoveredRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: "task",...item, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [show, setShow] = useState(false);

  const onOpen = () => setShow(true);

  const onClose = () => setShow(false);

  drag(drop(ref));

  return (
    <Fragment>
      <div
        ref={ref}
        className="mb-4"
        style={{ opacity: isDragging ? 0 : 1, cursor: "pointer" }}
        onClick={onOpen}
      >
        <TaskCard item={item} status={status} />
      </div>
      <TaskModal item={item} onClose={onClose} show={show} />
    </Fragment>
  );
};

export default Item;

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    padding: "15px",
    borderRadius: "20px",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const TaskCard = ({ item, status }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <Grid
        container
        direction={"row"}
        alignItems="center"
        justify="space-around"
        style={{
          width: "100%",
        }}
      >
        <Grid item xs={6}>
          <div
            className={"color-bar"}
            style={{ backgroundColor: status.color }}
          />
        </Grid>
        <Grid item xs={6}>
          <p className="item-status">{getIcon(item)}</p>
        </Grid>
      </Grid>
      <CardTitle className={classes.title}>{item.title}</CardTitle>
      <CardContent></CardContent>
      <CardActions>
        <Grid
          container
          direction={"row"}
          alignItems="center"
          justify="space-around"
          style={{
            width: "100%",
          }}
        >
          <Grid item xs={6}>
            <Button size="small">Details</Button>
          </Grid>
          <Grid item xs={6}>
            <Typography
              className={classes.title}
              color="textSecondary"
              style={{ float: "right" }}
              gutterBottom
            >
              {Moment(item.deadline).format("DD-MM-YYYY")}
            </Typography>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
