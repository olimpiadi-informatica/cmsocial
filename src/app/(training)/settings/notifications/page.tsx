import { PageClient } from "./page-client";

export default function Page() {
  return <PageClient applicationServerKey={process.env.VAPID_PUBLIC_KEY} />;
}
