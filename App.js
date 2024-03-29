import React from 'react';
import {
	ActivityIndicator,
	StatusBar,
	View,
} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import io from 'socket.io-client'
import { SocketProvider } from './providers/SocketProvider'

// import TimelineScreen from './views/TimelineScreen'
import ChatScreen from './views/ChatScreen'
import ChatListScreen from './views/ChatListScreen'
import ProfileScreen from './views/ProfileScreen'
import SignInScreen from './views/SignInScreen'
import PickProfileTypeScreen from './views/PickProfileType'
import WelcomeScreen from './views/WelcomeScreen'
import Icon from './components/Icon'
import PhoneAuthScreen from './views/PhoneAuthScreen';
import firebase from 'react-native-firebase';
import SolidAPIService from './services/SolidAPIService'
import AsyncStorage from '@react-native-community/async-storage';

global.SERVER_URL = "http://localhost:3000"

const AuthStack = createStackNavigator({ Welcome: WelcomeScreen, SignIn: SignInScreen, PickProfile: PickProfileTypeScreen, PhoneAuth: PhoneAuthScreen });
const AppStack = createBottomTabNavigator({
	ProfileScreen: {
		screen: ProfileScreen,
		navigationOptions: {
			tabBarIcon: ({ tintColor }) => <Icon name="profile" color={tintColor} />
		}
	},
	ChatStack: createStackNavigator({
		ChatListScreen: { screen: ChatListScreen },
		ChatScreen: { screen: ChatScreen},
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
		const user = await AsyncStorage.getItem("user")
		this.props.navigation.navigate(user ? 'App' : 'Auth')
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

const App = createAppContainer(
	createSwitchNavigator({
		AuthLoading: AuthLoadingScreen,
		App: AppStack,
		Auth: AuthStack,
	}, {
		initialRouteName: 'AuthLoading',
	}
))


export default class AppRenderer extends React.Component {
	state = {
		token: null
	}

	componentDidMount(){
		this.loadToken()
	}

	async loadToken(){ // TODO: Need a try/catch here for currentUser being null
		global.SolidAPI = null

		const firebaseToken = await firebase.auth().currentUser.getIdToken()

		global.SolidAPI = new SolidAPIService(firebaseToken)

		this.setState({
			token: firebaseToken
		})
	}

	render(){
		return (
			<SocketProvider socket={
				io(global.SERVER_URL, {
					query: { token: this.state.token },
					transports: ['websocket'],
					reconnectionAttempts: 15
				})
			}>
				<App />
			</SocketProvider>
		)
	}
}