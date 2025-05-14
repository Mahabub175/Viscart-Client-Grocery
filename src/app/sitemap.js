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
    // Fetch product data
    const productResponse = await fetch(`${base_url}/product/`);
    const products = await productResponse.json();

    const productRoutes =
      products?.data?.results?.map((product) => ({
        url: `/products/${product.slug}`,
        date: dayjs(product?.updatedAt).format("YYYY-MM-DD"),
      })) || [];

    // Fetch blog data
    const blogResponse = await fetch(`${base_url}/blog/`);
    const blogs = await blogResponse.json();

    const blogRoutes =
      blogs?.data?.results?.map((blog) => ({
        url: `/blogs/${blog.slug}`,
        date: dayjs(blog?.updatedAt).format("YYYY-MM-DD"),
      })) || [];

    const staticRoutes = [
      { url: "/wishlist", date: dayjs().format("YYYY-MM-DD") },
      { url: "/compare", date: dayjs().format("YYYY-MM-DD") },
      { url: "/cart", date: dayjs().format("YYYY-MM-DD") },
      { url: "/offers", date: dayjs().format("YYYY-MM-DD") },
    ];

    return [...productRoutes, ...blogRoutes, ...staticRoutes];
  } catch (error) {
    console.error("Error fetching routes for sitemap:", error);
    return [];
  }
}

export async function generateStaticParams() {
  try {
    // Fetch product params
    const resProducts = await fetch(`${base_url}/product/`);
    const products = await resProducts.json();

    const productParams =
      products?.data?.results?.map((product) => ({
        __metadata_id__: [product.slug],
      })) || [];

    // Fetch blog params
    const resBlogs = await fetch(`${base_url}/blog/`);
    const blogs = await resBlogs.json();

    const blogParams =
      blogs?.data?.results?.map((blog) => ({
        __metadata_id__: [blog.slug],
      })) || [];

    return [...productParams, ...blogParams];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
