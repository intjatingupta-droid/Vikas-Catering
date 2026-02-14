import { useSiteData } from "@/context/SiteDataContext";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const { data } = useSiteData();
  const { hero } = data;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hero.videoUrl) return;

    // Get video duration and set up trimming
    const handleLoadedMetadata = () => {
      const duration = video.duration;
      const trimStart = 8; // Skip first 8 seconds
      const trimEnd = duration - 8; // End 8 seconds before the end

      // Start video at 8 seconds
      video.currentTime = trimStart;

      // Loop back to start when reaching trim end
      const handleTimeUpdate = () => {
        if (video.currentTime >= trimEnd) {
          video.currentTime = trimStart;
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [hero.videoUrl]);

  return (
    <section className="relative min-h-[80vh] flex items-center">
      {hero.videoUrl ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={hero.videoUrl}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-foreground/60" />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <p className="text-primary-foreground/80 text-lg mb-3 font-body text-shadow">{hero.welcomeText}</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6 text-shadow">
            {hero.heading}
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed text-shadow">{hero.description}</p>
          <a
            href="#menu"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity border border-primary-foreground/30"
          >
            {hero.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
