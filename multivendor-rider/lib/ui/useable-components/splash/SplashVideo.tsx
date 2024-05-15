import { StyleSheet, View } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { VideoView, useVideoPlayer, VideoPlayer } from 'expo-video';

interface SplashVideoProps {
  onLoaded?: () => void;
  onFinish?: () => void;
}

export default function SplashVideo({ onLoaded, onFinish }: SplashVideoProps) {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const playerRef = useRef<VideoPlayer | null>(null);

  const player = useVideoPlayer(require("@/lib/assets/video/mobile-splash.mp4"), (player) => {
    playerRef.current = player;
    player.loop = false;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener('statusChange', (status) => {
      console.log('Video status:', status); 
      
      if (status.isLoaded && !hasLoaded) {
        setHasLoaded(true);
        onLoaded?.();
      }
    });

    const endSubscription1 = player.addListener('playToEnd', () => {
      console.log('Video ended (playToEnd)'); 
      if (!hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    });

    const endSubscription2 = player.addListener('playbackEnd', () => {
      console.log('Video ended (playbackEnd)'); 
      if (!hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    });

    const endSubscription3 = player.addListener('didJustFinish', () => {
      console.log('Video ended (didJustFinish)'); 
      if (!hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    });

    const statusSubscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay' && !hasLoaded) {
        setHasLoaded(true);
        onLoaded?.();
      }

      if ((status.status === 'idle' || status.didJustFinish) && hasLoaded && !hasFinished) {
        console.log('Video ended via status change'); 
        setHasFinished(true);
        onFinish?.();
      }
    });

    return () => {
      subscription?.remove();
      endSubscription1?.remove();
      endSubscription2?.remove();
      endSubscription3?.remove();
      statusSubscription?.remove();
    };
  }, [player, hasLoaded, hasFinished, onLoaded, onFinish]);

  return (
    <View style={{ flex: 1 }}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        contentFit="cover"
      />
    </View>
  );
}