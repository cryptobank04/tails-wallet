import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useUser } from '../hooks'

const ProfileAvatar = () => {
	const user = useUser()

	if (!user) return null

	return (
		<View style={styles.container}>
			<Image resizeMode='contain' source={{ uri: user.additionalUserInfo.profile.picture }} style={styles.image} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: 30,
		height: 30,
		borderRadius: 60,
		borderWidth: 1,
		borderColor: 'purple',
		marginRight: 20
	},
	image: {
		width: 30,
		height: 30,
		borderRadius: 60,
	}
})

export default ProfileAvatar