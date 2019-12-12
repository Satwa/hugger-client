import React from 'react'
import {
	ActivityIndicator,
	AsyncStorage,
	StatusBar,
	StyleSheet,
	View,
	Text,
	Button,
} from 'react-native';

class SignInScreen extends React.Component {
	static navigationOptions = {
		title: 'Rejoindre',
	};
	
	render() {
		return (
			<View>
				<Text>Process de connexion</Text>
			</View>
		);
	}  
}

export default SignInScreen;
