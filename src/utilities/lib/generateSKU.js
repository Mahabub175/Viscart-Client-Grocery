export const generateSKU = (productName) => {
  if (!productName) throw new Error("Product name is required");

  const normalized = productName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .toUpperCase();

  const initials = normalized
    .split(" ")
    .slice(0, 3)
    .map((word) => word[0])
    .join("");

  const randomId = Math.floor(1000 + Math.random() * 9000);

  return `${initials}-${randomId}`;
};
