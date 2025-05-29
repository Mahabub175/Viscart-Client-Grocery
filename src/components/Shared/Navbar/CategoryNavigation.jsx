import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Link from "next/link";
import { Popover } from "antd";
import { useDispatch } from "react-redux";
import { resetFilter, setFilter } from "@/redux/services/device/deviceSlice";

const CategoryNavigation = () => {
  const dispatch = useDispatch();

  const { data: categories } = useGetAllCategoriesQuery();

  const itemClickHandler = (item) => {
    if (item?.name) {
      dispatch(setFilter(item?.name));
    }
    if (item === "all") {
      dispatch(resetFilter());
    }
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
      <div key={rowIndex} className="grid grid-cols-4 gap-8 mb-4">
        {row.map((category) => (
          <div key={category._id} className="flex flex-col">
            <Link href={`/products`} className="font-semibold text-primary">
              <p onClick={() => itemClickHandler(category)}>{category.name}</p>
            </Link>
            <div className="my-2 text-sm text-gray-600">
              {category.subcategories?.map((subCategory) => (
                <Link
                  key={subCategory._id}
                  href={`/products`}
                  className="block text-gray-800 hover:text-primary mb-1"
                >
                  <p onClick={() => itemClickHandler(subCategory)}>
                    {subCategory.name}
                  </p>
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
        <Popover
          key={parentCategory._id}
          content={renderCategoriesInColumns(parentCategory)}
          placement="bottom"
          overlayClassName="shadow-lg rounded-lg"
        >
          <Link
            href={`/products`}
            className="hover:text-primary border-b-2 border-transparent hover:border-primary duration-300"
          >
            <p onClick={() => itemClickHandler(parentCategory)}>
              {parentCategory.name}
            </p>
          </Link>
        </Popover>
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
          <p onClick={() => itemClickHandler("all")}>All Products</p>
        </Link>
        {renderParentCategories()}
      </div>
    </div>
  );
};

export default CategoryNavigation;
