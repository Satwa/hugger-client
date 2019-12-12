import React from "react";
import { Text } from "react-native";
import TimelineScreen from '../views/TimelineScreen'
import ChatScreen from '../views/ChatScreen'
import ProfileScreen from '../views/ProfileScreen'
import SignInScreen from '../views/SignInScreen'
import WelcomeScreen from '../views/WelcomeScreen'
import { createBottomTabNavigator } from 'react-navigation-tabs';

const iconMap =  {
  timeline: "♡",
  chat: "♢",
  profile: "♤"
};

const Icon = ({ name, color, style, ...props }) => {
  const icon = iconMap[name];

  return <Text style={[{ fontSize: 60, color }, style]}>{icon}</Text>;
};
export default Icon;


const TabNavigator = createBottomTabNavigator({
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
  });