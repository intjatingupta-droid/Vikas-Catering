import { useSiteData } from "@/context/SiteDataContext";
import { Phone, ChevronDown } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Our Work", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
];

export default function Header() {
  const { data } = useSiteData();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span>⭐⭐⭐⭐⭐ Review us on Google</span>
          </div>
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wide">{data.siteName}</h1>
            <p className="text-xs uppercase tracking-[0.3em] opacity-80">{data.tagline}</p>
          </div>
          <div className="hidden md:block text-right text-sm">
            <p className="text-secondary font-semibold">Call Us Today!</p>
            <p className="text-lg font-bold">{data.phone}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center px-4">
          <button className="md:hidden absolute left-4 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <ChevronDown className={`h-5 w-5 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
          </button>
          <ul className={`${mobileOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center gap-0 md:gap-1 w-full md:w-auto absolute md:relative top-full md:top-auto left-0 bg-background md:bg-transparent border-b md:border-0 border-border z-50`}>
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="block px-5 py-4 text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
