import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native'
import { createFlowAccount, createTailsAccount } from './api';
import { useDispatch } from './hooks';




const LandingPage = () => {
	const dispatch = useDispatch()

	const createAccount = async () => {
		await createTailsAccount(dispatch)
		await createFlowAccount(dispatch)
	}


	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<TouchableOpacity onPress={createAccount}>
				<Image style={{ width: 220, height: 100 }} resizeMode='contain' source={{ uri: 'https://developers.google.com/static/identity/images/btn_google_signin_dark_normal_web.png' }} />
			</TouchableOpacity>
		</View>
	)
}

export default LandingPage