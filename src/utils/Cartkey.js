export function buildVariantKey(productId, colorId) {
  return colorId ? `${productId}::${colorId}` : productId;
}
 