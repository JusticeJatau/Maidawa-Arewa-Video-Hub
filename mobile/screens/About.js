import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../constants/colors';

const About = () => {
  return (
    <View style={styles.container}>
        <View style={styles.headerTop}>
        <Text style={styles.title}>About</Text>
        </View>
        
        <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.textSecondary} />
        <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={colors.textSecondary}
        />
        </View>
    </View>
  )
}

export default About
