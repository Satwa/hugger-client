import React from 'react'
import {
	ActivityIndicator,
	AsyncStorage,
	StatusBar,
	StyleSheet,
	Text,
	View,
	Button,
} from 'react-native';

class WelcomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Bienvenue',
	};
	
	render() {
		return (
			<View>
				<Button title="Rejoindre" onPress={this._goToSignIn} />
			</View>
		);
	}
	
	_goToSignIn = /*async */() => {
		// await AsyncStorage.setItem('userToken', 'abc');
		this.props.navigation.navigate('PickProfile');
	};
}
	
export default WelcomeScreen;
	