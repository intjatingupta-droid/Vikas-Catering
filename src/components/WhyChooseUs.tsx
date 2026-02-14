import { useSiteData } from "@/context/SiteDataContext";
import { Check } from "lucide-react";

export default function WhyChooseUs() {
  const { data } = useSiteData();
  const { whyChooseUs, gallery } = data;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary italic mb-6">{whyChooseUs.heading}</h2>
            {whyChooseUs.paragraphs.map((p, i) => (
              <p key={i} className="text-foreground/70 leading-relaxed mb-4">{p}</p>
            ))}
            <ul className="mt-4 space-y-3">
              {whyChooseUs.points.map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-3">
              {gallery.images.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className={`w-full object-cover rounded shadow ${i === 0 ? "h-48 col-span-2" : "h-40"}`}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
