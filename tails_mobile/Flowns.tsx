import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { createFlowAccount } from './api'
import { useDispatch } from './hooks'



const Flowns = () => {
	const dispatch = useDispatch()
	const [flownsName, setFlownsName] = useState('')
	const [loading, setLoading] = useState(false)

	const submit = async () => {
		setLoading(true)

		await createFlowAccount(flownsName, dispatch)

		setLoading(false)
	}



	return (
		<View style={styles.container}>
			<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

				<TextInput value={flownsName} style={styles.textinput} autoFocus onChangeText={t => setFlownsName(t.toLocaleLowerCase())} />
				<Text style={styles.fn}>.fn</Text>
			</View>
			<View style={{ width: '80%', alignItems: 'center', justifyContent: 'center' }}>

				<Text style={{ textAlign: 'center' }}>Create a unique username. This username can be used to send and receive tokens.</Text>
			</View>


			<TouchableOpacity style={{ width: '100%', marginTop: 50, alignItems: 'center', justifyContent: 'center' }} onPress={submit}>
				<View style={styles.button}>
					{loading ? <ActivityIndicator animating color='white' /> : <Text style={styles.buttonText}>Continue</Text>}
				</View>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'white',
		paddingTop: 30
	},
	textinput: {
		fontSize: 50,
		fontWeight: '400',
		// width: 200,
		height: 120,
		marginTop: 0

	},
	button: {
		width: '70%',
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		height: 60,
		backgroundColor: 'black'
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18
	},
	fn: {
		fontSize: 50,
		fontWeight: '400',
		color: 'grey'
	}
})

export default Flowns