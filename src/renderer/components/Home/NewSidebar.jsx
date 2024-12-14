
import React from "react";
import CategoryManager from "../Category/CategoryManager";
export default function NewSidebar({ categories, setCategories }) {
  return (
    <div className="sidebar">
      <CategoryManager categories={categories} setCategories={setCategories} />
    </div>
  );
}