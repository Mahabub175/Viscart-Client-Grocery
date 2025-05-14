import { useRef, useState } from "react";
import { Button, Modal } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Image from "next/image";
import dayjs from "dayjs";

const generateUniqueInvoiceId = () => {
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `INV-${randomString}${timestamp}`;
};

const OrderInvoice = ({ order }) => {
  const invoiceRef = useRef();
  const { data } = useGetAllGlobalSettingQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const downloadInvoice = async (order) => {
    const element = invoiceRef.current;

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        ignoreElements: (el) => el.classList.contains("no-pdf"),
      });

      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.save(`invoice_${order?.orderId || generateUniqueInvoiceId()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <Button
        className="capitalize font-semibold cursor-pointer"
        type="primary"
        onClick={showModal}
      >
        Generate Invoice
      </Button>

      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button
            key="download"
            type="primary"
            onClick={() => downloadInvoice(order)}
          >
            Download Invoice
          </Button>,
          <Button key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
        width={700}
      >
        <div
          className="p-8 bg-white shadow-lg rounded-lg"
          ref={invoiceRef}
          style={{
            fontFamily: "'Arial', sans-serif",
            color: "#333",
            lineHeight: "1.5",
          }}
        >
          <div className="flex justify-between items-center -mt-8 -mb-2">
            <Image
              src={data?.results?.logo}
              alt="Logo"
              width={120}
              height={120}
              className="object-contain"
            />
            <div className="font-semibold text-right">
              <p>Date: {dayjs().format("DD/MM/YYYY")}</p>
              <p>Invoice #: {generateUniqueInvoiceId()}</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Order Invoice</h1>
            <p className="text-gray-600 text-lg">
              Order ID: {order?.orderId || "N/A"}
            </p>
            <p className="text-gray-600 text-lg">
              Transaction ID: {order?.tranId || "N/A"}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
            <p>
              <strong>Name:</strong> {order?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {order?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {order?.number || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {order?.address || "N/A"}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">
                    Product
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Quantity
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody>
                {order?.products?.split(" , ")?.map((product, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{product}</td>
                    <td className="border border-gray-300 p-2">
                      {order?.quantity?.split(" , ")[index]}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order?.weight?.split(" , ")[index] &&
                      order?.weight?.split(" , ")[index] !== "0"
                        ? `${order?.weight?.split(" , ")[index]} kg`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Pricing Summary</h2>
            <p>
              <strong>Subtotal:</strong> {data?.results?.currency}{" "}
              {order?.subTotal || "0.00"}
            </p>
            <p>
              <strong>Shipping Fee:</strong> {data?.results?.currency}{" "}
              {order?.shippingFee || "0.00"}
            </p>
            <p>
              <strong>Extra Charge:</strong> {data?.results?.currency}{" "}
              {order?.extraCharge || "0.00"}
            </p>
            <p>
              <strong>Discount:</strong> -{data?.results?.currency}{" "}
              {order?.discount || "0.00"}
            </p>
            <p>
              <strong>Grand Total:</strong> {data?.results?.currency}{" "}
              {order?.grandTotal || "0.00"}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderInvoice;
