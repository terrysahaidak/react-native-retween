import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { routes } from '../../App';
import { FlatList } from 'react-native';
import { NavigationStackOptions } from 'react-navigation-stack';

const s = StyleSheet.create({
  listItem: {
    height: 52,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  text: {
    fontSize: 19,
    fontWeight: '500',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#cccccc',
  },
});

interface HomeProps extends NavigationStackScreenProps {}

export function HomeScreen({ navigation }: HomeProps) {
  const list = Object.keys(routes);

  return (
    <FlatList
      data={list}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={s.listItem}
          onPress={() => navigation.navigate(item)}
        >
          <Text style={s.text}>{item}</Text>
          <Icon name="ios-arrow-forward" color="black" size={24} />
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={s.separator} />}
      ListFooterComponent={() => <View style={s.separator} />}
    />
  );
}

HomeScreen.navigationOptions = {
  title: 'Examples',
} as NavigationStackOptions;
