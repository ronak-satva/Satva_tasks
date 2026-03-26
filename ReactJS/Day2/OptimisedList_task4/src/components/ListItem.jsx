import React from "react";

const ListItem = React.memo(({ item, onDelete }) => {
  console.log("Rendering:", item.name);

  return (
    <div>
      <span>{item.name}</span>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
});

export default ListItem;