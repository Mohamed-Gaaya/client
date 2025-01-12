import React from "react";
import Card from "./Card";

const DashboardContent = () => {
  const stats = [
    { title: "Users", value: 1234 },
    { title: "Orders", value: 567 },
    { title: "Revenue", value: "$12,345" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};

export default DashboardContent;
