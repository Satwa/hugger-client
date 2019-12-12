import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';

class TimelineScreen extends React.Component {
    static navigationOptions = {
      title: 'Fil d"actualité',
    };
  
    render() {
      return (
        <View>
          <Text>Fil d'actualité</Text>
        </View>
      );
    }

}
export default TimelineScreen;