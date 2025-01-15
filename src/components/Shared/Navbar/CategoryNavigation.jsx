import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Link from "next/link";
import { useState } from "react";

const CategoryNavigation = () => {
  const { data: categories } = useGetAllCategoriesQuery();
  const [hoveredParent, setHoveredParent] = useState(null);

  const handleMouseEnter = (parentCategory) => {
    setHoveredParent(parentCategory._id);
  };

  const handleMouseLeave = () => {
    setHoveredParent(null);
  };

  const renderCategoriesInColumns = (parentCategory) => {
    const categoriesToDisplay = parentCategory.categories || [];
    const columnCount = 4;
    const rows = Math.ceil(categoriesToDisplay.length / columnCount);

    const categoryChunks = Array.from({ length: rows }, (_, rowIndex) =>
      categoriesToDisplay.slice(
        rowIndex * columnCount,
        rowIndex * columnCount + columnCount
      )
    );

    if (!categoriesToDisplay.length)
      return <div className="text-center">No Categories Available</div>;

    return categoryChunks.map((row, rowIndex) => (
      <div key={rowIndex} className="flex gap-8 mb-4">
        {row.map((category) => (
          <div key={category._id} className="flex flex-col">
            <Link
              href={`/products?filter=${category.name}`}
              className="font-semibold text-primary"
            >
              {category.name}
            </Link>
            <div className="mt-2 text-sm text-gray-600">
              {category.subcategories?.map((subCategory) => (
                <Link
                  key={subCategory._id}
                  href={`/products?filter=${subCategory.name}`}
                  className="block hover:text-gray-800"
                >
                  {subCategory.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  const renderParentCategories = () =>
    categories?.results
      ?.filter((item) => item.level === "parentCategory")
      .map((parentCategory) => (
        <div
          key={parentCategory._id}
          onMouseEnter={() => handleMouseEnter(parentCategory)}
          onMouseLeave={handleMouseLeave}
          className="relative cursor-pointer"
        >
          <Link href={`/products?filter=${parentCategory?.name}`} className="">
            <span
              className={`hover:text-primary border-b-2 border-transparent hover:border-primary duration-300 ${
                hoveredParent === parentCategory._id && "text-primary"
              }`}
            >
              {parentCategory.name}
            </span>
          </Link>
          {hoveredParent === parentCategory._id && (
            <div className="absolute -left-52 top-4 mt-2 py-10 px-4 bg-white shadow-lg rounded-lg xl:w-[500px] z-10">
              {renderCategoriesInColumns(parentCategory)}
            </div>
          )}
        </div>
      ));

  return (
    <div className="-mt-5 lg:-mt-0 px-8">
      <div className="flex flex-col lg:flex-row gap-5 lg:items-center justify-center xl:justify-start flex-wrap py-4 text-sm">
        <Link
          href={"/"}
          className="hover:text-primary border-b-2 border-transparent hover:border-primary duration-300"
        >
          Home
        </Link>
        <Link
          href={"/offers"}
          className="hover:text-primary border-b-2 border-transparent hover:border-primary duration-300"
        >
          Offers
        </Link>
        <Link
          href={"/products"}
          className="hover:text-primary border-b-2 border-transparent hover:border-primary duration-300"
        >
          All Products
        </Link>
        {renderParentCategories()}
      </div>
    </div>
  );
};

export default CategoryNavigation;
