import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Users from "./components/Users";
import Products from "./components/Products/Products";
import Orders from "./components/Orders";
import AddProduct from "./components/Products/AddProduct";
import ModifyProduct from "./components/Products/ModifyProduct";
import Categories from "./components/Categories/Categories";
import AddCategory from "./components/Categories/AddCategory";
import ModifyCategory from "./components/Categories/ModifyCategory";
import Brands from "./components/Brands/Brands";
import AddBrand from "./components/Brands/AddBrand";
import ModifyBrand from "./components/Brands/ModifyBrand";
import ClothingandAccessories from "./components/Clothing & Accessories/ClothingandAccessories";
import Clothes from "./components/Clothing & Accessories/Clothes";
import Accessories from "./components/Clothing & Accessories/Accessories";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/products" element={<Products />} />
      <Route path="/admin/products/add" element={<AddProduct />} />
      <Route path="/admin/products/modify/:id" element={<ModifyProduct />} />
      <Route path="/admin/categories" element={<Categories />} />
      <Route path="/admin/categories/add" element={<AddCategory />} />
      <Route path="/admin/categories/modify" element={<ModifyCategory />} />
      <Route path="/admin/brands" element={<Brands />} />
      <Route path="/admin/brands/add" element={<AddBrand />} />
      <Route path="/admin/brands/modify" element={<ModifyBrand />} />
      <Route path="/admin/clothingandaccessories" element={<ClothingandAccessories />} />
      <Route path="/admin/clothes" element={<Clothes />} />
      <Route path="/admin/accessories" element={<Accessories />} />
      <Route path="/admin/orders" element={<Orders />} />
    </Routes>
  );
}

export default AdminRoutes;
