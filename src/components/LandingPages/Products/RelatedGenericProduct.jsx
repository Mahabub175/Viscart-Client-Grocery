"use client";

import LinkButton from "@/components/Shared/LinkButton";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";

const RelatedGenericProducts = ({ singleProduct }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results?.filter((item) => {
    const isGenericMatch =
      item?.generic &&
      singleProduct?.generic &&
      item.generic.name === singleProduct.generic.name;

    return (
      item?.status !== "Inactive" &&
      item?.name !== singleProduct?.name &&
      isGenericMatch
    );
  });

  return (
    <section className="border-t mt-10">
      <div className="mt-5 space-y-3">
        {activeProducts?.map((item) => (
          <div key={item?._id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={formatImagePath(item?.mainImage)}
                alt={item?.name}
                height={60}
                width={60}
                className="border p-2 rounded-xl"
                priority
              />
              <div>
                <LinkButton href={`/products/${item?.slug}`}>
                  <Tooltip placement="top" title={item?.name}>
                    <h2 className="text-sm text-start md:text-base hover:text-gray-500 duration-300 mb-1">
                      {item?.name.length > 30
                        ? item.name.slice(0, 30).concat("...")
                        : item.name}
                    </h2>
                  </Tooltip>
                </LinkButton>
                {item?.brand ? (
                  <Link href={`/products?filter=${item?.brand?.name}`}>
                    <p className="text-gray-500 text-sm">
                      By {item?.brand?.name}
                    </p>
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(item?.offerPrice || item?.offerPrice > 0) && (
                <p className="text-sm line-through text-red-500">
                  {globalData?.results?.currency + " " + item?.sellingPrice}
                </p>
              )}
              {item?.offerPrice || item?.offerPrice > 0 ? (
                <p className="text-primary">
                  {globalData?.results?.currency + " " + item?.offerPrice}
                </p>
              ) : (
                <p className="text-primary">
                  {globalData?.results?.currency + " " + item?.sellingPrice}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedGenericProducts;
