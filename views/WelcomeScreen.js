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
// import ActionSheet from 'react-native-actionsheet';

class WelcomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Bienvenue',
	};
	
	render() {
		return (
			<View>
				<Button title="Rejoindre" onPress={this._goToSignIn} />
				<Button title="Déjà inscrit ? Récupérer mon compte" onPress={this._goToPhoneAuth} />

				{/* <ActionSheet
					ref={o => this.ActionSheet = o}
					title={'Quel est ton moyen de connexion ?'}
					options={['Numéro de téléphone', 'Adresse mail', 'cancel']}
					cancelButtonIndex={2}
					// destructiveButtonIndex={1}
					onPress={this._handleAction}
				/> */}
			</View>
		);
	}
	
	_goToSignIn = /*async */() => {
		// await AsyncStorage.setItem('userToken', 'abc');
		this.props.navigation.navigate('PickProfile');
	};

	/*_showActionSheet */ _goToPhoneAuth = () => {
		// this.ActionSheet.show()
		this.props.navigation.navigate("PhoneAuth", { shouldAccountExist: true }) // TODO: Handle if account not found
	}

	// _handleAction = (index) => {
	// 	if(index === 0){
	// 		// Phone Auth
	// 		this.props.navigation.navigate("PhoneAuth")
	// 	}else if(index === 1){
	// 		// Email Auth
	// 	}else{
	// 		return
	// 	}
	// }
}
	
export default WelcomeScreen;
	