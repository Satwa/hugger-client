import React from 'react'

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
  