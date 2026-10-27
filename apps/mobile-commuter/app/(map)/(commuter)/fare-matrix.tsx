import { useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { STRINGS } from "@/constants";
import { useTransit } from "@/hooks";
import { discountPercent, isPlaceholderMatrix, quoteFare, roundingLabel } from "@/lib/fare";
import { formatClock, formatDate, formatKm, formatPeso, inSentence } from "@/lib/format";
import { useOfflineCache } from "@/store";
import { sendEmail } from "@/utils";
import { Button, Card, Chip, Icon, IconButton, Sheet, ThemedText } from "@/components/ui";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-3">
      <ThemedText variant="small" tone="muted" className="shrink">
        {label}
      </ThemedText>
      <ThemedText variant="dataSm">{value}</ThemedText>
    </View>
  );
}

/** Where the rates come from, how a fare is computed, and the full stop-to-stop table. */
export default function FareMatrixSheet() {
  const { top } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const transit = useTransit();
  const { route, direction, stops, stopKm, fareMatrix } = transit;
  const syncedAt = useOfflineCache((s) => s.syncedAt);
  const savedCopyAt = useOfflineCache((s) => s.savedCopyAt);
  const [saving, setSaving] = useState(false);

  const t = STRINGS.commuter.matrix;
  const placeholder = isPlaceholderMatrix(fareMatrix);
  const legs = stops.flatMap((from, i) =>
    stops.slice(i + 1).map((to) => {
      const km = Math.abs((stopKm[to.id] ?? 0) - (stopKm[from.id] ?? 0));
      return { from, to, km, quote: quoteFare(fareMatrix, km) };
    }),
  );

  const saveCopy = async () => {
    setSaving(true);
    try {
      await Promise.all(
        ["routes", "stop-points", "fare-matrices"].map((key) =>
          queryClient.refetchQueries({ queryKey: [key] }),
        ),
      );
      useOfflineCache.getState().markCopySaved();
    } finally {
      setSaving(false);
    }
  };

  const footer = (
    <View className="gap-2">
      <View className="flex-row gap-2.5">
        <View className="flex-1">
          <Button
            label={t.report}
            variant="outline"
            size="md"
            onPress={() => sendEmail(STRINGS.settings.mincEmail, t.reportSubject)}
          />
        </View>
        <View className="flex-1">
          <Button
            label={savedCopyAt ? t.savedCopy(formatDate(savedCopyAt)) : t.saveCopy}
            iconName={savedCopyAt ? "checkmark" : "download-outline"}
            size="md"
            disabled={saving}
            onPress={saveCopy}
          />
        </View>
      </View>
      <ThemedText variant="label" tone="muted" className="text-center">
        {t.footer}
      </ThemedText>
    </View>
  );

  return (
    <View className="absolute inset-0" pointerEvents="box-none">
      <Pressable
        onPress={() => router.back()}
        accessibilityLabel="Close"
        className="absolute inset-0 bg-navy-950/30"
      />
      <View style={{ top: top + 8 }} className="absolute left-4">
        <IconButton iconName="close" accessibilityLabel="Close" onPress={() => router.back()} />
      </View>

      <Sheet snapPoints={[height - top - 72]} footer={footer}>
        <View className="gap-4">
          <View className="gap-1">
            <View className="flex-row items-center gap-2">
              <ThemedText variant="title" className="flex-1" accessibilityRole="header">
                {t.title}
              </ThemedText>
              <Chip label={t.source} />
            </View>
            <ThemedText variant="small" tone="muted">
              {t.subtitle(route?.name ?? STRINGS.commuter.routeFallback, fareMatrix.vehicleClass)}
            </ThemedText>
          </View>

          <Card className="gap-2.5 rounded-tile p-4">
            <Row label={t.orderNo} value={fareMatrix.orderNo ?? t.notPosted} />
            <Row label={t.issuedBy} value={fareMatrix.issuedBy ?? t.notPosted} />
            <Row label={t.route} value={route?.name ?? STRINGS.commuter.routeFallback} />
            <Row label={t.vehicleClass} value={fareMatrix.vehicleClass} />
            <Row
              label={t.effective}
              value={fareMatrix.effectiveDate ? formatDate(fareMatrix.effectiveDate) : t.notPosted}
            />
            {syncedAt != null && (
              <Row
                label={t.lastSynced}
                value={`${formatDate(syncedAt)} ${formatClock(syncedAt)}`}
              />
            )}
            <View className="flex-row items-center gap-2.5 border-t-[1.5px] border-sunken pt-2.5">
              <View className="h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-action">
                <Icon name={placeholder ? "alert" : "checkmark"} size={14} tone="action" />
              </View>
              <ThemedText variant="small" className="flex-1">
                {placeholder ? t.placeholder : t.synced}
              </ThemedText>
            </View>
          </Card>

          <View className="gap-1.5">
            <ThemedText variant="eyebrow" tone="muted">
              {t.howComputed}
            </ThemedText>
            <Card className="gap-2.5 rounded-tile p-4">
              <Row label={t.baseFare(fareMatrix.baseKm)} value={formatPeso(fareMatrix.baseFare)} />
              <Row label={t.perKm} value={formatPeso(fareMatrix.perKm)} />
              <Row label={t.discount} value={`−${discountPercent(fareMatrix)}%`} />
              <Row label={t.rounding} value={roundingLabel(fareMatrix)} />
            </Card>
          </View>

          <View className="flex-row items-baseline justify-between">
            <ThemedText variant="strong">
              {direction ? `${t.table} · ${inSentence(direction.label)}` : t.table}
            </ThemedText>
            <ThemedText variant="label" tone="muted">
              {t.tableHint}
            </ThemedText>
          </View>

          {legs.length === 0 ? (
            <ThemedText tone="muted">{t.empty}</ThemedText>
          ) : (
            <Card elevation="none" className="overflow-hidden rounded-tile">
              <View className="flex-row gap-3 border-b-[1.5px] border-line bg-page px-3 py-2.5">
                <ThemedText variant="eyebrow" tone="muted" className="flex-1">
                  {t.leg}
                </ThemedText>
                <ThemedText variant="eyebrow" tone="muted" className="w-16 text-right">
                  {t.reg}
                </ThemedText>
                <ThemedText variant="eyebrow" tone="muted" className="w-16 text-right">
                  {t.disc}
                </ThemedText>
              </View>
              {legs.map(({ from, to, km, quote }) => (
                <View
                  key={`${from.id}-${to.id}`}
                  className="flex-row items-center gap-3 border-b-[1.5px] border-sunken px-3 py-2.5"
                >
                  <View className="flex-1 flex-row gap-2">
                    <View className="w-2.5 items-center py-1">
                      <View className="h-2 w-2 rounded-full border-[1.5px] border-faint" />
                      <View className="min-h-2 w-px flex-1 bg-line" />
                      <View className="h-2 w-2 rounded-full bg-action" />
                    </View>
                    <View className="flex-1 gap-0.5">
                      <ThemedText variant="small" tone="muted">
                        {from.name}
                      </ThemedText>
                      <ThemedText variant="strong">{to.name}</ThemedText>
                      <ThemedText variant="dataSm" tone="faint">
                        {formatKm(km)}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText variant="dataStrong" className="w-16 text-right">
                    {formatPeso(quote.regular)}
                  </ThemedText>
                  <ThemedText variant="data" tone="muted" className="w-16 text-right">
                    {formatPeso(quote.discounted)}
                  </ThemedText>
                </View>
              ))}
            </Card>
          )}
        </View>
      </Sheet>
    </View>
  );
}
