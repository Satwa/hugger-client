import React from 'react'
import {
	ActivityIndicator,
	AsyncStorage,
	StatusBar,
	StyleSheet,
	Text,
	View,
	Image,
	Button,
} from 'react-native';
// import ActionSheet from 'react-native-actionsheet';

class WelcomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Bienvenue',
	}
	
	render() {
		return (
			<View>
				<Image 
					source={require("../assets/onboard-hand.png")} 
					style={{ width: '100%', height: 200 }} 
					resizeMode="contain"
					marginTop={120}
				/>
				<Text style={{ color: '#Ff1d25',fontSize: 37,fontWeight: 'bold', textAlign: 'center', marginTop:20 }}>Hugger</Text>
				<Text style={{ color: '#00000',fontSize: 22, textAlign: 'center', marginTop:20, marginBottom:120 }}>Ne reste plus seul, rejoins-nous</Text>
				<Button color="#00000" title="Rejoindre" onPress={this._goToSignIn}  />
				<Button color="#00000" title="Déjà inscrit ? Connexion" onPress={this._goToPhoneAuth} />

				{/* <ActionSheet
					ref={o => this.ActionSheet = o}
					title={'Quel est ton moyen de connexion ?'}
					options={['Numéro de téléphone', 'Adresse mail', 'cancel']}
					cancelButtonIndex={2}
					// destructiveButtonIndex={1}
					onPress={this._handleAction}
				/> */}
			</View>
		)
	}
	
	_goToSignIn = /*async */() => {
		this.props.navigation.navigate('PickProfile')
	};

	/*_showActionSheet */ _goToPhoneAuth = () => {
		// this.ActionSheet.show()
		this.props.navigation.navigate("PhoneAuth", { shouldAccountExist: true }) // TODO: Handle if account not found
	}
$
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
	