import { PageShell } from "@/components/PageShell";
import { CoachMilestoneOnMount } from "@/components/CoachMilestoneOnMount";
import { DiktatWorkspace } from "@/components/diktat/DiktatWorkspace";

export default function DiktatPage() {
  return (
    <PageShell
      title="Diktat"
      subtitle="Serbest yaz · kelime listesi yanda · dinle-yaz kontrol"
      backHref="/"
      backLabel="Panele dön"
      maxWidth="full"
    >
      <CoachMilestoneOnMount milestone="diktatVisited" />
      <DiktatWorkspace />
    </PageShell>
  );
}
