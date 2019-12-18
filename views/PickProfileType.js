import React from 'react'
import {
	ActivityIndicator,
	AsyncStorage,
	StatusBar,
	StyleSheet,
	View,
	Text,
	Button,
	TouchableHighlight,
	Image
} from 'react-native';

class PickProfileTypeScreen extends React.Component {
	static navigationOptions = {
		title: 'JE SUIS',
	};
	
	render() {
		return (
			<View>
				<TouchableHighlight
  					  onPress={ () => this.props.navigation.navigate("SignIn", { userType: "huggy" }) }
					  style={{ borderRadius:30, justifyContent:"center", marginBottom:10, alignSelf:'center' }}>
				<View> 
				<Text style={{ color: '#00000',fontSize: 20, textAlign: 'center', marginTop:50}} >HUGGY</Text>
				<Text style={{ color: '#F70505',fontSize: 15, textAlign: 'center', marginTop:5}}>J'ai besoin d'aide</Text>
				<Image
				style={{width: 200, height: 200,marginTop:20 }}
				  source={require('../assets/huggyprofile.png')}
				  resizeMode="contain" 
				  />
				</View>
				</TouchableHighlight>
				<TouchableHighlight
  					  onPress={ () => this.props.navigation.navigate("SignIn", { userType: "hugger" }) }
					  style={{ borderRadius:30, justifyContent:"center", marginBottom:10, alignSelf:'center' }}>
				<View> 
				<Text style={{ color: '#00000',fontSize: 20, textAlign: 'center', marginTop:100}} >HUGGER</Text>
				<Text style={{ color: '#F70505',fontSize: 15, textAlign: 'center', marginTop:5}}>J'aide</Text>
				<Image
				style={{width: 200, height: 200,marginTop:20 }}
				  source={require('../assets/huggerprofile.png')}
				  resizeMode="contain" 
				  />
				</View>
				</TouchableHighlight>
			</View>
		);
	}  
}

export default PickProfileTypeScreen;
