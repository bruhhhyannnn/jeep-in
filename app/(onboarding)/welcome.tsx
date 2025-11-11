import { ROUTES, STRINGS } from "@/constants";
import Swiper from "react-native-swiper";
import { useRef, useState } from "react";
import { Image, View } from "react-native";
import { router } from "expo-router";
import { onboardingData } from "@/data/onboardingData";
import { SafeAreaContainer, ButtonText, ButtonBack, ThemedView, ThemedText } from "@/components/ui";

export default function WelcomeScreen() {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboardingData.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.replace(ROUTES.onboarding.roleSelection);
    } else {
      swiperRef.current?.scrollBy(1);
    }
  };

  return (
    <SafeAreaContainer className="items-center justify-center">
      {/* Skip Button */}
      <View className="w-full items-end">
        <ButtonBack
          label={STRINGS.onboarding.welcome.skip}
          onPress={() => router.replace(ROUTES.onboarding.roleSelection)}
        />
      </View>

      {/* Swiper Cards */}
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={true}
        dot={<View className="mx-1 h-1 w-8 rounded-full bg-neutral-600" />}
        activeDot={<View className="mx-1 h-1 w-8 rounded-full bg-dodger-blue-600" />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboardingData.map((item) => (
          <ThemedView
            key={item.id}
            variant="bg_light"
            className="mx-1 mt-16 items-center justify-center gap-5 rounded-3xl p-5"
          >
            <View className="overflow-hidden rounded-2xl">
              <Image source={item.image} className="h-[320px] w-[320px]" resizeMode="cover" />
            </View>

            <View className="drop-shadow-lg">
              <ThemedText variant="h700" className="text-center">
                {item.title}
              </ThemedText>
              <ThemedText variant="h400" color="secondary" className="text-center">
                {item.subtitle}
              </ThemedText>
            </View>
          </ThemedView>
        ))}
      </Swiper>

      {/* Next / Get Started Button */}
      <ButtonText
        label={
          isLastSlide ? STRINGS.onboarding.welcome.getStarted : STRINGS.onboarding.welcome.next
        }
        fullWidth
        onPress={handleNext}
      />
    </SafeAreaContainer>
  );
}
