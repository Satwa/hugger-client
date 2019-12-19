import React from 'react'
import {
	View,
	Text,
	Button,
	FlatList,
	Dimensions,
	TextInput,
	Picker,
	Alert,
	Image,
	TouchableHighlight,
	TouchableOpacity
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import RadioSelector from '../components/RadioSelector'
import MultiSelector from '../components/MultiSelector'
import ImagePicker from 'react-native-image-picker'

class SignInScreen extends React.Component {
	static navigationOptions = {
		header: null,
	}

	// TODO: Afficher les points de suivi d'écran

	state = {
		step: 0,
		screen_width: Dimensions.get('window').width,
		birthdate: Date.now()
	}

	constructor(props){
		super(props)

		if(props.navigation.getParam("userType") == "huggy"){
			// Eleve
			this.fields = [ // TODO: Demander le mood
				{
					name: "Prénom",
					fieldtype: "textinput",
					label: "Je m'appelle ?",
					allowMultilines: false,
					slug: "name"
				},
				{
					name: "Age",
					fieldtype: "datetimepicker",
					label: "Quel est ta date de naissance ?",
					// TODO: Si < 12 ans rediriger directement à la connexion
					slug: "birthdate"
				},
				{
					name: "Ecole",
					fieldtype: "textinput", 
					// TODO: Crawl (scan par académie) https://www.education.gouv.fr/pid24301/annuaire-accueil-recherche.html
					label: "Quel est le nom de ton école ?",
					allowMultilines: false,
					slug: "schoolName"
				},
				{
					name: "Sexe",
					fieldtype: "radio",
					label: "Quel est ton sexe ?", // WIP
					values: [{ label: "Non spécifié", slug: "unknown" }, { label: "Femme", slug: "woman" }, { label: "Homme", slug: "man" }],
					slug: "sex"
				},
				{
					name: "Evenements",
					fieldtype: "picker",
					label: "Que vis-tu ? (cliquer pour sélectionner)", // WIP
					values: [
						{ label: "Agressions physiques", slug: "physical-assaults" }, 
						{ label: "Insultes", slug: "insults" }, 
						{ label: "On me touche", slug: "touching" }, 
						{ label: "On me critique", slug: "discrimination" }, 
						{ label: "Diffamation", slug: "defamation" }, 
						{ label: "Sexisme", slug: "sexism" }, 
						{ label: "Je reçois beaucoup de messages et appels pas très sympa", slug: "intrusive-contact" }, 
						{ label: "Menaces", slug: "threats" }, 
						{ label: "Je suis suivi", slug: "followed" }, 
						{ label: "Fausses rumeurs", slug: "rumors" }, 
						{ label: "On me laisse seul", slug: "rejection" }, 
						{ label: "Diffusion d'images blessantes", slug: "spreading-images" }, 
						{ label: "Usurpation de mon identité", slug: "identity-theft" }, 
						{ label: "Racket", slug: "racket" }, 
						{ label: "Sentiment d'isolement", slug: "loneliness" }, 
						{ label: "Sentiment de dépression", slug: "depression" }, 
						{ label: "Sentiment de phobie scolaire", slug: "scool-phobia" }, 
						{ label: "Sentiment d'anxiété", slug: "anxiety" }, 
						{ label: "Sentiment de nervosité", slug: "nervous" }, 
						{ label: "Sentiment de honte", slug: "shame" }, 
						{ label: "Sentiment de mal-être permanent", slug: "discomfort" }, 
						{ label: "Sentiment d'incompréhension", slug: "misunderstanding" }, 
						{ label: "Autre", slug: "other" }
					], 
					// TODO: Si autre, ajouter un textInput
					allowMultipleValues: true,
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
					allowMultilines: false,
					slug: "name"
				},
				{
					name: "Nom",
					fieldtype: "textinput",
					label: "Quel est ton nom ?",
					allowMultilines: false,
					slug: "lastname"
				},
				{
					name: "Age",
					fieldtype: "datetimepicker",
					label: "Quel est ta date de naissance ?",
					slug: "birthdate"
				},
				{
					name: "Sexe",
					fieldtype: "radio",
					label: "Quel est ton sexe ?", // WIP
					values: [{ label: "Non spécifié", slug: "unknown" }, { label: "Femme", slug: "woman" }, { label: "Homme", slug: "man" }],
					slug: "sex"
				},
				{
					name: "Carte d'identité", // Passbase bientôt (inshh)
					fieldtype: "fileupload", // TODO: Crawl (scan par académie) https://www.education.gouv.fr/pid24301/annuaire-accueil-recherche.html
					label: "Ma carte d'identité",
					multiplicator: 2, // use multiplicator here to add multiple fields
					values: [{ label: "Carte d'identité (Recto)", slug: "idCardRecto" }, { label: "Carte d'identité (Verso)", slug: "idCardVerso" }],
					slug: "idCard"
				},
				{
					name: "Selfie",
					fieldtype: "fileupload",
					label: "Envoie-nous un selfie afin de valider ton identité",
					slug: "idCardSelfie"
				},
				{
					name: "Adresse",
					fieldtype: "textinput",
					label: "Quel est ton adresse actuelle ?",
					allowMultilines: true,
					slug: "address"
					// TODO: Auto-suggest address
				},
				{
					name: "Histoire",
					fieldtype: "textinput",
					label: "Dis-nous pourquoi tu ferais un bon parrain, quelle est ton histoire ?",
					allowMultilines: true,
					slug: "story"
				}
			]
		}
	}

	render() {
		return (
			<View style={{ flex: 1, paddingBottom: 120,  alignItems: '' }}>
				<FlatList
					horizontal
					showsHorizontalScrollIndicator={false}
					scrollEnabled={false}
					data={this.fields}
					ref={ref => this.stepsRef = ref }
					keyExtractor={item => item.slug}
					style={{ flex: 1 }}
					renderItem={ ({ item, index }) => (
						<View style={{ width: this.state.screen_width, justifyContent: 'space-evenly' }}>
							<View>
								<Text style={{ color: '#000000',fontSize: 25, textAlign: 'center', marginBottom: 30}} >{item.label}</Text>
								{ this._renderField(item) }
							</View>
							{/* <Text>{ this.state[item.slug] }</Text> */}
						</View>
					)
						
					}
				/>
				<TouchableOpacity
  					  onPress={this._validateInput.bind(this)}
					  style={{ backgroundColor:'#F70505', borderRadius:30, height:50, width:170, justifyContent:"center", alignSelf:'center' }}
				>
					<Text style={{ color: 'white',fontSize: 20, textAlign: 'center'}} >Suivant</Text>
				</TouchableOpacity>
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
						multiline={ item.allowMultilines }
						placeholder={ item.name }
						style={{alignSelf:'center', backgroundColor: 'white', borderWidth: 2, borderColor: '#F70505', borderRadius: 20, width: 200, height: 60, textAlign: 'center', fontSize: 20 }}
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
						style={{marginTop: 60}}
					/>
				)
			case 'radio':
				return <RadioSelector 
							values={item.values}
							onChange={(value) => {
								const update = {}
								update[item.slug] = value
								this.setState(update)
							}}
							style={{}}
						/>
			case 'picker':
				if(item.allowMultipleValues){
					return (
						<MultiSelector
							values={item.values}
							rowStyle={{padding: 10}}
							rowSelectedColor="#FF0000"
							onChange={(value) => {
								const update = {}
								update[item.slug] = value
								this.setState(update)
							}}
						/>
					)
				}else{
					return (
						<Picker
							selectedValue={ this.state[item.slug] }
							onValueChange={ (value, index) => {
								const update = {}
								update[item.slug] = item.values[index].slug
								this.setState(update)
							}}
							style={{ color: '#000000',fontSize: 20, textAlign: 'center'}}
							rowStyle={{ }}
						>
							{ item.values.map( value => {
								return <Picker.Item label={value.label} value={value.slug} key={value.slug} />
							}) }
						
							
						</Picker>
					)
				}
			case 'fileupload':
				if(item.multiplicator && item.multiplicator > 1){
					return (
						<View style={{
							 
						}}>
							{
								item.values.map(value => {
									return (
										<View key={value.slug}>
											<Text style={{ color: '#000000',fontSize: 15, textAlign: 'center', alignSelf:'center', marginBottom:20}}>Prenez 2 photos Recto-Verso de votre carte afin de vérifier ton identité</Text>
											<Image source={this.state[value.slug]} style={{ height: 100, width: 100 }} />
											<TouchableOpacity
											   onPress={() => this._openImagePicker(value)} 
							
					 						style={{marginBottom:40, alignSelf:'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#000000', borderRadius: 15, width: 160, height: 37, justifyContent: 'center'}}>	
											 <Text style={{ color: '#000000',fontSize: 15, textAlign: 'center', alignSelf:'center'}} >Ajouter une image</Text>
											 </TouchableOpacity>
										</View>
									)
								})
							}
						</View>
					)
				}else{
					return (
						<View key={item.slug}>
							<Image source={this.state[item.slug]} style={{ height: 100, width: 100 }} />
							<TouchableOpacity
											   onPress={() => this._openImagePicker(item)}
							
					 						style={{marginBottom:40, alignSelf:'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#000000', borderRadius: 15, width: 160, height: 37, justifyContent: 'center'}}>	
											 <Text style={{ color: '#000000',fontSize: 15, textAlign: 'center', alignSelf:'center'}} >Ajouter une image</Text>
											 </TouchableOpacity>
						</View>
					)
				}
			default:
				return <Text>Unhandled yet.</Text>
		}
	}

	_validateInput() {
		// TODO: validate input at each step to be sure

		let currentField = this.fields[this.state.step].slug

		console.log(`Current state of slug ${currentField}: ${this.state[currentField]}`)

		// if(currentField == "idCard"){
		// 	currentField = "idCardRecto"
		// }
		// if(this.state[currentField] === undefined){ // TODO: OR NULL (or invalid)
		// 	Alert.alert(
		// 		'Erreur',
		// 		"L'information saisie est invalide. Vérifies que tu n'as pas fait d'erreur !",
		// 		[
		// 			{ text: 'OK', onPress: null },
		// 		],
		// 		{ cancelable: false },
		// 	)
		// 	return
		// }

		if(this.state.step + 1 >= this.fields.length) {
			this.props.navigation.navigate("PhoneAuth", {
				shouldAccountExist: false,
				data: {
					...this.state,
					idCardRecto: this.state.idCardRecto ? this.state.idCardRecto.uri : null,
					idCardVerso: this.state.idCardVerso ? this.state.idCardVerso.uri : null,
					idCardSelfie: this.state.idCardSelfie ? this.state.idCardSelfie.uri : null,
					userType: this.props.navigation.getParam("userType")
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

	_openImagePicker(item){
		ImagePicker.showImagePicker({ title: item.label }, (response) => {
			if(response.didCancel) {
				console.log("Action annulée par l'utilisateur")
			} else if(response.error) {
				console.log('Erreur ImagePicker : ', response.error)
			} else if(response.customButton) {
				console.log('Custom button: ', response.customButton)
			} else {
				const source = { uri: response.uri }

				const update = {}
				update[item.slug] = source
				this.setState(update)
			}
		})
	}
}

export default SignInScreen