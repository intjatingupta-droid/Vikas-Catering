import { useSiteData } from "@/context/SiteDataContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Menu", href: "/menu" },
  { label: "Our Work", href: "/our-work" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const { data } = useSiteData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    
    // If it's a hash link and we're not on home page, navigate to home first
    if (href.startsWith("/#") && location.pathname !== "/") {
      window.location.href = href;
    }
  };

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between py-2 md:py-3 px-4">
          <div className="hidden md:block flex-1"></div>
          <div className="text-center flex-1">
            {data.useLogo && data.logoUrl ? (
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <img 
                  src={data.logoUrl} 
                  alt={data.siteName}
                  className="h-10 md:h-12 mx-auto cursor-pointer hover:opacity-90 transition-opacity"
                />
              </Link>
            ) : (
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-display font-bold tracking-wide cursor-pointer hover:opacity-90 transition-opacity">
                  {data.siteName}
                </h1>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-80">{data.tagline}</p>
              </Link>
            )}
          </div>
          <div className="flex-1 text-right text-xs md:text-sm">
            <p className="text-secondary font-semibold hidden md:block">Call Us Today!</p>
            <a href={`tel:${data.phone}`} className="text-sm md:text-lg font-bold hover:opacity-80 transition-opacity">{data.phone}</a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 relative">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 p-2 z-50" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.href.startsWith("/") && !item.href.includes("#") ? (
                  <Link
                    to={item.href}
                    className="block px-4 lg:px-5 py-4 text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="block px-4 lg:px-5 py-4 text-sm font-medium tracking-wide text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Navigation */}
          <div className={`md:hidden ${mobileOpen ? "block" : "hidden"}`}>
            <ul className="flex flex-col py-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.href.startsWith("/") && !item.href.includes("#") ? (
                    <Link
                      to={item.href}
                      className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors border-b border-border last:border-0"
                      onClick={() => handleNavClick(item.href)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors border-b border-border last:border-0"
                      onClick={() => handleNavClick(item.href)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Spacer for mobile to maintain height */}
          <div className="md:hidden h-12"></div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}
