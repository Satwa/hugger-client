import React from 'react'
import {
	ActivityIndicator,
	StatusBar,
	StyleSheet,
	View,
	Button,
	Image,
	Text,
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view';
import AsyncStorage from '@react-native-community/async-storage'
import Slider from '@react-native-community/slider'
import ImagePicker from 'react-native-image-picker'
import SpriteSheet from 'rn-sprite-sheet'
import firebase from 'react-native-firebase'
import { withSocketContext } from '../providers/SocketProvider'

class ProfileScreen extends React.Component {
	static navigationOptions = {
		header: null,
	}
	
	state = {
		user: {},
		slideValue: 0
	}

	componentDidMount(){
		const { socket } = this.props
		if (!!socket) {
			if (socket.connected) {
				// socket.emit('bbb')
				// socket.on('aaa', () => { })
			} 
			// TODO: Handle socket not being connected
		}

		AsyncStorage.getItem("user")
			.then((data) => {
				const user = JSON.parse(data)

				if(user.mood){
					this.setState({
						user: user,
						slideValue: user.mood
					})
					this._onSlideChange(user.mood)
				}else{
					this.setState({
						user: user
					})
				}
			})
	}

	renderHuggyProfile(){
		return (
			<SafeAreaView style={{alignItems: "center", flex: 1, justifyContent: "center"}} >
				<Text style={{fontSize: 26, color:'#F70505', textAlign: "center"}} >{this.state.user.name} est un {this.state.user.type}</Text>
				<SpriteSheet
					ref={ref => (this.spriteRef = ref)}
					source={require('../assets/handsmotion.png')}
					columns={5}
					rows={1}
					width={300}
					animations={{
						angry: [0],
						sad: [1],
						scared: [2],
						good: [3],
						happy: [4],
					}}
					
					
				/>
				<Slider
					style={{ width: 200, height: 40 }}
					minimumValue={0}
					maximumValue={400}
					step={1}
					value={this.state.slideValue}
					onValueChange={this._onSlideChange.bind(this)}
					onSlidingComplete={this._onSlideComplete.bind(this)}
					minimumTrackTintColor='green'
					maximumTrackTintColor= '#F70505'
					
					
				/>
				<Button style={{marginTop: 50}} color="#F70505" title="Déconnexion" onPress={() => { AsyncStorage.clear(); this.props.navigation.navigate("Auth") }} />

			</SafeAreaView>
		)
	}

	renderHuggerProfile(){
		return (
			<SafeAreaView style={{alignItems: "center", flex: 1, justifyContent: "center"}} >
				<Text style={{fontSize: 26, color:'black', textAlign: "center", marginBottom:30}}>{this.state.user.name} est un {this.state.user.type}</Text>
				<Image source={{uri: this.state.user.picture}} style={{ height: 300, width: 300, borderRadius: 150, marginBottom: 30}} />
				<Button color='#000000' title="Changer ma photo de profil" onPress={() => this._openImagePicker()} />
				<Button color='#F70505' title="Déconnexion" onPress={() => { AsyncStorage.clear(); this.props.navigation.navigate("Auth") }} />
			</SafeAreaView>
		)
	}

	render() {
		return this.state.user.type == "hugger" ? this.renderHuggerProfile() : this.renderHuggyProfile()
	}

	_openImagePicker(){
		ImagePicker.showImagePicker({ title: "Changer ma photo de profil" }, (response) => {
			if (response.didCancel) {
				console.log("Action annulée par l'utilisateur")
			} else if (response.error) {
				console.log('Erreur ImagePicker : ', response.error)
			} else if (response.customButton) {
				console.log('Custom button: ', response.customButton)
			} else {
				const update = {user: this.state.user}
				update.user.picture = response.uri
				this.setState(update)

				firebase
					.storage()
					.ref(`profile_pictures/${this.state.user.uid}`)
					.putFile(response.uri)
			}
		})
	}

	_onSlideChange(value){
		this.setState({
			slideValue: value
		})
		this.spriteRef.play({
			type: Object.keys(this.spriteRef.props.animations)[(Math.floor(value / 100))],
			fps: 1,
			loop: false,
			resetAfterFinish: true,
		})
	}

	_onSlideComplete(){
		const update = { user: this.state.user }
		update.user.mood = this.state.slideValue
		this.setState(update)

		firebase.firestore()
			.collection("users")
			.doc(this.state.user.uid)
			.update({
				picture: Object.keys(this.spriteRef.props.animations)[(Math.floor(this.state.slideValue / 100))]
			})

		AsyncStorage.setItem("user", JSON.stringify(update.user)) // Update user mood in cache
		// TODO: Send to Firebase and notify huggy's hugger
		// TODO: For hugger, hide slider & hand, put profile picture
	}
		
}
	
export default withSocketContext(ProfileScreen)
// TODO: Handle socket here (huggy: when changing mood || hugger: subscribe to every huggy changing their mood)