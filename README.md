# React Native ReTween

> Blazing fast and easy tween animation.

<img src="demo.gif" />

## Installation

Open a Terminal in the project root and run:

```sh
yarn add react-native-retween
```

Now we need to install [`react-native-reanimated`](https://github.com/kmagiera/react-native-reanimated).

If you are using Expo (this might work slower with latest Expo SDK 35 than vanilla RN, since it has outdated version of reanimated with no proces), to ensure that you get the compatible versions of the libraries, run:

```sh
expo install react-native-reanimated
```

If you are not using Expo, run the following:

```sh
yarn add react-native-reanimated
```

If you are using Expo, you are done. Otherwise, continue to the next steps.

Next, we need to link these libraries. The steps depends on your React Native version:

- **React Native 0.60 and higher**

  On newer versions of React Native, [linking is automatic](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

  To complete the linking on iOS, make sure you have [Cocoapods](https://cocoapods.org/) installed. Then run:

  ```sh
  cd ios
  pod install
  cd ..
  ```

- **React Native 0.59 and lower**

  If you're on an older React Native version, you need to manually link the dependencies. To do that, run:

  ```sh
  react-native link react-native-reanimated
  ```

## Quick overview

You can find this in the [example](example) folder.

```tsx
function TweenExample() {
  const { play, values, stop } = useTween(() => ({
    timing: {
      duration: 400,
    },
    // otherwise you can use spring
    // spring: {
    //   mass: 1,
    // },
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

  const [backward, setBackward] = React.useState(false);

  function onPress() {
    play(backward);
    setBackward((val) => !val);
  }

  return (
    <View style={s.animationContainer}>
      <View style={s.row}>
        <Button onPress={onPress} title="Toggle animation" />
        <Button onPress={stop} title="Stop" />
      </View>

      <Animated.View style={[s.animatedView, values]} />
    </View>
  );
}
```

## License

[MIT](LICENSE)
