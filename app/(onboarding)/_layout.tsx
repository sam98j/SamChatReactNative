import { Slot } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const OnboardingLayout = () => {
  return (
    <View>
      <Text>OnboardingLayout</Text>
      <Slot />
    </View>
  );
};

export default OnboardingLayout;
