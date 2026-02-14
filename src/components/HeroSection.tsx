import { useSiteData } from "@/context/SiteDataContext";
import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const { data } = useSiteData();
  const { hero } = data;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

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

    const handleCanPlay = () => {
      setVideoLoaded(true);
    };

    const handleError = () => {
      setVideoError(true);
      setVideoLoaded(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [hero.videoUrl]);

  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background Image - Always show as fallback */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      />

      {/* Loading Skeleton */}
      {!videoLoaded && hero.videoUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
              <p className="text-primary-foreground text-lg font-semibold">Loading...</p>
            </div>
          </div>
        </div>
      )}

      {/* Video */}
      {hero.videoUrl && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
          }`}
          src={hero.videoUrl}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-foreground/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <p className="text-primary-foreground/80 text-lg mb-3 font-body text-shadow animate-fade-in">
            {hero.welcomeText}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6 text-shadow animate-fade-in-up">
            {hero.heading}
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed text-shadow animate-fade-in-up animation-delay-200">
            {hero.description}
          </p>
          <a
            href="#menu"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 font-semibold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity border border-primary-foreground/30 animate-fade-in-up animation-delay-400"
          >
            {hero.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
