import React from 'react'

import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Image,
    View,
    Text
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from 'react-native-firebase'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { withSocketContext } from '../providers/SocketProvider'

// Get more info on GiftedChat from: https://github.com/FaridSafi/react-native-gifted-chat
class ChatListScreen extends React.Component {
    static navigationOptions = {
        title: 'Discussion',
    }

    state = {
        shouldHideWaitScreen: false,
        user: {},
        conversations: [{ id: null, messages: [] }]
    }

    constructor(props) {
        super(props)
        this.spriteRef = []

        this.moods = {
            angry: require("../assets/angry.png"),
            sad: require("../assets/sad.png"),
            scared: require("../assets/scared.png"),
            good: require("../assets/good.png"),
            happy: require("../assets/happy.png"),
        }
    }

    componentDidMount() {
        (async () => {
            const userInMemory = await AsyncStorage.getItem("user")
            const user = JSON.parse(userInMemory)
            this.setState({
                user: user,
                shouldHideWaitScreen: user.authorized
            })

            try {
                // TODO: add cache
                if (user.type == "hugger") {
                    if(!user.authorized){
                        const me = await global.SolidAPI.user()
                        console.log("unauthorized hugger")
                        if(me.authorized == true){
                            console.log("now authorized hugger")
                            user.authorized = true
                            this.setState({
                                shouldHideWaitScreen: true,
                                user: user
                            })
                            AsyncStorage.setItem("user", JSON.stringify(user))
                            return
                        }
                        return
                    }
                    
                    const { socket } = this.props

                    if(!!socket){
                        if (socket.connected) {
                            socket.emit("chatList")
                            socket.on("chatListData", (data) => {
                                conversations = data
                                this.setState({
                                    conversations: data
                                })
                            })

                            socket.on("moodUpdated", (data) => {
                                let update = this.state.conversations
                                update.find($0 => $0.id == data.room.replace("chatroom", "")).huggy.picture = data.picture
                                this.setState({
                                    conversations: update
                                })
                            })
                        }
                        // TODO: Handle socket not being connected
                    }
                }else{
                    this.props.navigation.replace("ChatScreen")
                }
            } catch (error) {
                console.log(error)
            }
        })()
        .catch((err) => { console.log(this.spriteRef); console.log(err)})
    }

    render() {
        if(!this.state.shouldHideWaitScreen){
            return(
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        marginBottom: 50,
                        fontSize: 22,
                        textAlign: 'center'
                    }}>
                        Ton compte est en cours de validation par l'équipe Hugger
                    </Text>
                    <Image
                        source={require("../assets/waiting.png")}
                        style={{width: 300, height: 300}}
                        resizeMode="contain"
                    />
                </View>
            )
        }else{
            return (
                <FlatList
                    data={this.state.conversations}
                    keyExtractor={item => item.id}
                    renderItem={ (item) => {
                        return (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate("ChatScreen", { conversations: [item.item] })}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={this.moods[item.item.huggy ? item.item.huggy.picture : '']} style={{height: 150, width: 150}} resizeMode="contain" />
                                    <Text style={{fontSize: 25}}>{ item.item.huggy ? item.item.huggy.name : "" } </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            )
        }
    }
}

export default withSocketContext(ChatListScreen)