import { useSiteData } from "@/context/SiteDataContext";
import { Link } from "react-router-dom";

export default function MenuSection() {
  const { data } = useSiteData();
  const { menu } = data;

  // Limit to max 6 items for homepage display
  const displayItems = menu.items.slice(0, 6);

  return (
    <section id="menu" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-semibold tracking-widest uppercase text-foreground/60 mb-2">{menu.sectionLabel}</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary text-center mb-16">{menu.sectionTitle}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayItems.map((item, i) => (
            <div key={i} className="group">
              <div className="bg-card rounded-lg p-8 hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center">
                {/* Circular Image */}
                <div className="relative mb-6 overflow-hidden rounded-full w-48 h-48 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    loading="lazy" 
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-display font-bold text-primary mb-3">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-foreground/70 text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>
                
                {/* Read More Button */}
                <Link
                  to="/menu"
                  className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide transition-all shadow-md hover:shadow-lg"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Menu Button */}
        {menu.items.length > 6 && (
          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3.5 rounded-full font-bold text-base uppercase tracking-wide transition-all shadow-lg hover:shadow-xl"
            >
              View Full Menu
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
