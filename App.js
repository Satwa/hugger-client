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
import Icon from './components/Icon'



const AuthStack = createStackNavigator({ SignIn: SignInScreen, Welcome : WelcomeScreen });

const AppStack = createBottomTabNavigator({
  TimelineScreen: {
    screen: TimelineScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="timeline" color={tintColor} />
    }
  },
  ChatScreen: {
    screen: ChatScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="chat" color={tintColor} />
    }
  },
 
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="profile" color={tintColor} />
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

