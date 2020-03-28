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

//TODO: Test when two active chats at once, does it route correctly?

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

	findUserAvatar = url => url.includes("http") ? { uri: url } : this.moods[url]

	componentDidMount() {
		const { socket } = this.props

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

					let i = 0, j = 0
					for (const conversation of conversations) {
						for (const message of conversation.messages) {
							conversations[j].messages[i]._id = message.id
							conversations[j].messages[i].text = message.message
							conversations[j].messages[i].createdAt = (new Date(message.createdAt)).getTime()
							conversations[j].messages[i].user = {
								_id: message.sender_id,
								name: message.sender_id == user.uid ? conversation.hugger.name : conversation.huggy.name, // TODO: we do this like that because we are in a if-huggy statement
								avatar: this.findUserAvatar(message.sender_id == user.uid ? conversation.hugger.picture : conversation.huggy.picture)
							}
							i++
						}
						j++
					}

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
					if (!!socket) {
						if (socket.connected) { // only for huggy to fetch chatroom
							socket.emit("chatList")
							socket.on("chatListData", (data) => {
								let temp = data.slice(0)
								let i = 0, j = 0
								for(const conversation of temp){
									for(const message of conversation.messages){
										temp[j].messages[i]._id = message.id
										temp[j].messages[i].text = message.message
										temp[j].messages[i].createdAt = (new Date(message.createdAt)).getTime()
										temp[j].messages[i].user = {
											_id: message.sender_id,
											name: message.sender_id == user.uid ? conversation.huggy.name : conversation.hugger.name, // TODO: we do this like that because we are in a if-huggy statement
											avatar: this.findUserAvatar(message.sender_id == user.uid ? conversation.huggy.picture : conversation.hugger.picture)
										}
										i++
									}
									j++
								}
								this.setState({
									conversations: temp,
									user: user
								})
								console.log("not saving any chatroom (" + temp[0].id + ")")
								user.chatroom = temp[0].id
							})
						}
						// TODO: Handle socket not being connected
					}
					
					// const pictureURL = await firebase.storage().ref(`profile_pictures/${conversations[0].hugger.authID}`).getDownloadURL()
					// user.huggerpicture = pictureURL
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
			.then(() => {
				if(!!socket){ // global message handling
					if (socket.connected){
						socket.on("newMessage", (data) => {
							console.log(data)

							const update = this.state.conversations
							const otherUser = this.state.user.type == "huggy" ? this.state.conversations[0].hugger : this.state.conversations[0].huggy
							
							if(update[0].id != data.room.replace("chatroom", "")) return
							
							GiftedChat.append(update[0].messages, [{
								_id: data.id,
								text: data.message,
								createdAt: new Date(),
								user: {
									_id: otherUser.authID,
									name: otherUser.name,
									avatar: this.findUserAvatar(otherUser.picture)
								}
							}])
							this.setState({conversation: update})
						})

						socket.on("moodUpdated", (data) => {
							console.log("Mood update")
							let update = this.state.conversations
							if(update[0].id !== null){
								update.find($0 => $0.id == data.room.replace("chatroom", "")).huggy.picture = data.picture

								if (update[0].id !== data.room.replace("chatroom")) return

								this.setState({
									conversations: update
								})
							}
						})
					}
				}
			})
	}
	
	onSend(messages = []) {
		for(const message of messages){
			this.props.socket.emit("sendMessage", {
				room: "chatroom" + this.state.conversations[0].id,
				message: message.text
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