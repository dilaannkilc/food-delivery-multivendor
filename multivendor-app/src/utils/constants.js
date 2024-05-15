import { Easing } from 'react-native-reanimated'

export const IMAGE_LINK =
  'https://res.cloudinary.com/do1ia4vzf/image/upload/v1714636036/food/z3woendyhtelzarcmdcm.jpg'

export const SLIDE_UP_RIGHT_ANIMATION = {
  cardStyleInterpolator: ({ current, layouts }) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0]
    })

    const translateY = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-layouts.screen.height, 0]
    })

    return {
      cardStyle: {
        transform: [{ translateX }, { translateY }]
      }
    }
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.inOut(Easing.ease)
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200
      }
    }
  }
}

export const SLIDE_RIGHT_WITH_CURVE_ANIM = {
  cardStyleInterpolator: ({ current, layouts }) => {

    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0] 
    })

    const rotateY = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['-45deg', '0deg'] 
    })

    const perspective = 1000 

    const scale = current.progress.interpolate({
      inputRange: [0, 0.3, 0.6, 1],
      outputRange: [1.4, 1.2, 1.05, 1] 
    })

    return {
      cardStyle: {
        transform: [
          { translateX }, 
          { perspective }, 
          { rotateY }, 
          { scale } 
        ]
      }
    }
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 380, 
        easing: Easing.inOut(Easing.ease) 
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200 
      }
    }
  }
}

export const AIMATE_FROM_CENTER = {
  cardStyleInterpolator: ({ current, layouts }) => {

    const scale = current.progress.interpolate({
      inputRange: [0, 0.3, 0.6, 1],
      outputRange: [0, 0.3, 0.6, 1] 
    })

    return {
      cardStyle: {
        transform: [
          { scale } 
        ]
      }
    }
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 200, 
        easing: Easing.inOut(Easing.ease) 
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 100 
      }
    }
  }
}

export const SLIDE_UP_RIGHT_ANIMATION_FIXED_HEADER = {
  cardStyleInterpolator: ({ current, layouts }) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0]
    })

    const translateY = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-layouts.screen.height, 0]
    })

    return {
      cardStyle: {
        transform: [{ translateX }, { translateY }]
      }
    }
  },

  headerStyleInterpolator: ({ current }) => ({
    headerStyle: {
      opacity: 1, 
    },
  }),
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.inOut(Easing.ease)
      }
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200
      }
    }
  }
}