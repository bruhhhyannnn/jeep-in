import { useState } from "react";
import { router } from "expo-router";
import { ThemedText, CustomTextInput, ButtonText, ThemedView } from "@/components/ui";
import { loginWithEmailPassword } from "@/services/firebase/auth";
import { useRoleStore } from "@/context";

export default function DriverAuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setRole } = useRoleStore();

  const handleLogin = async () => {
    try {
      setError(null);

      // --- Simple required field validation ---
      if (!email.trim() || !password.trim()) {
        setError("Both email and password are required.");
        return;
      }

      setSubmitting(true);
      setError(null);

      // Login with firebase email password
      await loginWithEmailPassword(email.trim(), password);

      // Remove all stacked screens
      router.dismissAll();

      // Set role as driver
      await setRole("driver");

      // After login, push/replace to driver home
      router.replace("/(driver)/home");
    } catch (e: any) {
      console.log("Driver login error:", e);
      setError("Invalid credentials or network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView className="flex-1 justify-center px-6">
      <ThemedView variant="bg_light" className="gap-4 rounded-2xl p-5">
        <ThemedText variant="h700">Driver Login</ThemedText>

        <CustomTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          iconName="mail-outline"
        />

        <CustomTextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          iconName="lock-closed-outline"
        />

        {error && (
          <ThemedText variant="h100" className="text-warning-600 dark:text-warning-600">
            {error}
          </ThemedText>
        )}

        <ButtonText
          label={submitting ? "Signing in..." : "Sign in as Driver"}
          onPress={handleLogin}
          disabled={submitting}
          iconName="log-in-outline"
        />
      </ThemedView>
    </ThemedView>
  );
}
