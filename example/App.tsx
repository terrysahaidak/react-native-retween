import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Button,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useTween, TweenAnimationProps } from 'react-native-retween';

const { width: windowWidth } = Dimensions.get('window');

const colors = {
  red: '#e74c3c',
  white: 'white',
  green: '#2ecc71',
};

const s = StyleSheet.create({
  scroll: {
    paddingVertical: 20,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  animatedView: {
    backgroundColor: colors.red,
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

function TweenExample() {
  const [animation, setAnimation] = useState<
    TweenAnimationProps<any>
  >(() => ({
    timing: {
      duration: 2000,
    },
    from: {
      width: 50,
      height: 50,
      left: 20,
      borderRadius: 0,
    },
    to: {
      width: 200,
      height: 200,
      left: windowWidth - 20 - 200,
      borderRadius: 2,
    },
  }));

  const { play, values, stop } = useTween(() => animation, [
    animation,
  ]);

  const [backward, setBackward] = React.useState(false);

  function onPress() {
    play(backward);
    setBackward((val) => !val);
  }

  useEffect(() => {
    play();
  }, []);

  function changeAnimation() {
    setAnimation((val) => ({
      ...val,
      timing: undefined,
      spring: {
        mass: 1,
        stiffness: 200,
      },
    }));
  }

  return (
    <View style={s.animationContainer}>
      <View style={s.row}>
        <Button onPress={onPress} title="Toggle animation" />
        <Button onPress={changeAnimation} title="Change Animation" />
        <Button onPress={stop} title="Stop" />
      </View>

      <Animated.View style={[s.animatedView, values]} />
    </View>
  );
}

const ANIMATION_COUNT = 50;

export default function App() {
  const [show, setShow] = React.useState(false);
  // performance test
  const range = Array.from(new Array(ANIMATION_COUNT));

  if (!show) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button onPress={() => setShow(true)} title="Show" />
      </View>
    );
  }

  return (
    <FlatList
      // style={{ marginTop:  }}
      data={range}
      initialNumToRender={ANIMATION_COUNT}
      // maxToRenderPerBatch={ANIMATION_COUNT}
      contentContainerStyle={s.scroll}
      renderItem={() => <TweenExample />}
      keyExtractor={(_, i) => i.toString()}
    />
  );
}
