import { base_url, base_url_client } from "@/utilities/configs/base_api";
import dayjs from "dayjs";

export default async function sitemap() {
  const routes = await getRoutes();

  if (Array.isArray(routes)) {
    return routes.map(({ url, date }) => ({
      url: `${base_url_client}${url}`,
      lastModified: date,
    }));
  } else {
    throw new Error("routes is not an array");
  }
}

async function getRoutes() {
  try {
    const productResponse = await fetch(`${base_url}/product/`);
    const products = await productResponse.json();

    const productRoutes =
      products?.data?.results?.map((product) => ({
        url: `/products/${product.slug}`,
        date: dayjs(product?.updatedAt).format("YYYY-MM-DD"),
      })) || [];

    const staticRoutes = [
      { url: "/wishlist", date: dayjs().format("YYYY-MM-DD") },
      { url: "/compare", date: dayjs().format("YYYY-MM-DD") },
      { url: "/cart", date: dayjs().format("YYYY-MM-DD") },
      { url: "/offers", date: dayjs().format("YYYY-MM-DD") },
    ];

    return [...productRoutes, ...staticRoutes];
  } catch (error) {
    console.error("Error fetching routes for sitemap:", error);
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const resProducts = await fetch(`${base_url}/product/`);
    const products = await resProducts.json();

    const productParams =
      products?.data?.results?.map((product) => ({
        __metadata_id__: [product.slug],
      })) || [];

    return productParams;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
