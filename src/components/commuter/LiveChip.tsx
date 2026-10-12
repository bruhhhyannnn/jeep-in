import { STRINGS } from "@/constants";
import { formatAgo } from "@/lib/format";
import { useNow } from "@/hooks";
import { Chip } from "@/components/ui";

type LiveChipProps = {
  /** Newest position time. Null for drivers on app versions that don't send one. */
  updatedAt: number | null;
  stale?: boolean;
};

/** "8s ago" while positions update, dashed "Last seen 9 min ago" once they stop. */
export default function LiveChip({ updatedAt, stale = false }: LiveChipProps) {
  const now = useNow(1000);

  if (stale && updatedAt != null) {
    return (
      <Chip tone="stale" data label={STRINGS.commuter.home.lastSeen(formatAgo(updatedAt, now))} />
    );
  }
  if (updatedAt == null) return <Chip tone="live" label={STRINGS.commuter.home.live} />;
  return <Chip tone="fresh" data label={formatAgo(updatedAt, now)} />;
}
