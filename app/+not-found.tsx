import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
const NotFound = () => {
  return (
    <View style={styles.container}>
      {/* Error Icon */}
      <Ionicons name="warning-outline" size={100} color="#FF7300" />
      {/* Error Message */}
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.subtitle}>Page Not Found</Text>
      <Text style={styles.description}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Text>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FF7300',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7300',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
})
export default NotFound