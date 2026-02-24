import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

const CategoryTabs = ({ categories, onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryTab,
            selectedCategory === category._id && styles.categoryTabActive
          ]}
          onPress={() => handleCategorySelect(category._id)}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === category._id && styles.categoryTextActive
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    // height: 50,
  },
  categoryTab: {
    height: 30, 
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.text,
    fontWeight: 'bold',
  },
});

export default CategoryTabs;