export type PlanDescriptionBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

const CHECKMARK_SPLIT = /\s*[✓✔✅]\s*/u;

/**
 * Interpreta a descrição do plano para exibição:
 * - preserva parágrafos (quebras de linha);
 * - transforma trechos separados por ✓ em lista.
 */
export function parsePlanDescription(raw: string): PlanDescriptionBlock[] {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  const blocks: PlanDescriptionBlock[] = [];
  const paragraphs = normalized.split(/\n{2,}/);

  for (const paragraph of paragraphs) {
    const lines = paragraph
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (CHECKMARK_SPLIT.test(line) && (line.match(/[✓✔✅]/gu)?.length ?? 0) >= 1) {
        const parts = line.split(CHECKMARK_SPLIT).map((part) => part.trim());
        const intro = parts[0] ?? "";
        const items = parts.slice(1).filter(Boolean);

        if (intro) {
          blocks.push({ type: "paragraph", text: intro });
        }

        if (items.length > 0) {
          blocks.push({ type: "list", items });
        }

        continue;
      }

      blocks.push({ type: "paragraph", text: line });
    }
  }

  return blocks;
}
