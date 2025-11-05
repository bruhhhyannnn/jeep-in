import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import { router } from "expo-router";
import { onboardingData } from "../../data/onboardingData";
import ThemedText from "@/components/shared/ThemedText";
import SafeAreaContainer from "@/components/shared/SafeAreaContainer";

export default function WelcomeScreen() {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboardingData.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.replace("/(onboarding)/role-selection");
    } else {
      swiperRef.current?.scrollBy(1);
    }
  };

  return (
    <SafeAreaContainer className="items-center justify-center">
      {/* Skip Button */}
      <TouchableOpacity
        onPress={() => router.replace("/(onboarding)/role-selection")}
        className="w-full items-end"
      >
        <ThemedText variant="h300">Skip</ThemedText>
      </TouchableOpacity>

      {/* Swiper */}
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={true}
        dot={<View className="mx-1 h-1 w-8 rounded-full bg-neutral-400/50" />}
        activeDot={<View className="mx-1 h-1 w-8 rounded-full bg-dodger-blue-600" />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboardingData.map((item) => (
          <View key={item.id} className="gap- flex-1 items-center justify-center gap-5">
            <Image source={item.image} className="h-[320px] w-[320px]" resizeMode="contain" />
            <View>
              <ThemedText variant="h700" color="primary" className="text-center">
                {item.title}
              </ThemedText>
              <ThemedText variant="h400" color="secondary" className="text-center">
                {item.subtitle}
              </ThemedText>
            </View>
          </View>
        ))}
      </Swiper>

      {/* Next / Get Started */}
      <TouchableOpacity
        onPress={handleNext}
        className="mx-auto mb-8 w-11/12 rounded-2xl bg-dodger-blue-600 py-4"
      >
        <ThemedText variant="h400" color="primary" className="text-center">
          {isLastSlide ? "Get Started" : "Next"}
        </ThemedText>
      </TouchableOpacity>
    </SafeAreaContainer>
  );
}
