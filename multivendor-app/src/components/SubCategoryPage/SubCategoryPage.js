import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Easing,
  ActivityIndicator
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import ReAnimated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  runOnJS
} from 'react-native-reanimated'
import { useQuery } from '@apollo/client'
import LottieView from 'lottie-react-native'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native-paper'
import { GET_SUB_CATEGORIES } from '../../apollo/queries'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'
import { useRestaurant } from '../../ui/hooks'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import SearchOverlay from '../SearchOverlay/searchOverlay'
import CategoryPageHeader from './CategoryHeader/CategoryHeader'
import FoodItem from './FoodItem/FoodItem'
import callStyles from './styles'

const SCREEN_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = 180
const MAX_CHAR_LEN = 20

const debugLog = (message, type = 'info') => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 12)
  const prefix =
    type === 'error'
      ? '❌'
      : type === 'success'
        ? '✅'
        : type === 'warning'
          ? '⚠️'
          : 'ℹ️'
  console.log(`${prefix} [${timestamp}] ${message}`)
}

const CategoryTabSkeleton = ({ currentTheme }) => {
  const animatedOpacity = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.5,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [])

  return (
    <Animated.View
      style={[
        styles.categoryTabSkeleton,
        {
          backgroundColor: currentTheme?.gray || '#ddd',
          opacity: animatedOpacity
        }
      ]}
    />
  )
}

const CategoryTabsSkeleton = ({ currentTheme }) => {
  return (
    <View style={styles.categoryTabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Array(4).fill(0).map((_, index) => (
          <CategoryTabSkeleton key={`tab-skeleton-${index}`} currentTheme={currentTheme} />
        ))}
      </ScrollView>
    </View>
  )
}

const FoodItemSkeleton = ({ currentTheme }) => {
  const animatedOpacity = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.5,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [])

  return (
    <View style={styles.foodItemContainer}>
      <Animated.View
        style={[
          styles.foodItemCard,
          {
            backgroundColor: currentTheme?.cardBackground || '#fff',
            opacity: animatedOpacity
          }
        ]}
      >
        <Animated.View
          style={[
            styles.addButton,
            { backgroundColor: currentTheme?.plusIcon || '#000' }
          ]}
        />
        <Animated.View
          style={[
            styles.imageContainer,
            { backgroundColor: currentTheme?.gray || '#ddd' }
          ]}
        />
        <View style={styles.detailsContainer}>
          <Animated.View
            style={[
              styles.priceSkeleton,
              { backgroundColor: currentTheme?.gray || '#ddd' }
            ]}
          />
          <Animated.View
            style={[
              styles.titleSkeleton,
              { backgroundColor: currentTheme?.gray || '#ddd' }
            ]}
          />
        </View>
      </Animated.View>
    </View>
  )
}

const FoodItemsGridSkeleton = ({ currentTheme, count = 6 }) => {
  return (
    <View style={styles.foodList}>
      <FlatList
        data={Array(count).fill(0)}
        keyExtractor={(_, index) => `skeleton-${index}`}
        numColumns={2}
        scrollEnabled={true}
        renderItem={() => <FoodItemSkeleton currentTheme={currentTheme} />}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ gap: 20 }}
      />
    </View>
  )
}

const CategoryPage = ({ route, navigation }) => {

  const { restaurantName, deliveryTime, category, restaurantId } = route.params

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)
  const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] = useState(0)
  const [tabs, setTabs] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [initialRender, setInitialRender] = useState(true)

  const [preloadedFoodItems, setPreloadedFoodItems] = useState({})
  const [currentFoodItems, setCurrentFoodItems] = useState([])
  const [isChangingCategory, setIsChangingCategory] = useState(false)

  const categoryScrollRef = useRef(null)
  const subcategoryScrollRef = useRef(null)
  const swipeInProgress = useRef(false)

  const translateX = useSharedValue(0)
  const opacity = useSharedValue(1)

  const { t, i18n } = useTranslation()

  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const { cartCount } = useContext(UserContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const NO_ITEM_AVAILABLE = require('../../assets/SVG/ItemUnavailable.json')

  const { data: restaurantData, loading: restaurantLoading } = useRestaurant(restaurantId)
  const { data: subcategoriesData, loading: subcategoriesLoading } = useQuery(GET_SUB_CATEGORIES)

  const scaleValue = useRef(new Animated.Value(1)).current

  const handleOpenSearch = () => {
    setIsSearchVisible(true)
  }
  const handleCloseSearch = () => {
    setIsSearchVisible(false)
  }

  const preloadAllFoodItems = (restaurantCategories, subcategoriesData) => {
    debugLog('🍕 PRELOADING ALL FOOD ITEMS...')
    
    const foodItemsCache = {}
    
    restaurantCategories.forEach((category, categoryIndex) => {
      debugLog(`Processing category ${categoryIndex}: ${category.title}`)
      
      const categorySubcategories = subcategoriesData.subCategories.filter(
        (sub) => sub.parentCategoryId === category._id
      )

      const sortedSubcategories = categorySubcategories.sort((a, b) => 
        a.title.localeCompare(b.title)
      )

      const categoryKey = `category_${categoryIndex}`
      foodItemsCache[categoryKey] = {}
      
      if (sortedSubcategories.length > 0) {

        sortedSubcategories.forEach((subcategory, subIndex) => {
          const subKey = `sub_${subIndex}`
          const foodItems = category.foods.filter(
            (food) => food.subCategory === subcategory._id
          )
          foodItemsCache[categoryKey][subKey] = foodItems
          debugLog(`  Subcategory ${subIndex} (${subcategory.title}): ${foodItems.length} items`)
        })
      } else {

        foodItemsCache[categoryKey]['no_sub'] = category.foods
        debugLog(`  No subcategories: ${category.foods.length} items`)
      }
    })
    
    debugLog('🍕 FOOD ITEMS PRELOADING COMPLETE!', 'success')
    setPreloadedFoodItems(foodItemsCache)
  }

  const getCurrentFoodItems = () => {
    if (!preloadedFoodItems || Object.keys(preloadedFoodItems).length === 0) {
      return []
    }
    
    const categoryKey = `category_${selectedCategoryIndex}`
    const categoryCache = preloadedFoodItems[categoryKey]
    
    if (!categoryCache) {
      return []
    }

    if (subCategories[selectedCategoryIndex]?.length > 0) {
      const subKey = `sub_${selectedSubcategoryIndex}`
      return categoryCache[subKey] || []
    } else {
      return categoryCache['no_sub'] || []
    }
  }

  const preprocessSubcategories = (subcategoriesData, restaurantCategories) => {
    if (!subcategoriesData?.subCategories || !restaurantCategories) {
      return []
    }

    debugLog('Preprocessing subcategories for consistent sorting...')
    
    const processedSubcategories = []
    
    restaurantCategories.forEach((category, categoryIndex) => {
      const categorySubcategories = subcategoriesData.subCategories.filter(
        (sub) => sub.parentCategoryId === category._id
      )

      const sortedSubcategories = categorySubcategories.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })

      const subcategoriesWithIndex = sortedSubcategories.map((sub, index) => ({
        ...sub,
        originalIndex: index,
        categoryIndex
      }))
      
      processedSubcategories.push(subcategoriesWithIndex)
      
      debugLog(
        `Category ${categoryIndex} (${category.title}): ${subcategoriesWithIndex.length} subcategories sorted`,
        'success'
      )
    })
    
    return processedSubcategories
  }

  const createDisplayData = (originalData, isRTL) => {
    if (!originalData || originalData.length === 0) return []

    const dataWithIndex = originalData.map((item, index) => ({
      ...item,
      originalIndex: index,
      displayIndex: index
    }))

    if (isRTL) {

      const reversed = [...dataWithIndex].reverse()

      return reversed.map((item, index) => ({
        ...item,
        displayIndex: index
      }))
    }

    return dataWithIndex
  }

  const displayTabs = createDisplayData(tabs, currentTheme.isRTL)
  const displaySubcategories = createDisplayData(
    subCategories[selectedCategoryIndex] || [],
    currentTheme.isRTL
  )

  const scrollToSelectedSimple = (
    scrollRef,
    displayIndex,
    itemsArray,
    scrollType,
    animated = true
  ) => {
    debugLog(`=== ${scrollType.toUpperCase()} SIMPLE SCROLL START ===`)
    debugLog(
      `Display index: ${displayIndex}, Items count: ${itemsArray.length}, RTL: ${currentTheme.isRTL}`
    )

    if (!scrollRef.current || itemsArray.length === 0) {
      debugLog('ScrollRef or items not ready', 'warning')
      return
    }

    const totalContentWidth = itemsArray.length * ITEM_WIDTH
    const maxScrollX = Math.max(0, totalContentWidth - SCREEN_WIDTH)

    debugLog(`Content width: ${totalContentWidth}, Max scroll: ${maxScrollX}`)

    let targetScrollX = 0

    if (currentTheme.isRTL) {

      debugLog('RTL: Positioning at RIGHT corner')
      if (totalContentWidth <= SCREEN_WIDTH) {
        targetScrollX = 0
        debugLog('All items fit, no scroll needed')
      } else {

        const itemStartPosition = displayIndex * ITEM_WIDTH
        const itemEndPosition = itemStartPosition + ITEM_WIDTH

        targetScrollX = Math.max(0, itemEndPosition - SCREEN_WIDTH)
        targetScrollX = Math.min(targetScrollX, maxScrollX)
        
        debugLog(
          `RTL: Item start ${itemStartPosition}, end ${itemEndPosition}, target scroll ${targetScrollX}`
        )
      }
    } else {

      debugLog('LTR: Positioning at LEFT corner')

      if (displayIndex === 0) {
        targetScrollX = 0
        debugLog('First item - scroll to beginning')
      } else {

        targetScrollX = displayIndex * ITEM_WIDTH

        targetScrollX = Math.max(0, targetScrollX)
        targetScrollX = Math.min(targetScrollX, maxScrollX)
        
        debugLog(`LTR: Calculated target scroll: ${targetScrollX}`)
      }
    }

    debugLog(`Final scroll position: ${targetScrollX}`, 'success')
    debugLog(`=== ${scrollType.toUpperCase()} SIMPLE SCROLL END ===`)

    scrollRef.current.scrollTo({ x: targetScrollX, animated })
  }

  const scrollCategoryToSelected = (
    scrollRef,
    displayIndex,
    animated = true
  ) => {
    scrollToSelectedSimple(
      scrollRef,
      displayIndex,
      displayTabs,
      'CATEGORY',
      animated
    )
  }

  const scrollSubcategoryToSelected = (
    scrollRef,
    displayIndex,
    animated = true
  ) => {
    scrollToSelectedSimple(
      scrollRef,
      displayIndex,
      displaySubcategories,
      'SUBCATEGORY',
      animated
    )
  }

  const resetSubcategoryToCorrectPosition = (categoryIndex) => {
    debugLog('Resetting subcategory to show correct item at corner')

    const currentSubcategories = subCategories[categoryIndex] || []
    const currentDisplaySubcategories = createDisplayData(currentSubcategories, currentTheme.isRTL)
    
    debugLog(`Current subcategories count: ${currentSubcategories.length}`)
    debugLog(`Current display subcategories count: ${currentDisplaySubcategories.length}`)
    
    if (subcategoryScrollRef.current && currentDisplaySubcategories.length > 0) {
      if (currentTheme.isRTL) {

        const lastDisplayIndex = currentDisplaySubcategories.length - 1
        scrollToSelectedSimple(
          subcategoryScrollRef,
          lastDisplayIndex,
          currentDisplaySubcategories,
          'SUBCATEGORY_RESET',
          false
        )
        debugLog(`RTL: Positioning last subcategory (display index ${lastDisplayIndex}) at right corner`)
      } else {

        scrollToSelectedSimple(
          subcategoryScrollRef,
          0,
          currentDisplaySubcategories,
          'SUBCATEGORY_RESET',
          false
        )
        debugLog(`LTR: Positioning first subcategory (display index 0) at left corner`)
      }
    } else {
      debugLog('Subcategory scroll ref not ready or no subcategories', 'warning')
    }
  }

  const handleSwipeNavigation = (direction) => {
    if (!isDataLoaded || swipeInProgress.current) {
      debugLog('Data not loaded or swipe in progress, ignoring swipe', 'warning')
      return
    }

    swipeInProgress.current = true
    setIsChangingCategory(true)

    debugLog(`=== SWIPE NAVIGATION START ===`)
    debugLog(`Swipe direction: ${direction > 0 ? 'NEXT' : 'PREVIOUS'}`)
    debugLog(`RTL: ${currentTheme.isRTL}`)
    debugLog(`Current category: ${selectedCategoryIndex}`)
    debugLog(`Current subcategory: ${selectedSubcategoryIndex}`)
    debugLog(`Total subcategories: ${subCategories[selectedCategoryIndex]?.length || 0}`)

    const currentSubcategories = subCategories[selectedCategoryIndex] || []
    const maxSubcategoryIndex = currentSubcategories.length - 1
    const maxCategoryIndex = tabs.length - 1

    const nextSubcategoryIndex = selectedSubcategoryIndex + direction

    if (nextSubcategoryIndex >= 0 && nextSubcategoryIndex <= maxSubcategoryIndex) {

      debugLog(`Moving within subcategories: ${selectedSubcategoryIndex} → ${nextSubcategoryIndex}`)
      
      setSelectedSubcategoryIndex(nextSubcategoryIndex)

      const currentDisplaySubcategories = createDisplayData(currentSubcategories, currentTheme.isRTL)
      const targetDisplayIndex = currentDisplaySubcategories.findIndex(
        item => item.originalIndex === nextSubcategoryIndex
      )
      
      debugLog(`Target subcategory display index: ${targetDisplayIndex}`)
      
      if (targetDisplayIndex !== -1) {
        setTimeout(() => {
          scrollSubcategoryToSelected(
            subcategoryScrollRef,
            targetDisplayIndex,
            true
          )
        }, 10)
      }
    } else {

      const nextCategoryIndex = selectedCategoryIndex + direction
      
      if (nextCategoryIndex >= 0 && nextCategoryIndex <= maxCategoryIndex) {
        debugLog(`Moving to ${direction > 0 ? 'next' : 'previous'} category: ${selectedCategoryIndex} → ${nextCategoryIndex}`)

        const nextCategorySubcategories = subCategories[nextCategoryIndex] || []
        let newSubcategoryIndex = 0
        
        if (currentTheme.isRTL) {


          newSubcategoryIndex = direction > 0 ? (nextCategorySubcategories.length - 1) : 0
        } else {


          newSubcategoryIndex = direction > 0 ? 0 : (nextCategorySubcategories.length - 1)
        }
        
        debugLog(`New category subcategories: ${nextCategorySubcategories.length}`)
        debugLog(`New subcategory index: ${newSubcategoryIndex}`)

        setSelectedCategoryIndex(nextCategoryIndex)
        setSelectedSubcategoryIndex(newSubcategoryIndex)

        const categoryDisplayIndex = currentTheme.isRTL 
          ? displayTabs.findIndex(item => item.originalIndex === nextCategoryIndex)
          : nextCategoryIndex
        
        setTimeout(() => {
          scrollCategoryToSelected(categoryScrollRef, categoryDisplayIndex, true)
        }, 10)

        setTimeout(() => {
          resetSubcategoryToCorrectPosition(nextCategoryIndex)
        }, 100)
      } else {
        debugLog(`Cannot move to category index ${nextCategoryIndex} (out of bounds)`, 'warning')
      }
    }

    setTimeout(() => {
      swipeInProgress.current = false
      setIsChangingCategory(false)
    }, 300)
    
    debugLog(`=== SWIPE NAVIGATION END ===`)
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15]) 
    .failOffsetY([-25, 25])   
    .onUpdate((event) => {

      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        translateX.value = event.translationX
      }
    })
    .onEnd((event) => {
      const swipeDistance = event.translationX
      const threshold = 50 
      
      if (Math.abs(swipeDistance) > threshold) {
        let direction = 0
        
        if (currentTheme.isRTL) {

          direction = swipeDistance > 0 ? 1 : -1
        } else {

          direction = swipeDistance < 0 ? 1 : -1
        }
        
        runOnJS(handleSwipeNavigation)(direction)
      }

      translateX.value = withTiming(0, { duration: 200 })
    })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    }
  })

  const preloadAllData = () => {
    debugLog('=== PRELOADING ALL DATA ===')

    if (
      !restaurantData?.restaurant?.categories ||
      !subcategoriesData?.subCategories
    ) {
      debugLog('Restaurant data or subcategories data not ready', 'warning')
      return
    }

    const categories = restaurantData.restaurant.categories.map(category => ({
      _id: category._id,
      name: category.title
    }))

    const processedSubcategories = preprocessSubcategories(
      subcategoriesData,
      restaurantData.restaurant.categories
    )

    preloadAllFoodItems(
      restaurantData.restaurant.categories,
      subcategoriesData
    )

    debugLog(`Categories loaded: ${categories.length}`, 'success')
    debugLog(
      `Subcategories preloaded for all categories: ${processedSubcategories.map(
        (subs, i) => `Category ${i}: ${subs.length} subcategories`
      ).join(', ')}`
    )

    setTabs(categories)
    setSubCategories(processedSubcategories)

    let targetCategoryIndex = 0
    if (category) {
      const ctgryIndex = categories.findIndex(
        (cat) => cat._id === category.id || cat._id === category._id
      )
      if (ctgryIndex !== -1) {
        targetCategoryIndex = ctgryIndex
        debugLog(
          `Found target category at index: ${targetCategoryIndex}`,
          'success'
        )
      }
    }

    setSelectedCategoryIndex(targetCategoryIndex)
    setSelectedSubcategoryIndex(0)
    setIsDataLoaded(true)
    setIsInitialized(true)
    
    debugLog('=== DATA PRELOADING COMPLETE ===', 'success')
  }

  const handleCategoryPress = (displayIndex) => {
    if (!isDataLoaded) {
      debugLog('Data not loaded yet, ignoring category press', 'warning')
      return
    }

    const selectedItem = displayTabs[displayIndex]
    const originalIndex = selectedItem.originalIndex

    debugLog(
      `Category TAP: display[${displayIndex}] -> original[${originalIndex}] - ${selectedItem?.name}`
    )

    setSelectedCategoryIndex(originalIndex)
    setSelectedSubcategoryIndex(0)
    setIsChangingCategory(true)

    setTimeout(() => {
      scrollCategoryToSelected(categoryScrollRef, displayIndex, true)
      setTimeout(() => {
        resetSubcategoryToCorrectPosition(originalIndex)
        setIsChangingCategory(false)
      }, 100)
    }, 10)
  }

  const handleSubcategoryPress = (displayIndex) => {
    if (!isDataLoaded) {
      debugLog('Data not loaded yet, ignoring subcategory press', 'warning')
      return
    }

    const selectedItem = displaySubcategories[displayIndex]
    const originalIndex = selectedItem.originalIndex

    debugLog(
      `Subcategory TAP: display[${displayIndex}] -> original[${originalIndex}] - ${selectedItem?.title}`
    )

    setSelectedSubcategoryIndex(originalIndex)


    
    setTimeout(() => {
      scrollSubcategoryToSelected(subcategoryScrollRef, displayIndex, true)
    }, 10)
  }

  const MemoizedFlatList = React.memo(({ data }) => {

    const AnimatedItem = ({ index, children }) => {
      const itemOpacity = useRef(new Animated.Value(0)).current

      useEffect(() => {
        Animated.timing(itemOpacity, {
          toValue: 1,
          delay: index * 40,
          duration: 500,
          useNativeDriver: true
        }).start()
      }, [])

      return (
        <Animated.View style={{ opacity: itemOpacity }}>
          {children}
        </Animated.View>
      )
    }

    if (isChangingCategory) {
      return <FoodItemsGridSkeleton currentTheme={currentTheme} count={6} />
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        numColumns={2}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        bounces={true}
        style={styles.foodList}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 20,
          paddingHorizontal: 3,
          paddingBottom: 100
        }}
        renderItem={({ item, index }) => {
          return (
            <AnimatedItem index={index}>
              <View style={styles.foodItemContainer} key={item?._id}>
                <FoodItem
                  item={item}
                  currentTheme={currentTheme}
                  configuration={configuration}
                  onPress={() => {
                    navigation.navigate('ItemDetail', {
                      food: {
                        ...item,
                        restaurant: restaurantId,
                        restaurantName: restaurantData?.restaurant?.name
                      },
                      addons: restaurantData?.restaurant?.addons || [],
                      options: restaurantData?.restaurant?.options || [],
                      restaurant: restaurantId
                    })
                  }}
                />
              </View>
            </AnimatedItem>
          )
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {!initialRender && (
              <>
                <LottieView
                  source={NO_ITEM_AVAILABLE}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                <Text
                  style={{
                    color:
                      callStyles(currentTheme).backgroundColor === '#000'
                        ? 'white'
                        : 'black',
                    fontSize: 20
                  }}
                >
                  No Items Available
                </Text>
              </>
            )}
          </View>
        }
        columnWrapperStyle={{ gap: 10 }}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={4}
        windowSize={10}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    )
  })

  useEffect(() => {
    if (isDataLoaded && Object.keys(preloadedFoodItems).length > 0) {
      const foodItems = getCurrentFoodItems()
      setCurrentFoodItems(foodItems)
      debugLog(`🍕 Updated food items: ${foodItems.length} items`)
    }
  }, [selectedCategoryIndex, selectedSubcategoryIndex, preloadedFoodItems, isDataLoaded])

  useEffect(() => {
    if (isInitialized && isDataLoaded && tabs.length > 0) {
      debugLog(
        `Initializing scroll position - RTL: ${currentTheme.isRTL}, selectedCategoryIndex: ${selectedCategoryIndex}`
      )

      const timer = setTimeout(() => {
        let displayIndex = selectedCategoryIndex
        if (currentTheme.isRTL) {
          displayIndex = displayTabs.findIndex(
            item => item.originalIndex === selectedCategoryIndex
          )
        }

        scrollCategoryToSelected(categoryScrollRef, displayIndex, false)

        if (subCategories[selectedCategoryIndex]?.length > 0) {
          setTimeout(() => {
            resetSubcategoryToCorrectPosition(selectedCategoryIndex)
          }, 100)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isInitialized, isDataLoaded, tabs.length, subCategories.length, currentTheme.isRTL])

  useEffect(() => {
    if (restaurantData?.restaurant?.categories && subcategoriesData?.subCategories) {
      setIsInitialized(false)
      setIsDataLoaded(false)
      preloadAllData()
    }
  }, [
    restaurantData?.restaurant?.categories,
    subcategoriesData?.subCategories,
    currentTheme.isRTL
  ])

  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [cartCount])

  useEffect(() => {
    if (initialRender) {
      setTimeout(() => {
        setInitialRender(false)
      }, 3000)
    }
  }, [initialRender])

  if (!isDataLoaded || restaurantLoading || subcategoriesLoading) {
    return (
      <View style={[callStyles(currentTheme).container, { flex: 1 }]}>
        <StatusBar
          barStyle={
            themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
          }
          backgroundColor='transparent'
          translucent={true}
        />
        
        <CategoryPageHeader
          navigation={navigation}
          restaurantName={restaurantName}
          deliveryTime={deliveryTime}
          currentTheme={currentTheme}
          onOpenSearch={handleOpenSearch}
        />
        
        <CategoryTabsSkeleton currentTheme={currentTheme} />
        <FoodItemsGridSkeleton currentTheme={currentTheme} count={8} />
      </View>
    )
  }

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <View style={[callStyles(currentTheme).container, { flex: 1 }]}>
          <StatusBar
            barStyle={
              themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
            }
            backgroundColor='transparent'
            translucent={true}
          />

          <CategoryPageHeader
            navigation={navigation}
            restaurantName={restaurantName}
            deliveryTime={deliveryTime}
            currentTheme={currentTheme}
            onOpenSearch={handleOpenSearch}
          />

          <View
            style={[
              styles.container,
              {
                backgroundColor: callStyles(currentTheme).backgroundColor,
                flex: 1
              }
            ]}
          >
            {}
            <View style={{ zIndex: 2 }}>
              <ScrollView
                horizontal
                ref={categoryScrollRef}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={[
                    callStyles(currentTheme).container2,
                    { minWidth: SCREEN_WIDTH }
                  ]}
                >
                  {displayTabs?.map((tab, displayIndex) => {
                    const isSelected = tab.originalIndex === selectedCategoryIndex
                    return (
                      <TouchableOpacity
                        key={`${tab._id}-${displayIndex}`}
                        style={[
                          callStyles(currentTheme).categoryItem,
                          isSelected && callStyles(currentTheme).selectedCategoryItem,
                          {
                            direction: currentTheme.isRTL ? "rtl" : "ltr",
                            flexDirection: currentTheme.isRTL ? 'row-reverse' : 'row',
                          }
                        ]}
                        onPress={() => handleCategoryPress(displayIndex)}
                      >
                        <TextDefault
                          style={[
                            callStyles(currentTheme).categoryText,
                            isSelected &&
                            callStyles(currentTheme).selectedCategoryText
                          ]}
                          textColor={
                            isSelected
                              ? currentTheme.buttonText
                              : currentTheme.fontMainColor
                          }
                        >
                          {tab.name.length > MAX_CHAR_LEN
                            ? tab.name.slice(0, MAX_CHAR_LEN) + '...'
                            : tab.name}
                        </TextDefault>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </ScrollView>
            </View>

            {}
            {displaySubcategories?.length > 0 && (
              <View style={{ zIndex: 2 }}>
                <ScrollView
                  horizontal
                  ref={subcategoryScrollRef}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    height: 50,
                    backgroundColor: callStyles(currentTheme).topSectionColor,
                    width: "100%",
                  }}
                  contentContainerStyle={{ alignItems: "center" }}
                >
                  <View style={[styles.subcategoryContainer]}>
                    {displaySubcategories?.map((sub, displayIndex) => {
                      const isSelected = sub.originalIndex === selectedSubcategoryIndex
                      return (
                        <TouchableOpacity
                          key={`${sub._id}-${displayIndex}`}
                          style={[

                            currentTheme.isRTL 
                              ? callStyles(currentTheme).subcategoryItem     
                              : callStyles(currentTheme).subcategoryItemltr, 
                            isSelected && callStyles(currentTheme).selectedSubcategoryItem,
                            {
                              direction: currentTheme.isRTL ? "rtl" : "ltr",
                              flexDirection: currentTheme.isRTL ? 'row-reverse' : 'row',
                            }
                          ]}
                          onPress={() => handleSubcategoryPress(displayIndex)}
                        >
                          <TextDefault
                            style={[
                              callStyles(currentTheme).subcategoryText,
                              isSelected &&
                              callStyles(currentTheme).selectedSubcategoryText
                            ]}
                            textColor={
                              isSelected
                                ? currentTheme.buttonText
                                : currentTheme.fontMainColor
                            }
                          >
                            {sub.title.length > MAX_CHAR_LEN
                              ? sub.title.slice(0, MAX_CHAR_LEN) + '...'
                              : sub.title}
                          </TextDefault>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            {}
            <ReAnimated.View
              style={[
                {
                  flex: 1,
                  backgroundColor: callStyles(currentTheme).backgroundColor,
                },
                animatedStyle
              ]}
            >
              <MemoizedFlatList data={currentFoodItems} />
            </ReAnimated.View>
          </View>

          {}
          <SearchOverlay
            isVisible={isSearchVisible}
            onClose={handleCloseSearch}
            currentTheme={currentTheme}
            configuration={configuration}
            restaurant={restaurantData?.restaurant}
            navigation={navigation}
          />
        </View>
      </GestureDetector>

      {cartCount > 0 && (
        <View style={callStyles(currentTheme).buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={callStyles(currentTheme).button}
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={callStyles().buttontLeft}>
              <Animated.View
                style={[
                  callStyles(currentTheme).buttonLeftCircle,
                  {
                    width: scale(18),
                    height: scale(18),
                    borderRadius: scale(9),
                    transform: [{ scale: scaleValue }]
                  }
                ]}
              >
                <Text
                  style={[
                    callStyles(currentTheme).buttonTextLeft,
                    { fontSize: scale(10) }
                  ]}
                >
                  {cartCount}
                </Text>
              </Animated.View>
            </View>
            <TextDefault
              style={callStyles().buttonText}
              textColor={currentTheme.buttonTextPink}
              uppercase
              center
              bolder
              small
            >
              {t('viewCart')}
            </TextDefault>
            <View style={callStyles().buttonTextRight} />
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingTextContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  
  subcategoryContainer: {
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    gap: 8
  },

  foodList: {
    flex: 1,
    margin: scale(10)
  },

  foodItemContainer: {
    flex: 1,
    marginBottom: 8
  },
  foodItemCard: {
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  imageContainer: {
    width: '100%',
    height: scale(150),
    borderRadius: 15
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 1
  },
  detailsContainer: {
    marginTop: 10,
    gap: 4
  },
  priceSkeleton: {
    width: '40%',
    height: 16,
    borderRadius: 3,
    marginBottom: 4
  },
  titleSkeleton: {
    width: '80%',
    height: 14,
    borderRadius: 3
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  emptyText: {
    fontSize: 16,
    color: 'gray'
  },
  lottie: {
    width: 250,
    height: 250
  }
})

export default CategoryPage