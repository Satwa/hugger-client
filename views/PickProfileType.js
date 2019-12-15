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

class PickProfileTypeScreen extends React.Component {
	static navigationOptions = {
		title: 'Choisir mon profil',
	};
	
	render() {
		return (
			<View>
				<Button title="Harcelé" onPress={ () => this.props.navigation.navigate("SignIn", { userType: "huggy" }) } />
				<Button title="Parrain" onPress={ () => this.props.navigation.navigate("SignIn", { userType: "hugger" }) } />
			</View>
		);
	}  
}

export default PickProfileTypeScreen;
