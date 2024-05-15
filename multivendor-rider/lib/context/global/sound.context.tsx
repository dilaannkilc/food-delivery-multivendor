
import { useContext, useEffect, useState, createContext } from "react";
import { AudioPlayer, useAudioPlayer, AudioSource } from "expo-audio";

import {
  ISoundContext,
  ISoundContextProviderProps,
} from "@/lib/utils/interfaces";

import { useUserContext } from "./user.context";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

const SoundContext = createContext<ISoundContext>({} as ISoundContext);

export const SoundProvider = ({ children }: ISoundContextProviderProps) => {

  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { assignedOrders } = useUserContext();

  const player = useAudioPlayer(require("@/lib/assets/sound/beep3.mp3") as AudioSource);

  const playSound = async () => {
    try {
      await stopSound();


      
      player.loop = true;
      player.play();
      setAudioPlayer(player);
      setIsPlaying(true);
    } catch (err) {
      console.log("Error playing sound:", err);
    }
  };

  const stopSound = async () => {
    if (audioPlayer && isPlaying) {
      try {
        audioPlayer.pause();
        setIsPlaying(false);
      } catch (err) {
        console.log("Error stopping sound:", err);
      }
    }
  };

  useEffect(() => {
    const playingSubscription = player.addListener('playingChange', (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      playingSubscription?.remove();
    };
  }, [player]);

  useEffect(() => {
    if (assignedOrders) {

      const new_order = assignedOrders?.find(
        (o: IOrder) => o.orderStatus === "ACCEPTED" && !o?.isPickedUp,
      );

      const shouldPlaySound = !!new_order;

      if (shouldPlaySound && !isPlaying) {
        playSound();
      } else if (!shouldPlaySound && isPlaying) {
        stopSound();
      }
    } else {
      stopSound();
    }

    return () => {
      if (isPlaying) {
        stopSound();
      }
    };
  }, [assignedOrders, isPlaying]);

  useEffect(() => {
    return () => {
      if (isPlaying) {
        player.pause();
      }
    };
  }, []);

  return (
    <SoundContext.Provider value={{ playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const SoundContextConsumer = SoundContext.Consumer;
export const useSoundContext = () => useContext(SoundContext);
export default SoundContext;