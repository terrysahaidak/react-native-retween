import React from 'react';
import { Text, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { List, List as ListModel } from './List';

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
function AccordionScreen() {
  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.innerContainer}
    >
      <Text style={s.title}>Markets</Text>
      <List list={list} />
      <List list={list} />
      <List list={list} />
      <List list={list} />
      <List list={list} />
      <List list={list} />
    </ScrollView>
  );
}

export default AccordionScreen;
