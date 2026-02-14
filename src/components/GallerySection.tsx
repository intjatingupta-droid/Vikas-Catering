import { useSiteData } from "@/context/SiteDataContext";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GallerySection() {
  const { data } = useSiteData();
  const { gallery } = data;
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % gallery.images.length);
  const prev = () => setCurrent((c) => (c - 1 + gallery.images.length) % gallery.images.length);

  return (
    <section id="gallery" className="py-20 bg-section-red text-primary-foreground relative overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{gallery.heading}</h2>
        <p className="opacity-80 mb-10 max-w-2xl mx-auto">{gallery.description}</p>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <button onClick={prev} className="p-2 hover:opacity-70 transition-opacity">
              <ChevronLeft className="h-8 w-8" />
            </button>
            <div className="flex gap-4 overflow-hidden">
              {gallery.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Work ${i + 1}`}
                  className={`h-64 md:h-80 w-auto object-cover rounded-lg transition-all duration-300 ${
                    i === current ? "scale-105 shadow-2xl z-10" : "opacity-60 scale-95"
                  }`}
                  loading="lazy"
                />
              ))}
            </div>
            <button onClick={next} className="p-2 hover:opacity-70 transition-opacity">
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8" style={{ background: "linear-gradient(to top, hsl(42 80% 50%), transparent)" }}>
          <a
            href="#contact"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity border border-primary-foreground/30"
          >
            {gallery.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
