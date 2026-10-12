import { useCallback, useEffect, useState } from "react";
import { AppState, Linking, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { formatAlertTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  getNotificationPermission,
  requestNotificationPermission,
  type NotificationPermission,
} from "@/services/notifications/local";
import { ALERT_MINUTES, useAlerts, usePreferences } from "@/store";
import type { AlertKind, CommuterAlert } from "@/types";
import { Button, Card, Icon, ThemedText, ThemedView, Toggle } from "@/components/ui";
import { ScreenHeader, useBottomChrome } from "@/components/commuter";

const ICONS: Record<AlertKind, string> = {
  arrival: "time-outline",
  live: "radio-outline",
  passed: "arrow-redo-outline",
  lost: "cloud-offline-outline",
};

function AlertRow({ alert }: { alert: CommuterAlert }) {
  return (
    <Card
      elevation={alert.read ? "none" : "sm"}
      className={cn(
        "flex-row items-center gap-3 rounded-[20px] px-3.5 py-3",
        alert.read && "border-transparent bg-transparent",
      )}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-line bg-sunken">
        <Icon name={ICONS[alert.kind]} size={18} tone="muted" />
      </View>
      <View className="flex-1">
        <ThemedText variant="strong">{alert.title}</ThemedText>
        <ThemedText variant="small" tone="muted">
          {alert.body}
        </ThemedText>
      </View>
      <View className="items-end gap-1.5">
        <ThemedText variant="dataSm" tone="muted">
          {formatAlertTime(alert.createdAt)}
        </ThemedText>
        <View className={cn("h-2 w-2 rounded-full", !alert.read && "bg-action")} />
      </View>
    </Card>
  );
}

/** Alerts kept on this phone only. Nothing is sent unless the commuter asked for it. */
export default function AlertsTab() {
  const { top } = useSafeAreaInsets();
  const bottomChrome = useBottomChrome();
  const items = useAlerts((s) => s.items);
  const markAllRead = useAlerts((s) => s.markAllRead);
  const arrivalAlerts = usePreferences((s) => s.arrivalAlerts);
  const setArrivalAlerts = usePreferences((s) => s.setArrivalAlerts);
  const [permission, setPermission] = useState<NotificationPermission>("undetermined");

  const refreshPermission = useCallback(() => {
    getNotificationPermission().then(setPermission);
  }, []);

  useEffect(() => {
    refreshPermission();
    const sub = AppState.addEventListener("change", (s) => s === "active" && refreshPermission());
    return () => sub.remove();
  }, [refreshPermission]);

  const turnOn = async () => {
    const next = await requestNotificationPermission();
    if (next === "denied") Linking.openSettings();
    setPermission(next);
  };

  const t = STRINGS.commuter.alerts;
  const unread = items.some((a) => !a.read);
  const blocked = permission === "denied" || permission === "unavailable";

  return (
    <ThemedView className="absolute inset-0">
      <ScrollView
        contentContainerStyle={{ paddingTop: top + 12, paddingBottom: bottomChrome + 16 }}
        contentContainerClassName="grow gap-3 px-5"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={t.title}
          right={
            unread && (
              <Button label={t.markAllRead} variant="ghost" size="sm" onPress={markAllRead} />
            )
          }
        />

        {items.length === 0 ? (
          <View className="flex-1 justify-center gap-3 py-6">
            <View className="items-center gap-3">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-sunken">
                <Icon name="notifications-outline" size={26} tone="muted" />
              </View>
              <ThemedText variant="heading" className="text-center">
                {t.emptyTitle}
              </ThemedText>
              <ThemedText variant="small" tone="muted" className="text-center">
                {t.emptyBody(ALERT_MINUTES)}
              </ThemedText>
            </View>
            <Button label={t.findJeep} onPress={() => router.navigate(ROUTES.commuter.home)} />
          </View>
        ) : (
          <>
            <Card dashed className="flex-row items-center gap-3 rounded-tile px-3.5 py-3">
              <Icon name="information-circle-outline" size={20} tone="muted" />
              <ThemedText variant="small" tone="muted" className="flex-1">
                {t.deviceOnly}
              </ThemedText>
            </Card>
            {items.map((a) => (
              <AlertRow key={a.id} alert={a} />
            ))}
          </>
        )}

        {blocked && (
          <Card dashed className="flex-row items-center gap-3 rounded-tile px-3.5 py-3">
            <View className="flex-1">
              <ThemedText variant="strong">{t.blockedTitle}</ThemedText>
              <ThemedText variant="small" tone="muted">
                {t.blockedBody}
              </ThemedText>
            </View>
            {permission === "denied" && (
              <Button label={t.turnOn} variant="outline" size="sm" onPress={turnOn} />
            )}
          </Card>
        )}

        <Card className="min-h-[64px] flex-row items-center gap-3 px-4 py-3">
          <View className="flex-1">
            <ThemedText variant="strong">{t.arrivalAlerts}</ThemedText>
            <ThemedText variant="small" tone="muted">
              {t.arrivalAlertsHint(ALERT_MINUTES)}
            </ThemedText>
          </View>
          <Toggle
            value={arrivalAlerts}
            onValueChange={async (v) => {
              setArrivalAlerts(v);
              if (v && permission === "undetermined")
                setPermission(await requestNotificationPermission());
            }}
            accessibilityLabel={t.arrivalAlerts}
          />
        </Card>

        {items.length === 0 && (
          <ThemedText variant="label" tone="muted" className="text-center">
            {t.footer}
          </ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}
