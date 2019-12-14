import React from 'react'
import {
	View,
	Text,
	Button,
	FlatList,
	Dimensions,
	TextInput
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'

class SignInScreen extends React.Component {
	static navigationOptions = {
		title: `Rejoindre Hugger`,
	}

	// TODO: Props (huggy/hugger)
		// - Selon, tableau de données différent pr demander les infos

	// TODO: Afficher les points de suivi d'écran

	state = {
		step: 0,
		screen_width: Dimensions.get('window').width,
		birthdate: Date.now()
	}

	// constructor(){
	// 	this._validateInput.bind(this)
	// }

	constructor(props){
		super(props)

		if(props.navigation.getParam("userType") == "huggy"){
			// Eleve
			this.fields = [ // TODO: Demander le mood
				{
					name: "Prénom",
					fieldtype: "textinput",
					label: "Quel est ton prénom ?",
					slug: "name"
				},
				{
					name: "Age",
					fieldtype: "datetimepicker",
					label: "Quel est ta date de naissance ?",
					slug: "birthdate"
				},
				{
					name: "Etablissement scolaire",
					fieldtype: "textinput", // TODO: Crawl (scan par académie) https://www.education.gouv.fr/pid24301/annuaire-accueil-recherche.html
					label: "Quel est ton établissement scolaire ?",
					slug: "schoolName"
				},
				{
					name: "Sexe",
					fieldtype: "radio",
					label: "Quel est ton sexe ?", // WIP
					values: ["Non spécifié", "Femme", "Homme"],
					slug: "sex"
				},
				{
					name: "Evenements",
					fieldtype: "picker",
					label: "Que vis-tu ?", // WIP
					values: ["", "", "", "Autre"], // TODO: Si autre, ajouter un textInput
					slug: "eventType"
				}
			]
		}else{
			// Parrain (hugger)
			this.fields = [
				{
					name: "Prénom",
					fieldtype: "textinput",
					label: "Quel est ton prénom ?",
					slug: "name"
				},
				{
					name: "Nom",
					fieldtype: "textinput",
					label: "Quel est ton nom ?",
					slug: "lastname"
				},
				{
					name: "Age",
					fieldtype: "datetimepicker",
					label: "Quel est ta date de naissance ?",
					slug: "birthdate"
				},
				{ // TODO: file input
					name: "Carte d'identité",
					fieldtype: "fileupload", // TODO: Crawl (scan par académie) https://www.education.gouv.fr/pid24301/annuaire-accueil-recherche.html
					label: "Envoie une photo recto/verso de ta carte d'identité ou passeport en cours de validité",
					slug: "idCard"
				},
				{ // TODO: file input
					name: "Selfie",
					fieldtype: "fileupload", // TODO: Crawl (scan par académie) https://www.education.gouv.fr/pid24301/annuaire-accueil-recherche.html
					label: "Envoie-nous un selfie afin de valider ton identité",
					slug: "idCardSelfie"
				},
				{
					name: "Adresse",
					fieldtype: "textinput",
					label: "Quel est ton adresse actuelle ?",
					slug: "address"
				},
				{
					name: "Histoire",
					fieldtype: "textinput",
					label: "Dis-nous pourquoi tu ferais un bon parrain, quelle est ton histoire ?",
					slug: "story"
				}
			]
		}
	}

	render() {
		return (
			<View style={{ flex: 1, paddingBottom: 30 }}>
				{/* <Text>Process de connexion</Text> */}
				<FlatList
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEnabled={false}
					data={this.fields}
					ref={ref => this.stepsRef = ref }
					keyExtractor={item => item.slug}
					style={{ flex: 1 }}
					renderItem={ ({ item, index }) => (
						<View style={{ width: this.state.screen_width }}>
							<Text>{item.label}</Text>
							{ this._renderField(item) }
							<Text>{ this.state[item.slug] }</Text>
						</View>
					)
						
					}
				/>
				<Button title="Suivant" onPress={this._validateInput.bind(this)} />
			</View>
		);
	}

	_renderField(item) {
		switch(item.fieldtype){
			case 'textinput':
				return (
					<TextInput
						onChangeText={text => {
							const update = {}
							update[item.slug] = text
							this.setState(update)
						}}
						placeholder={ item.name }
						style={{ backgroundColor: '#ccc' }}
					/>
				)
			case 'datetimepicker':
				return (
					<DateTimePicker
						value={new Date(this.state[item.slug])}
						maximumDate={new Date()}
						minimumDate={new Date((new Date()).getFullYear() - 30, 0, 1)}
						onChange={(e, date) => {
							const update = {}
							update[item.slug] = date.getTime()
							this.setState(update)
						}}
					/>
				)
			case 'radio':
				// TODO: Foreach each value, override state
				break
			case 'picker':
				break
			case 'fileupload':
				break
			default:
				return <Text>Unhandled yet.</Text>
		}
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
