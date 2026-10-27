import { useCallback, useEffect, useState } from "react";
import { ROUTES, STRINGS } from "@/constants";
import { formatAlertTime } from "@/lib/format";
import { router } from "@/lib/router";
import { cn } from "@/lib/utils";
import {
  getNotificationPermission,
  requestNotificationPermission,
  type NotificationPermission,
} from "@/services/notifications/local";
import { showWarning } from "@/services/ui/toasts";
import { useNow, useSafeAreaInsets } from "@/hooks";
import { ALERT_MINUTES, isIOS, isStandalone, useAlerts, usePreferences } from "@/store";
import { layout, useTheme } from "@/theme";
import type { AlertKind, CommuterAlert } from "@/types";
import {
  Button,
  Card,
  Icon,
  ThemedText,
  ThemedView,
  Toggle,
  View,
  type IconName,
} from "@/components/ui";
import { ScreenHeader, useTabBarInset } from "@/components/commuter";

const ICONS: Record<AlertKind, IconName> = {
  arrival: "time-outline",
  live: "radio-outline",
  passed: "arrow-redo-outline",
  lost: "cloud-offline-outline",
};

/** Read alerts older than this fade back. */
const RECENT_MS = 3 * 60 * 60 * 1000;

/** Unread: blue border and dot · read: plain · older: faded border and dot. */
function AlertRow({ alert, now }: { alert: CommuterAlert; now: number }) {
  const { colors } = useTheme();
  const older = alert.read && now - alert.createdAt > RECENT_MS;
  return (
    <Card
      elevation={alert.read ? (older ? "none" : "sm") : "md"}
      selected={!alert.read}
      style={older ? { borderColor: colors.sunken } : undefined}
      className="flex-row items-center gap-3 rounded-[20px] px-3.5 py-3"
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
        <View
          className={cn(
            "h-2 w-2 rounded-full",
            !alert.read ? "bg-action" : older ? "bg-line" : "bg-muted",
          )}
        />
      </View>
    </Card>
  );
}

/** Alerts kept on this phone only. Nothing is sent unless the commuter asked for it. */
export default function AlertsTab() {
  const { top } = useSafeAreaInsets();
  const bottomChrome = useTabBarInset();
  const items = useAlerts((s) => s.items);
  const now = useNow(60000);
  const markAllRead = useAlerts((s) => s.markAllRead);
  const arrivalAlerts = usePreferences((s) => s.arrivalAlerts);
  const setArrivalAlerts = usePreferences((s) => s.setArrivalAlerts);
  const [permission, setPermission] = useState<NotificationPermission>("undetermined");

  const refreshPermission = useCallback(() => {
    getNotificationPermission().then(setPermission);
  }, []);

  useEffect(() => {
    refreshPermission();
    const onVisible = () => document.visibilityState === "visible" && refreshPermission();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refreshPermission]);

  const turnOn = async () => {
    const next = await requestNotificationPermission();
    // A browser can't ask again after a denial; only its site settings can undo it.
    if (next === "denied") showWarning(STRINGS.web.blocked.notifications);
    setPermission(next);
  };

  const t = STRINGS.commuter.alerts;
  const unread = items.some((a) => !a.read);
  const blocked = permission === "denied" || permission === "unavailable";

  return (
    <ThemedView className="absolute inset-0">
      <View className="no-scrollbar flex-1 overflow-y-auto">
        <View
          style={{
            paddingTop: top + 12,
            paddingBottom: bottomChrome + 16,
            maxWidth: layout.contentMaxWidth,
          }}
          className="min-h-full w-full grow gap-3 self-center px-5"
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
                <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-line-strong">
                  <Icon name="notifications-outline" size={26} tone="faint" />
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
                <AlertRow key={a.id} alert={a} now={now} />
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
              {/* iOS only offers notifications to apps added to the Home Screen. */}
              {isIOS() && !isStandalone() && (
                <ThemedText variant="label" tone="muted" className="mt-1">
                  {STRINGS.web.alerts.iosHint}
                </ThemedText>
              )}
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
        </View>
      </View>
    </ThemedView>
  );
}
