import { useSiteData } from "@/context/SiteDataContext";
import { useState } from "react";

export default function ContactSection() {
  const { data } = useSiteData();
  const { contact } = data;
  const [form, setForm] = useState({ name: "", email: "", phone: "", people: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your enquiry! We will get back to you soon.");
    setForm({ name: "", email: "", phone: "", people: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-12 max-w-2xl mx-auto">
          {/* Visit Us */}
          <div>
            <h2 className="text-2xl font-display font-bold text-primary mb-2">{contact.visitHeading}</h2>
            <h3 className="text-xl font-display font-bold mb-4">{contact.officeLabel}</h3>
            <p className="text-foreground/70 mb-4 leading-relaxed">{data.address}</p>
            <p className="mb-2"><span className="font-bold">Phone No:</span> {data.phone}</p>
            <p className="mb-6"><span className="font-bold">Email Id:</span> {data.email}</p>
            <div className="w-full h-64 bg-border rounded overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.4!2d77.97!3d27.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEwJzEyLjAiTiA3N8KwNTgnMTIuMCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Map"
              />
            </div>
          </div>

          {/* Enquiry Form - HIDDEN */}
          {/* <div>
            <h2 className="text-2xl font-display font-bold text-primary mb-6">{contact.enquireHeading}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "name", placeholder: "Name", type: "text" },
                { key: "email", placeholder: "Email", type: "email" },
                { key: "phone", placeholder: "Phone No", type: "tel" },
                { key: "people", placeholder: "No. of People", type: "text" },
              ].map((field) => (
                <input
                  key={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border border-border rounded px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              ))}
              <textarea
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full border border-border rounded px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 font-semibold text-lg hover:opacity-90 transition-opacity rounded"
              >
                Send
              </button>
            </form>
          </div> */}
        </div>
      </div>
    </section>
  );
}
