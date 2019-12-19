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
import ChatListScreen from './views/ChatListScreen'
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
	},
	ChatStack: createStackNavigator({
		ChatScreen: { screen: ChatScreen},
		ChatListScreen: { screen: ChatListScreen }
	}, {
		navigationOptions: {
			tabBarIcon: ({ tintColor }) => <Icon name="chat" color={tintColor} />,
		}
	}),
	// TimelineScreen: {
	// 	screen: TimelineScreen,
	// 	navigationOptions: {
	// 		tabBarIcon: ({ tintColor }) => <Icon name="timeline" color={tintColor} />
	// 	}
	// }
}, {
	tabBarOptions: { 
		showLabel: false,
		activeTintColor: '#e91590',
		style: {
			borderTopColor: "transparent",
			textAlignVertical: 'center'
		},
		tabStyle: {
			iconInsets: { top: 0, left: 0, bottom: 0, right: 0 },
		}
	}
})


class AuthLoadingScreen extends React.Component {
	componentDidMount() {
		this._bootstrapAsync();
	}
	
	_bootstrapAsync = async () => {
		const user = await AsyncStorage.getItem('user');
		
		this.props.navigation.navigate(user ? 'App' : 'Auth');
	}
	
	render() {
		return (
			<View>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
			</View>
		)
	}
}
	
//

export default createAppContainer(
	createSwitchNavigator({
		AuthLoading: AuthLoadingScreen,
		App: AppStack,
		Auth: AuthStack,
	}, {
		initialRouteName: 'AuthLoading',
	}
))


  


		