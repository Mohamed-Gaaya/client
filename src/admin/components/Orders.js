import React, { useState, useEffect } from "react";


const Orders = () => {
  const [orders, setOrders] = useState([]);

 

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.user}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
