import { useSiteData } from "@/context/SiteDataContext";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GallerySection() {
  const { data } = useSiteData();
  const { gallery } = data;
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const next = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((c) => (c + 1) % gallery.images.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const prev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((c) => (c - 1 + gallery.images.length) % gallery.images.length);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Get 3 images: previous, current, next
  const getVisibleImages = () => {
    const total = gallery.images.length;
    if (total === 0) return [];
    if (total === 1) return [{ src: gallery.images[0], index: 0, position: 'center' }];
    if (total === 2) return [
      { src: gallery.images[0], index: 0, position: current === 0 ? 'center' : 'left' },
      { src: gallery.images[1], index: 1, position: current === 1 ? 'center' : 'right' }
    ];
    
    const prevIndex = (current - 1 + total) % total;
    const nextIndex = (current + 1) % total;
    return [
      { src: gallery.images[prevIndex], index: prevIndex, position: 'left' },
      { src: gallery.images[current], index: current, position: 'center' },
      { src: gallery.images[nextIndex], index: nextIndex, position: 'right' }
    ];
  };

  const visibleImages = getVisibleImages();

  if (gallery.images.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-20 bg-section-red text-primary-foreground relative overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">{gallery.heading}</h2>
        <p className="text-lg opacity-90 mb-12 max-w-3xl mx-auto">{gallery.description}</p>

        <div className="relative max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-6 md:gap-8">
            {/* Left Arrow */}
            {gallery.images.length > 1 && (
              <button 
                onClick={prev} 
                disabled={isAnimating}
                className="p-3 hover:opacity-70 transition-opacity z-20 flex-shrink-0 disabled:opacity-50"
                aria-label="Previous"
              >
                <ChevronLeft className="h-10 w-10 md:h-12 md:w-12" />
              </button>
            )}

            {/* Images Container */}
            <div className="flex items-center justify-center gap-4 md:gap-6 flex-1 max-w-5xl">
              {visibleImages.map((img) => (
                <div
                  key={`${img.index}-${img.position}`}
                  className={`transition-all duration-600 ease-in-out transform ${
                    img.position === 'center'
                      ? 'w-[45%] md:w-[40%] scale-100 z-10 opacity-100'
                      : 'w-[27.5%] md:w-[30%] scale-90 opacity-70'
                  }`}
                  style={{ transitionProperty: 'all' }}
                >
                  <img
                    src={img.src}
                    alt={`Work ${img.index + 1}`}
                    className="w-full h-48 md:h-72 object-cover rounded-lg shadow-2xl"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {gallery.images.length > 1 && (
              <button 
                onClick={next} 
                disabled={isAnimating}
                className="p-3 hover:opacity-70 transition-opacity z-20 flex-shrink-0 disabled:opacity-50"
                aria-label="Next"
              >
                <ChevronRight className="h-10 w-10 md:h-12 md:w-12" />
              </button>
            )}
          </div>

          {/* Dot Indicators */}
          {gallery.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {gallery.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrent(i);
                      setTimeout(() => setIsAnimating(false), 600);
                    }
                  }}
                  disabled={isAnimating}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-3 h-3 bg-primary-foreground'
                      : 'w-2 h-2 bg-primary-foreground/40 hover:bg-primary-foreground/60'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Button with gradient background */}
        <div className="w-full -mx-4 px-4 mt-12 pt-8 pb-6" style={{ 
          background: "linear-gradient(to top, rgba(234, 179, 8, 0.6) 0%, rgba(234, 179, 8, 0.2) 70%, transparent 100%)" 
        }}>
          <Link
            to="/our-work"
            className="inline-block bg-[#8B1538] hover:bg-[#A01A42] text-white px-10 py-3.5 font-bold uppercase tracking-[0.15em] text-sm transition-all shadow-xl hover:shadow-2xl"
          >
            {gallery.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
