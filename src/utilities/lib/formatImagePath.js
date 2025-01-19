import { base_url_image } from "../configs/base_api";

export const formatImagePath = (imagePath) => {
  if (!imagePath) {
    return undefined;
  }

  const cleanedPath = imagePath
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\//, "");

  return `${base_url_image}${cleanedPath.replace(/\s+/g, "%20")}`;
};
