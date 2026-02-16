import { useSiteData } from "@/context/SiteDataContext";

export default function AboutSection() {
  const { data } = useSiteData();
  const { about } = data;

  return (
    <section id="about" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-5/12">
            <img src={about.image} alt="Award" className="w-full max-w-md mx-auto rounded shadow-lg" loading="lazy" />
          </div>
          <div className="w-full md:w-7/12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary italic leading-tight mb-4 md:mb-6">
              {about.heading}
            </h2>
            {about.paragraphs.map((p, i) => (
              <p key={i} className="text-foreground/80 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">{p}</p>
            ))}
            <a
              href="#contact"
              className="inline-block mt-4 bg-primary text-primary-foreground px-6 md:px-8 py-2.5 md:py-3 font-semibold uppercase tracking-widest text-xs md:text-sm hover:opacity-90 transition-opacity"
            >
              {about.ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
