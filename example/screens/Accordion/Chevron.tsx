import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { bInterpolateColor } from 'react-native-redash';

const size = 30;
const s = StyleSheet.create({
  container: {
    height: size,
    width: size,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

interface ChevronProps {
  chevronBg: Animated.Value<number>;
  rotateZ: Animated.Value<number>;
}

export function Chevron({ chevronBg, rotateZ }: ChevronProps) {
  return (
    <Animated.View
      // @ts-ignore
      style={[
        { transform: [{ rotateZ }], backgroundColor: chevronBg },
        s.container,
      ]}
    >
      <Icon
        style={s.icon}
        name="ios-arrow-down"
        color="white"
        size={24}
      />
    </Animated.View>
  );
}
