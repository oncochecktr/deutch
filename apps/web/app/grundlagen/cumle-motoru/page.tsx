import { PageShell } from "@/components/PageShell";
import { CumleMotoru } from "@/components/grundlagen/CumleMotoru";

export default function CumleMotoruPage() {
  return (
    <PageShell
      title="Kelime Oyunu"
      subtitle="852 kelime · cümle hafızası · puan"
      backHref="/grundlagen"
      backLabel="Gramer modüllere dön"
      maxWidth="lg"
    >
      <CumleMotoru />
    </PageShell>
  );
}
