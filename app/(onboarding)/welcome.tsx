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
        <ThemedText variant="h50">Skip</ThemedText>
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
          <View key={item.id} className="flex-1 items-center justify-center px-6 pb-10">
            <Image source={item.image} className="h-[320px] w-[320px]" resizeMode="contain" />
            <Text className="mt-10 text-center font-puffin-bold text-h700 text-dodger-blue-500">
              {item.title}
            </Text>
            <ThemedText variant="h200">{item.subtitle}</ThemedText>
            <Text className="text-center text-h500 text-neutral-600">{item.subtitle}</Text>
          </View>
        ))}
      </Swiper>

      {/* Next / Get Started */}
      <TouchableOpacity
        onPress={handleNext}
        className="mx-auto mb-8 w-11/12 rounded-2xl bg-dodger-blue-600 py-4"
      >
        <Text className="text-center font-puffin-semibold text-h500 text-white">
          {isLastSlide ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </SafeAreaContainer>
  );
}
