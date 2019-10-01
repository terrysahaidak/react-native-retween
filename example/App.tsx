import React from 'react';
import AccordionScreen from './screens/Accordion/AccordionScreen';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { HomeScreen } from './screens/HomeScreen/HomeScreen';
import { BasicScreen } from './screens/Basic/BasicScreen';

export const routes = {
  Accordion: AccordionScreen,
  Basic: BasicScreen,
};

const StackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    ...routes,
  },
  {
    initialRouteName: 'Home',
  },
);

const Navigator = createAppContainer(StackNavigator);

function App() {
  return <Navigator />;
}

export default App;
