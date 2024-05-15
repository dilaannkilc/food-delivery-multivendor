import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ThemeContext from '../../ui/ThemeContext/ThemeContext';
import { theme } from '../../utils/themeColors';
import { useTranslation } from 'react-i18next';
import TextDefault from '../Text/TextDefault/TextDefault';

const AppliedFilters = ({ filters }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] };

  const selectedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value.selected.length > 0) {
      acc.push(...value.selected); 
    }
    return acc;
  }, []);

  if (selectedFilters.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TextDefault H4 bolder isRTL style={{ paddingBottom: 5 }}>
        {t('Selected Filters')}
      </TextDefault>
      <FlatList
        data={selectedFilters}
        keyExtractor={(item, index) => `${item}-${index}`}

        renderItem={({ item }) => (
          <View style={[styles.filterItem, { backgroundColor: currentTheme.color1, borderColor: currentTheme.color7 }]}>
            <Text style={[styles.filterText, { color: currentTheme.fontMainColor }]}>{t(item)}</Text>
          </View>
        )}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 8,
          paddingBottom: 5
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        inverted={currentTheme?.isRTL ? true : false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 2,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 5,
  },
  filterItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40, 
  },
  filterText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AppliedFilters;
