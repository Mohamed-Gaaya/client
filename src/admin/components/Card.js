import React from "react";

const Card = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-2xl mt-2">{value}</p>
    </div>
  );
};

export default Card;
