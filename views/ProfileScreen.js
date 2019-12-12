import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';

class ProfileScreen extends React.Component {
    static navigationOptions = {
      title: 'Profile',
    };
  
    render() {
      return (
        <View>
          <Text>Profile</Text>
        </View>
      );
    }
  
  }

  export default ProfileScreen;