import React from 'react'
import {
	ActivityIndicator,
	AsyncStorage,
	StatusBar,
	StyleSheet,
	View,
	Text,
	Button,
	FlatList,
	Dimensions
} from 'react-native';

class SignInScreen extends React.Component {
	static navigationOptions = {
		title: 'Rejoindre',
	};

	// TODO: Props (huggy/hugger)
		// - Selon, tableau de données différent pr demander les infos

	// TODO: Afficher les points de suivi d'écran

	state = {
		step: 0,
		screen_width: Dimensions.get('window').width
	}

	// constructor(){
	// 	this._validateInput.bind(this)
	// }

	render() {
		return (
			<View style={{ flex: 1, paddingBottom: 30 }}>
				{/* <Text>Process de connexion</Text> */}
				<FlatList
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEnabled={false}
					data={["Prénom", "Nom", "Age", "CI", "Adresse", "Histoire"]}
					ref={ref => this.stepsRef = ref }
					style={{ flex: 1 }}
					renderItem={ ({ item, index }) => (
						<View style={{ width: this.state.screen_width }}>
							<Text>{item}</Text>
						</View>
					)
						
					}
				/>
				<Button title="Suivant" onPress={this._validateInput.bind(this)} />
			</View>
		);
	}

	_validateInput() {
		// TODO: validate input at each step to be sure
		// console.log(this.refs)

		if(this.state.step + 1 > 5) { // 5 being the hardcoded number of value
			this.props.navigation.navigate("PhoneAuth", {
				data: {
					
				}
			})
		}else{
			this.stepsRef.scrollToIndex({
				animated: true,
				index: this.state.step + 1
			})
			this.setState({
				step: (this.state.step + 1)
			})
		}
	}
}

export default SignInScreen;
