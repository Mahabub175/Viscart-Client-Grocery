import dynamic from "next/dynamic";

const AdminBlog = dynamic(
  () => import("@/components/Dashboard/Admin/Blog/AdminBlog"),
  {
    ssr: false,
  }
);

export default function AdminBlogPage() {
  return <AdminBlog />;
}
