import { useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { useDriverProfile, useDriverRoute } from "@/hooks";
import { formatDate } from "@/lib/format";
import { useAuthStore, useDriverSession, usePreferences, useSharingStore } from "@/store";
import { useTheme } from "@/theme";
import type { BottomSheetModalBaseRef } from "@/types";
import { Button, Card, Chip, Icon, ThemedText } from "@/components/ui";
import { LogoutConfirmModal } from "@/components/settings";

const APPEARANCE_LABEL = {
  light: STRINGS.settings.appearance.light,
  dark: STRINGS.settings.appearance.dark,
  system: STRINGS.settings.appearance.system,
};

/** Photo, ID, role, today's unit and the read-only record. Sign out is the only destructive action. */
export default function ProfileTab() {
  const { top } = useSafeAreaInsets();
  const { shadows } = useTheme();
  const logoutRef = useRef<BottomSheetModalBaseRef>(null);
  const { data: driver } = useDriverProfile();
  const email = useAuthStore((s) => s.user?.email ?? null);
  const jeepney = useDriverSession((s) => s.jeepney);
  const directionId = useDriverSession((s) => s.directionId);
  const phase = useSharingStore((s) => s.phase);
  const appearance = usePreferences((s) => s.appearance);
  const { directions } = useDriverRoute();

  const t = STRINGS.driver.profile;
  const direction = directions.find((d) => d.id === directionId);
  const record = [
    { label: t.driverId, value: driver?.employeeId },
    { label: t.license, value: driver?.licenseNo },
    {
      label: t.licenseExpiry,
      value: driver?.licenseExpiry ? formatDate(driver.licenseExpiry) : null,
    },
    { label: t.phone, value: driver?.phone },
    { label: t.email, value: email },
  ];

  return (
    <View className="flex-1">
      <View
        style={{ paddingTop: top + 12 }}
        className="flex-row items-center gap-3.5 border-b-[1.5px] border-line px-5 pb-4"
      >
        <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-line bg-sunken">
          {driver?.photoUrl ? (
            <Image source={{ uri: driver.photoUrl }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <Icon name="person-outline" size={26} tone="muted" />
          )}
        </View>
        <View className="flex-1 gap-1">
          <ThemedText variant="heading">{driver?.name ?? " "}</ThemedText>
          {driver?.employeeId && (
            <ThemedText variant="dataSm" tone="muted">
              {driver.employeeId}
            </ThemedText>
          )}
          <Chip
            label={`${driver?.role === "reliever" ? t.reliever : t.main} · ${phase === "on" ? t.onDuty : t.offDuty}`}
          />
        </View>
      </View>

      <ScrollView contentContainerClassName="gap-4 px-5 py-4" showsVerticalScrollIndicator={false}>
        <View className="gap-2">
          <ThemedText variant="eyebrow" tone="muted">
            {t.assignment}
          </ThemedText>
          {jeepney ? (
            <View
              style={shadows.md}
              className="flex-row items-center gap-3 rounded-[20px] border-2 border-action bg-card p-3.5"
            >
              <View className="h-12 w-12 items-center justify-center rounded-tile border-[1.5px] border-line bg-sunken">
                <Icon name="bus-outline" size={22} tone="muted" />
              </View>
              <View className="flex-1">
                <ThemedText variant="dataStrong">{jeepney.plateNumber}</ThemedText>
                <ThemedText variant="small" tone="muted">
                  {t.unitLine(
                    jeepney.jeepneyNumber || "—",
                    jeepney.seats,
                    direction?.label ?? null,
                  )}
                </ThemedText>
              </View>
            </View>
          ) : (
            <Card dashed className="px-4 py-3.5">
              <ThemedText tone="muted">{t.noAssignment}</ThemedText>
            </Card>
          )}
        </View>

        <View className="gap-2">
          <ThemedText variant="eyebrow" tone="muted">
            {t.record}
          </ThemedText>
          <Card className="overflow-hidden">
            {record.map((row, i) => (
              <View
                key={row.label}
                className={`flex-row justify-between gap-3 px-4 py-3 ${i > 0 ? "border-t-[1.5px] border-sunken" : ""}`}
              >
                <ThemedText variant="small" tone="muted">
                  {row.label}
                </ThemedText>
                <ThemedText
                  variant="dataSm"
                  tone={row.value ? "ink" : "faint"}
                  className="shrink text-right"
                >
                  {row.value ?? t.notOnFile}
                </ThemedText>
              </View>
            ))}
          </Card>
        </View>

        <Pressable
          onPress={() => router.push(ROUTES.driver.display)}
          accessibilityRole="button"
          style={shadows.sm}
          className="min-h-[60px] flex-row items-center gap-3 rounded-[20px] border-[1.5px] border-line bg-card px-4 py-3"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-inverse">
            <Icon name="moon" size={16} tone="accent" />
          </View>
          <View className="flex-1">
            <ThemedText variant="strong">{t.display}</ThemedText>
            <ThemedText variant="small" tone="muted">
              {APPEARANCE_LABEL[appearance]}
            </ThemedText>
          </View>
          <ThemedText variant="label" tone="action">
            {t.change}
          </ThemedText>
        </Pressable>

        <ThemedText variant="small" tone="muted">
          {t.managerNote}
        </ThemedText>

        <Button
          label={t.signOut}
          variant="outline"
          size="md"
          iconName="log-out-outline"
          onPress={() => logoutRef.current?.open()}
        />
      </ScrollView>

      <LogoutConfirmModal ref={logoutRef} />
    </View>
  );
}
