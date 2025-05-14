import { smallFeatureData } from "@/assets/data/smallFeatureData";
import Image from "next/image";
import React from "react";

const SmallFeature = () => {
  return (
    <section className="my-container bg-grey p-10 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-10">
        {smallFeatureData?.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 justify-center bg-white rounded-xl p-5"
          >
            <Image src={item?.image} alt={item?.name} width={60} height={60} />
            <div>
              <h3 className="text-base font-bold mb-1">{item?.name}</h3>
              <p className="text-textColor text-sm">{item?.feature}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SmallFeature;
