import { useSiteData } from "@/context/SiteDataContext";

export default function ServicesSection() {
  const { data } = useSiteData();
  const { services } = data;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-center italic mb-4">
          {services.sectionTitle}
        </h2>
        <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-12 leading-relaxed">{services.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.items.map((item, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card">
              <img src={item.image} alt={item.title} className="w-full h-56 object-cover" loading="lazy" />
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
