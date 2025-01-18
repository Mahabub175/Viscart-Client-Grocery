import AllProducts from "@/components/LandingPages/Products/AllProducts";

const page = (param) => {
  let filter = "";

  if (param?.searchParams) {
    filter = Object.entries(param.searchParams)
      .map(([key, value]) =>
        key.trim().toLowerCase() === "filter"
          ? value.trim()
          : `${key.trim()}${value ? ` ${value.trim()}` : ""}`
      )
      .join(" & ");
  }

  return (
    <>
      <AllProducts searchParams={filter} />
    </>
  );
};

export default page;
