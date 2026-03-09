import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - IELTS Flow",
  description: "Get in touch with the IELTS Flow team.",
};

export default function ContactPage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center">Contact Us</h1>
      <p className="mt-4 text-center text-muted-foreground">Have questions? We&apos;d love to hear from you.</p>
    </div>
  );
}
