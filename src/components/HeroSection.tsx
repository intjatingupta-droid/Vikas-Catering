import { useSiteData } from "@/context/SiteDataContext";

export default function HeroSection() {
  const { data } = useSiteData();
  const { hero } = data;

  return (
    <section className="relative min-h-[80vh] flex items-center">
      {hero.videoUrl ? (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={hero.videoUrl}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-foreground/60" />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <p className="text-primary-foreground/80 text-lg mb-3 font-body text-shadow">{hero.welcomeText}</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6 text-shadow">
            {hero.heading}
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed text-shadow">{hero.description}</p>
          <a
            href="#menu"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity border border-primary-foreground/30"
          >
            {hero.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
