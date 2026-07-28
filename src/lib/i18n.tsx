import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "mr";

const dict = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.chairman": "Lobby",
    "nav.committee": "Committee",
    "nav.updates": "Market Updates",
    "nav.notices": "Notices",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "nav.login": "Gala Owner Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "assoc.name": "Vishal Purandhar Patasanstha",
    "assoc.short": "Market Yard Owners Association",
    "hero.title": "Connecting Every Gala Owner with the Market Yard Administration",
    "hero.sub": "A secure digital platform for market updates, complaints, official notices, documents and communication.",
    "hero.cta.login": "Gala Owner Login",
    "hero.cta.register": "Register Your Gala",
    "hero.cta.updates": "View Latest Market Updates",
    "stats.owners": "Registered Gala Owners",
    "stats.portal": "Digital Market Yard Portal",
    "stats.access": "Access to Notices",
    "stats.resolution": "Faster Complaint Resolution",
    "section.services": "Portal Services",
    "section.chairman": "Chairman's Desk",
    "section.committee": "Committee Members",
    "section.updates": "Latest Market Updates",
    "section.notices": "Latest Notices",
    "section.how": "How the Portal Works",
    "section.gallery": "Gallery",
    "section.contact": "Contact Us",
    "footer.rights": "All rights reserved.",
  },
  mr: {
    "nav.home": "मुख्यपृष्ठ",
    "nav.about": "आमच्याविषयी",
    "nav.chairman": "लॉबी",
    "nav.committee": "समिती",
    "nav.updates": "बाजार अद्यतने",
    "nav.notices": "सूचना",
    "nav.gallery": "गॅलरी",
    "nav.contact": "संपर्क",
    "nav.login": "गाळा मालक लॉगिन",
    "nav.register": "नोंदणी",
    "nav.logout": "बाहेर पडा",
    "assoc.name": "विशाल पुरंदर पतसंस्था मार्केट यार्ड",
    "assoc.short": "मार्केट यार्ड गाळा मालक संघटना",
    "hero.title": "प्रत्येक गाळा मालकाला मार्केट यार्ड प्रशासनाशी जोडणे",
    "hero.sub": "बाजार अद्यतने, तक्रारी, अधिकृत सूचना, कागदपत्रे आणि संवादासाठी सुरक्षित डिजिटल व्यासपीठ.",
    "hero.cta.login": "गाळा मालक लॉगिन",
    "hero.cta.register": "गाळा नोंदणी करा",
    "hero.cta.updates": "नवीनतम बाजार अद्यतने पहा",
    "stats.owners": "नोंदणीकृत गाळा मालक",
    "stats.portal": "डिजिटल मार्केट यार्ड पोर्टल",
    "stats.access": "सूचनांसाठी प्रवेश",
    "stats.resolution": "जलद तक्रार निवारण",
    "section.services": "पोर्टल सेवा",
    "section.chairman": "अध्यक्षांचे कार्यालय",
    "section.committee": "समिती सदस्य",
    "section.updates": "नवीनतम बाजार अद्यतने",
    "section.notices": "नवीनतम सूचना",
    "section.how": "पोर्टल कसे कार्य करते",
    "section.gallery": "गॅलरी",
    "section.contact": "आमच्याशी संपर्क साधा",
    "footer.rights": "सर्व हक्क राखीव.",
  },
} as const;

type Key = keyof typeof dict["en"];

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (saved === "en" || saved === "mr") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (k: Key) => (dict[lang] as Record<string, string>)[k] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
