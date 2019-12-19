import React from 'react'
import {
	ActivityIndicator,
	AsyncStorage,
	StatusBar,
	StyleSheet,
	View,
	Text,
	Button,
	TouchableOpacity,
	Image
} from 'react-native';

class PickProfileTypeScreen extends React.Component {
	static navigationOptions = {
		header: null,
	};
	
	render() {
		return (
			<View>
				<TouchableOpacity
  					onPress={ () => this.props.navigation.navigate("SignIn", { userType: "huggy" }) }
					style={{ 
						borderRadius: 20, 
						justifyContent:"center", 
						marginBottom:10, 
						alignSelf:'center', 
						marginTop:60, 
						backgroundColor: "#FFF",
						width: '80%',
						alignItems: 'center',
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 3,
						},
						shadowOpacity: 0.29,
						shadowRadius: 4.65,

						elevation: 7,
					}}>
				<View>
					<Text style={{ color: '#000000',fontSize: 20, textAlign: 'center', marginTop:70}} >HUGGY</Text>
					<Text style={{ color: '#F70505',fontSize: 15, textAlign: 'center', marginTop:5}}>J'ai besoin d'aide</Text>
					<Image
						style={{width: 200, height: 200,marginTop:20 }}
						source={require('../assets/huggyprofile.png')}
						resizeMode="contain" 
					/>
				</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={ () => this.props.navigation.navigate("SignIn", { userType: "hugger" }) }
					style={{ 

						borderRadius: 20,
						justifyContent: "center",
						marginTop: 10,
						alignSelf: 'center',
						backgroundColor: "#FFF",
						width: '80%',
						alignItems: 'center',
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 3,
						},
						shadowOpacity: 0.29,
						shadowRadius: 4.65,

						elevation: 7,
					}}>
					<View> 
						<Text style={{ color: '#000000',fontSize: 20, textAlign: 'center', marginTop:70}} >HUGGER</Text>
						<Text style={{ color: '#F70505',fontSize: 15, textAlign: 'center', marginTop:5}}>J'aide</Text>
						<Image
						style={{width: 200, height: 200,marginTop:20 }}
						source={require('../assets/huggerprofile.png')}
						resizeMode="contain" 
						/>
					</View>
				</TouchableOpacity>
			</View>
		);
	}  
}

export default PickProfileTypeScreen;
