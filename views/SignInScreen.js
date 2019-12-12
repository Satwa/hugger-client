import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Button,
} from 'react-native';

class SignInScreen extends React.Component {
    static navigationOptions = {
      title: 'Rejoindre',
    };
  
    render() {
      return (
        <View>
          <Button title="Rejoins!" onPress={this._signInAsync} />
        </View>
      );
    }
  
    _signInAsync = async () => {
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('App');
    };
  }
  
  export default SignInScreen;
  