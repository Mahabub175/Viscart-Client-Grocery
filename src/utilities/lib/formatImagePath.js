import { base_url_image } from "../configs/base_api";

export const formatImagePath = (imagePath) => {
  if (!imagePath) {
    return undefined;
  }

  return `${base_url_image}${imagePath?.replace(/\/$/, "/")}`;
};
