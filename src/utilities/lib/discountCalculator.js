export const calculateDiscountPercentage = (sellingPrice, offerPrice) => {
  if (offerPrice && sellingPrice) {
    return Math.round(((sellingPrice - offerPrice) / sellingPrice) * 100);
  }
  return 0;
};
