export function normaliseAwin(raw) {
  return {
    id: `awin-${raw.aw_product_id}`,
    title: raw.product_name,
    price: `£${parseFloat(raw.search_price).toFixed(2)}`,
    image: raw.merchant_image_url,
    brand: raw.brand_name,
    retailer: raw.merchant_name,
    productUrl: raw.aw_deep_link,
    category: raw.category_name,
    color: raw.colour,
  };
}

export function normaliseRakuten(raw) {
  const item = raw.item;
  return {
    id: `rakuten-${item.ItemID}`,
    title: item.ItemName,
    price: `£${parseFloat(item.ItemPrice).toFixed(2)}`,
    image: item.ImageURL,
    brand: item.Brand,
    retailer: item.Retailer,
    productUrl: item.ItemURL,
    category: item.Category,
    color: item.Color,
  };
}

export function normaliseImpact(raw) {
  return {
    id: `impact-${raw.imp_id}`,
    title: raw.name,
    price: `£${parseFloat(raw.price_gbp).toFixed(2)}`,
    image: raw.img,
    brand: raw.brand,
    retailer: raw.store,
    productUrl: raw.url,
    category: raw.product_type,
    color: raw.primary_colour,
  };
}
