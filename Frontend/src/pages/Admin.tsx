import { useState, useRef } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { SiteData } from "@/data/siteData";
import { Save, RotateCcw, ChevronRight, Edit3, Plus, Trash2, ArrowLeft, Upload, Link as LinkIcon, X, LogOut, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { API_ENDPOINTS } from "@/config/api";

type SectionKey = keyof SiteData;

const sectionLabels: { key: SectionKey | "contacts"; label: string }[] = [
  { key: "hero", label: "Hero Section" },
  { key: "about", label: "About Section" },
  { key: "brandSection", label: "Brand Section" },
  { key: "services", label: "Services / Occasions" },
  { key: "menu", label: "Menu Section (Homepage)" },
  { key: "detailedMenu", label: "Detailed Menu Page" },
  { key: "whyChooseUs", label: "Why Choose Us" },
  { key: "gallery", label: "Gallery (Homepage)" },
  { key: "ourWorkPage", label: "Our Work Page" },
  { key: "testimonials", label: "Testimonials" },
  { key: "contact", label: "Contact Section Labels" },
  { key: "contacts", label: "📧 Contact Submissions" },
  { key: "footer", label: "Footer" },
];

const topLevelFields: { key: keyof SiteData; label: string; type?: string }[] = [
  { key: "siteName", label: "Site Name" },
  { key: "tagline", label: "Tagline" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
];

export default function AdminPage() {
  const { data, updateData, updateSection, resetToDefaults } = useSiteData();
  const [activeSection, setActiveSection] = useState<SectionKey | "general" | "contacts" | null>(null);
  const [saved, setSaved] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [newContactsCount, setNewContactsCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.contacts, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setContacts(result.contacts);
        const newCount = result.contacts.filter((c: any) => c.status === 'new').length;
        setNewContactsCount(newCount);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoadingContacts(false);
    }
  };

  // Auto-fetch contacts on mount and every 30 seconds
  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.contactUpdate(id), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchContacts();
        toast.success('Status updated');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.contactDelete(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchContacts();
        toast.success('Contact deleted');
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const renderGeneralFields = () => (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-base md:text-lg font-semibold mb-4">Business Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-1">Business Name</label>
            <input
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground text-sm"
              value={data.siteName}
              onChange={(e) => updateData({ siteName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-1">Tagline</label>
            <input
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground text-sm"
              value={data.tagline}
              onChange={(e) => updateData({ tagline: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-base md:text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-1">Phone Number</label>
            <input
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground text-sm"
              value={data.phone}
              onChange={(e) => updateData({ phone: e.target.value })}
              placeholder="090584 81865"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground text-sm"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="info@vikascaterings.com"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold mb-1">Office Address</label>
            <textarea
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground resize-none text-sm"
              rows={3}
              value={data.address}
              onChange={(e) => updateData({ address: e.target.value })}
              placeholder="Full address with city, state, pincode"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-base md:text-lg font-semibold mb-4">Logo Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="useLogo"
              checked={data.useLogo}
              onChange={(e) => updateData({ useLogo: e.target.checked })}
              className="h-4 w-4"
            />
            <label htmlFor="useLogo" className="text-xs md:text-sm font-semibold">
              Use Logo instead of Business Name
            </label>
          </div>
          
          {data.useLogo && (
            <>
              <MediaField
                label="Logo Image"
                value={data.logoUrl}
                onChange={(v) => updateData({ logoUrl: v })}
                accept="image/*"
                hint="Upload your logo (recommended size: 200x60px)"
              />
              {data.logoUrl && (
                <div className="border border-border rounded p-4 bg-muted">
                  <p className="text-xs font-semibold mb-2">Logo Preview:</p>
                  <img src={data.logoUrl} alt="Logo" className="h-12 object-contain" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <button onClick={showSaved} className="bg-primary text-primary-foreground px-4 md:px-6 py-2 rounded font-semibold flex items-center gap-2 text-sm md:text-base">
        <Save className="h-4 w-4" /> Save Changes
      </button>
    </div>
  );

  const renderHeroEditor = () => {
    const hero = { ...data.hero };
    const update = (patch: Partial<typeof hero>) => updateSection("hero", { ...hero, ...patch });
    return (
      <div className="space-y-4">
        <Field label="Welcome Text" value={hero.welcomeText} onChange={(v) => update({ welcomeText: v })} />
        <Field label="Heading" value={hero.heading} onChange={(v) => update({ heading: v })} textarea />
        <Field label="Description" value={hero.description} onChange={(v) => update({ description: v })} textarea />
        <Field label="CTA Text" value={hero.ctaText} onChange={(v) => update({ ctaText: v })} />
        <MediaField
          label="Background Image"
          value={hero.backgroundImage}
          onChange={(v) => update({ backgroundImage: v })}
          accept="image/*"
        />
        <MediaField
          label="Hero Video"
          value={hero.videoUrl}
          onChange={(v) => update({ videoUrl: v })}
          accept="video/*"
          hint="Leave empty to show background image instead"
        />
        {hero.videoUrl && (
          <div className="rounded overflow-hidden border border-border">
            <video src={hero.videoUrl} controls loop muted className="w-full max-h-48 object-cover" />
          </div>
        )}
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderAboutEditor = () => {
    const about = { ...data.about };
    const update = (patch: Partial<typeof about>) => updateSection("about", { ...about, ...patch });
    return (
      <div className="space-y-4">
        <Field label="Heading" value={about.heading} onChange={(v) => update({ heading: v })} textarea />
        {about.paragraphs.map((p, i) => (
          <Field key={i} label={`Paragraph ${i + 1}`} value={p} onChange={(v) => {
            const newP = [...about.paragraphs];
            newP[i] = v;
            update({ paragraphs: newP });
          }} textarea />
        ))}
        <MediaField
          label="About Image"
          value={about.image}
          onChange={(v) => update({ image: v })}
          accept="image/*"
        />
        <Field label="CTA Text" value={about.ctaText} onChange={(v) => update({ ctaText: v })} />
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderBrandEditor = () => {
    const b = { ...data.brandSection };
    const update = (patch: Partial<typeof b>) => updateSection("brandSection", { ...b, ...patch });
    return (
      <div className="space-y-4">
        <Field label="Name" value={b.name} onChange={(v) => update({ name: v })} />
        <Field label="Subtitle" value={b.subtitle} onChange={(v) => update({ subtitle: v })} />
        <Field label="Description" value={b.description} onChange={(v) => update({ description: v })} textarea />
        <Field label="CTA Text" value={b.ctaText} onChange={(v) => update({ ctaText: v })} />
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderServicesEditor = () => {
    const s = { ...data.services };
    const update = (patch: Partial<typeof s>) => updateSection("services", { ...s, ...patch });
    return (
      <div className="space-y-4">
        <Field label="Section Title" value={s.sectionTitle} onChange={(v) => update({ sectionTitle: v })} />
        <Field label="Description" value={s.description} onChange={(v) => update({ description: v })} textarea />
        {s.items.map((item, i) => (
          <div key={i} className="border border-border rounded p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Service {i + 1}</span>
              <button onClick={() => { const items = s.items.filter((_, j) => j !== i); update({ items }); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
            <Field label="Title" value={item.title} onChange={(v) => { const items = [...s.items]; items[i] = { ...items[i], title: v }; update({ items }); }} />
            <Field label="Description" value={item.description} onChange={(v) => { const items = [...s.items]; items[i] = { ...items[i], description: v }; update({ items }); }} textarea />
            <MediaField
              label="Service Image"
              value={item.image}
              onChange={(v) => { const items = [...s.items]; items[i] = { ...items[i], image: v }; update({ items }); }}
              accept="image/*"
            />
          </div>
        ))}
        <button onClick={() => update({ items: [...s.items, { title: "New Service", description: "", image: "" }] })} className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Plus className="h-4 w-4" /> Add Service
        </button>
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderMenuEditor = () => {
    const m = { ...data.menu };
    const update = (patch: Partial<typeof m>) => updateSection("menu", { ...m, ...patch });
    return (
      <div className="space-y-4">
        <Field label="Section Label" value={m.sectionLabel} onChange={(v) => update({ sectionLabel: v })} />
        <Field label="Section Title" value={m.sectionTitle} onChange={(v) => update({ sectionTitle: v })} />
        {m.items.map((item, i) => (
          <div key={i} className="border border-border rounded p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Menu Item {i + 1}</span>
              <button onClick={() => { const items = m.items.filter((_, j) => j !== i); update({ items }); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
            <Field label="Title" value={item.title} onChange={(v) => { const items = [...m.items]; items[i] = { ...items[i], title: v }; update({ items }); }} />
            <Field label="Description" value={item.description} onChange={(v) => { const items = [...m.items]; items[i] = { ...items[i], description: v }; update({ items }); }} textarea />
            <MediaField
              label="Menu Item Image"
              value={item.image}
              onChange={(v) => { const items = [...m.items]; items[i] = { ...items[i], image: v }; update({ items }); }}
              accept="image/*"
            />
          </div>
        ))}
        <button onClick={() => update({ items: [...m.items, { title: "New Item", description: "", image: "" }] })} className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Plus className="h-4 w-4" /> Add Menu Item
        </button>
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderDetailedMenuEditor = () => {
    const dm = { ...data.detailedMenu };
    const update = (patch: Partial<typeof dm>) => updateSection("detailedMenu", { ...dm, ...patch });
    
    return (
      <div className="space-y-6">
        <Field label="Hero Title" value={dm.heroTitle} onChange={(v) => update({ heroTitle: v })} />
        <MediaField
          label="Hero Image"
          value={dm.heroImage}
          onChange={(v) => update({ heroImage: v })}
          accept="image/*"
        />
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Menu Categories</h3>
          {dm.categories.map((category, catIndex) => (
            <div key={catIndex} className="border border-border rounded p-4 mb-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Category {catIndex + 1}</span>
                <button 
                  onClick={() => {
                    const categories = dm.categories.filter((_, i) => i !== catIndex);
                    update({ categories });
                  }} 
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <Field 
                label="Category Title" 
                value={category.title} 
                onChange={(v) => {
                  const categories = [...dm.categories];
                  categories[catIndex] = { ...categories[catIndex], title: v };
                  update({ categories });
                }} 
              />
              
              {/* Single Category Image */}
              <div className="space-y-2">
                <MediaField
                  label="Category Image"
                  value={category.images[0] || ''}
                  onChange={(v) => {
                    const categories = [...dm.categories];
                    categories[catIndex].images = [v];
                    update({ categories });
                  }}
                  accept="image/*"
                />
                {category.images[0] && (
                  <div className="rounded overflow-hidden border border-border">
                    <img src={category.images[0]} alt={category.title} className="w-full max-h-48 object-cover" />
                  </div>
                )}
              </div>
              
              {/* Subcategories */}
              <div className="space-y-3 mt-4">
                <label className="block text-sm font-semibold">Subcategories</label>
                {category.subcategories.map((sub, subIndex) => (
                  <div key={subIndex} className="border border-muted rounded p-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <input
                        className="flex-1 border border-border rounded px-2 py-1 bg-background text-foreground text-sm font-semibold"
                        value={sub.name}
                        placeholder="Subcategory name"
                        onChange={(e) => {
                          const categories = [...dm.categories];
                          const subcategories = [...categories[catIndex].subcategories];
                          subcategories[subIndex] = { ...subcategories[subIndex], name: e.target.value };
                          categories[catIndex] = { ...categories[catIndex], subcategories };
                          update({ categories });
                        }}
                      />
                      <button
                        onClick={() => {
                          const categories = [...dm.categories];
                          const subcategories = categories[catIndex].subcategories.filter((_, i) => i !== subIndex);
                          categories[catIndex] = { ...categories[catIndex], subcategories };
                          update({ categories });
                        }}
                        className="text-destructive ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Items */}
                    <div className="space-y-1 pl-4">
                      {sub.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <input
                            className="flex-1 border border-border rounded px-2 py-1 bg-background text-foreground text-xs"
                            value={item}
                            placeholder="Menu item"
                            onChange={(e) => {
                              const categories = [...dm.categories];
                              const subcategories = [...categories[catIndex].subcategories];
                              const items = [...subcategories[subIndex].items];
                              items[itemIndex] = e.target.value;
                              subcategories[subIndex] = { ...subcategories[subIndex], items };
                              categories[catIndex] = { ...categories[catIndex], subcategories };
                              update({ categories });
                            }}
                          />
                          <button
                            onClick={() => {
                              const categories = [...dm.categories];
                              const subcategories = [...categories[catIndex].subcategories];
                              const items = subcategories[subIndex].items.filter((_, i) => i !== itemIndex);
                              subcategories[subIndex] = { ...subcategories[subIndex], items };
                              categories[catIndex] = { ...categories[catIndex], subcategories };
                              update({ categories });
                            }}
                            className="text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const categories = [...dm.categories];
                          const subcategories = [...categories[catIndex].subcategories];
                          subcategories[subIndex].items.push("");
                          categories[catIndex] = { ...categories[catIndex], subcategories };
                          update({ categories });
                        }}
                        className="flex items-center gap-1 text-primary font-semibold text-xs"
                      >
                        <Plus className="h-3 w-3" /> Add Item
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const categories = [...dm.categories];
                    categories[catIndex].subcategories.push({ name: "New Subcategory", items: [] });
                    update({ categories });
                  }}
                  className="flex items-center gap-2 text-primary font-semibold text-xs"
                >
                  <Plus className="h-3 w-3" /> Add Subcategory
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              const categories = [...dm.categories, {
                title: "New Category",
                images: [],
                subcategories: []
              }];
              update({ categories });
            }}
            className="flex items-center gap-2 text-primary font-semibold text-sm"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
        
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderWhyChooseUsEditor = () => {
    const w = { ...data.whyChooseUs };
    const update = (patch: Partial<typeof w>) => updateSection("whyChooseUs", { ...w, ...patch });
    return (
      <div className="space-y-4">
        <Field label="Heading" value={w.heading} onChange={(v) => update({ heading: v })} />
        {w.paragraphs.map((p, i) => (
          <Field key={i} label={`Paragraph ${i + 1}`} value={p} onChange={(v) => { const paragraphs = [...w.paragraphs]; paragraphs[i] = v; update({ paragraphs }); }} textarea />
        ))}
        <div className="border border-border rounded p-4 space-y-2">
          <span className="font-semibold text-sm">Points</span>
          {w.points.map((pt, i) => (
            <div key={i} className="flex gap-2">
              <input className="flex-1 border border-border rounded px-3 py-1 bg-background text-foreground text-sm" value={pt} onChange={(e) => { const points = [...w.points]; points[i] = e.target.value; update({ points }); }} />
              <button onClick={() => update({ points: w.points.filter((_, j) => j !== i) })} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button onClick={() => update({ points: [...w.points, "New Point"] })} className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Plus className="h-4 w-4" /> Add Point
          </button>
        </div>
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderGalleryEditor = () => {
    const g = { ...data.gallery };
    const update = (patch: Partial<typeof g>) => updateSection("gallery", { ...g, ...patch });
    return (
      <div className="space-y-4">
        <Field label="Heading" value={g.heading} onChange={(v) => update({ heading: v })} />
        <Field label="Description" value={g.description} onChange={(v) => update({ description: v })} textarea />
        <Field label="CTA Text" value={g.ctaText} onChange={(v) => update({ ctaText: v })} />
        <div className="border border-border rounded p-4 space-y-3">
          <span className="font-semibold text-sm">Gallery Images</span>
          {g.images.map((img, i) => (
            <div key={i} className="border border-muted rounded p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Image {i + 1}</span>
                <button onClick={() => update({ images: g.images.filter((_, j) => j !== i) })} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <MediaField
                label=""
                value={img}
                onChange={(v) => { const images = [...g.images]; images[i] = v; update({ images }); }}
                accept="image/*"
              />
            </div>
          ))}
          <button onClick={() => update({ images: [...g.images, ""] })} className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Plus className="h-4 w-4" /> Add Image
          </button>
        </div>
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderTestimonialsEditor = () => {
    const t = { ...data.testimonials };
    const update = (patch: Partial<typeof t>) => updateSection("testimonials", { ...t, ...patch });
    return (
      <div className="space-y-4">
        <Field label="Heading" value={t.heading} onChange={(v) => update({ heading: v })} />
        {t.items.map((item, i) => (
          <div key={i} className="border border-border rounded p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Testimonial {i + 1}</span>
              <button onClick={() => update({ items: t.items.filter((_, j) => j !== i) })} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
            <Field label="Name" value={item.name} onChange={(v) => { const items = [...t.items]; items[i] = { ...items[i], name: v }; update({ items }); }} />
            <Field label="Review" value={item.text} onChange={(v) => { const items = [...t.items]; items[i] = { ...items[i], text: v }; update({ items }); }} textarea />
            <div>
              <label className="block text-sm font-semibold mb-1">Rating</label>
              <select className="border border-border rounded px-3 py-2 bg-background text-foreground" value={item.rating} onChange={(e) => { const items = [...t.items]; items[i] = { ...items[i], rating: Number(e.target.value) }; update({ items }); }}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>
          </div>
        ))}
        <button onClick={() => update({ items: [...t.items, { name: "New Reviewer", text: "", rating: 5 }] })} className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderContactEditor = () => {
    const c = { ...data.contact };
    const update = (patch: Partial<typeof c>) => updateSection("contact", { ...c, ...patch });
    return (
      <div className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            💡 <strong>Tip:</strong> The contact information (phone, email, address) is managed in the "General Info" section.
            Here you can customize the section headings and labels.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Visit Section Heading</label>
            <input
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
              value={c.visitHeading}
              onChange={(e) => update({ visitHeading: e.target.value })}
              placeholder="Visit Us"
            />
            <p className="text-xs text-muted-foreground mt-1">Main heading for the visit/location section</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Office Label</label>
            <input
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
              value={c.officeLabel}
              onChange={(e) => update({ officeLabel: e.target.value })}
              placeholder="Head Office Address"
            />
            <p className="text-xs text-muted-foreground mt-1">Label above the address</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Enquiry Form Heading</label>
            <input
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
              value={c.enquireHeading}
              onChange={(e) => update({ enquireHeading: e.target.value })}
              placeholder="Enquire Now"
            />
            <p className="text-xs text-muted-foreground mt-1">Heading for the contact form</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Alternate Phone Number (Optional)</label>
            <input
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
              value={c.alternatePhone || ""}
              onChange={(e) => update({ alternatePhone: e.target.value })}
              placeholder="Additional phone number"
            />
            <p className="text-xs text-muted-foreground mt-1">Optional second phone number for contact page</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-2">Current Contact Information Preview:</h3>
          <div className="bg-muted p-4 rounded space-y-2 text-sm">
            <p><strong>Phone:</strong> {data.phone}</p>
            {c.alternatePhone && <p><strong>Alternate Phone:</strong> {c.alternatePhone}</p>}
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Address:</strong> {data.address}</p>
            <p className="text-xs text-muted-foreground mt-2">
              To change these, go to "General Info" section
            </p>
          </div>
        </div>

        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>
    );
  };

  const renderFooterEditor = () => {
    const f = { ...data.footer };
    const update = (patch: Partial<typeof f>) => updateSection("footer", { ...f, ...patch });
    return (
      <div className="space-y-4">
        <Field label="Description" value={f.description} onChange={(v) => update({ description: v })} textarea />
        
        <div className="border border-border rounded p-4 space-y-2">
          <span className="font-semibold text-sm">Services List</span>
          {f.services.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className="flex-1 border border-border rounded px-3 py-1 bg-background text-foreground text-sm" value={s} onChange={(e) => { const services = [...f.services]; services[i] = e.target.value; update({ services }); }} />
              <button onClick={() => update({ services: f.services.filter((_, j) => j !== i) })} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button onClick={() => update({ services: [...f.services, "New Service"] })} className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Plus className="h-4 w-4" /> Add Service
          </button>
        </div>

        <div className="border border-border rounded p-4 space-y-3">
          <span className="font-semibold text-sm">Social Media Links</span>
          {f.socials.map((social, i) => (
            <div key={i} className="border border-muted rounded p-3 space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold capitalize">{social.platform}</span>
                <button onClick={() => update({ socials: f.socials.filter((_, j) => j !== i) })} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Platform</label>
                <select
                  className="w-full border border-border rounded px-3 py-1 bg-background text-foreground text-sm"
                  value={social.platform}
                  onChange={(e) => {
                    const socials = [...f.socials];
                    socials[i] = { ...socials[i], platform: e.target.value };
                    update({ socials });
                  }}
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">URL</label>
                <input
                  className="w-full border border-border rounded px-3 py-1 bg-background text-foreground text-sm"
                  value={social.url}
                  placeholder="https://facebook.com/yourpage"
                  onChange={(e) => {
                    const socials = [...f.socials];
                    socials[i] = { ...socials[i], url: e.target.value };
                    update({ socials });
                  }}
                />
              </div>
            </div>
          ))}
          <button onClick={() => update({ socials: [...f.socials, { platform: "facebook", url: "#" }] })} className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Plus className="h-4 w-4" /> Add Social Media
          </button>
        </div>

        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderOurWorkPageEditor = () => {
    const ow = { ...data.ourWorkPage };
    const update = (patch: Partial<typeof ow>) => updateSection("ourWorkPage", { ...ow, ...patch });
    
    return (
      <div className="space-y-6">
        <Field label="Hero Title" value={ow.heroTitle} onChange={(v) => update({ heroTitle: v })} />
        
        <div>
          <label className="block text-sm font-semibold mb-2">Hero Media Type</label>
          <select 
            className="border border-border rounded px-3 py-2 bg-background text-foreground"
            value={ow.heroMediaType}
            onChange={(e) => update({ heroMediaType: e.target.value as "image" | "video" })}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <MediaField
          label={`Hero ${ow.heroMediaType === "video" ? "Video" : "Image"}`}
          value={ow.heroMedia}
          onChange={(v) => update({ heroMedia: v })}
          accept={ow.heroMediaType === "video" ? "video/*" : "image/*"}
        />

        {ow.heroMedia && (
          <div className="rounded overflow-hidden border border-border">
            {ow.heroMediaType === "video" ? (
              <video src={ow.heroMedia} controls loop muted className="w-full max-h-64 object-cover" />
            ) : (
              <img src={ow.heroMedia} alt="Hero" className="w-full max-h-64 object-cover" />
            )}
          </div>
        )}

        <Field label="Gallery Heading" value={ow.galleryHeading} onChange={(v) => update({ galleryHeading: v })} />

        <div className="border border-border rounded p-4 space-y-3">
          <span className="font-semibold text-sm">Gallery Images</span>
          {ow.galleryImages.map((img, i) => (
            <div key={i} className="border border-muted rounded p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Image {i + 1}</span>
                <button onClick={() => update({ galleryImages: ow.galleryImages.filter((_, j) => j !== i) })} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <MediaField
                label=""
                value={img}
                onChange={(v) => { const galleryImages = [...ow.galleryImages]; galleryImages[i] = v; update({ galleryImages }); }}
                accept="image/*"
              />
            </div>
          ))}
          <button onClick={() => update({ galleryImages: [...ow.galleryImages, ""] })} className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Plus className="h-4 w-4" /> Add Image
          </button>
        </div>

        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
      </div>
    );
  };

  const renderContactsViewer = () => {
    if (contacts.length === 0 && !loadingContacts) {
      fetchContacts();
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold">Contact Form Submissions</h3>
            <p className="text-sm text-muted-foreground">View and manage customer inquiries</p>
          </div>
          <button
            onClick={fetchContacts}
            disabled={loadingContacts}
            className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loadingContacts ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {loadingContacts ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading submissions...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">No contact submissions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className={`border rounded-lg p-6 ${
                  contact.status === 'new'
                    ? 'bg-blue-50 border-blue-200'
                    : contact.status === 'read'
                    ? 'bg-background border-border'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(contact.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={contact.status}
                      onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                      className="border border-border rounded px-3 py-1 text-sm bg-background"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
                    </select>
                    <button
                      onClick={() => deleteContact(contact._id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">Email:</span>
                    <p className="text-sm">{contact.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground">Phone:</span>
                    <p className="text-sm">{contact.phone}</p>
                  </div>
                  {contact.people && (
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">Number of People:</span>
                      <p className="text-sm">{contact.people}</p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs font-semibold text-muted-foreground">Message:</span>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{contact.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const editors: Record<string, () => JSX.Element> = {
    general: renderGeneralFields,
    hero: renderHeroEditor,
    about: renderAboutEditor,
    brandSection: renderBrandEditor,
    services: renderServicesEditor,
    menu: renderMenuEditor,
    detailedMenu: renderDetailedMenuEditor,
    whyChooseUs: renderWhyChooseUsEditor,
    gallery: renderGalleryEditor,
    ourWorkPage: renderOurWorkPageEditor,
    testimonials: renderTestimonialsEditor,
    contact: renderContactEditor,
    contacts: renderContactsViewer,
    footer: renderFooterEditor,
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-3 md:py-4 px-3 md:px-6">
        <div className="flex items-center justify-between gap-2 mb-2 md:mb-0">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1.5 hover:bg-primary-foreground/10 rounded"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
            </button>
            
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
            <h1 className="text-base md:text-xl font-display font-bold">Admin Panel</h1>
            <span className="hidden sm:inline text-xs md:text-sm opacity-80">Welcome, {username}</span>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* Contact Submissions Button */}
            <button
              onClick={() => {
                setActiveSection("contacts");
                setSidebarOpen(false);
              }}
              className={`relative flex items-center gap-1 md:gap-2 px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg font-bold text-xs md:text-sm transition-all shadow-lg ${
                activeSection === "contacts"
                  ? "bg-yellow-400 text-gray-900 scale-105"
                  : "bg-yellow-500 hover:bg-yellow-400 text-gray-900 hover:scale-105"
              }`}
            >
              <Mail className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Contact Submissions</span>
              <span className="sm:hidden">Contacts</span>
              {newContactsCount > 0 && (
                <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-600 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full min-w-[20px] md:min-w-[28px] text-center animate-pulse shadow-xl border-2 border-white">
                  {newContactsCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => { 
                if (confirm('⚠️ Are you sure you want to reset ALL data to defaults? This will restore all default images and text. This action cannot be undone!')) {
                  resetToDefaults(); 
                  toast.success('All data reset to defaults!');
                  setTimeout(() => window.location.reload(), 1000);
                }
              }} 
              className="hidden lg:flex items-center gap-2 text-sm hover:opacity-80 bg-red-600/20 hover:bg-red-600/30 px-3 py-1.5 rounded transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> Reset to Defaults
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1 md:gap-2 text-xs md:text-sm hover:opacity-80 bg-primary-foreground/10 px-2 md:px-3 py-1.5 rounded"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4" /> 
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <div className="bg-green-600 text-primary-foreground text-center py-2 text-xs md:text-sm font-semibold">
          ✓ Changes saved successfully!
        </div>
      )}

      <div className="flex min-h-[calc(100vh-60px)] relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-card border-r border-border p-4 space-y-1 flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto
          top-[52px] md:top-0
        `}>
          <button
            onClick={() => {
              setActiveSection("general");
              setSidebarOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded text-sm font-medium flex items-center justify-between transition-colors ${activeSection === "general" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            General Info <ChevronRight className="h-4 w-4" />
          </button>
          {sectionLabels.filter(s => s.key !== "contacts").map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setActiveSection(s.key);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded text-sm font-medium flex items-center justify-between transition-colors ${activeSection === s.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {s.label} <Edit3 className="h-3 w-3 opacity-50" />
            </button>
          ))}
        </aside>

        {/* Editor */}
        <main className="flex-1 p-4 md:p-8 max-w-full md:max-w-3xl">
          {activeSection && editors[activeSection] ? (
            <>
              <h2 className="text-xl md:text-2xl font-display font-bold mb-4 md:mb-6">
                {activeSection === "general" ? "General Info" : sectionLabels.find((s) => s.key === activeSection)?.label}
              </h2>
              {editors[activeSection]()}
            </>
          ) : (
            <div className="text-center text-muted-foreground mt-12 md:mt-20">
              <Edit3 className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 opacity-30" />
              <p className="text-base md:text-lg">Select a section from the sidebar to start editing</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-xs md:text-sm font-semibold mb-1">{label}</label>
      {textarea ? (
        <textarea className="w-full border border-border rounded px-3 py-2 bg-background text-foreground resize-none text-sm" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="w-full border border-border rounded px-3 py-2 bg-background text-foreground text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function MediaField({ label, value, onChange, accept = "video/*,image/*", hint }: { label: string; value: string; onChange: (v: string) => void; accept?: string; hint?: string }) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      
      try {
        // Upload file to server
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.upload, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          onChange(result.url);
          toast.success('File uploaded successfully');
        } else {
          toast.error(result.message || 'Failed to upload file');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload file');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      {label && <label className="block text-xs md:text-sm font-semibold mb-1">{label}</label>}
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded text-xs font-medium transition-colors ${mode === "url" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
        >
          <LinkIcon className="h-3 w-3" /> <span className="hidden sm:inline">Paste</span> URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded text-xs font-medium transition-colors ${mode === "upload" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
        >
          <Upload className="h-3 w-3" /> Upload<span className="hidden sm:inline"> File</span>
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="ml-auto flex items-center gap-1 px-2 md:px-3 py-1.5 rounded text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        )}
      </div>
      {mode === "url" ? (
        <input
          className="w-full border border-border rounded px-3 py-2 bg-background text-foreground text-xs md:text-sm"
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-border rounded-lg p-4 md:p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors ${uploading ? 'opacity-50' : ''}`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to browse or drag & drop</p>
              <p className="text-xs text-muted-foreground mt-1">Supports video & image files</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
