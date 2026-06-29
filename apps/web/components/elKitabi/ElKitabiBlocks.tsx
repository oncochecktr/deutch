import Link from "next/link";
import { ElKitabiCallout } from "@/components/elKitabi/ElKitabiCallout";
import { ElKitabiTable } from "@/components/elKitabi/ElKitabiTable";
import type { ElKitabiBlock } from "@/lib/elKitabi/types";

export function ElKitabiBlocks({ blocks }: { blocks: ElKitabiBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-sm leading-relaxed text-sage-700">
                {block.text}
              </p>
            );
          case "h3":
            return (
              <h4 key={i} className="text-sm font-bold text-goethe-blue">
                {block.text}
              </h4>
            );
          case "callout":
            return (
              <ElKitabiCallout
                key={i}
                kind={block.kind}
                text={block.text}
                de={block.de}
                tr={block.tr}
              />
            );
          case "table":
            return (
              <ElKitabiTable
                key={i}
                headers={block.headers}
                rows={block.rows}
                caption={block.caption}
              />
            );
          case "list":
            if (block.ordered) {
              return (
                <ol key={i} className="list-decimal space-y-1 pl-5 text-sm text-sage-700">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={i} className="list-disc space-y-1 pl-5 text-sm text-sage-700">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "link":
            return (
              <div key={i} className="rounded-lg border border-goethe-gold/30 bg-goethe-gold/5 px-4 py-3">
                <p className="text-xs font-semibold uppercase text-goethe-gold">
                  German Coach&apos;ta
                </p>
                <Link
                  href={block.href}
                  className="mt-1 inline-block text-sm font-semibold text-goethe-blue hover:underline"
                >
                  {block.label} →
                </Link>
                {block.note && (
                  <p className="mt-1 text-xs text-sage-600">{block.note}</p>
                )}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
