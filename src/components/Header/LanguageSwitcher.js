import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ukFlag from '../../assets/images/uk-flag.png';
import frFlag from '../../assets/images/france-flag.png';
import saFlag from '../../assets/images/saudia-arabia-flag.png';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', name: t('English'), flag: ukFlag },
    { code: 'fr', name: t('Français'), flag: frFlag },
    { code: 'ar', name: t('العربية'), flag: saFlag }
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsDropdownOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="text-gray-700 hover:text-blue-600 flex items-center"
        title={t("common.switchLanguage")}
      >
        <span className="material-symbols-outlined text-3xl">language</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center p-2 hover:bg-gray-100 ${
                lang.code === i18n.language ? 'bg-blue-100' : ''
              }`}
            >
              <img
                src={lang.flag}
                alt={lang.name}
                className="w-6 h-4 mr-2 rounded"
              />
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;