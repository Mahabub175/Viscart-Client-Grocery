"use client";

import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { notFound } from "next/navigation";

const DynamicPage = ({ params }) => {
  const query = params?.slug[0]
    ?.toLowerCase()
    ?.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const pageData = globalData?.results?.[query];

  if (!pageData) {
    notFound();
  }

  return (
    <div className="mt-10 mb-20 my-container">
      <div dangerouslySetInnerHTML={{ __html: pageData }} />
    </div>
  );
};

export default DynamicPage;
