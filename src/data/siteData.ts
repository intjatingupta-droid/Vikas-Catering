import heroBg from "@/assets/hero-bg.jpg";
import aboutAward from "@/assets/about-award.jpg";
import indianCuisine from "@/assets/indian-cuisine.jpg";
import southIndian from "@/assets/south-indian.jpg";
import punjabiCuisine from "@/assets/punjabi-cuisine.jpg";
import italianCuisine from "@/assets/italian-cuisine.jpg";
import chineseCuisine from "@/assets/chinese-cuisine.jpg";
import festiveCatering from "@/assets/festive-catering.jpg";
import weddingCatering from "@/assets/wedding-catering.jpg";
import corporateCatering from "@/assets/corporate-catering.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";

export interface SiteData {
  siteName: string;
  tagline: string;
  useLogo: boolean;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;

  hero: {
    welcomeText: string;
    heading: string;
    description: string;
    ctaText: string;
    backgroundImage: string;
    videoUrl: string;
  };

  about: {
    heading: string;
    paragraphs: string[];
    image: string;
    ctaText: string;
  };

  brandSection: {
    name: string;
    subtitle: string;
    description: string;
    ctaText: string;
  };

  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    description: string;
    items: { title: string; description: string; image: string }[];
  };

  menu: {
    sectionLabel: string;
    sectionTitle: string;
    items: { title: string; description: string; image: string }[];
  };

  detailedMenu: {
    heroTitle: string;
    heroImage: string;
    categories: {
      title: string;
      images: string[];
      subcategories: {
        name: string;
        items: string[];
      }[];
    }[];
  };

  whyChooseUs: {
    heading: string;
    paragraphs: string[];
    points: string[];
  };

  gallery: {
    heading: string;
    description: string;
    images: string[];
    ctaText: string;
  };

  ourWorkPage: {
    heroTitle: string;
    heroMedia: string; // Can be image or video URL
    heroMediaType: "image" | "video";
    galleryHeading: string;
    galleryImages: string[];
  };

  testimonials: {
    heading: string;
    items: { name: string; text: string; rating: number }[];
  };

  contact: {
    visitHeading: string;
    officeLabel: string;
    enquireHeading: string;
    alternatePhone?: string;
  };

  footer: {
    description: string;
    quickLinks: { label: string; href: string }[];
    services: string[];
    socials: { platform: string; url: string }[];
  };
}

export const defaultSiteData: SiteData = {
  siteName: "Vikas Caterings",
  tagline: "Simple As Traditional",
  useLogo: false,
  logoUrl: "",
  phone: "090584 81865",
  email: "info@vikascaterings.com",
  address: "306, Sector 15-B, Kar Kunj Chauraha, Avas Vikas Colony, Sikandra, Agra, Uttar Pradesh 282007",

  hero: {
    welcomeText: "Welcome to Shree Vishnu Caterers",
    heading: "Premium Catering Services for Weddings, Corporate Events & Parties",
    description: "From house parties to corporate events, we serve flavors and elegance that turn every occasion into a memorable experience.",
    ctaText: "Discover Our Menu",
    backgroundImage: heroBg,
    videoUrl: "https://hepbcynttvfgtnembdux.supabase.co/storage/v1/object/public/Vikas%20Catering/Catering%20Advertisement%20%20ATOZO%20%20Maharishi%20Caterers%20%20Catering%20Video%20-%20ATOZO%20Films%20%26%20Entertainment%20(1080p,%20h264).mp4",
  },

  about: {
    heading: "Award-Winning Caterers in India for Weddings, Corporate Events & Grand Celebrations",
    paragraphs: [
      "With over 10 years of great catering services, Vikas Caterings, led by founder Kuldeep Singh, has become known around North India for turning events into special food experiences. Our award-winning team combines real flavors, creative displays, and outstanding service to make every celebration better.",
      "From top weddings to important business events, we offer carefully chosen menus, fresh ingredients, and smooth service that show our quality and style. Serving Agra, Mathura, Gwalior, Noida, Delhi, Gurugram, and nearby areas, we are proud to create memorable dining experiences for every event.",
    ],
    image: aboutAward,
    ctaText: "Book Now",
  },

  brandSection: {
    name: "Vikas Caterings",
    subtitle: "Authentic Indian Catering for Every Celebration",
    description: "At Vikas Caterings, we serve authentic Indian dishes, fresh ingredients, and flawless service for weddings, birthdays, kitty parties, and corporate events. Our expert team customizes every menu to your taste, making every occasion unforgettable.",
    ctaText: "Book Now",
  },

  services: {
    sectionTitle: "India's Leading Caterer for Every Occasion",
    sectionSubtitle: "",
    description: "At Vikas Caterings, we understand that every event is unique and deserves exceptional catering. Our services are designed to create memorable experiences, whether it's a grand wedding, a professional corporate gathering, or an intimate birthday party.",
    items: [
      { title: "Festive Gathering Catering", description: "Authentic festive catering for Diwali, Holi, Eid, and more. Traditional menus, fresh ingredients, and flavors that bring joy to every celebration.", image: festiveCatering },
      { title: "Wedding Catering", description: "Premium wedding catering with authentic flavors, elegant presentation, and customized menus for every ceremony.", image: weddingCatering },
      { title: "Corporate Events", description: "Professional catering service for conferences, meetings, and corporate gatherings. Fresh food, seamless service, and tailored menus.", image: corporateCatering },
    ],
  },

  menu: {
    sectionLabel: "WHAT WE OFFER",
    sectionTitle: "Explore The Menu",
    items: [
      { title: "Indian Cuisine", description: "From house parties to corporate events, we bring flavors and sophistication that make every moment unforgettable.", image: indianCuisine },
      { title: "South Indian Cuisine", description: "From house parties to corporate events, we bring flavors and sophistication that make every moment unforgettable.", image: southIndian },
      { title: "Punjabi Cuisine", description: "From house parties to corporate events, we bring flavors and sophistication that make every moment unforgettable.", image: punjabiCuisine },
      { title: "Italian Cuisine", description: "From house parties to corporate events, we bring flavors and sophistication that make every moment unforgettable.", image: italianCuisine },
      { title: "Chinese Cuisine", description: "From house parties to corporate events, we bring flavors and sophistication that make every moment unforgettable.", image: chineseCuisine },
    ],
  },

  detailedMenu: {
    heroTitle: "Our Menu",
    heroImage: heroBg,
    categories: [
      {
        title: "Beverages",
        images: [indianCuisine, southIndian, punjabiCuisine, chineseCuisine],
        subcategories: [
          {
            name: "Welcome Drinks",
            items: ["Mausmi Juice", "Pineapple Juice", "Watermelon Juice"]
          },
          {
            name: "Aerated Drinks",
            items: ["Masala Chai", "Coffee"]
          },
          {
            name: "Creamy Shakes",
            items: ["Custard Apple Shake", "Punch Shake", "Oreo Shake", "Pan Shake"]
          },
          {
            name: "Hot Beverages",
            items: ["Masala Chai", "Coffee"]
          },
          {
            name: "Soup",
            items: ["Tomato Creamy Soup", "Sweet Corn Soup"]
          },
          {
            name: "Mocktails",
            items: ["Mojito", "Guava Marinara"]
          }
        ]
      },
      {
        title: "Starters & Snacks",
        images: [italianCuisine, punjabiCuisine, gallery1],
        subcategories: [
          {
            name: "Snacks",
            items: ["Paneer Afgani Tikka", "Soya Malai Tikka", "Crunchy Papad", "Kabab Hara Bhara", "Kabab Thai Mini", "Spring Roll", "Honey Chilli Potato", "Dry Maunchurian", "Dahi Ke Sole", "French Fries"]
          },
          {
            name: "Chaat Galli",
            items: ["Pani Puri (suzi + Dal)", "Aloo Tikki", "Raj Kachori", "Jaipuri Paneer Cheela", "Hot English Chaat", "Kesar Dahi Bhalla", "Mattar Kulche", "Dal Muradabadi", "Pau Bhaji"]
          }
        ]
      }
    ]
  },

  whyChooseUs: {
    heading: "Why Choose Us",
    paragraphs: [
      "With years of expertise in the catering industry, we deliver customized culinary experiences for events of every size. Our diverse menu features North Indian, South Indian, and Continental cuisines prepared with fresh ingredients and meticulous attention to detail.",
      "From live counters and curated menus to flawless presentation and timely service, we ensure every dish delights your guests. Whether it's a small gathering or a grand celebration, we bring quality, hygiene, and personalization to every plate we serve.",
    ],
    points: [
      "Years of Proven Experience",
      "Personalized & Friendly Service",
      "Trained, Skilled, and Professional Staff",
      "Wide Range of Creative Menu Options",
      "Fresh, High-Quality Ingredients",
      "Authentic Local Flavors & International Cuisine",
    ],
  },

  gallery: {
    heading: "Explore Our Work",
    description: "From house parties to corporate events, we bring flavors and sophistication that make every moment unforgettable.",
    images: [gallery1, gallery2, heroBg],
    ctaText: "Explore Our Gallery",
  },

  ourWorkPage: {
    heroTitle: "Explore Our Work",
    heroMedia: heroBg,
    heroMediaType: "image",
    galleryHeading: "Explore Our Work",
    galleryImages: [
      gallery1, gallery2, heroBg, aboutAward, 
      indianCuisine, southIndian, punjabiCuisine, 
      italianCuisine, chineseCuisine, festiveCatering,
      weddingCatering, corporateCatering
    ],
  },

  testimonials: {
    heading: "Our Testimonials",
    items: [
      { name: "SUMIT SINGH", text: "The way Vikas Caterings present food for our guest was amazing, everyone delightfully loved the taste. Top notch services, highly recommended from my side for your wedding or any Occasion.", rating: 5 },
      { name: "Saurabh Singh Pundhir", text: "Best Catering services in this region, taste, decoration, presentation is best according to the surrounding scenario.", rating: 5 },
      { name: "Ram Bahadur Singh", text: "A heartfelt thank you to Kuldeep Bhai and the entire team. Your work was superb and well-planned. The food was amazing, and the service was superb! Many thanks.", rating: 5 },
    ],
  },

  contact: {
    visitHeading: "Visit Us",
    officeLabel: "Head Office Address",
    enquireHeading: "Enquire Now",
    alternatePhone: "",
  },

  footer: {
    description: "Your reliable catering partner for fresh food, exceptional taste, and professional event service across Agra and nearby cities.",
    quickLinks: [
      { label: "About Us", href: "#about" },
      { label: "Menu", href: "#menu" },
      { label: "Our Work", href: "#gallery" },
      { label: "Contact Us", href: "#contact" },
    ],
    services: ["Wedding Catering", "Birthday Catering", "Corporate Event Catering", "Theme-Based Catering", "Live Food Stalls"],
    socials: [
      { platform: "instagram", url: "#" },
      { platform: "facebook", url: "#" },
      { platform: "youtube", url: "#" },
      { platform: "whatsapp", url: "#" },
    ],
  },
};
