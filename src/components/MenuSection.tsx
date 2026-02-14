import { useSiteData } from "@/context/SiteDataContext";

export default function MenuSection() {
  const { data } = useSiteData();
  const { menu } = data;

  return (
    <section id="menu" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-semibold tracking-widest uppercase text-foreground/60 mb-2">{menu.sectionLabel}</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-center mb-12">{menu.sectionTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menu.items.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-4 flex justify-center">
                <img src={item.image} alt={item.title} className="h-48 w-48 object-cover rounded-full" loading="lazy" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
