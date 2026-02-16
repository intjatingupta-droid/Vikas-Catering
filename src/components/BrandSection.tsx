import { useSiteData } from "@/context/SiteDataContext";

export default function BrandSection() {
  const { data } = useSiteData();
  const { brandSection } = data;

  return (
    <section className="py-12 md:py-20 bg-muted text-center">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary mb-2">{brandSection.name}</h2>
        <p className="text-secondary text-base md:text-lg font-display mb-4 md:mb-6">{brandSection.subtitle}</p>
        <p className="text-foreground/70 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">{brandSection.description}</p>
        <a
          href="#contact"
          className="inline-block bg-primary text-primary-foreground px-6 md:px-8 py-2.5 md:py-3 font-semibold uppercase tracking-widest text-xs md:text-sm hover:opacity-90 transition-opacity"
        >
          {brandSection.ctaText}
        </a>
      </div>
    </section>
  );
}
