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

class TimelineScreen extends React.Component {
    static navigationOptions = {
      title: 'Fil d"actualité',
    };
  
    render() {
      return (
        <SafeAreaView>
          <Text>Timeline</Text>
        </SafeAreaView>
      );
    }

}
export default TimelineScreen;