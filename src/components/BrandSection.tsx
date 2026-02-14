import { useSiteData } from "@/context/SiteDataContext";

export default function BrandSection() {
  const { data } = useSiteData();
  const { brandSection } = data;

  return (
    <section className="py-20 bg-muted text-center">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">{brandSection.name}</h2>
        <p className="text-secondary text-lg font-display mb-6">{brandSection.subtitle}</p>
        <p className="text-foreground/70 leading-relaxed mb-8">{brandSection.description}</p>
        <a
          href="#contact"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
        >
          {brandSection.ctaText}
        </a>
      </div>
    </section>
  );
}
