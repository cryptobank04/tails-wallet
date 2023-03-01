import React from 'react';
import { 
	StyleSheet, 
	Image, 
	TouchableOpacity, 
	View, 
	Text, 
	SafeAreaView 
} from 'react-native'
import { createFlowAccount, createTailsAccount } from '../api';
import { useDispatch } from '../hooks';

const LandingPage = () => {
	const dispatch = useDispatch()

	const createAccount = async (flownsName: string) => {
		await createTailsAccount(dispatch)
		// await createFlowAccount(flownsName, dispatch)
	}

	return (
		<SafeAreaView style={styles.background}>
			<View>
				<Text style={styles.headerText}>Tails</Text>
			</View>

			<View style={{alignItems: 'center'}}>
				<Image style={styles.image} resizeMode='contain' source={require('../assets/increment_logo.png')}/>
				<View style={{marginTop: 25}}>
					<Text style={styles.subText}>EARN MORE WITH DeFi</Text>
				</View>
			</View>

			<View>
				<TouchableOpacity onPress={createAccount}>
					<Image style={{ width: 240, height: 100 }} resizeMode='contain' source={{ uri: 'https://developers.google.com/static/identity/images/btn_google_signin_dark_normal_web.png' }} />
				</TouchableOpacity>
				<View style={styles.buttons}>
					<Text style={styles.emailText}>Log in with email</Text>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	background: {
		flex: 1, 
		alignItems: 'center', 
		justifyContent: 'space-around',
		backgroundColor: '#1b1c1c'
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 35,
		letterSpacing: 1,
		color: '#ffffff'
	},
	image: {
		height: 150,
		width: 150
	},
	subText: {
		fontWeight: 'bold',
		letterSpacing: 1,
		fontSize: 20,
		color: '#ffffff'
	},
	buttons: {
		alignItems: 'center'
	},
	emailText: {
		fontWeight: "800",
		fontSize: 17,
		letterSpacing: .5,
		color: '#ffffff'
	}
})

export default LandingPage