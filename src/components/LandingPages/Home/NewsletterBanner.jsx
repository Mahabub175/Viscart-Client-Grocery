"use client";

import { Button, Form, Input } from "antd";
import { LuSend } from "react-icons/lu";
import { useState } from "react";
import { useAddNewsletterMutation } from "@/redux/services/newsletter/newsletterApi";
import { toast } from "sonner";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [addNewsletter, { isLoading }] = useAddNewsletterMutation();

  const onSubmit = async () => {
    const toastId = toast.loading("Adding to newsletter...");
    const submittedData = {
      email: email,
    };

    try {
      const res = await addNewsletter(submittedData);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setEmail("");
      }
    } catch (error) {
      console.error("Error creating Attribute:", error);
    }
  };

  return (
    <section className="mt-10 my-container flex flex-col lg:flex-row justify-between items-center gap-5">
      <div className="text-center lg:text-start">
        <h3 className="text-3xl font-bold mb-2">Newsletter</h3>
        <p>Subscribe to get updates about our products.</p>
      </div>
      <div className="lg:px-10 space-y-3 pb-5 lg:py-10">
        <Form
          onFinish={onSubmit}
          className="flex items-center lg:w-[450px] relative gap-2"
        >
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            type="email"
            size="large"
            value={email}
            className="rounded-xl px-10 py-4"
            required
          />
          <LuSend className="text-xl absolute left-3" />
          <Button
            loading={isLoading}
            htmlType="submit"
            type="primary"
            className="rounded-xl font-bold lg:px-10 py-7"
          >
            Subscribe
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default NewsletterBanner;
