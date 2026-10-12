import { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loginWithEmailPassword } from "@/services/firebase/auth";
import { useAuthStore } from "@/store";
import { getUser } from "@/api";
import { ROUTES, STRINGS } from "@/constants";
import { Button, IconButton, TextField, ThemedText, ThemedView } from "@/components/ui";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-1.5">
      <ThemedText variant="label" tone="muted">
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

/** Email and password from the manager. Signing in lasts the whole shift. */
export default function LoginScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setRole = useAuthStore((s) => s.setRole);
  const t = STRINGS.auth;

  const handleLogin = async () => {
    try {
      setError(null);

      if (!email.trim() || !password.trim()) {
        setError(t.emailPasswordRequired);
        return;
      }

      setSubmitting(true);

      // 1) Authenticate
      const userCred = await loginWithEmailPassword(email.trim(), password);
      const uid = userCred.user.uid;

      // 2) Get user profile from Firestore
      const profile = await getUser(uid);
      if (!profile) {
        setError(t.userNotFound);
        return;
      }

      // 3) Only allow drivers to log in
      if (profile.role !== "driver") {
        setError(t.accountNotAllowed);
        return;
      }

      // 4) Persist role and route
      await setRole("driver");

      router.dismissAll();
      router.replace(ROUTES.driver.home);
    } catch {
      setError(t.invalidCredentials);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingTop: top + 12, paddingBottom: bottom + 24 }}
          contentContainerClassName="gap-7 px-5"
          keyboardShouldPersistTaps="handled"
        >
          {router.canGoBack() && (
            <View className="self-start">
              <IconButton
                iconName="arrow-back"
                accessibilityLabel="Back"
                onPress={() => router.back()}
              />
            </View>
          )}

          <View className="gap-2 pt-4">
            <Image
              source={require("@/assets/images/logo-jeep-in.png")}
              className="h-14 w-36"
              resizeMode="contain"
              accessibilityLabel={STRINGS.general.appName}
            />
            <ThemedText variant="title" accessibilityRole="header" className="mt-2">
              {t.title}
            </ThemedText>
            <ThemedText tone="muted">{t.subtitle}</ThemedText>
          </View>

          <View className="gap-4">
            <Field label={t.email}>
              <TextField
                placeholder={t.emailPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                shape="box"
              />
            </Field>
            <Field label={t.password}>
              <View>
                <TextField
                  ref={passwordRef}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                  shape="box"
                  className="pr-20"
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  accessibilityRole="button"
                  hitSlop={8}
                  className="absolute bottom-0 right-4 top-0 justify-center"
                >
                  <ThemedText variant="label">{showPassword ? t.hide : t.show}</ThemedText>
                </Pressable>
              </View>
            </Field>

            {error && (
              <View
                className="rounded-tile bg-danger-tint px-4 py-3"
                accessibilityLiveRegion="polite"
              >
                <ThemedText variant="small" tone="danger">
                  {error}
                </ThemedText>
              </View>
            )}

            <Button
              label={submitting ? t.signingIn : t.signIn}
              onPress={handleLogin}
              disabled={submitting}
            />
            <ThemedText variant="label" tone="muted" className="text-center">
              {t.forgot}
            </ThemedText>
            <ThemedText variant="small" tone="muted" className="text-center">
              {t.lasts}
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
