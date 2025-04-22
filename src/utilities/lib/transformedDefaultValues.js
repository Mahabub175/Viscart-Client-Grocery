import dayjs from "dayjs";
import { formatImagePath } from "./formatImagePath";

const excludedKeys = [];

export const transformDefaultValues = (defaultValue, selectedData) => {
  if (!defaultValue) return [];
  const fields = [];

  const selectedDataMap = (
    Array.isArray(selectedData) ? selectedData : []
  ).reduce((acc, { name, value }) => {
    acc[name] = value || "";
    return acc;
  }, {});

  const processValue = (key, value) => {
    if (value === "true") return true;
    if (value === "false") return false;

    if (
      key.includes("publishedAt") ||
      key.includes("expiredDate") ||
      key.includes("startDate") ||
      key.includes("endDate")
    ) {
      const parsedDate = dayjs(value, "YYYY-MM-DD");
      return parsedDate.isValid() ? parsedDate : null;
    }

    if (Array.isArray(value) && typeof value[0] === "number") {
      return value;
    }

    if (Array.isArray(value)) {
      if (key === "images") {
        return value.map((url, index) => ({
          url: formatImagePath(url),
          uid: `__AUTO__${Date.now()}_${index}__`,
        }));
      } else {
        return value.length > 0 ? value[0] : null;
      }
    }

    if (
      typeof value === "string" &&
      value.startsWith("http") &&
      [
        "logo",
        "attachment",
        "image",
        "favicon",
        "storeImage",
        "mainImage",
        "images",
        "popUpImage",
      ].some((substring) => key.includes(substring)) &&
      !excludedKeys.includes(key)
    ) {
      return [{ url: value }];
    }

    return value;
  };

  for (const key in defaultValue) {
    if (!defaultValue.hasOwnProperty(key)) continue;

    const value = defaultValue[key];

    if (Array.isArray(value) && typeof value[0] === "object") {
      value.forEach((item, index) => {
        for (const nestedKey in item) {
          const fieldName = `${key}[${index}].${nestedKey}`;
          const fieldValue =
            selectedDataMap[fieldName] !== undefined
              ? selectedDataMap[fieldName]
              : processValue(nestedKey, item[nestedKey]);

          fields.push({
            name: fieldName,
            value: fieldValue,
            errors: "",
          });
        }
      });
    } else {
      const fieldValue =
        selectedDataMap[key] !== undefined
          ? selectedDataMap[key]
          : processValue(key, value);

      fields.push({
        name: key,
        value: fieldValue,
        errors: "",
      });
    }
  }

  // Include any additional fields from selectedData not already present
  if (Array.isArray(selectedData)) {
    selectedData.forEach((data) => {
      if (!fields.some((field) => field.name === data.name)) {
        fields.push(data);
      }
    });
  }

  return fields;
};
