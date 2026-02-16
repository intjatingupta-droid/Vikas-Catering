import { useSiteData } from "@/context/SiteDataContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MenuPage() {
  const { data } = useSiteData();
  const { detailedMenu } = data;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative h-[30vh] md:h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${detailedMenu.heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            {detailedMenu.heroTitle}
          </h1>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-12 md:py-16 px-4 max-w-7xl mx-auto">
        {detailedMenu.categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16 md:mb-20">
            {/* Category Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary text-center mb-8 md:mb-12">
              {category.title}
            </h2>

            <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-start`}>
              {/* Single Image - Alternates left/right */}
              <div className={`${categoryIndex % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                <div className="overflow-hidden rounded-lg shadow-xl">
                  <img
                    src={category.images[0] || ''}
                    alt={category.title}
                    className="w-full h-64 md:h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Menu Items Section - Multi-column layout */}
              <div className={`${categoryIndex % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-6">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <div key={subIndex} className="break-inside-avoid">
                      <h3 className="text-base md:text-lg font-display font-bold text-foreground mb-2">
                        {subcategory.name}
                      </h3>
                      <ul className="space-y-1 ml-2">
                        {subcategory.items.map((item, itemIndex) => (
                          <li 
                            key={itemIndex}
                            className="flex items-start gap-2 text-muted-foreground text-xs md:text-sm"
                          >
                            <span className="text-primary mt-0.5 flex-shrink-0">◦</span>
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
