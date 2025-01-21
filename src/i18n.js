import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import ar_common from "./locales/ar/common.json";
import en_common from "./locales/en/common.json";
import fr_common from "./locales/fr/common.json";
i18n.use(initReactI18next).init({
  resources: {
    ar: { ...ar_common },
    en: { ...en_common },
    fr: { ...fr_common },
  },
  lng: "en",
});
