import React from 'react'

class WelcomeScreen extends React.Component {
    static navigationOptions = {
      title: 'Bienvenue !',
    };
  
    render() {
      return (
        <View>
          <Button title="Show me more of the app" onPress={this._showMoreApp} />
        </View>
      );
    }
  
  }
  export default WelcomeScreen;