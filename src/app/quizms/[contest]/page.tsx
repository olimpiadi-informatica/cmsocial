import { PageClient } from "./page-client";

export default async function Page({ params }: { params: Promise<{ contest: string }> }) {
  const { contest } = await params;
  return <PageClient contest={contest} quizmsUrl={process.env.QUIZMS_URL!} />;
}
