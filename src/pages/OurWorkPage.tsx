import { useSiteData } from "@/context/SiteDataContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";

export default function OurWorkPage() {
  const { data } = useSiteData();
  const { ourWorkPage, testimonials, contact } = data;

  // Safety check - if ourWorkPage is undefined, show loading or error
  if (!ourWorkPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Video/Image */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        {ourWorkPage.heroMediaType === "video" && ourWorkPage.heroMedia ? (
          <>
            <video
              src={ourWorkPage.heroMedia}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${ourWorkPage.heroMedia})` }}
            ></div>
            <div className="absolute inset-0 bg-black/50"></div>
          </>
        )}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
            {ourWorkPage.heroTitle}
          </h1>
        </div>
      </section>

      {/* Masonry Gallery Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-center mb-12">
            {ourWorkPage.galleryHeading}
          </h2>
          
          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {ourWorkPage.galleryImages.map((image, index) => (
              <div
                key={index}
                className="break-inside-avoid overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </div>
  );
}
