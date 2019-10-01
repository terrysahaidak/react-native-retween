import React, { RefObject, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import Animated from 'react-native-reanimated';
import { Chevron } from './Chevron';
import Item, { ListItem } from './ListItem';
import { useTweenToggle } from '../../../src';

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  items: {
    overflow: 'hidden',
  },
});

export interface List {
  name: string;
  items: ListItem[];
}

interface ListProps {
  list: List;
}

export function List({ list }: ListProps) {
  const [open, setOpen] = useState(false);

  const { values, transition } = useTweenToggle(
    () => ({
      spring: {
        mass: 0.1,
        stiffness: 50,
      },
      from: {
        opacity: 0,
        height: 0,
        bottomRadius: 8,
        rotateZ: 0,
        chevronBg: { r: 82, g: 82, b: 81 },
      },
      to: {
        opacity: 1,
        height: 54 * list.items.length,
        bottomRadius: 0,
        rotateZ: Math.PI,
        chevronBg: { r: 228, g: 86, b: 69 },
      },
    }),
    open,
  );

  const { bottomRadius, chevronBg, rotateZ, ...restValues } = values;

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          setOpen((prev) => !prev);
        }}
      >
        <Animated.View
          style={[
            styles.container,
            {
              borderBottomLeftRadius: bottomRadius,
              borderBottomRightRadius: bottomRadius,
            },
          ]}
        >
          <Text style={styles.title}>Total Points</Text>
          <Chevron {...{ transition, chevronBg, rotateZ }} />
        </Animated.View>
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.items, restValues]}>
        {list.items.map((item, key) => (
          <Item
            {...{ item, key }}
            isLast={key === list.items.length - 1}
          />
        ))}
      </Animated.View>
    </>
  );
}
