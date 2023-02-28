/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LandingPage from './LandingPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

import { AppContext } from './store';
import { useFlowAccount, useUser } from './hooks';
import Dashboard from './Dashboard';
import ProfileAvatar from './components/ProfileAvatar';
import TransferList from './TransferList';
import Transfer from './Transfer';
import Flowns from './Flowns';


function App(): JSX.Element {
  const user = useUser()
  const flowAccount = useFlowAccount()

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='LandingPage' component={LandingPage} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  if (!flowAccount) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Flowns' component={Flowns} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  const TransferNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen options={{ headerShadowVisible: false }} name='Move Money' component={TransferList} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
          <Stack.Screen name='Transfer' component={Transfer} />
        </Stack.Group>
      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          options={{
            headerRight: ProfileAvatar,
            title: '',
            headerShadowVisible: false
          }}
          name='Dashboard'
          component={Dashboard}
        />
        <Tab.Screen
          name='Move Money'
          component={TransferNavigator}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )


  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user === undefined ? <Stack.Screen name='LandingPage' component={LandingPage} /> :
          <Stack.Screen
            options={{
              headerRight: ProfileAvatar,
              title: '',
              headerShadowVisible: false
            }}
            name='Dashboard'
            component={Dashboard}
          />}
      </Stack.Navigator>
    </NavigationContainer>

  )
}



export default App;
