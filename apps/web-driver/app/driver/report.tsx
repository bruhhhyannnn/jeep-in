import { useEffect, useState } from "react";
import { formatClock } from "@jeep-in/core/format";
import { ROUTES, STRINGS } from "@/constants";
import { sendDriverReport, subscribeToReportSeen, withdrawDriverReport } from "@/api";
import { useSafeAreaInsets } from "@/hooks";
import { router } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useAuthStore, useDriverSession, useSharingStore } from "@/store";
import { useTheme } from "@/theme";
import type { ReportReason } from "@/types";
import {
  Button,
  Card,
  Icon,
  Pressable,
  TextField,
  ThemedText,
  View,
  type IconName,
} from "@/components/ui";
import { LockedCard, StatusStrip } from "@/components/driver";

const REASONS: { reason: ReportReason; icon: IconName }[] = [
  { reason: "breakdown", icon: "construct-outline" },
  { reason: "road_blocked", icon: "remove-circle-outline" },
  { reason: "accident", icon: "warning-outline" },
  { reason: "heavy_traffic", icon: "car-outline" },
  { reason: "other", icon: "ellipsis-horizontal" },
];

type Sent = {
  id: string;
  reason: ReportReason;
  at: number;
  withdrawn: boolean;
  deliveredAt: number | null;
  seenAt: number | null;
};

const shortClock = (ms: number) => formatClock(ms).replace(/\s?[AP]M$/, "");

/** One step of Queued → Delivered → Seen: green once it happened, dashed until then. */
function Stage({ label, at }: { label: string; at: number | null }) {
  const done = at != null;
  return (
    <View
      className={cn(
        "flex-1 items-center gap-0.5 rounded-tile border-[1.5px] px-2 py-2.5",
        done ? "border-live bg-live-tint" : "border-dashed border-line-strong",
      )}
    >
      <ThemedText variant="label" className={done ? "text-live-ink" : undefined}>
        {label}
      </ThemedText>
      <ThemedText
        variant="dataSm"
        tone={done ? undefined : "muted"}
        className={done ? "text-live-ink" : undefined}
      >
        {done ? shortClock(at) : STRINGS.driver.report.notYet}
      </ThemedText>
    </View>
  );
}

/** Five fixed reasons, one tap each. Locked while the jeep moves. */
export default function ReportTab() {
  const { top } = useSafeAreaInsets();
  const { shadows } = useTheme();
  const uid = useAuthStore((s) => s.user?.uid ?? null);
  const jeepney = useDriverSession((s) => s.jeepney);
  const directionId = useDriverSession((s) => s.directionId);
  const moving = useSharingStore((s) => s.moving);
  const position = useSharingStore((s) => s.position);

  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);
  const t = STRINGS.driver.report;

  const send = () => {
    if (!uid || !jeepney || !reason) return;
    const { id, delivered } = sendDriverReport({
      driverId: uid,
      jeepneyId: jeepney.id,
      unit: jeepney.jeepneyNumber || jeepney.plateNumber,
      reason,
      note: note.trim() || null,
      lat: position?.[1] ?? null,
      long: position?.[0] ?? null,
      directionId,
    });
    setSent({ id, reason, at: Date.now(), withdrawn: false, deliveredAt: null, seenAt: null });
    setReason(null);
    setNote("");
    // Resolves once the server has the report; with no signal that's later, by itself.
    delivered
      .then(() => setSent((s) => (s?.id === id ? { ...s, deliveredAt: Date.now() } : s)))
      .catch(() => {});
  };

  // Seen can only follow Delivered (see subscribeToReportSeen).
  const seenWatchId = sent?.deliveredAt != null ? sent.id : null;
  useEffect(() => {
    if (!seenWatchId) return;
    return subscribeToReportSeen(seenWatchId, (seenAt) =>
      setSent((s) => (s?.id === seenWatchId ? { ...s, seenAt } : s)),
    );
  }, [seenWatchId]);

  if (sent) {
    return (
      <View className="no-scrollbar flex-1 overflow-y-auto">
        <View
          style={{ paddingTop: top + 12, paddingBottom: 16 }}
          className="min-h-full grow gap-4 px-5"
        >
          <StatusStrip />
          <View className="flex-1 items-center justify-center gap-4 py-4">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-action">
              <Icon name="checkmark" size={44} tone="actionInk" />
            </View>
            <View className="items-center gap-1">
              <ThemedText variant="title" accessibilityRole="header" className="text-center">
                {sent.deliveredAt ? t.sentTitle : t.queuedTitle}
              </ThemedText>
              <ThemedText variant="small" tone="muted">
                {t.sentMeta(t.reasons[sent.reason].title, formatClock(sent.at))}
              </ThemedText>
            </View>
            <View className="w-full flex-row gap-2">
              <Stage label={t.stages.queued} at={sent.at} />
              <Stage label={t.stages.delivered} at={sent.deliveredAt} />
              <Stage label={t.stages.seen} at={sent.seenAt} />
            </View>
            <Card className="w-full gap-2.5 p-4">
              <ThemedText variant="eyebrow" tone="muted">
                {t.whatNow}
              </ThemedText>
              {t.whatNowSteps.map((step, i) => (
                <View key={step} className="flex-row gap-3">
                  <View className="h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-action">
                    <ThemedText variant="label">{String(i + 1)}</ThemedText>
                  </View>
                  <ThemedText variant="small" className="flex-1">
                    {step}
                  </ThemedText>
                </View>
              ))}
            </Card>
            {sent.withdrawn ? (
              <ThemedText variant="small" tone="muted" className="text-center">
                {t.takenBack}
              </ThemedText>
            ) : (
              <Card dashed className="w-full flex-row items-center gap-3 p-3">
                <ThemedText variant="strong" className="flex-1">
                  {t.mistake}
                </ThemedText>
                <Button
                  label={t.takeBack}
                  variant="outline"
                  size="md"
                  onPress={() => {
                    withdrawDriverReport(sent.id).catch(() => {});
                    setSent({ ...sent, withdrawn: true });
                  }}
                />
              </Card>
            )}
            <View className="w-full">
              <Button
                label={t.backToSharing}
                variant="outline"
                onPress={() => {
                  setSent(null);
                  router.navigate(ROUTES.driver.home);
                }}
              />
            </View>
            <ThemedText variant="small" tone="muted" className="max-w-[280px] text-center">
              {t.queued}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={cn("no-scrollbar flex-1", moving ? "overflow-hidden" : "overflow-y-auto")}>
      <View
        style={{ paddingTop: top + 12, paddingBottom: 16 }}
        className="min-h-full grow gap-4 px-5"
      >
        <StatusStrip />
        <View>
          <ThemedText variant="title" accessibilityRole="header">
            {t.title}
          </ThemedText>
          <ThemedText tone="muted">{t.subtitle}</ThemedText>
        </View>

        <View className="gap-2">
          {REASONS.map(({ reason: r, icon }) => {
            const selected = reason === r;
            return (
              <Pressable
                key={r}
                onPress={() => setReason(r)}
                disabled={moving}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected, disabled: moving }}
                style={selected ? shadows.md : shadows.sm}
                className={cn(
                  "min-h-[60px] flex-row items-center gap-3 rounded-[20px] bg-card px-3.5 py-2.5",
                  selected ? "border-2 border-action" : "border-[1.5px] border-line",
                  moving && "opacity-40",
                )}
              >
                <View
                  className={cn(
                    "h-10 w-10 items-center justify-center rounded-full",
                    selected ? "bg-inverse" : "bg-sunken",
                  )}
                >
                  <Icon name={icon} size={20} tone={selected ? "onInverse" : "muted"} />
                </View>
                <View className="flex-1">
                  <ThemedText variant="strong">{t.reasons[r].title}</ThemedText>
                  {!moving && (
                    <ThemedText variant="small" tone="muted">
                      {t.reasons[r].sub}
                    </ThemedText>
                  )}
                </View>
              </Pressable>
            );
          })}
          {moving && (
            <View className="absolute inset-0 justify-center" pointerEvents="none">
              <LockedCard body={STRINGS.driver.locked.report} />
            </View>
          )}
        </View>

        {!moving && (
          <>
            <Card className="gap-2 p-3">
              <ThemedText variant="label" tone="muted">
                {t.noteLabel}
              </ThemedText>
              <TextField
                placeholder={t.notePlaceholder}
                value={note}
                onChangeText={setNote}
                onClear={() => setNote("")}
                maxLength={200}
                enterKeyHint="done"
                accessibilityLabel={t.noteLabel}
              />
            </Card>

            <View className="gap-2">
              <Button
                label={t.send}
                iconName="send"
                disabled={!reason || !jeepney}
                onPress={send}
              />
              <ThemedText variant="small" tone="muted" className="text-center">
                {jeepney ? t.attached : t.noUnit}
              </ThemedText>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
