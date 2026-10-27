import { Image, Pressable, View } from "react-native";
import { router } from "expo-router";
import { ROUTES, STRINGS } from "@/constants";
import { cn } from "@/lib/utils";
import { useAuthStore, usePreferences } from "@/store";
import { useTheme } from "@/theme";
import { Icon, SafeAreaContainer, ThemedText } from "@/components/ui";

function RoleCard({
  title,
  hint,
  iconName,
  primary = false,
  onPress,
}: {
  title: string;
  hint: string;
  iconName: string;
  primary?: boolean;
  onPress: () => void;
}) {
  const { shadows } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={primary ? shadows.md : shadows.sm}
      className={cn(
        "min-h-[84px] flex-row items-center gap-4 rounded-card bg-card px-4 py-4 active:opacity-90",
        primary ? "border-2 border-action" : "border-[1.5px] border-line",
      )}
    >
      <View
        className={cn(
          "h-12 w-12 items-center justify-center rounded-full",
          primary ? "bg-inverse" : "bg-sunken",
        )}
      >
        <Icon name={iconName} size={22} tone={primary ? "accent" : "ink"} />
      </View>
      <View className="flex-1">
        <ThemedText variant="heading">{title}</ThemedText>
        <ThemedText variant="small" tone="muted">
          {hint}
        </ThemedText>
      </View>
      <Icon name="chevron-forward" size={18} tone="faint" />
    </Pressable>
  );
}

export default function RoleSelectionScreen() {
  const setRole = useAuthStore((s) => s.setRole);
  const onboarded = usePreferences((s) => s.onboarded);
  const t = STRINGS.onboarding.roleSelection;

  return (
    <SafeAreaContainer className="justify-center gap-8">
      <View className="flex-row items-center justify-center gap-3">
        <Image
          source={require("@/assets/images/logo-mmsu.png")}
          className="h-16 w-16"
          resizeMode="contain"
          accessibilityLabel="Mariano Marcos State University"
        />
        <Image
          source={require("@/assets/images/logo-jeep-in.png")}
          className="h-14 w-36"
          resizeMode="contain"
          accessibilityLabel={STRINGS.general.appName}
        />
      </View>

      <View className="gap-1">
        <ThemedText variant="title" className="text-center" accessibilityRole="header">
          {t.title}
        </ThemedText>
        <ThemedText tone="muted" className="text-center">
          {t.subtitle}
        </ThemedText>
      </View>

      <View className="gap-3">
        <RoleCard
          primary
          title={t.commuter}
          hint={t.commuterHint}
          iconName="map-outline"
          onPress={async () => {
            await setRole("commuter");
            router.replace(onboarded ? ROUTES.commuter.home : ROUTES.onboarding.welcome);
          }}
        />
        <RoleCard
          title={t.operator}
          hint={t.operatorHint}
          iconName="bus-outline"
          onPress={() => router.push(ROUTES.auth.login)}
        />
      </View>
    </SafeAreaContainer>
  );
}
