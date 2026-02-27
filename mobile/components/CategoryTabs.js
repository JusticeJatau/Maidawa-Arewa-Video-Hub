import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const CategoryTabs = ({ categories, onCategoryChange }) => {
  const { theme } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    container: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 10,
    },
    categoryTab: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 25,
      backgroundColor: theme.surface2,
      // borderWidth: 1,
      borderColor: theme.border,
    },
    categoryTabActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryText: {
      color: theme.textSecondary,
      fontSize: 15,
      fontWeight: '500',
    },
    categoryTextActive: {
      color: theme.text,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryTab,
              selectedCategory === category._id && styles.categoryTabActive
            ]}
            onPress={() => handleCategorySelect(category._id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category._id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
        <View>
          
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryTabs;