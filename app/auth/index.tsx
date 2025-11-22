import { useState } from "react";
import { router } from "expo-router";
import { ThemedText, CustomTextInput, ButtonText, ThemedView } from "@/components/ui";
import { loginWithEmailPassword } from "@/services/firebase/auth";
import { useRoleStore } from "@/context";
import { Image, View } from "react-native";
import { getUserProfile } from "@/services/firebase/users";
import { UserRole } from "@/types";
import { ROUTES } from "@/constants";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setRole } = useRoleStore();

  const handleLogin = async () => {
    try {
      setError(null);

      if (!email.trim() || !password.trim()) {
        setError("Both email and password are required.");
        return;
      }

      setSubmitting(true);

      // 1) Authenticate
      const userCred = await loginWithEmailPassword(email.trim(), password);
      const uid = userCred.user.uid;

      // 2) Get user profile
      const profile = await getUserProfile(uid);
      if (!profile) {
        setError("User not found.");
        return;
      }

      const role = profile.role as UserRole;

      // 3) Only allow DRIVERS to log in
      if (role !== "driver") {
        setError("This account is not allowed to sign in.");
        return;
      }

      // 4) Set role and route
      await setRole("driver");
      router.dismissAll();
      router.replace(ROUTES.driver.home);
    } catch (e: any) {
      console.log("Driver login error:", e);
      setError("Invalid credentials or network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView className="flex-1 justify-start gap-6 px-6 pt-56">
      {/* Image Container */}
      <View className="flex-row items-center justify-center gap-2">
        <Image
          source={require("@/assets/images/logo-mmsu.png")}
          className="h-20 w-20"
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/logo-jeep-in.png")}
          className="h-16 w-40"
          resizeMode="contain"
        />
      </View>

      <ThemedView variant="bg_light" className="gap-4 rounded-2xl p-5">
        <ThemedText variant="h700">Sign In to JEEP'IN</ThemedText>

        <CustomTextInput
          placeholder="Email"
          variant="bg"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          iconName="mail-outline"
        />

        <CustomTextInput
          placeholder="Password"
          variant="bg"
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
          label={submitting ? "Signing in..." : "Sign in"}
          onPress={handleLogin}
          disabled={submitting}
          iconName="log-in-outline"
        />
      </ThemedView>
    </ThemedView>
  );
}
