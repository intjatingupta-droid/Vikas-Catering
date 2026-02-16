import { useSiteData } from "@/context/SiteDataContext";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ServicesSection() {
  const { data } = useSiteData();
  const { services } = data;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / services.items.length;
      container.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
    }
  };

  const next = () => {
    const nextIndex = (activeIndex + 1) % services.items.length;
    scrollToIndex(nextIndex);
  };

  const prev = () => {
    const prevIndex = (activeIndex - 1 + services.items.length) % services.items.length;
    scrollToIndex(prevIndex);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.scrollWidth / services.items.length;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [services.items.length]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (services.items.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-center italic mb-4">
          {services.sectionTitle}
        </h2>
        <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-12 leading-relaxed">
          {services.description}
        </p>
        
        {/* Horizontal Scrollable Container with Drag */}
        <div className="relative">
          {/* Left Arrow */}
          {services.items.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-2 rounded-full bg-primary text-primary-foreground hover:opacity-80 transition-opacity shadow-lg"
              aria-label="Previous service"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 cursor-grab select-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {services.items.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[85%] md:w-[45%] lg:w-[30%] snap-center"
              >
                <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card h-full pointer-events-none">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-56 object-cover"
                    loading="lazy"
                    draggable="false"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-display font-bold text-primary mb-3">
                      {item.title}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {services.items.length > 1 && (
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-2 rounded-full bg-primary text-primary-foreground hover:opacity-80 transition-opacity shadow-lg"
              aria-label="Next service"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Dot Indicators */}
          {services.items.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {services.items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
