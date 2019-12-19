import React from 'react'
import {
	ActivityIndicator,
	StatusBar,
	StyleSheet,
	View,
	Button,
	Text,
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view';
import AsyncStorage from '@react-native-community/async-storage'
import Slider from '@react-native-community/slider'
import SpriteSheet from 'rn-sprite-sheet'


class ProfileScreen extends React.Component {
	static navigationOptions = {
		header: null,
	}
	
	state = {
		user: {},
		slideValue: 0
	}

	componentDidMount(){
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

	render() {
		return (
			<SafeAreaView>
				<Text>{ this.state.user.name } est un { this.state.user.type }</Text>
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
					minimumTrackTintColor="#5EDE22"
					maximumTrackTintColor="#CE7111A"
				/>
				<Button title="Déconnexion" onPress={() => { AsyncStorage.clear(); this.props.navigation.navigate("Auth") }} />
			</SafeAreaView>
		)
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

		AsyncStorage.setItem("user", JSON.stringify(update.user)) // Update user mood in cache
		// TODO: Send to Firebase and notify huggy's hugger
		// TODO: For hugger, hide slider & hand, put profile picture
	}
		
}
	
export default ProfileScreen