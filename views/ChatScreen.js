import React from 'react'

import {
	ActivityIndicator,
	StatusBar,
	StyleSheet,
	View,
	Text
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import AsyncStorage from '@react-native-community/async-storage'
import { GiftedChat } from 'react-native-gifted-chat'
import firebase from 'react-native-firebase'
import {Bubble} from 'react-native-gifted-chat'

// Get more info on GiftedChat from: https://github.com/FaridSafi/react-native-gifted-chat
class ChatScreen extends React.Component {
	static navigationOptions = {
		title: 'Discussion',
	}
	
	state = {
		messages: [],
		user: {},
		conversations: [{id: null, messages: []}]
	}

	constructor(props){
		super(props)
	}

	componentDidMount() {
		const test = async () => {
			const userInMemory = await AsyncStorage.getItem("user")
			const user = JSON.parse(userInMemory)
			this.setState({
				user: user
			})

			try{
				// TODO: add cache
				// TODO: Fetch chatroom if none in memory
				let conversations = []
				if(!this.props.navigation.getParam("conversations") && user.type == "hugger"){
					this.props.navigation.replace("ChatListScreen")
				} else if (this.props.navigation.getParam("conversations")){
					this.setState({
						conversations: this.props.navigation.getParam("conversations")
					})
				}

				if(conversations.length === 1 && user.type == "huggy" && !user.chatroom){
					// Save in memory to not perform this again
					user.chatroom = conversations[0].id
					AsyncStorage.setItem("user", JSON.stringify(user))
				}else{
					console.log("not saving any chatroom")
				}

				// TODO: WIPWIPWIPWIPWIPWIPWIPWIP
				if(conversations.length === 1){
					this.setState({
						messages: this.state.conversations[0].messages
					})
				}
			}catch(error){
				console.log(error)
			}
		}

		test()
			.then(() => {
				firebase.firestore()
					.collection('chats')
					.doc(this.state.user.chatroom || this.state.conversations[0].id)
					.collection('messages')
					.orderBy('created', 'desc')
					.onSnapshot((query) => {
						const update = this.state.conversations
						update[0].messages = []
						for(const doc of query.docs){
							const data = doc.data()

							update[0].messages.push({
								_id: doc.id,
								text: data.message,
								createdAt: data.created,
								user: {
									_id: data.user.sender
								}
							})
						}
						this.setState({conversations: update})
					}, (err) => console.log(err))
			})
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
	renderBubble ( props ) {
		return (
		  <Bubble
		   { ... accessoires}
		   wrapperStyle={{
			right: {
			  backgroundColor: '#9400D3',
			},
		   }}
		  />
	   );
	 }
}

export default ChatScreen