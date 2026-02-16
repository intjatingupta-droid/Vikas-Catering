import React, { useState } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaFacebook, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { API_ENDPOINTS } from "@/config/api";

export default function ContactPage() {
  const { data } = useSiteData();
  const [form, setForm] = useState({ name: "", email: "", phone: "", people: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", people: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert(result.message || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${data.hero.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2 md:mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Let's Create Memorable Moments!
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary text-center mb-8 md:mb-12">
            Reach Out to Us
          </h2>
          
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            {/* Address */}
            <div className="space-y-2">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-relaxed px-4">
                {data.address}
              </p>
            </div>

            {/* Phone Numbers */}
            <div className="space-y-2 md:space-y-3">
              <a href={`tel:${data.phone}`} className="block text-2xl sm:text-3xl md:text-4xl font-bold text-foreground hover:text-primary transition-colors">
                {data.phone}
              </a>
              {data.contact.alternatePhone && (
                <a href={`tel:${data.contact.alternatePhone}`} className="block text-2xl sm:text-3xl md:text-4xl font-bold text-foreground hover:text-primary transition-colors">
                  {data.contact.alternatePhone}
                </a>
              )}
            </div>

            {/* Social Media */}
            <div className="flex items-center justify-center gap-2 md:gap-3 pt-4">
              {data.footer.socials.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 md:w-14 md:h-14 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-80 transition-opacity"
                  aria-label={social.platform}
                >
                  {social.platform === 'facebook' && <FaFacebook className="h-5 w-5 md:h-6 md:w-6" />}
                  {social.platform === 'youtube' && <FaYoutube className="h-5 w-5 md:h-6 md:w-6" />}
                  {social.platform === 'instagram' && <FaInstagram className="h-5 w-5 md:h-6 md:w-6" />}
                  {social.platform === 'whatsapp' && <FaWhatsapp className="h-5 w-5 md:h-6 md:w-6" />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section - HIDDEN */}
      {/* <section id="contact-form" className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-primary text-center mb-8">
              Send Us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 bg-background p-8 rounded-lg shadow-lg">
              {submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  Thank you for your enquiry! We will get back to you soon.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border rounded px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={submitting}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-border rounded px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-border rounded px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={submitting}
                />
                <input
                  type="text"
                  placeholder="Number of People"
                  value={form.people}
                  onChange={(e) => setForm({ ...form, people: e.target.value })}
                  className="w-full border border-border rounded px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={submitting}
                />
              </div>

              <textarea
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full border border-border rounded px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
                disabled={submitting}
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section> */}

      {/* Map Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary text-center mb-6 md:mb-8">
            Find Us Here
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="w-full h-64 md:h-96 bg-border rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.7891234567!2d77.98765432109876!3d27.169876543210987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747121d702ff6d%3A0x8a9b7c6d5e4f3a2b!2s306%2C%20Sector%2015-B%2C%20Kar%20Kunj%20Chauraha%2C%20Avas%20Vikas%20Colony%2C%20Sikandra%2C%20Agra%2C%20Uttar%20Pradesh%20282007!5e0!3m2!1sen!2sin!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Vikas Caterings Location"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href="https://maps.app.goo.gl/RSwrcBE42uuiUc8r9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-sm md:text-base"
              >
                <span>📍</span> Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
