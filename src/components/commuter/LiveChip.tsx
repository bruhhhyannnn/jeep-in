import { STRINGS } from "@/constants";
import { formatAgo } from "@/lib/format";
import { useNow } from "@/hooks";
import { Chip } from "@/components/ui";

type LiveChipProps = {
  /** Newest position time. Null for drivers on app versions that don't send one. */
  updatedAt: number | null;
  stale?: boolean;
};

/** "Live · 8s ago", or dashed "Last seen 9 min ago" once positions stop updating. */
export default function LiveChip({ updatedAt, stale = false }: LiveChipProps) {
  const now = useNow(1000);

  if (stale && updatedAt != null) {
    return (
      <Chip tone="stale" data label={STRINGS.commuter.home.lastSeen(formatAgo(updatedAt, now))} />
    );
  }
  return (
    <Chip
      tone="live"
      label={
        updatedAt != null
          ? `${STRINGS.commuter.home.live} · ${formatAgo(updatedAt, now)}`
          : STRINGS.commuter.home.live
      }
    />
  );
}
