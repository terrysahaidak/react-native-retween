import React from 'react';
import { Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { List, List as ListModel } from './List';
import { FlatList } from 'react-native-gesture-handler';

const s = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f6',
  },
  innerContainer: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
const list: ListModel = {
  name: 'Total Points',
  items: [
    { name: 'Nathaniel Fitzgerald', points: '$3.45' },
    { name: 'Lawrence Fullter Fitzgerald', points: '$3.45' },
    { name: 'Jacob Mullins', points: '$3.45' },
    { name: 'Jesus Lewis', points: '$3.45' },
    { name: 'Johnny Marr', points: '$2.56' },
  ],
};

const data: ListModel[] = Array(5).fill(list);

function AccordionScreen() {
  return (
    <FlatList
      style={s.container}
      contentContainerStyle={s.innerContainer}
      ListHeaderComponent={() => <Text style={s.title}>Markets</Text>}
      data={data}
      keyExtractor={(_, index) => String(index)}
      renderItem={({ item }) => <List list={item} />}
    />
  );
}

export default AccordionScreen;
