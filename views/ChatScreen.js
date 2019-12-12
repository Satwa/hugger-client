import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text
} from 'react-native';

class ChatScreen extends React.Component {
    static navigationOptions = {
      title: 'Discussion',
    };
  
    render() {
      return (
        <View>
          <Text> Chat </Text>
        </View>
      );
    }
}

export default ChatScreen;