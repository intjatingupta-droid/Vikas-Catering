import { useState, useRef } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import { SiteData } from "@/data/siteData";
import { Save, RotateCcw, ChevronRight, Edit3, Plus, Trash2, ArrowLeft, Upload, Link as LinkIcon, X } from "lucide-react";
import { Link } from "react-router-dom";

type SectionKey = keyof SiteData;

const sectionLabels: { key: SectionKey; label: string }[] = [
  { key: "hero", label: "Hero Section" },
  { key: "about", label: "About Section" },
  { key: "brandSection", label: "Brand Section" },
  { key: "services", label: "Services / Occasions" },
  { key: "menu", label: "Menu Section" },
  { key: "whyChooseUs", label: "Why Choose Us" },
  { key: "gallery", label: "Gallery / Our Work" },
  { key: "testimonials", label: "Testimonials" },
  { key: "contact", label: "Contact Section" },
  { key: "footer", label: "Footer" },
];

const topLevelFields: { key: keyof SiteData; label: string }[] = [
  { key: "siteName", label: "Site Name" },
  { key: "tagline", label: "Tagline" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
];

export default function AdminPage() {
  const { data, updateData, updateSection, resetToDefaults } = useSiteData();
  const [activeSection, setActiveSection] = useState<SectionKey | "general" | null>(null);
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderGeneralFields = () => (
    <div className="space-y-4">
      {topLevelFields.map((f) => (
        <div key={f.key}>
          <label className="block text-sm font-semibold mb-1">{f.label}</label>
          <input
            className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
            value={data[f.key] as string}
            onChange={(e) => updateData({ [f.key]: e.target.value })}
          />
        </div>
      ))}
      <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
        <Save className="h-4 w-4" /> Save
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
        <Field label="Background Image URL" value={hero.backgroundImage} onChange={(v) => update({ backgroundImage: v })} />
        <MediaField
          label="Hero Video"
          value={hero.videoUrl}
          onChange={(v) => update({ videoUrl: v })}
          accept="video/*"
          hint="Leave empty to show background image instead"
        />
        {hero.videoUrl && (
          <div className="rounded overflow-hidden border border-border">
            <video src={hero.videoUrl} controls muted className="w-full max-h-48 object-cover" />
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
        <Field label="Image URL" value={about.image} onChange={(v) => update({ image: v })} />
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
            <Field label="Image URL" value={item.image} onChange={(v) => { const items = [...s.items]; items[i] = { ...items[i], image: v }; update({ items }); }} />
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
            <Field label="Image URL" value={item.image} onChange={(v) => { const items = [...m.items]; items[i] = { ...items[i], image: v }; update({ items }); }} />
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
        <div className="border border-border rounded p-4 space-y-2">
          <span className="font-semibold text-sm">Gallery Images</span>
          {g.images.map((img, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input className="flex-1 border border-border rounded px-3 py-1 bg-background text-foreground text-sm" value={img} onChange={(e) => { const images = [...g.images]; images[i] = e.target.value; update({ images }); }} />
              {img && <img src={img} alt="" className="h-10 w-10 object-cover rounded" />}
              <button onClick={() => update({ images: g.images.filter((_, j) => j !== i) })} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
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
      <div className="space-y-4">
        <Field label="Visit Heading" value={c.visitHeading} onChange={(v) => update({ visitHeading: v })} />
        <Field label="Office Label" value={c.officeLabel} onChange={(v) => update({ officeLabel: v })} />
        <Field label="Enquire Heading" value={c.enquireHeading} onChange={(v) => update({ enquireHeading: v })} />
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
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
        </div>
        <button onClick={showSaved} className="bg-primary text-primary-foreground px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </button>
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
    whyChooseUs: renderWhyChooseUsEditor,
    gallery: renderGalleryEditor,
    testimonials: renderTestimonialsEditor,
    contact: renderContactEditor,
    footer: renderFooterEditor,
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-display font-bold">Admin Panel</h1>
        </div>
        <button onClick={() => { resetToDefaults(); showSaved(); }} className="flex items-center gap-2 text-sm hover:opacity-80">
          <RotateCcw className="h-4 w-4" /> Reset to Defaults
        </button>
      </div>

      {saved && (
        <div className="bg-green-600 text-primary-foreground text-center py-2 text-sm font-semibold">
          ✓ Changes saved successfully!
        </div>
      )}

      <div className="flex min-h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border p-4 space-y-1 flex-shrink-0">
          <button
            onClick={() => setActiveSection("general")}
            className={`w-full text-left px-4 py-3 rounded text-sm font-medium flex items-center justify-between transition-colors ${activeSection === "general" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            General Info <ChevronRight className="h-4 w-4" />
          </button>
          {sectionLabels.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`w-full text-left px-4 py-3 rounded text-sm font-medium flex items-center justify-between transition-colors ${activeSection === s.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {s.label} <Edit3 className="h-3 w-3 opacity-50" />
            </button>
          ))}
        </aside>

        {/* Editor */}
        <main className="flex-1 p-8 max-w-3xl">
          {activeSection && editors[activeSection] ? (
            <>
              <h2 className="text-2xl font-display font-bold mb-6">
                {activeSection === "general" ? "General Info" : sectionLabels.find((s) => s.key === activeSection)?.label}
              </h2>
              {editors[activeSection]()}
            </>
          ) : (
            <div className="text-center text-muted-foreground mt-20">
              <Edit3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Select a section from the sidebar to start editing</p>
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
      <label className="block text-sm font-semibold mb-1">{label}</label>
      {textarea ? (
        <textarea className="w-full border border-border rounded px-3 py-2 bg-background text-foreground resize-none" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="w-full border border-border rounded px-3 py-2 bg-background text-foreground" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function MediaField({ label, value, onChange, accept = "video/*,image/*", hint }: { label: string; value: string; onChange: (v: string) => void; accept?: string; hint?: string }) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${mode === "url" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
        >
          <LinkIcon className="h-3 w-3" /> Paste URL
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${mode === "upload" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
        >
          <Upload className="h-3 w-3" /> Upload File
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        )}
      </div>
      {mode === "url" ? (
        <input
          className="w-full border border-border rounded px-3 py-2 bg-background text-foreground text-sm"
          placeholder="https://example.com/video.mp4"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to browse or drag & drop</p>
          <p className="text-xs text-muted-foreground mt-1">Supports video & image files</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
