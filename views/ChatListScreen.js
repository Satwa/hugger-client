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
                    data.forEach(doc => {
                        let conversation = doc.data()
                        conversation.id = doc.id
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
    }

    render() {
        return (
            <FlatList
                data={this.state.conversations}
                keyExtractor={item => item.id}
                renderItem={ (item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("ChatScreen", { conversations: [item.item] })}
                        >
                            <View>
                                <Text>{ item.item.id }</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        )
    }
}

export default ChatListScreen