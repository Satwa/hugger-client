import React from 'react'

import {
	ActivityIndicator,
	StatusBar,
	StyleSheet,
	View,
	Text
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import firebase from 'react-native-firebase'
import { withSocketContext } from '../providers/SocketProvider'

// Get more info on GiftedChat from: https://github.com/FaridSafi/react-native-gifted-chat
class ChatScreen extends React.Component {
	static navigationOptions = {
		title: 'Discussion',
	}
	
	state = {
		user: {},
		conversations: [{id: null, messages: []}]
	}

	constructor(props){
		super(props)

		this.moods = {
			angry: require("../assets/angry.png"),
			sad: require("../assets/sad.png"),
			scared: require("../assets/scared.png"),
			good: require("../assets/good.png"),
			happy: require("../assets/happy.png"),
		}
	}

	componentDidMount() {
		this.init = async () => {
			const userInMemory = await AsyncStorage.getItem("user")
			const user = JSON.parse(userInMemory)

			try{
				// TODO: add cache
				let conversations = []
				if(!this.props.navigation.getParam("conversations") && user.type == "hugger"){ // If hugger but no chat selected, redirect
					this.props.navigation.replace("ChatListScreen")
					return false
				} else if(this.props.navigation.getParam("conversations")){ // if param then update state
					conversations = this.props.navigation.getParam("conversations")
					user.chatroom = conversations[0].id
					this.setState({
						conversations: this.props.navigation.getParam("conversations"),
						user: user
					})
					return
				}

				delete user.chatroom
				if(user.type == "huggy" && !user.chatroom){
					// Save in memory to not perform this again
					
					const chatroom = await firebase.firestore().collection("chats").where("users", "array-contains", user.uid).limit(1).get()
					console.log("not saving any chatroom (" + chatroom.docs[0].id + ")")
					user.chatroom = chatroom.docs[0].id

					const pictureURL = await firebase.storage().ref(`profile_pictures/${chatroom.docs[0].data().users.find($0 => $0 != user.uid)}`).getDownloadURL()
					user.huggerpicture = pictureURL ///////////////// WIPWIPWIPWIPWIWIP
					AsyncStorage.setItem("user", JSON.stringify(user))
				}else if(user.type == "hugger"){
					console.log("hugger chatroom")
					user.chatroom = conversations[0].id
				}
				this.setState({
					user: user
				})
			}catch(error){
				console.log(error)
			}
		}

		this.init()
			.then((d) => {
				if(d === false) return
				firebase.firestore()
					.collection('chats')
					.doc(this.state.user.chatroom || this.state.conversations[0].id)
					.collection('messages')
					.orderBy('created', 'desc')
					.onSnapshot((query) => {
						const update = this.state.conversations
						update[0].messages = []

						const findUserAvatar = (data) => {
							if(data.user.sender !== this.state.user.uid){
								// User is not me
								if(this.state.conversations[0].sender){
									if(this.state.conversations[0].sender.picture.includes("http")){
										return { uri: this.state.conversations[0].sender.picture }
									}else{
										return this.moods[this.state.conversations[0].sender.picture]
									}
								}else{
									return { uri: this.state.user.huggerpicture }
								}
							}else{
								return null
							}
						}

						for(const doc of query.docs){
							const data = doc.data()

							update[0].messages.push({
								_id: doc.id,
								text: data.message,
								createdAt: data.created,
								user: {
									_id: data.user.sender,
									name: data.user.sender !== this.state.user.uid ? this.state.user.name : (this.state.conversations[0].sender ? this.state.conversations[0].sender.name : ""),
									avatar: findUserAvatar(data)
								}
							})
						}
						this.setState({conversations: update})
					}, (err) => console.log(err)) // TODO: Ajouter alert
			})
	}

	componentWillUnmount(){

	}
	
	onSend(messages = []) {
		for(const message of messages){
			firebase
				.firestore()
				.collection('chats')
				.doc(this.state.user.chatroom || this.state.conversations[0].id)
				.collection('messages')
				.add({
					created: Date.now(),
					message: message.text,
					user: {
						sender: this.state.user.uid
					}
				})
		}

		const update = this.state.conversations
		update[0].messages = GiftedChat.append(update[0].messages, messages),
		this.setState({ conversations: update })
	}
	
	render() {
		return (
			<GiftedChat
				messages={this.state.conversations[0].messages}
				onSend={messages => this.onSend(messages)}
				user={{
					_id: this.state.user.uid,
				
				}}
				renderBubble={this.renderBubble.bind(this)}
			/>
		)
	}
	renderBubble(props) {
		return (
			<Bubble
		   		{...props}
		   		wrapperStyle={{
					right: {
			  			backgroundColor: '#9223F3',
					},
		   		}}
		  	/>
	   );
	 }
}

export default withSocketContext(ChatScreen)