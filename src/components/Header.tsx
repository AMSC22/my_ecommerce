import React from "react";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="p-4 bg-blue-500 text-white flex justify-between">
      <h1>{t("welcome")}</h1>
      <div>
        <button onClick={() => changeLanguage("en")} className="px-2">EN</button>
        <button onClick={() => changeLanguage("fr")} className="px-2">FR</button>
      </div>
    </header>
  );
};

export default Header;
