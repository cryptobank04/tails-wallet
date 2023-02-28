/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { TouchableOpacity } from 'react-native'


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeatherIcon from 'react-native-vector-icons/Feather'

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

import FA from 'react-native-vector-icons/FontAwesome'
import MA from 'react-native-vector-icons/MaterialCommunityIcons'
import BankAccounts from './BankAccounts';


function App(): JSX.Element {
  const user = useUser()
  const flowAccount = useFlowAccount()

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='LandingPage'
            component={LandingPage}
            options={{ headerShown: false }}
          />
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
          <Stack.Screen
            options={{ headerShadowVisible: false }}
            name='Move Money'
            component={TransferList}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name='Transfer'
            component={Transfer}
            options={({ navigation }) => {
              return {
                title: 'Select Token',
                headerTitleStyle: {
                  // color: "#FFFFFF"
                },
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <MA name="window-close" size={20} />
                    </TouchableOpacity>
                  )
                },
                // headerStyle: {
                //   backgroundColor: "#262626",
                // },
              }
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    )
  }

  const HomeTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            // borderTopColor: "#191919",
            backgroundColor: "#FAF9F6"
          },
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#c8c8c8",
          tabBarActiveTintColor: '#673ab7',
        }}
      >
        <Tab.Screen
          name='Dashboard'
          component={Dashboard}
          options={{
            headerRight: ProfileAvatar,
            title: 'Earn Account',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "#FAF9F6",
            },
            tabBarIcon: ({ color }) => (
              <FA name="usd" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name='Move Money'
          component={TransferList}
          options={{
            // headerShown: false,
            tabBarIcon: ({ color }) => (
              <FA name="exchange" color={color} size={25} />
            ),
          }}
        />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeTabs">
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Group>
          <Stack.Screen 
            // options={{ headerShadowVisible: false }} 
            name='Move Money' 
            component={TransferList} 
          />
        </Stack.Group> */}
        <Stack.Group
          screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name='Transfer'
            component={Transfer}
            options={({ navigation }) => {
              return {
                title: 'Transfer',
                headerTitleStyle: {
                  // color: "#FFFFFF"
                },
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <MA name="window-close" size={20} />
                    </TouchableOpacity>
                  )
                },
              }
            }}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name='BankAccounts'
            component={BankAccounts}
            options={{
              title: 'Bank Accounts',
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            // borderTopColor: "#191919",
            backgroundColor: "#FAF9F6"
          },
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#c8c8c8",
          tabBarActiveTintColor: '#673ab7',
        }}
      >
        <Tab.Screen
          name='Dashboard'
          component={Dashboard}
          options={{
            headerRight: ProfileAvatar,
            title: 'Earn Account',
            headerShadowVisible: false,
            tabBarIcon: ({ color }) => (
              <FA name="usd" color={color} size={25} />
            ),
          }}
        />
        <Tab.Screen
          name='Move Money'
          options={{
            headerShown: false,
            tabBarIcon: (props) => {
              return <FeatherIcon color={props.focused ? 'black' : 'grey'} name='dollar-sign' size={25} />
            }
          }}
          component={TransferNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FA name="exchange" color={color} size={25} />
            ),
          }}
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
