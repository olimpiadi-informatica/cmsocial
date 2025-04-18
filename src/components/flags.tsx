import { GB, IT } from "country-flag-icons/react/3x2";

export function Flag({ locale }: { locale: string }) {
  switch (locale) {
    case "it":
      return <IT title="Italiano" className="w-4 inline-block" />;
    case "en":
      return <GB title="English" className="w-4 inline-block" />;
  }
}
