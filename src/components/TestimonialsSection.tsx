import { useSiteData } from "@/context/SiteDataContext";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function TestimonialsSection() {
  const { data } = useSiteData();
  const { testimonials } = data;
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.items.length / perPage);
  const visible = testimonials.items.slice(page * perPage, (page + 1) * perPage);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">{testimonials.heading}</h2>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visible.map((item, i) => (
              <div key={i} className="border border-border rounded-lg p-6 bg-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <Star key={s} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-foreground/70 leading-relaxed mb-6 min-h-[100px]">{item.text}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm tracking-wide">{item.name}</span>
                  <span className="text-xl font-bold text-secondary">G</span>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${i === page ? "bg-foreground" : "bg-foreground/30"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
