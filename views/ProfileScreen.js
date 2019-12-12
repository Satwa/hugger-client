import React from 'react'

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
  
   
  
    _signOutAsync = async () => {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    };
  }