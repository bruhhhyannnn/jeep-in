import { useRef, useState } from "react";
import { usePreferences } from "@/store";
import { useTheme } from "@/theme";
import type { Appearance, BottomSheetModalBaseRef, TextSize } from "@/types";
import { showSuccess, showWarning } from "@/services/ui/toasts";
import {
  BottomSheetModalBase,
  Button,
  Card,
  Chip,
  Icon,
  IconButton,
  RadioCard,
  Segmented,
  Sheet,
  Spinner,
  TextField,
  ThemedText,
  ThemedView,
  Toggle,
  View,
} from "@/components/ui";

/** Development only: every UI kit component, to check against the design in both themes. */
export default function UiKitScreen() {
  const { colors } = useTheme();
  const appearance = usePreferences((s) => s.appearance);
  const setAppearance = usePreferences((s) => s.setAppearance);
  const textSize = usePreferences((s) => s.textSize);
  const setTextSize = usePreferences((s) => s.setTextSize);
  const modalRef = useRef<BottomSheetModalBaseRef>(null);
  const [toggle, setToggle] = useState(true);
  const [radio, setRadio] = useState("paoay");
  const [query, setQuery] = useState("");
  const [sheet, setSheet] = useState(false);

  return (
    <ThemedView className="absolute inset-0">
      <View className="no-scrollbar flex-1 overflow-y-auto">
        <View className="mx-auto w-full max-w-[480px] gap-4 px-5 pb-[420px] pt-6">
          <ThemedText variant="title" accessibilityRole="header">
            UI kit
          </ThemedText>
          <Segmented<Appearance>
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "Match phone" },
            ]}
            value={appearance}
            onChange={setAppearance}
          />
          <Segmented<TextSize>
            options={[
              { value: "default", label: "Default" },
              { value: "large", label: "Large" },
              { value: "largest", label: "Largest" },
            ]}
            value={textSize}
            onChange={setTextSize}
          />

          <ThemedText variant="eyebrow" tone="muted">
            Type
          </ThemedText>
          <ThemedText variant="moment">₱25.00</ThemedText>
          <ThemedText variant="momentMd">See where the jeeps are</ThemedText>
          <ThemedText variant="title">Fare guide</ThemedText>
          <ThemedText variant="heading">5 jeeps toward Paoay</ThemedText>
          <ThemedText variant="strong">Batac City Plaza</ThemedText>
          <ThemedText>
            Live locations along Laoag – Batac – Paoay, updated as drivers move.
          </ThemedText>
          <ThemedText variant="small" tone="muted">
            Soonest arrival first
          </ThemedText>
          <ThemedText variant="label">Boarding at</ThemedText>
          <ThemedText variant="data">₱13.00 base + 6.7 km × ₱1.80</ThemedText>
          <ThemedText variant="dataSm" tone="muted">
            J-14 · 1.2 km
          </ThemedText>
          <ThemedText variant="dataStrong">₱25.00</ThemedText>

          <ThemedText variant="eyebrow" tone="muted">
            Buttons
          </ThemedText>
          <Button label="Show jeeps" onPress={() => showSuccess("Saved · Oct 27, 2026")} />
          <Button label="Start tracking" variant="accent" onPress={() => {}} />
          <Button label="Board at Batac City Plaza" variant="navy" onPress={() => {}} />
          <Button
            label="Choose my stop instead"
            variant="outline"
            size="md"
            iconRight="arrow-forward"
            onPress={() => showWarning("Pick a stop after Laoag terminal.")}
          />
          <Button
            label="Turn on location instead"
            variant="ghost"
            size="md"
            iconName="location-outline"
            onPress={() => {}}
          />
          <Button label="See fare for this trip" disabled onPress={() => {}} />
          <View className="flex-row items-center gap-2.5">
            <IconButton
              iconName="settings-outline"
              size={52}
              accessibilityLabel="Settings"
              onPress={() => {}}
            />
            <IconButton iconName="arrow-back" accessibilityLabel="Back" onPress={() => {}} />
            <IconButton
              iconName="close"
              size={44}
              variant="plain"
              accessibilityLabel="Close"
              onPress={() => {}}
            />
            <Spinner color={colors.action} />
            <Toggle value={toggle} onValueChange={setToggle} accessibilityLabel="Use my location" />
            <View className="rounded-full bg-inverse p-2">
              <Toggle
                value={!toggle}
                onValueChange={(v) => setToggle(!v)}
                onInverse
                accessibilityLabel="Discount"
              />
            </View>
          </View>

          <ThemedText variant="eyebrow" tone="muted">
            Chips
          </ThemedText>
          <View className="flex-row flex-wrap gap-2">
            <Chip label="Live" tone="live" />
            <Chip label="8s ago" tone="fresh" data />
            <Chip label="Last seen 9 min ago" tone="stale" data />
            <Chip label="Pending" tone="pending" />
            <Chip label="Blocked" tone="error" />
            <Chip label="Toward Paoay" tone="selected" />
            <Chip label="Source" />
          </View>

          <ThemedText variant="eyebrow" tone="muted">
            Cards and fields
          </ThemedText>
          <TextField
            iconName="search"
            placeholder="Search a stop or landmark"
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery("")}
            autoCorrect={false}
            accessibilityLabel="Search a stop or landmark"
          />
          <Card elevation="md" className="gap-1 p-4">
            <ThemedText variant="heading">No jeeps toward Paoay right now</ThemedText>
            <ThemedText variant="small" tone="muted">
              Drivers show up here as soon as they start sharing.
            </ThemedText>
          </Card>
          <Card selected className="flex-row items-center gap-3 p-4">
            <Icon name="time-outline" tone="muted" />
            <ThemedText variant="strong">J-14 is 3 min away</ThemedText>
          </Card>
          <Card dashed className="p-4">
            <ThemedText tone="muted">This jeep stopped sharing its location.</ThemedText>
          </Card>
          <RadioCard
            title="Toward Paoay"
            hint="Laoag → Batac → Paoay"
            trailing="5 live"
            selected={radio === "paoay"}
            onPress={() => setRadio("paoay")}
          />
          <RadioCard
            title="Toward Laoag"
            hint="Paoay → Batac → Laoag"
            trailing="4 live"
            selected={radio === "laoag"}
            onPress={() => setRadio("laoag")}
          />
          <RadioCard
            title="Batac City Plaza"
            hint="Rizal St. corner Washington"
            radioEnd
            compact
            selected={radio === "plaza"}
            onPress={() => setRadio("plaza")}
          />

          <ThemedText variant="eyebrow" tone="muted">
            Sheets
          </ThemedText>
          <Button
            label="Open modal sheet"
            variant="outline"
            size="md"
            onPress={() => modalRef.current?.open()}
          />
          <Button
            label={sheet ? "Hide map sheet" : "Show map sheet"}
            variant="outline"
            size="md"
            onPress={() => setSheet((s) => !s)}
          />
        </View>
      </View>

      {sheet && (
        <Sheet
          snapPoints={[160, 380, 620]}
          index={1}
          surface="page"
          footer={
            <Button label="See fare for this trip" iconRight="arrow-forward" onPress={() => {}} />
          }
        >
          <View className="gap-2">
            {Array.from({ length: 24 }, (_, i) => (
              <Card key={i} className="p-4">
                <ThemedText variant="strong">{`Stop ${i + 1}`}</ThemedText>
              </Card>
            ))}
          </View>
        </Sheet>
      )}

      <BottomSheetModalBase ref={modalRef} title="Where do you get off?">
        <View className="gap-2">
          {["Laoag terminal", "San Nicolas", "MMSU main gate", "Batac City Plaza"].map((s) => (
            <Card key={s} className="p-4">
              <ThemedText variant="strong">{s}</ThemedText>
            </Card>
          ))}
        </View>
      </BottomSheetModalBase>
    </ThemedView>
  );
}
