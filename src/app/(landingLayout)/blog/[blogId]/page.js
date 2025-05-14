import SingleBlogDetails from "@/components/LandingPages/Blog/SingleBlogDetails";

const page = ({ params }) => {
  return (
    <>
      <SingleBlogDetails params={params?.blogId} />
    </>
  );
};

export default page;
