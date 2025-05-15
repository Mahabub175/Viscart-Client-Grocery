import { Modal, Spin, Descriptions, Tag, Image } from "antd";
import moment from "moment";
import { SubmitButton } from "../Button/CustomButton";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import Link from "next/link";

const formatLabel = (label) => {
  const withSpaces = label.replace(/_/g, " ");
  const spacedLabel = withSpaces.replace(/([a-z])([A-Z])/g, "$1 $2");
  const capitalizedLabel = spacedLabel
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return <strong className="capitalize">{capitalizedLabel}</strong>;
};

const DetailsModal = ({ modalOpen, setModalOpen, title, details }) => {
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const excludedKeys = details
    ? ["__v", "updatedAt", "_id", "variants", "images", "reviews", "offers"]
    : [];

  const formatStatus = (value) => (
    <Tag color={value ? "green" : "red"} className="capitalize">
      {value ? "Active" : "Inactive"}
    </Tag>
  );

  const formatBoolean = (value) =>
    value ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>;

  const formatDate = (value) => moment(value).format("Do MMM, YYYY");

  const renderValue = (key, value) => {
    if (value === null || value === undefined) {
      return "-";
    }

    if (
      key === "video" &&
      typeof value === "string" &&
      value?.startsWith("https://www.youtube.com/embed/")
    ) {
      return (
        <Link href={value} target="_blank" className="text-blue-500 underline">
          View Video
        </Link>
      );
    }

    if (key.toLowerCase().includes("date") || key === "createdAt") {
      return formatDate(value);
    }

    if (key.toLowerCase() === "description") {
      return <div dangerouslySetInnerHTML={{ __html: value }} />;
    }

    if (typeof value === "boolean") {
      return formatBoolean(value);
    }

    if (Array.isArray(value)) {
      return (
        <div key={key} label={formatLabel(key)}>
          {value.length === 0
            ? "-"
            : value.map((item, index) =>
                typeof item === "object" ? (
                  <div
                    key={index}
                    className="my-4 grid grid-cols-1 border-t border-primary/20 first:border-0"
                  >
                    {Object.entries(item)
                      .filter(([subKey]) => !excludedKeys.includes(subKey))
                      .map(([subKey, subValue]) => (
                        <div
                          key={subKey}
                          className="flex items-center gap-2 mt-2"
                        >
                          <strong>{formatLabel(subKey)}:</strong>{" "}
                          {renderValue(subKey, subValue)}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div key={index}>{item ?? "-"}</div>
                )
              )}
        </div>
      );
    }

    if (typeof value === "object") {
      return (
        <div className="my-4 border-t border-primary/20 first:border-0">
          {Object.entries(value)
            .filter(([subKey]) => !excludedKeys.includes(subKey))
            .map(([subKey, subValue]) => (
              <div key={subKey} className="flex items-center gap-2 mt-2">
                <strong>{formatLabel(subKey)}:</strong>{" "}
                {renderValue(subKey, subValue)}
              </div>
            ))}
        </div>
      );
    }

    return value || "-";
  };

  const filteredDetails = details
    ? Object.entries(details).reduce((acc, [key, value]) => {
        if (
          !excludedKeys.includes(key) &&
          !(typeof value === "string" && value.startsWith("http"))
        ) {
          acc[key] = value;
        }
        return acc;
      }, {})
    : {};

  const urlKeys = details
    ? Object.entries(details).filter(
        ([key, value]) =>
          !excludedKeys.includes(key) &&
          typeof value === "string" &&
          value.startsWith("http") &&
          key !== "video"
      )
    : [];

  return (
    <Modal
      centered
      open={modalOpen}
      onCancel={handleCloseModal}
      footer={null}
      width={1000}
    >
      {details ? (
        <div className="p-5">
          <h2 className="text-center text-xl font-bold pb-2 w-1/3 mx-auto border-b-2 border-gray-500 mb-10">
            {title} Details
          </h2>

          <Descriptions bordered column={1}>
            {Object.entries(filteredDetails).map(([key, value]) => (
              <Descriptions.Item key={key} label={formatLabel(key)}>
                {key === "status" || key === "trending"
                  ? formatStatus(value)
                  : renderValue(key, value)}
              </Descriptions.Item>
            ))}

            {urlKeys.length > 0 &&
              urlKeys.map(([key, value]) => (
                <Descriptions.Item key={key} label={formatLabel(key)}>
                  {key === "name" ? (
                    <Link href={value} target="_blank">
                      {value}
                    </Link>
                  ) : (
                    <Image src={value} alt={key} style={{ maxWidth: 200 }} />
                  )}
                </Descriptions.Item>
              ))}

            {details?.images?.length > 0 && (
              <Descriptions.Item label={formatLabel("images")}>
                {details.images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginRight: 10,
                    }}
                  >
                    <Image
                      src={formatImagePath(image)}
                      alt={index}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                ))}
              </Descriptions.Item>
            )}
          </Descriptions>

          <div className="flex justify-end mt-10">
            <SubmitButton func={handleCloseModal} text={"Ok"} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[60vh]">
          <Spin />
        </div>
      )}
    </Modal>
  );
};

export default DetailsModal;
