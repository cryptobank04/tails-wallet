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

import LandingPage from './screens/LandingPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()


import { AppContext } from './store';
import { useFlowAccount, useUser } from './hooks';
import Dashboard from './screens/Dashboard';
import ProfileAvatar from './components/ProfileAvatar';
import TransferList from './screens/TransferList';
import Transfer from './screens/Transfer';
import Flowns from './Flowns';

import FA from 'react-native-vector-icons/FontAwesome'
import MA from 'react-native-vector-icons/MaterialCommunityIcons'
import BankAccounts from './screens/BankAccounts';


function App(): JSX.Element {
  const user = useUser()
  const flowAccount = useFlowAccount()
  console.log('flow!!!!!!', flowAccount)

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
            borderTopColor: "#191919",
            backgroundColor: "#191919"
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
            headerLeft: () => {
              return (
                <TouchableOpacity >
                  <MA style={{marginLeft: 20}} name='qrcode' color='#ffffff' size={28}/>
                </TouchableOpacity>
              )
              },
            title: `${flowAccount.flownsName}.fn`,
            headerShadowVisible: false,
            headerTintColor: '#c8c8c8',
            headerStyle: {
              backgroundColor: "#1b1c1c",
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              letterSpacing: 1
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
            headerShadowVisible: false,
            headerTintColor: '#ffffff',
            headerStyle: {
              backgroundColor: "#1b1c1c",
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              letterSpacing: 1
            },
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
                headerStyle: {
                  backgroundColor: "#1b1c1c",
                },
                title: 'Transfer',
                headerTitleStyle: {
                  color: "#FFFFFF"
                },
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <MA name="window-close" size={20} color='#ffffff'/>
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
              headerTintColor: '#ffffff',
              headerStyle: {
                backgroundColor: "#1b1c1c",
              },
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
