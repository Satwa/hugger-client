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
import Icon from './components/Icon'
import PhoneAuthScreen from './views/PhoneAuthScreen';



const AuthStack = createStackNavigator({ Welcome: WelcomeScreen, SignIn: SignInScreen, PickProfile: PickProfileTypeScreen, PhoneAuth: PhoneAuthScreen });

const AppStack = createBottomTabNavigator({
  
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="profile" color={tintColor} />
    }
  }
  ,
  ChatScreen: {
    screen: ChatScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => { return <Icon name="chat" color={tintColor} /> }, 
    }
  },

  TimelineScreen: {
    screen: TimelineScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="timeline" color={tintColor} />
    }
  }

}, {
  tabBarOptions: { 
    showLabel: false,
    style: {
      paddingTop : 30,
    }
  }
});





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





//

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

