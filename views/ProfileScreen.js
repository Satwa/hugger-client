import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

class ProfileScreen extends React.Component {
    static navigationOptions = {
      title: 'Profile',
    };
  
    render() {
      return (
        <SafeAreaView>
          <Text>Profil</Text>
        </SafeAreaView>
      );
    }
  
  }

  export default ProfileScreen;