import { DE, ES, FR, GB, IT } from "country-flag-icons/react/3x2";

export function Flag({ locale }: { locale: string }) {
  switch (locale) {
    case "it":
      return <IT title="Italiano" className="w-4 inline-block" />;
    case "en":
    case "gb":
      return <GB title="English" className="w-4 inline-block" />;
    case "de":
      return <DE title="Deutsch" className="w-4 inline-block" />;
    case "es":
      return <ES title="Español" className="w-4 inline-block" />;
    case "fr":
      return <FR title="Français" className="w-4 inline-block" />;
  }
}
