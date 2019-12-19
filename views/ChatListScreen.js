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

// Get more info on GiftedChat from: https://github.com/FaridSafi/react-native-gifted-chat
class ChatListScreen extends React.Component {
    static navigationOptions = {
        title: 'Discussion',
    }

    state = {
        messages: [],
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
                user: user
            })

            try {
                // TODO: add cache
                // TODO: Move multiple fetch to ChatListScreen (or save it when sending a data notification with a cloud funnction)
                let conversations = []
                if (user.type == "hugger") {
                    const data = await firebase.firestore().collection("chats").where("users", "array-contains", user.uid).get()
                    data.forEach(async (doc) => {
                        let conversation = doc.data()
                        conversation.id = doc.id

                        const sender = await firebase.firestore().collection("users").doc(conversation.id.split("_").find($0 => $0 != user.uid)).get()
                        conversation.sender = sender.data()

                        conversations.push(conversation)

                        if (data.docs[data.docs.length - 1].data().created == doc.data().created) {
                            this.setState({
                                conversations: conversations
                            })
                        }
                    })
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
                                
                                <Image source={this.moods[item.item.sender ? item.item.sender.picture : '']} style={{height: 100, width: 100}} resizeMode="contain" />
                                <Text>{ item.item.sender ? item.item.sender.name : "" }</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        )
    }
}

export default ChatListScreen