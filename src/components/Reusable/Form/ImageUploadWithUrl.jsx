import { base_url } from "@/utilities/configs/base_api";
import { compressImage } from "@/utilities/lib/compressImage";
import Image from "next/image";
import { useState, useRef } from "react";
import { FaImage, FaCopy, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const ImageUploaderWithUrl = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const compressedImage = await compressImage(file);

      const formData = new FormData();

      formData.append("file", compressedImage);

      const toastId = toast.loading("Uploading Image...");
      try {
        setLoading(true);
        const response = await fetch(`${base_url}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload the image");
        }

        const result = await response.json();
        setImageUrl(result.file.url);

        toast.success("Image uploaded successfully!", { id: toastId });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.", {
          id: toastId,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopyUrl = () => {
    if (imageUrl) {
      navigator.clipboard
        .writeText(imageUrl)
        .then(() => {
          toast.success("Image URL copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy the URL. Please try again.");
        });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border border-dashed rounded-lg border-gray-400 mb-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden sr-only"
        onChange={handleFileChange}
        aria-label="Upload Image File"
      />
      {loading ? (
        <p className="text-blue-500 mb-2">Uploading...</p>
      ) : imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt="Uploaded"
            height={200}
            width={200}
            className="rounded-md mb-2"
          />
          <div className="flex gap-4">
            <button
              type="button"
              className="bg-primary text-white px-4 py-2 rounded-md"
              onClick={handleCopyUrl}
              aria-label="Copy Image URL"
            >
              <FaCopy className="inline mr-2" />
              Copy URL
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={handleReset}
              aria-label="Delete Image"
            >
              <FaTrash className="inline mr-2" />
              Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <FaImage className="text-7xl mb-2" />
          <p className="text-gray-500 mb-2">Click to upload image</p>
          <button
            type="button"
            className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={handleUploadClick}
            aria-label="Upload Image"
          >
            Upload Image
          </button>
        </>
      )}
    </div>
  );
};

export default ImageUploaderWithUrl;
