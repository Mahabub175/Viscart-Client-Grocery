"use client";

import { useGetAllBlogsQuery } from "@/redux/services/blog/blogApi";
import { Input, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";

const AllBlogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: blogsData, isLoading } = useGetAllBlogsQuery();

  const activeBlogs = blogsData?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const filteredBlogs = activeBlogs?.filter((blog) =>
    blog.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="my-container mt-10 mb-20">
      <div className="lg:flex justify-between mt-10 relative">
        <div></div>
        <div>
          <Input
            size="large"
            label="Search..."
            value={searchTerm}
            className="bg-white/70 rounded-full"
            placeholder="Search Blogs..."
            suffix={<CiSearch className="text-black text-2xl" />}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Spin size="large" />
        </div>
      ) : filteredBlogs?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 justify-center items-center mt-10">
          {filteredBlogs.map((item) => (
            <div
              key={item?._id}
              className="bg-white rounded-xl shadow-lg h-full lg:w-[400px] mx-auto group"
            >
              <div className="w-full h-[300px] overflow-hidden rounded-t-xl">
                <Image
                  src={item?.attachment}
                  alt={item?.title ?? "something"}
                  width={400}
                  height={600}
                  className="mx-auto h-[300px] object-cover border-b group-hover:scale-105 duration-500"
                />
              </div>
              <div className="px-6 mt-6 pb-2">
                <h4 className="text-2xl font-bold mb-4 mt-4">{item?.name}</h4>
                <div className="text-textColor mb-5">
                  {item?.shortDescription?.slice(0, 100)}
                </div>
                <Link href={`/blog/${item?.slug}`}>
                  <button className="w-full text-primaryLight py-3 rounded-xl bg-black">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600 mt-20">
          No blogs available.
        </div>
      )}
    </section>
  );
};

export default AllBlogs;
