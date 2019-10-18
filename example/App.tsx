import React from 'react';
import { useScreens } from 'react-native-screens';
import AccordionScreen from './screens/Accordion/AccordionScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './screens/HomeScreen/HomeScreen';
import { BasicScreen } from './screens/Basic/BasicScreen';
import { NavigationContainer } from '@react-navigation/core';

useScreens();

export const routes = {
  Accordion: AccordionScreen,
  Basic: BasicScreen,
};

const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={HomeScreen}
          name="Home"
          options={{
            headerLargeTitle: true,
          }}
        />

        {Object.entries(routes).map(([key, screen]) => (
          <Stack.Screen component={screen} name={key} key={key} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
