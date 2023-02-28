import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { useFlowAccount, useUser } from '../hooks'

const ProfileAvatar = () => {
	const user = useUser()
	const flowAccount = useFlowAccount()

	if (!user) return null

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{flowAccount.flownsName}</Text>

			<View style={styles.avatarcontainer}>
				<Image resizeMode='contain' source={{ uri: user.additionalUserInfo.profile.picture }} style={styles.image} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		fontSize: 15,
		marginRight: 6,
		fontWeight: '400'
	},
	avatarcontainer: {
		width: 30,
		height: 30,
		borderRadius: 60,
		marginRight: 20
	},
	image: {
		width: 30,
		height: 30,
		borderRadius: 60,
	}
})

export default ProfileAvatar