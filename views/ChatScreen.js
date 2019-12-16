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

class ChatScreen extends React.Component {
    static navigationOptions = {
      title: 'Discussion',
    };
  
    render() {
      return (
        <SafeAreaView>
          <Text>Chat</Text>
        </SafeAreaView>
      );
    }
}

export default ChatScreen;