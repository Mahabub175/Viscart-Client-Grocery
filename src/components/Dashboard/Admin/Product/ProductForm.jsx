import CustomButtonInput from "@/components/Reusable/Form/CustomButtonInput";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { Checkbox, Form } from "antd";
import { RiRefreshLine } from "react-icons/ri";
import { VariantComponent } from "./VariantComponent";
import CustomTextEditor from "@/components/Reusable/Form/CustomTextEditor";
import CustomVideoUploader from "@/components/Reusable/Form/VideoUploader";
import MultipleFileUploader from "@/components/Reusable/Form/MultipleFIleUploader";
import { useGetAllGenericsQuery } from "@/redux/services/generic/genericApi";
import { useGetAllUnitsQuery } from "@/redux/services/unit/unitApi";

const ProductForm = ({
  attachment,
  handleVariantProduct,
  data,
  videoData,
  onChange,
  content,
  setContent,
}) => {
  const form = Form.useFormInstance();

  const isVariant = Form.useWatch("isVariant", form);

  const { data: brandData, isFetching: isBrandFetching } =
    useGetAllBrandsQuery();

  const brandOptions = brandData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  const { data: genericData, isFetching: isGenericFetching } =
    useGetAllGenericsQuery();

  const genericOptions = genericData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  const { data: unitData, isFetching: isUnitFetching } = useGetAllUnitsQuery();

  const unitOptions = unitData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

  const { data: categoryData, isFetching: isCategoryFetching } =
    useGetAllCategoriesQuery();

  const categoryOptions = categoryData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name + " " + `(${item?.level.toUpperCase()})`,
    }));

  const generateRandomCode = () => {
    const randomNumbers = Math.floor(100000 + Math.random() * 900000);
    return `${randomNumbers}`;
  };

  const generate = () => {
    const randomCode = generateRandomCode();
    form.setFieldsValue({ sku: randomCode });
  };

  return (
    <>
      <div className="three-grid">
        <div className="col-span-2">
          <CustomInput
            label={"Product Name"}
            name={"name"}
            type={"text"}
            required={true}
          />
        </div>
        <CustomButtonInput
          label="SKU Code"
          type={"text"}
          required={true}
          name={"sku"}
          placeholder={"Generate SKU Code"}
          onClick={generate}
          icon={<RiRefreshLine className="text-xl" />}
        />
      </div>
      <div className="three-grid">
        <CustomSelect
          label={"Product Brand"}
          name={"brand"}
          options={brandOptions}
          loading={isBrandFetching}
          disabled={isBrandFetching}
        />
        <CustomSelect
          label={"Product Category"}
          name={"category"}
          options={categoryOptions}
          required={true}
          loading={isCategoryFetching}
          disabled={isCategoryFetching}
        />
        <CustomSelect
          label={"Product Generic"}
          name={"generic"}
          options={genericOptions}
          loading={isGenericFetching}
          disabled={isGenericFetching}
        />
        <CustomInput label={"Product Weight"} name={"weight"} type={"number"} />
        <CustomSelect
          label={"Product Unit"}
          name={"unit"}
          options={unitOptions}
          loading={isUnitFetching}
          disabled={isUnitFetching}
        />
        <CustomInput
          label={"Product Purchase Point"}
          name={"point"}
          type={"number"}
        />
      </div>

      <CustomSelect label={"Product Tags"} name={"tags"} mode={"tags"} />

      <div className="two-grid">
        <CustomInput
          label={"Product Buying Price"}
          name={"buyingPrice"}
          type={"number"}
        />
        <CustomInput
          label={"Product Selling Price"}
          name={"sellingPrice"}
          type={"number"}
          required={true}
        />
        <CustomInput
          label={"Product Offer Price"}
          name={"offerPrice"}
          type={"number"}
          required={false}
        />
        {!isVariant && (
          <CustomInput
            label={"Product Stock"}
            name={"stock"}
            type={"number"}
            required={true}
          />
        )}
      </div>
      <CustomVideoUploader
        name="video"
        label="Product Video"
        required={true}
        onChange={onChange}
        defaultValue={videoData}
      />
      <FileUploader
        defaultValue={attachment}
        label="Product Main Image"
        name="mainImage"
        required={true}
      />

      <MultipleFileUploader name={"images"} label={"Product Images"} />

      <Form.Item label={"Product Description"} name={"description"} required>
        <CustomTextEditor value={content} onChange={setContent} />
      </Form.Item>

      <Form.Item name={"isFeatured"} valuePropName="checked">
        <Checkbox className="font-semibold">This Product Is Featured</Checkbox>
      </Form.Item>

      <Form.Item name={"isVariant"} valuePropName="checked">
        <Checkbox className="font-semibold">
          This Product Has Variations
        </Checkbox>
      </Form.Item>

      {isVariant && (
        <VariantComponent onCustomSubmit={handleVariantProduct} data={data} />
      )}
    </>
  );
};

export default ProductForm;
