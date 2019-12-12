import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import AsyncStorage from '@react-native-community/async-storage';

import TimelineScreen from './views/TimelineScreen'
import ChatScreen from './views/ChatScreen'
import ProfileScreen from './views/ProfileScreen'
import SignInScreen from './views/SignInScreen'
import PickProfileTypeScreen from './views/PickProfileType'
import WelcomeScreen from './views/WelcomeScreen'
import PhoneAuthScreen from './views/PhoneAuthScreen'

import tabbar from './components/tabbar'


const AppStack = createBottomTabNavigator({ Timeline: TimelineScreen, Chat: ChatScreen, Profile: ProfileScreen });
const AuthStack = createStackNavigator({ Welcome: WelcomeScreen, PickProfile: PickProfileTypeScreen, PhoneAuth: PhoneAuthScreen, SignIn: SignInScreen });


class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };


  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}



export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);

