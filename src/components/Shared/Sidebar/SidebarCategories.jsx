"use client";

import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DownOutlined, RightOutlined } from "@ant-design/icons";

const SidebarCategories = () => {
  const { data: categories } = useGetAllCategoriesQuery();
  const [openKeys, setOpenKeys] = useState([]);

  const toggleOpenKey = (key) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderSubcategories = (subcategories) => {
    if (!subcategories || subcategories.length === 0) {
      return <li className="text-gray-500 pl-6">No Subcategories</li>;
    }

    return subcategories.map((subcategory) => (
      <li key={subcategory._id} className="pl-6">
        <Link href={`/products?filter=${subcategory.name}`}>
          <span className="hover:text-primary">{subcategory.name}</span>
        </Link>
      </li>
    ));
  };

  const renderCategories = (categories) => {
    if (!categories || categories.length === 0) {
      return <li className="text-gray-500 text-center mt-2">No Categories</li>;
    }

    return categories.map((category) => (
      <Link
        href={`/products?filter=${category?.name}`}
        key={category._id}
        className="mt-3"
      >
        <div
          className="flex items-center justify-between cursor-pointer hover:text-primary ml-2 my-3 pr-2"
          onClick={() => toggleOpenKey(category._id)}
        >
          <span>{category.name}</span>
          {category.subcategories && category.subcategories.length > 0 && (
            <span className="text-sm">
              {openKeys.includes(category._id) ? (
                <DownOutlined className="text-gray-400" />
              ) : (
                <RightOutlined className="text-gray-400" />
              )}
            </span>
          )}
        </div>
        {openKeys.includes(category._id) && (
          <ul className="ml-4 border-l border-gray-200 mt-2">
            {renderSubcategories(category.subcategories)}
          </ul>
        )}
      </Link>
    ));
  };

  const renderParentCategories = () => {
    if (!categories?.results) return null;

    return categories.results
      .filter((item) => item.level === "parentCategory")
      .map((parentCategory) => (
        <Link
          href={`/products?filter=${parentCategory?.name}`}
          key={parentCategory._id}
          className="mt-4 group"
        >
          <div
            className="flex items-center justify-between cursor-pointer group-hover:text-primary border-y py-2 odd:border-b-0"
            onClick={() => toggleOpenKey(parentCategory._id)}
          >
            <span className="flex items-center gap-2">
              <Image
                src={parentCategory.attachment}
                alt={parentCategory.name}
                width={40}
                height={20}
              />
              <span>{parentCategory.name}</span>
            </span>
            {parentCategory.categories &&
              parentCategory.categories.length > 0 && (
                <span className="text-sm text-gray-400 group-hover:text-primary">
                  {openKeys.includes(parentCategory._id) ? (
                    <DownOutlined />
                  ) : (
                    <RightOutlined />
                  )}
                </span>
              )}
          </div>
          {openKeys.includes(parentCategory._id) && (
            <ul className="ml-4 border-l border-gray-200 mt-2">
              {renderCategories(parentCategory.categories)}
            </ul>
          )}
        </Link>
      ));
  };

  return (
    <aside className="bg-white rounded-lg p-4">
      <ul className="w-[300px] overflow-y-auto h-[800px] space-y-2 pr-3">
        {renderParentCategories()}
      </ul>
    </aside>
  );
};

export default SidebarCategories;
