"use client";

import AttributeOptionSelector from "@/components/Shared/Product/AttributeOptionSelector";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetSingleProductBySlugQuery } from "@/redux/services/product/productApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Rate } from "antd";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaWhatsapp } from "react-icons/fa";
import "react-medium-image-zoom/dist/styles.css";
import { toast } from "sonner";
import ProductDetailsSlider from "./ProductDetailsSlider";
import ProductReview from "./ProductReview";
import SingleProductCart from "./SingleProductCart";

const SinglePageCart = ({ params }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );

  const businessWhatsapp = globalData?.results?.businessWhatsapp;

  const handleWhatsappClick = () => {
    window.open(`https://wa.me/${businessWhatsapp}`, "_blank");
  };

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const [count, setCount] = useState(1);
  const [variantMedia, setVariantMedia] = useState([]);

  const groupedAttributes = singleProduct?.variants?.reduce((acc, variant) => {
    variant.attributeCombination.forEach((attribute) => {
      const attributeName = attribute.attribute.name;
      if (!acc[attributeName]) {
        acc[attributeName] = [];
      }
      if (!acc[attributeName].some((opt) => opt.name === attribute.name)) {
        acc[attributeName].push({
          name: attribute.name,
          label: attribute.label || attribute.name,
          _id: attribute._id,
        });
      }
    });
    return acc;
  }, {});

  const handleAttributeSelect = (attributeName, option) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0) {
      setCurrentVariant(null);
      setVariantMedia([]);
    } else {
      const updatedVariant = singleProduct?.variants.find((variant) =>
        Object.entries(selectedAttributes).every(
          ([attrName, selectedValue]) => {
            return variant.attributeCombination.some(
              (attr) =>
                attr.attribute.name === attrName && attr.name === selectedValue
            );
          }
        )
      );
      setCurrentVariant(updatedVariant);

      if (updatedVariant?.images) {
        setVariantMedia(
          updatedVariant.images.map((image) => formatImagePath(image))
        );
      } else {
        setVariantMedia([]);
      }
    }
  }, [selectedAttributes, singleProduct]);

  const allMedia =
    variantMedia.length > 0
      ? [...variantMedia].filter(Boolean)
      : [
          singleProduct?.mainImage
            ? formatImagePath(singleProduct.mainImage)
            : null,
          ...(Array.isArray(singleProduct?.images)
            ? singleProduct.images.map((image) =>
                image ? formatImagePath(image) : null
              )
            : []),
          ...(Array.isArray(singleProduct?.variants)
            ? singleProduct.variants.flatMap((variant) =>
                Array.isArray(variant.images)
                  ? variant.images.map((image) =>
                      image ? formatImagePath(image) : null
                    )
                  : []
              )
            : []),
        ].filter(Boolean);
  const handleCount = (action) => {
    if (action === "increment") {
      setCount((prev) => prev + 1);
    } else if (action === "decrement") {
      if (count > 1) {
        setCount((prev) => prev - 1);
      } else {
        toast.info("Count cannot be less than one");
      }
    }
  };

  const isOutOfStock = singleProduct?.stock <= 0 || currentVariant?.stock <= 0;
  return (
    <section className="my-container py-10 -mt-5 lg:-mt-0">
      <div className="border-2 border-primary rounded-xl p-5 mb-10 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 mb-10">
          <div className="relative mx-auto flex flex-col lg:flex-row-reverse items-center lg:gap-5">
            <ProductDetailsSlider allMedia={allMedia} />
          </div>
          <div className="lg:w-1/2 flex flex-col gap-3">
            <h2 className="text-xl lg:text-3xl font-medium">
              {singleProduct?.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="font-medium">Category:</span>
              <span>{singleProduct?.category?.name}</span>
            </div>
            {singleProduct?.brand && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Brand:</span>
                <span>{singleProduct?.brand?.name}</span>
              </div>
            )}
            <div className="flex items-center mt-4 gap-4 font-medium">
              <Rate
                disabled
                value={singleProduct?.ratings?.average}
                allowHalf
              />
              ({singleProduct?.ratings?.count})
            </div>
            <div className="flex items-center gap-4 text-textColor font-bold my-2">
              Price:{" "}
              {currentVariant ? (
                currentVariant.offerPrice > 0 ? (
                  <>
                    <p className="text-base line-through text-red-500">
                      {globalData?.results?.currency +
                        " " +
                        currentVariant.sellingPrice}
                    </p>
                    <p className="text-primary text-xl">
                      {globalData?.results?.currency +
                        " " +
                        currentVariant.offerPrice}
                    </p>
                  </>
                ) : (
                  <p className="text-primary text-xl">
                    {globalData?.results?.currency +
                      " " +
                      currentVariant.sellingPrice}
                  </p>
                )
              ) : singleProduct?.offerPrice > 0 ? (
                <>
                  <p className="text-base line-through text-red-500">
                    {globalData?.results?.currency +
                      " " +
                      singleProduct?.sellingPrice}
                  </p>
                  <p className="text-primary text-xl">
                    {globalData?.results?.currency +
                      " " +
                      singleProduct?.offerPrice}
                  </p>
                </>
              ) : (
                <p className="text-primary text-xl">
                  {globalData?.results?.currency +
                    " " +
                    singleProduct?.sellingPrice}
                </p>
              )}
            </div>

            {singleProduct?.isVariant && (
              <AttributeOptionSelector
                groupedAttributes={groupedAttributes}
                selectedAttributes={selectedAttributes}
                handleAttributeSelect={handleAttributeSelect}
                item={singleProduct}
              />
            )}
            {!isOutOfStock ? (
              <>
                <div className="flex items-center justify-start w-[7.5rem] gap-3 border border-primary rounded-xl p-1.5 mt-5">
                  <button
                    className="cursor-pointer bg-primaryLight p-2 rounded text-xl text-primary"
                    onClick={() => handleCount("decrement")}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-base font-bold text-textColor">
                    {count}
                  </span>
                  <button
                    className="cursor-pointer bg-primaryLight p-2 rounded text-xl text-primary"
                    onClick={() => handleCount("increment")}
                  >
                    <FaPlus />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded font-bold text-xs z-10">
                Out Of Stock
              </div>
            )}
            <div
              className="w-full bg-primary px-10 py-2 text-sm rounded-full shadow-xl mt-10 text-center text-white font-bold cursor-pointer"
              onClick={handleWhatsappClick}
            >
              <p>Click To Place a Order With Just a Phone Call</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <FaWhatsapp className="text-2xl" />
                <p>{businessWhatsapp}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <SingleProductCart
            item={currentVariant ?? singleProduct}
            count={count}
            productId={singleProduct?._id}
            productName={singleProduct?.name}
          />
        </div>
      </div>
      <div className="border-2 border-primary rounded-xl p-5 mb-10 shadow-xl bg-white">
        <div className="bg-primary mb-10 px-10 py-2 text-white font-bold rounded-xl inline-block">
          Description
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
        ></div>
        {singleProduct?.video && (
          <div>
            <iframe
              width="100%"
              height="500"
              src={singleProduct?.video}
              title="video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-fit lg:h-[500px] mt-5"
            />
          </div>
        )}
      </div>
      <div className="rounded-xl p-5 mb-10 shadow bg-white/80 border">
        <div className="bg-primary px-10 py-2 text-white font-bold rounded-xl inline-block">
          Reviews
        </div>
        <ProductReview data={singleProduct?.reviews} />
      </div>
    </section>
  );
};

export default SinglePageCart;
