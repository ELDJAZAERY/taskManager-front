/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Item from "../components/Item";
import DropWrapper from "../components/DropWrapper";
import Col from "../components/Col";
import { statuses } from "../data";
import { updateStatus } from "../../../../api/tasks";

const Homepage = ({ tasks, fetchTasks = () => {}}) => {
  const [items, setItems] = useState([]);
  const [ignore, setIgnore] = useState(0)

  useEffect(() => {
    if(ignore === 0) setItems(tasks);
    else setIgnore(ignore - 1)
  }, [tasks]);

  const onDrop = async (item, monitor, status) => {
    setItems((prevState) => {
      const newItems = prevState
        .filter((i) => i.id !== item.id)
        .concat({ ...item, status });
        console.log(" new Items onDrop ", newItems)
      return [...newItems];
    });
    setIgnore(1)
    await updateStatus(item.id, status);
    fetchTasks()
  };

  return (
    <div className={"rows"}>
      {statuses.map((s, index) => {
        return (
          <div key={index} className={"col-wrapper"}>
            <h2 className={"col-header"}>{s.status.toUpperCase()}</h2>
            <DropWrapper onDrop={onDrop} status={s.status}>
              <Col status={s} fetchTasks={fetchTasks}>
                {items
                  .filter((i) => i.status === s.status)
                  .map((i, idx) => (
                    <Item
                      key={i.id}
                      item={i}
                      index={idx}
                      moveItem={() => {}}
                      status={s}
                    />
                  ))}
              </Col>
            </DropWrapper>
          </div>
        );
      })}
    </div>
  );
};

export default Homepage;
