import { useSiteData } from "@/context/SiteDataContext";
import { Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

export default function Footer() {
  const { data } = useSiteData();
  const { footer } = data;

  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-bold text-background mb-4">{data.siteName}</h3>
            <p className="text-sm leading-relaxed">{footer.description}</p>
          </div>

          <div>
            <h4 className="font-bold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {footer.quickLinks.map((link, i) => (
                <li key={i}><a href={link.href} className="hover:text-secondary transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-background mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              {footer.services.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm mb-1"><span className="font-bold text-background">Address:</span> {data.address}</p>
            <p className="text-sm mb-1"><span className="font-bold text-background">Phone:</span> {data.phone}</p>
            <p className="text-sm mb-4"><span className="font-bold text-background">Email:</span> {data.email}</p>
            <div className="flex gap-4">
              {footer.socials.map((s, i) => {
                const Icon = iconMap[s.platform] || MessageCircle;
                return (
                  <a key={i} href={s.url} className="hover:text-secondary transition-colors">
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-background/20 py-4 text-center text-sm">
        Copyright © {new Date().getFullYear()} {data.siteName} |
      </div>
    </footer>
  );
}
