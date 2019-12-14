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
// import ActionSheet from 'react-native-actionsheet';

class PickProfileTypeScreen extends React.Component {
	static navigationOptions = {
		title: 'Choisir mon profil',
	};
	
	render() {
		return (
			<View>
				<Button title="Harcelé" onPress={ () => this.props.navigation.navigate("SignIn", { userType: "huggy" }) } />
				<Button title="Parrain" onPress={ () => this.props.navigation.navigate("SignIn", { userType: "hugger" }) } />
				<Button title="Déjà inscrit ? Récupérer mon compte"  onPress={this._goToPhoneAuth}/>

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

export default PickProfileTypeScreen;
