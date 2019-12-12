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
import ActionSheet from 'react-native-actionsheet';

class PickProfileTypeScreen extends React.Component {
	static navigationOptions = {
		title: 'Choisir mon profil',
	};
	
	render() {
		return (
			<View>
				<Button title="Harcelé" />
				<Button title="Parrain" />
				<Button title="Déjà inscrit ? Récupérer mon compte"  onPress={this._showActionSheet}/>

				<ActionSheet
					ref={o => this.ActionSheet = o}
					title={'Quel est ton moyen de connexion ?'}
					options={['Numéro de téléphone', 'Adresse mail', 'cancel']}
					cancelButtonIndex={2}
					// destructiveButtonIndex={1}
					onPress={this._handleAction}
				/>
			</View>
		);
	}  

	_showActionSheet = () => {
		this.ActionSheet.show()
	}

	_handleAction = (index) => {
		if(index === 0){
			// Phone Auth
			this.props.navigation.navigate("PhoneAuth")
		}else if(index === 1){
			// Email Auth
		}else{
			return
		}
	}
}

export default PickProfileTypeScreen;
