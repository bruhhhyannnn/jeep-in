import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { STRINGS } from "@/constants";
import { getAssignedJeepneyId, setDriverOvertime } from "@/api";
import { useDriverProfile, useDriverRoute, useNow, useShift } from "@/hooks";
import { reconnectFleet } from "@/hooks/useFleet";
import { nearestStop } from "@/hooks/useTrip";
import { formatAgo, formatClock, inSentence } from "@/lib/format";
import { cn } from "@/lib/utils";
import { startSharing, stopSharing } from "@/services/location/driverTracking";
import { showWarning } from "@/services/ui/toasts";
import {
  HANDSHAKE_STEPS,
  useAuthStore,
  useDriverSession,
  useSharingStore,
  type StepState,
} from "@/store";
import { useTheme } from "@/theme";
import { callNumber } from "@/utils";
import { Button, Card, Icon, ThemedText } from "@/components/ui";
import { Dial, UnitHeader } from "@/components/driver";

const DROPPED_AFTER_MS = 60 * 1000;
const DROPPED_CARD_AFTER_MS = 10 * 60 * 1000;
const OVERTIME_MS = 30 * 60 * 1000;
const WARN_BEFORE_END_MS = 10 * 60 * 1000;

/** Big two-position switch, readable from a dashboard mount. */
function ShareSwitch({
  on,
  pending = false,
  disabled = false,
  onPress,
}: {
  on: boolean;
  pending?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const t = STRINGS.driver.gps;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={on ? t.stopSharing : t.startSharing}
      accessibilityState={{ checked: on, disabled }}
      className={cn(
        "h-[72px] w-60 justify-center rounded-full border-2 bg-sunken p-1.5",
        on ? "items-end" : "items-start",
        pending ? "border-faint" : on ? "border-action" : "border-line-strong",
        disabled && "opacity-50",
      )}
    >
      <View
        className={cn(
          "h-14 w-14 items-center justify-center rounded-full",
          pending ? "bg-faint" : on ? "bg-action" : "bg-card",
        )}
      >
        <Icon name="power" size={24} tone={on || pending ? "actionInk" : "muted"} />
      </View>
    </Pressable>
  );
}

function StepMark({ state, index }: { state: StepState; index: number }) {
  return (
    <View
      className={cn(
        "h-6 w-6 items-center justify-center rounded-full",
        state === "done" && "bg-action",
        state === "active" && "border-2 border-action",
        state === "waiting" && "border-[1.5px] border-line-strong",
      )}
    >
      {state === "done" ? (
        <Icon name="checkmark" size={14} tone="actionInk" />
      ) : (
        <ThemedText variant="label" tone={state === "active" ? "action" : "faint"}>
          {String(index + 1)}
        </ThemedText>
      )}
    </View>
  );
}

export default function GpsTab() {
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();
  const now = useNow(1000);
  const shift = useShift();
  const { stopsByDirection, directions } = useDriverRoute();
  const { data: driver } = useDriverProfile();
  const uid = useAuthStore((s) => s.user?.uid ?? null);

  const jeepney = useDriverSession((s) => s.jeepney);
  const jeepneyLoaded = useDriverSession((s) => s.jeepneyLoaded);
  const directionId = useDriverSession((s) => s.directionId);
  const sharing = useSharingStore();
  const [droppedSeenAt, setDroppedSeenAt] = useState<number | null>(null);
  const [doneForToday, setDoneForToday] = useState(false);

  const t = STRINGS.driver.gps;
  const direction = directions.find((d) => d.id === directionId) ?? null;
  const name = driver?.name ?? "";
  const start = () => startSharing({ shiftEndsAt: shift.endsAt });
  const toggle = () => (sharing.phase === "off" ? start() : stopSharing());

  const keepSharing = () => {
    const until = Date.now() + OVERTIME_MS;
    useSharingStore.setState({ overtimeUntil: until, stoppedByShiftEndAt: null });
    if (uid) setDriverOvertime(uid, until).catch(() => {});
    start();
  };

  const checkAgain = async () => {
    if (!(await getAssignedJeepneyId())) showWarning(t.stillNoUnit);
  };

  let header = direction ? `${name} · ${inSentence(direction.label)}` : name;
  let eyebrow = t.eyebrow;
  let body: React.ReactNode;

  if (!jeepneyLoaded) {
    body = <ActivityIndicator color={colors.action} />;
  } else if (sharing.phase === "blocked") {
    const services = sharing.blockedReason === "services";
    body = (
      <>
        <Dial state="blocked" value={t.off} caption={t.blocked} />
        <Card elevation="md" selected className="w-full gap-2.5 p-4">
          <ThemedText variant="heading">
            {services ? t.blockedServicesTitle : t.blockedPermissionTitle}
          </ThemedText>
          <ThemedText variant="small" tone="muted">
            {t.blockedBody}
          </ThemedText>
          <View className="gap-1 rounded-tile border-[1.5px] border-line bg-sunken px-3 py-2.5">
            <ThemedText variant="eyebrow" tone="muted">
              {t.threeTaps}
            </ThemedText>
            <ThemedText variant="small">
              {services ? t.servicesSteps : t.permissionSteps}
            </ThemedText>
          </View>
          <Button label={t.openSettings} onPress={() => Linking.openSettings()} />
        </Card>
        <ThemedText variant="small" tone="muted" className="max-w-[280px] text-center">
          {t.resumes}
        </ThemedText>
      </>
    );
  } else if (!jeepney) {
    header = driver?.employeeId ? `${name} · ${driver.employeeId}` : name;
    body = (
      <>
        <Dial state="pending" value="—" caption={t.nothing} />
        <Card className="w-full gap-2.5 p-4">
          <ThemedText variant="heading">{t.noUnitTitle}</ThemedText>
          <ThemedText variant="small" tone="muted">
            {t.noUnitBody}
          </ThemedText>
          <View className="flex-row gap-2.5">
            <View className="flex-1">
              <Button
                label={t.callManager}
                variant="outline"
                size="md"
                iconName="call-outline"
                onPress={() => callNumber(STRINGS.settings.mincPhoneNumber1)}
              />
            </View>
            <View className="flex-1">
              <Button label={t.checkAgain} size="md" onPress={checkAgain} />
            </View>
          </View>
        </Card>
      </>
    );
  } else if (
    sharing.phase === "off" &&
    (sharing.stoppedByShiftEndAt || shift.afterShift) &&
    !doneForToday
  ) {
    const stoppedAt = sharing.stoppedByShiftEndAt ?? shift.endsAt;
    eyebrow = t.shiftEnded(formatClock(shift.endsAt));
    body = (
      <>
        <Dial state="overtime" value={t.off} caption={t.stoppedByItself} />
        <Card elevation="md" selected className="w-full gap-2.5 p-4">
          <ThemedText variant="heading">{t.stoppedAt(formatClock(stoppedAt))}</ThemedText>
          <ThemedText variant="small" tone="muted">
            {t.stoppedBody}
          </ThemedText>
          <Button label={t.keepSharing} onPress={keepSharing} />
          <Button
            label={t.doneForToday}
            variant="outline"
            size="md"
            onPress={() => {
              setDoneForToday(true);
              useSharingStore.setState({ stoppedByShiftEndAt: null });
            }}
          />
        </Card>
        <ThemedText variant="small" tone="muted" className="max-w-[280px] text-center">
          {t.overtimeNote}
        </ThemedText>
      </>
    );
  } else if (sharing.phase === "off" && shift.beforeShift) {
    const opens = formatClock(shift.startsAt);
    body = (
      <>
        <Dial state="off" value={opens.replace(/\s?[AP]M$/, "")} caption={t.opensAt(opens)} />
        <Card className="w-full gap-2 p-4">
          <ThemedText variant="heading">{t.tooEarly}</ThemedText>
          <ThemedText variant="small" tone="muted">
            {t.tooEarlyBody(opens, formatClock(shift.endsAt))}
          </ThemedText>
          <View className="flex-row justify-between">
            <ThemedText variant="small" tone="muted">
              {t.now}
            </ThemedText>
            <ThemedText variant="dataSm">{formatClock(now)}</ThemedText>
          </View>
        </Card>
        <View className="h-14 w-full items-center justify-center rounded-full border-[1.5px] border-dashed border-line-strong">
          <ThemedText variant="strong" tone="faint">
            {t.offUntil(opens)}
          </ThemedText>
        </View>
        <ThemedText variant="small" tone="muted" className="max-w-[280px] text-center">
          {t.nobodyWaiting(opens)}
        </ThemedText>
      </>
    );
  } else if (sharing.phase === "starting") {
    body = (
      <>
        <Dial state="pending" value={t.starting} caption={t.notVisible} />
        <Card className="w-full overflow-hidden">
          {HANDSHAKE_STEPS.map((step, i) => {
            const state = sharing.steps[step];
            return (
              <View
                key={step}
                className={cn(
                  "flex-row items-center gap-3 px-3.5 py-3",
                  i > 0 && "border-t-[1.5px] border-sunken",
                  state === "active" && "bg-action-tint",
                )}
              >
                <StepMark state={state} index={i} />
                <View className="flex-1">
                  <ThemedText variant="strong" tone={state === "waiting" ? "muted" : "ink"}>
                    {t.steps[step].title}
                  </ThemedText>
                  <ThemedText variant="small" tone="muted">
                    {t.steps[step].detail}
                  </ThemedText>
                </View>
                <ThemedText variant="dataSm" tone={state === "done" ? "action" : "muted"}>
                  {t.stepState[state]}
                </ThemedText>
              </View>
            );
          })}
        </Card>
        <ShareSwitch on pending onPress={toggle} />
      </>
    );
  } else if (sharing.phase === "on") {
    const silentFor = sharing.lastAckAt ? now - sharing.lastAckAt : 0;
    const dropped = silentFor > DROPPED_AFTER_MS;
    const showDroppedCard =
      silentFor > DROPPED_CARD_AFTER_MS &&
      (droppedSeenAt == null || (sharing.lastAckAt ?? 0) > droppedSeenAt);
    const place =
      sharing.lastAckPosition && direction
        ? nearestStop(stopsByDirection[direction.id] ?? [], sharing.lastAckPosition)?.stop.name
        : undefined;
    const minutesToEnd = Math.round((shift.endsAt - now) / 60000);
    const endingSoon =
      !sharing.overtimeUntil && shift.endsAt - now <= WARN_BEFORE_END_MS && shift.endsAt > now;

    if (sharing.overtimeUntil) header = t.overtimeUntil(formatClock(sharing.overtimeUntil));
    body = (
      <>
        <Dial
          size={dropped ? "md" : "lg"}
          state={dropped ? "dropped" : "live"}
          value={t.on}
          caption={dropped ? t.waiting : t.broadcasting}
        />
        {dropped ? (
          <Card className="w-full p-3.5">
            <ThemedText variant="title">
              {Math.max(1, Math.round(silentFor / 60000))}
              <ThemedText variant="label" tone="muted">
                {" "}
                min
              </ThemedText>
            </ThemedText>
            <ThemedText variant="eyebrow" tone="muted">
              {t.sinceLastSent}
            </ThemedText>
          </Card>
        ) : (
          sharing.confirmedAt && (
            <View className="flex-row items-center gap-2 rounded-full border-[1.5px] border-action px-3 py-1.5">
              <View className="h-4 w-4 items-center justify-center rounded-full bg-action">
                <Icon name="checkmark" size={11} tone="actionInk" />
              </View>
              <ThemedText variant="label">
                {t.confirmed(formatAgo(sharing.confirmedAt, now))}
              </ThemedText>
            </View>
          )
        )}
        {showDroppedCard && (
          <Card elevation="md" selected className="w-full gap-2 p-4">
            <ThemedText variant="heading">
              {place ? t.droppedTitle(place) : t.droppedTitleNoPlace}
            </ThemedText>
            <ThemedText variant="small" tone="muted">
              {t.droppedBody(Math.round(silentFor / 60000))}
            </ThemedText>
            <View className="flex-row gap-2.5">
              <View className="flex-1">
                <Button
                  label={t.retry}
                  variant="outline"
                  size="md"
                  onPress={() => reconnectFleet().catch(() => {})}
                />
              </View>
              <View className="flex-1">
                <Button label={t.gotIt} size="md" onPress={() => setDroppedSeenAt(now)} />
              </View>
            </View>
          </Card>
        )}
        {endingSoon && (
          <Card selected className="w-full gap-1 p-4">
            <ThemedText variant="heading">{t.endingSoon(formatClock(shift.endsAt))}</ThemedText>
            <ThemedText variant="small" tone="muted">
              {t.endingSoonBody(minutesToEnd)}
            </ThemedText>
          </Card>
        )}
        {sharing.foregroundOnly && (
          <ThemedText variant="small" tone="muted" className="max-w-[280px] text-center">
            {t.foregroundOnly}
          </ThemedText>
        )}
        <ShareSwitch on onPress={toggle} />
      </>
    );
  } else {
    body = (
      <>
        <Dial
          state="off"
          size="lg"
          value={t.off}
          caption={shift.afterShift ? t.shiftEnded(formatClock(shift.endsAt)) : t.tapToStart}
        />
        {/* Outside the shift the app spends no data; extra time goes through the card above. */}
        <ShareSwitch on={false} disabled={shift.afterShift} onPress={toggle} />
      </>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: top + 12, paddingBottom: 16 }}
      contentContainerClassName="grow gap-4 px-5"
      showsVerticalScrollIndicator={false}
    >
      <UnitHeader jeepney={jeepney} detail={header} />
      <View className="flex-1 items-center justify-center gap-5 py-4">
        <ThemedText variant="eyebrow" tone="muted">
          {eyebrow}
        </ThemedText>
        {body}
      </View>
    </ScrollView>
  );
}
