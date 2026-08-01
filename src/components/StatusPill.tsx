import type { StatusItem } from "@/generated/prisma/enums";
import { STATUS_ITEM_LABELS, STATUS_ITEM_PILL_CLASS } from "@/lib/statusItem";

export function StatusPill({ status }: { status: StatusItem }) {
  return (
    <span className={`pill ${STATUS_ITEM_PILL_CLASS[status]}`}>
      <span className="dot" />
      {STATUS_ITEM_LABELS[status]}
    </span>
  );
}
