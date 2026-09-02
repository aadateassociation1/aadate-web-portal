import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translateDocumentToMarathi, translateToMarathi } from "@/lib/marathi";

export type Lang = "en" | "mr";

const dict = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.chairman": "Lobby",
    "nav.committee": "Committee",
    "nav.marketPrices": "Market Prices",
    "nav.updates": "Market Updates",
    "nav.notices": "Notices",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "nav.login": "Members",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "assoc.name": "Shree Chhatrapati Shivaji Market Yard Adte Association",
    "assoc.short": "Shree Chhatrapati Shivaji Market Yard Adte Association",
    "hero.title": "प्रत्येक आडते व्यापारी यांना मार्केट यार्ड व्यवसाय व प्रशासन यांच्याशी जोडणारे पोर्टल.",
    "hero.sub": "",
    "hero.cta.login": "Members",
    "hero.cta.register": "Register Your Gala",
    "hero.cta.updates": "View Latest Market Updates",
    "stats.owners": "Registered Members",
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
    "nav.marketPrices": "????? ???",
    "nav.updates": "बाजार माहिती",
    "nav.notices": "सूचना",
    "nav.gallery": "गॅलरी",
    "nav.contact": "संपर्क",
    "nav.login": "सभासद लॉगिन",
    "nav.register": "नोंदणी",
    "nav.logout": "बाहेर पडा",
    "assoc.name": "विशाल पुरंदर पतसंस्था मार्केट यार्ड",
    "assoc.short": "मार्केट यार्ड सभासद संघटना",
    "hero.title": "प्रत्येक सभासदाला मार्केट यार्ड प्रशासनाशी जोडणे",
    "hero.sub": "बाजार माहिती, तक्रारी, अधिकृत सूचना, कागदपत्रे आणि संवादासाठी सुरक्षित डिजिटल व्यासपीठ.",
    "hero.cta.login": "सभासद लॉगिन",
    "hero.cta.register": "गाळा नोंदणी करा",
    "hero.cta.updates": "नवीन बाजार माहिती पहा",
    "stats.owners": "नोंदणीकृत सभासद",
    "stats.portal": "डिजिटल मार्केट यार्ड पोर्टल",
    "stats.access": "सूचनांसाठी प्रवेश",
    "stats.resolution": "जलद तक्रार निवारण",
    "section.services": "पोर्टल सेवा",
    "section.chairman": "अध्यक्षांचे कार्यालय",
    "section.committee": "समिती सदस्य",
    "section.updates": "नवीन बाजार माहिती",
    "section.notices": "नवीनतम सूचना",
    "section.how": "पोर्टल कसे कार्य करते",
    "section.gallery": "गॅलरी",
    "section.contact": "आमच्याशी संपर्क साधा",
    "footer.rights": "सर्व हक्क राखीव.",
  },
} as const;

const cleanDict = {
  ...dict,
  en: {
    ...dict.en,
    "hero.title": "Connecting every Member with market yard business and administration.",
    "hero.sub": "A secure digital platform for market updates, complaints, official notices, documents and communication.",
  },
} as const;

type Key = keyof typeof cleanDict["en"];

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

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;

    let frame = 0;
    const translate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => translateDocumentToMarathi(document.body, lang));
    };

    translate();
    if (lang !== "mr") {
      return () => cancelAnimationFrame(frame);
    }

    const observer = new MutationObserver(translate);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (k: Key) => {
    const english = cleanDict.en[k] ?? k;
    return lang === "mr" ? translateToMarathi(english) : english;
  };
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);

