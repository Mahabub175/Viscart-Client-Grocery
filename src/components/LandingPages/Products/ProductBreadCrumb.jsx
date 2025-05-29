/* eslint-disable react-hooks/exhaustive-deps */
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { setFilter } from "@/redux/services/device/deviceSlice";
import { useGetSingleProductBySlugQuery } from "@/redux/services/product/productApi";
import { Breadcrumb } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ProductBreadCrumb = ({ params }) => {
  const dispatch = useDispatch();

  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );
  const { data: categories } = useGetAllCategoriesQuery();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const itemClickHandler = (item) => {
    if (item?.name) {
      dispatch(setFilter(item?.name));
    }
  };

  useEffect(() => {
    if (!singleProduct || !categories) return;

    const findCategoryById = (id) =>
      categories.results.find((cat) => cat._id === id);

    const currentCategory = categories.results.find(
      (cat) => cat.name === singleProduct?.category?.name
    );

    if (!currentCategory) return;

    const hierarchy = [];

    const buildHierarchy = (category) => {
      if (!category) return;
      hierarchy.unshift({
        title: (
          <Link href={`/products`}>
            <p onClick={() => itemClickHandler(category)}>{category.name}</p>
          </Link>
        ),
      });

      if (category.parentCategory) {
        const parent = findCategoryById(category.parentCategory);
        buildHierarchy(parent);
      }
    };

    buildHierarchy(currentCategory);

    setBreadcrumbItems([
      {
        title: <Link href="/">Home</Link>,
      },
      {
        title: <Link href="/products">Products</Link>,
      },
      ...hierarchy,
    ]);
  }, [singleProduct, categories]);

  return <Breadcrumb separator=">" items={breadcrumbItems} />;
};

export default ProductBreadCrumb;
