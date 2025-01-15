/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ProductCountCart from "@/components/LandingPages/Home/Products/ProductCountCart";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetSingleProductBySlugQuery } from "@/redux/services/product/productApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Rate } from "antd";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaPlay, FaWhatsapp } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import AttributeOptionSelector from "@/components/Shared/Product/AttributeOptionSelector";
import RelatedProducts from "./RelatedProducts";
import LinkButton from "@/components/Shared/LinkButton";

const SingleProductDetails = ({ params }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: singleProduct } = useGetSingleProductBySlugQuery(
    params?.productId
  );

  const businessWhatsapp = globalData?.results?.businessWhatsapp;

  const handleWhatsappClick = () => {
    window.open(`https://wa.me/${businessWhatsapp}`, "_blank");
  };

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentVariant, setCurrentVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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

  const currentPrice = currentVariant
    ? currentVariant?.sellingPrice
    : singleProduct?.offerPrice ?? singleProduct?.sellingPrice;

  const currentImage = selectedImage
    ? selectedImage
    : currentVariant?.images && currentVariant.images.length > 0
    ? formatImagePath(currentVariant.images[0])
    : formatImagePath(singleProduct?.mainImage);

  const allMedia =
    variantMedia.length > 0
      ? [
          ...variantMedia,
          singleProduct?.video ? "video-thumbnail" : null,
        ].filter(Boolean)
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
          singleProduct?.video ? "video-thumbnail" : null,
        ].filter(Boolean);

  const handleMediaClick = (media) => {
    if (media === "video-thumbnail") {
      setIsVideoPlaying(true);
      setSelectedImage(null);
      setVariantMedia([]);
    } else {
      setIsVideoPlaying(false);
      setSelectedImage(media);
    }
  };

  const [isMagnifying, setIsMagnifying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setIsMagnifying(true);
  };

  const handleMouseLeave = () => {
    setIsMagnifying(false);
  };
  const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func(...args);
      }
    };
  };

  const handleMouseMove = useCallback(
    throttle((e) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setMousePosition({ x, y });
    }, 50),
    []
  );

  const magnifierSize = 100;
  const zoomLevel = 2;

  return (
    <section className="py-10 -mt-20">
      <div className="bg-white">
        <div className="p-5 flex flex-col lg:flex-row items-start justify-center gap-10 mb-10 new-container pt-16 lg:pt-20">
          <div>
            <div className="relative mx-auto flex flex-col lg:flex-row-reverse items-center lg:gap-5 border p-5 rounded-xl">
              <div className="relative mx-auto lg:w-[300px] xl:w-full">
                {isVideoPlaying && singleProduct?.video ? (
                  <video
                    src={formatImagePath(singleProduct?.video)}
                    controls
                    autoPlay
                    className="mx-auto rounded-xl w-full h-auto"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : currentImage ? (
                  <>
                    <div className="hidden lg:block">
                      <div className="relative">
                        <Image
                          src={currentImage}
                          alt={singleProduct?.name}
                          width={450}
                          height={450}
                          className="object-cover"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          onMouseMove={handleMouseMove}
                        />
                      </div>

                      {isMagnifying && (
                        <div className="absolute top-0 xxl:top-[0px] -right-[120px] w-[100px] h-[80px] xxl:w-[120px] xxl:h-[120px] z-10">
                          <div
                            className="absolute w-full h-full"
                            style={{
                              backgroundImage: `url(${currentImage})`,
                              backgroundSize: `${zoomLevel * 100}%`,
                              backgroundPosition: `-${
                                mousePosition.x * zoomLevel - magnifierSize / 2
                              }px -${
                                mousePosition.y * zoomLevel - magnifierSize / 2
                              }px`,
                              width: `${zoomLevel * 200}%`,
                              height: `${zoomLevel * 200}%`,
                              backgroundRepeat: "no-repeat",
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="lg:hidden">
                      <Zoom>
                        <Image
                          src={currentImage}
                          alt="product image"
                          height={450}
                          width={450}
                          className="mx-auto rounded-xl"
                        />
                      </Zoom>
                    </div>
                  </>
                ) : (
                  <p>No image available</p>
                )}
              </div>

              <div className="flex flex-row lg:flex-col justify-start gap-2 mt-5 max-h-[400px] w-[300px] lg:w-auto xl:w-[115px] xxl:w-[125px] border rounded-xl xxl:p-2 !overflow-x-auto lg:overflow-y-auto thumbnail">
                {allMedia?.map((media, index) => (
                  <div
                    key={index}
                    onClick={() => handleMediaClick(media)}
                    className={`cursor-pointer border-2 rounded-xl ${
                      selectedImage === media ||
                      (media === "video-thumbnail" && isVideoPlaying)
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {media === "video-thumbnail" ? (
                      <div className="flex items-center justify-center rounded-xl w-20 h-20">
                        <FaPlay className="text-white text-2xl" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-center rounded-xl w-20 h-20">
                          <Image
                            src={media}
                            alt={`media ${index}`}
                            height={80}
                            width={80}
                            className="object-cover rounded-xl xl:w-[75px] xxl:w-[80px]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="border p-4 rounded-xl mt-5 max-w-[1200px]">
              <div
                dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
              ></div>
            </div>
          </div>
          <div className="lg:w-full flex flex-col text-sm lg:text-base border p-5 rounded-xl">
            <h2 className="text-xl md:text-3xl font-medium mb-2">
              {singleProduct?.name}
            </h2>
            <div className="flex items-center gap-2 border-y py-2 hover:text-primary duration-300">
              <span className="font-medium">Category:</span>
              <LinkButton
                href={`/products?filter=${singleProduct?.category?.name}`}
              >
                {singleProduct?.category?.name}
              </LinkButton>
            </div>
            {singleProduct?.brand && (
              <div className="flex items-center gap-2 border-b py-2 hover:text-primary duration-300">
                <span className="font-medium">Brand:</span>
                <LinkButton
                  href={`/products?filter=${singleProduct?.brand?.name}`}
                >
                  {singleProduct?.brand?.name}
                </LinkButton>
              </div>
            )}
            {singleProduct?.generic && (
              <div className="flex items-center gap-2 border-b py-2 hover:text-primary duration-300">
                <span className="font-medium">Generic:</span>
                <LinkButton
                  href={`/products?filter=${singleProduct?.generic?.name}`}
                >
                  {singleProduct?.generic?.name}
                </LinkButton>
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
            <div className="flex items-center gap-4 text-textColor font-medium my-2">
              Price:{" "}
              {singleProduct?.offerPrice || singleProduct?.offerPrice > 0 ? (
                <p className="text-primary text-xl">
                  {globalData?.results?.currency +
                    " " +
                    singleProduct?.offerPrice}
                </p>
              ) : (
                <p className="text-primary text-xl">
                  {globalData?.results?.currency + " " + currentPrice}
                </p>
              )}
              {(singleProduct?.offerPrice || singleProduct?.offerPrice > 0) && (
                <p className="text-base line-through text-red-500">
                  {globalData?.results?.currency +
                    " " +
                    singleProduct?.sellingPrice}
                </p>
              )}
            </div>
            <AttributeOptionSelector
              groupedAttributes={groupedAttributes}
              selectedAttributes={selectedAttributes}
              handleAttributeSelect={handleAttributeSelect}
              item={singleProduct}
            />
            <ProductCountCart
              item={singleProduct}
              previousSelectedVariant={currentVariant}
              setPreviousSelectedVariant={setCurrentVariant}
              fullWidth
              selectedPreviousAttributes={selectedAttributes}
            />
            <div
              className="w-full bg-primary px-10 py-2 text-xs lg:text-sm rounded-full shadow-xl mt-10 text-center text-white font-bold cursor-pointer"
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
      </div>
      <RelatedProducts singleProduct={singleProduct} />
    </section>
  );
};

export default SingleProductDetails;
