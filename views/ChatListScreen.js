import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';

class ChatListScreen extends React.Component {
    static navigationOptions = {
      title: 'Toutes les Discussions',
    };
  
    render() {
      return (
        <View>
          <Text> Liste des Chat </Text>
        </View>
      );
    }
}

export default ChatListScreen;
