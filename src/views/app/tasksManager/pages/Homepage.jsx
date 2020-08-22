import React, { useState, useEffect } from "react";
import Item from "../components/Item";
import DropWrapper from "../components/DropWrapper";
import Col from "../components/Col";
import { statuses } from "../data";
import { updateStatus } from "../../../../api/tasks";

const Homepage = ({ tasks, fetchTasks = () => {
  console.log(" khortiiii ")
} }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  const onDrop = async (item, monitor, status) => {
    setItems((prevState) => {
      const newItems = prevState
        .filter((i) => i.id !== item.id)
        .concat({ ...item, status });
        console.log(" new Items onDrop ", newItems)
      return [...newItems];
    });
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
              <Col status={s}>
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
