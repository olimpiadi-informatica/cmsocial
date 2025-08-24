import { DE, ES, FR, GB, HU, IT, PL, RO } from "country-flag-icons/react/3x2";

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
    case "ro":
      return <RO title="Română" className="w-4 inline-block" />;
    case "hu":
      return <HU title="Magyar" className="w-4 inline-block" />;
    case "pl":
      return <PL title="Polski" className="w-4 inline-block" />;
  }
}
