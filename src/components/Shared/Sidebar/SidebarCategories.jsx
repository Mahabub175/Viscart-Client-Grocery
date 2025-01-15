"use client";

import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";

const SidebarCategories = () => {
  const { data: categories } = useGetAllCategoriesQuery();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (categoryId) => {
    setOpenDropdown((prev) => (prev === categoryId ? null : categoryId));
  };

  const renderSubcategories = (subcategories) => {
    if (!subcategories || subcategories.length === 0)
      return <div className="text-gray-500">No Subcategories</div>;

    return (
      <ul className="ml-4 pl-4 border-l border-gray-200">
        {subcategories.map((subcategory) => (
          <li key={subcategory._id}>
            <Link
              href={`/products?filter=${subcategory.name}`}
              className="block hover:text-primary"
            >
              {subcategory.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderCategories = (categories) => {
    if (!categories || categories.length === 0)
      return (
        <div className="text-gray-500 text-center mt-2">No Categories</div>
      );

    return (
      <ul className="ml-4 pl-4 border-l border-gray-200">
        {categories.map((category) => (
          <li key={category._id} className="relative">
            <Link
              href={`/products?filter=${category.name}`}
              onClick={() => toggleDropdown(category._id)}
              className="flex items-center justify-between cursor-pointer hover:text-primary mt-5"
            >
              <span>{category.name}</span>
              {category.subcategories && category.subcategories.length > 0 && (
                <span className="ml-2 text-sm text-gray-400">
                  {openDropdown === category._id ? (
                    <FiChevronDown size={18} />
                  ) : (
                    <FiChevronRight size={18} />
                  )}
                </span>
              )}
            </Link>
            {openDropdown === category._id &&
              renderSubcategories(category.subcategories)}
          </li>
        ))}
      </ul>
    );
  };

  const renderParentCategories = () =>
    categories?.results
      ?.filter((item) => item.level === "parentCategory")
      .map((parentCategory) => (
        <li key={parentCategory._id} className="relative">
          <Link
            href={`/products?filter=${parentCategory?.name}`}
            onClick={() => toggleDropdown(parentCategory._id)}
            className="flex items-center justify-between group cursor-pointer w-[300px] border-y pt-4 odd:border-b-0"
          >
            <span className="flex items-center gap-2">
              <Image
                src={parentCategory.attachment}
                alt={parentCategory.name}
                width={30}
                height={20}
              />
              <span className="text-base group-hover:text-primary duration-300">
                {parentCategory.name}
              </span>
            </span>
            {parentCategory.categories &&
              parentCategory.categories.length > 0 && (
                <span className="ml-2 text-sm text-gray-400 group-hover:text-primary duration-300">
                  {openDropdown === parentCategory._id ? (
                    <FiChevronDown size={18} />
                  ) : (
                    <FiChevronRight size={18} />
                  )}
                </span>
              )}
          </Link>
          {openDropdown === parentCategory._id &&
            renderCategories(parentCategory.categories)}
        </li>
      ));

  return (
    <nav className="bg-white rounded-lg p-4">
      <ul className="space-y-3">
        <li>
          <ul className="mt-2 space-y-5 overflow-y-auto h-[800px]">
            {renderParentCategories()}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default SidebarCategories;
