
import "expo-dev-client";
import * as SplashScreen from "expo-splash-screen";

import { StyleSheet, View } from "react-native";

import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import SplashVideo from "./SplashVideo";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

export default function AnimatedSplashScreen({
  children,
}: {
  children: ReactNode;
}) {

  const [isAppReady, setAppReady] = useState(false);
  const [isSplashVideoComplete, setSplashVideoComplete] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  const opacityAnimation = useSharedValue(1); 
  const scaleAnimation = useSharedValue(1); 

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();

      await Promise.all([]);
    } catch (e) {
      const err = e as Error;
      console.log(err);

    } finally {
      setAppReady(true);
    }
  }, []);

  const videoElement = useMemo(() => {
    return (
      <SplashVideo
        onLoaded={onImageLoaded}
        onFinish={() => {
          setSplashVideoComplete(true); 
        }}
      />
    );
  }, [onImageLoaded]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityAnimation.value, 
      transform: [{ scale: scaleAnimation.value }], 
    };
  });

  useEffect(() => {
    if (isAppReady && isSplashVideoComplete) {

      opacityAnimation.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });

      scaleAnimation.value = withTiming(
        2,
        {
          duration: 300,
          easing: Easing.out(Easing.exp),
        },
        () => {
          runOnJS(setAnimationComplete)(true); 
        },
      );
    }
  }, [isAppReady, isSplashVideoComplete]);
  return (
    <View style={{ flex: 1 }}>
      {isSplashAnimationComplete ? children : null}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          animatedStyle,
          { backgroundColor: "black" },
        ]}
      >
        {videoElement}
      </Animated.View>
    </View>
  );
}
