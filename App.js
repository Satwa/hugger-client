import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import TimelineScreen from './views/TimelineScreen'
import ChatScreen from './views/ChatScreen'
import ProfileScreen from './views/ProfileScreen'
import SignInScreen from './views/SignInScreen'
import WelcomeScreen from './views/WelcomeScreen'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import tabbar from './components/tabbar'


const AppStack = createBottomTabNavigator({ Timeline: TimelineScreen, Chat: ChatScreen, Profile: ProfileScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen, Welcome : WelcomeScreen });



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

