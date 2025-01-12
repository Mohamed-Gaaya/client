import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Users from "./components/Users";
import Products from "./components/Products/Products";
import Orders from "./components/Orders";
import AddProduct from "./components/Products/AddProduct";
import Categories from "./components/Categories/Categories";
import AddCategory from "./components/Categories/AddCategory";
import ModifyCategory from "./components/Categories/ModifyCategory";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/products" element={<Products />} />
      <Route path="/admin/products/add" element={<AddProduct />} />
      <Route path="/admin/categories" element={<Categories />} />
      <Route path="/admin/categories/add" element={<AddCategory />} />
      <Route path="/admin/categories/modify" element={<ModifyCategory />} />
      <Route path="/admin/orders" element={<Orders />} />
    </Routes>
  );
}

export default AdminRoutes;
