import { useRef, useState, type FormEvent } from "react";
import { getUser } from "@/api";
import { ROUTES, STRINGS } from "@/constants";
import { useSafeAreaInsets } from "@/hooks";
import { router } from "@/lib/router";
import { loginWithEmailPassword, logout } from "@/services/firebase/auth";
import { layout } from "@/theme";
import { Button, Pressable, TextField, ThemedText, ThemedView, View } from "@/components/ui";
import logoJeepIn from "@/assets/images/logo-jeep-in.png";

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
  const passwordRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        await logout();
        setError(t.userNotFound);
        return;
      }

      // 3) Only allow drivers to sign in; don't leave anyone else signed in here
      if (profile.role !== "driver") {
        await logout();
        setError(t.accountNotAllowed);
        return;
      }

      router.replace(ROUTES.driver.home);
    } catch {
      setError(t.invalidCredentials);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!submitting) handleLogin();
  };

  return (
    <ThemedView className="flex-1">
      <View className="no-scrollbar flex-1 overflow-y-auto">
        <form
          onSubmit={onSubmit}
          noValidate
          style={{
            paddingTop: top + 12,
            paddingBottom: bottom + 24,
            maxWidth: layout.contentMaxWidth,
          }}
          className="view w-full gap-7 self-center px-5"
        >
          <View className="gap-2 pt-4">
            <img
              src={logoJeepIn}
              alt={STRINGS.general.appName}
              className="h-14 w-36 object-contain object-left"
            />
            <ThemedText variant="title" accessibilityRole="header" className="mt-2">
              {t.title}
            </ThemedText>
            <ThemedText tone="muted">{t.subtitle}</ThemedText>
          </View>

          <View className="gap-4">
            <Field label={t.email}>
              <TextField
                type="email"
                inputMode="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                enterKeyHint="next"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    passwordRef.current?.focus();
                  }
                }}
                accessibilityLabel={t.email}
                shape="box"
              />
            </Field>
            <Field label={t.password}>
              <View>
                <TextField
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  enterKeyHint="go"
                  accessibilityLabel={t.password}
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
        </form>
      </View>
    </ThemedView>
  );
}
