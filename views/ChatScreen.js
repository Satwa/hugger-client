import React from 'react'

import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { GiftedChat } from 'react-native-gifted-chat'


class ChatScreen extends React.Component {
    static navigationOptions = {
      title: 'Discussion',
    }
      state = {
        messages: [],
      }
      componentDidMount() {
        this.setState({
          messages: [
            {
              _id: 1,
              text: 'Hey Huggy',
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: require('../assets/logo.png')
              },
            },
          ],
        })
      }
    
      onSend(messages = []) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))
      };
  
    render() {
      return (
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1,
            }
            }
         />
         )
 }
}
export default ChatScreen;