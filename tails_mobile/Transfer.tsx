import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Text, Image, KeyboardAvoidingView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { depositIntoPool, getAccount } from './api';
import { useDispatch, useFlowAccount } from './hooks';

const values = {
	bank: {
		imageSource: require('./assets/td_logo.png'),
		name: 'TD Bank - 0000',
		balance: '$100'
	},
	increment: {
		imageSource: require('./assets/increment_logo.png'),
		name: 'Increment Pool',
	},
	wallet: {},
}

interface Props {
	source?: string;
	destination?: string;
}

const Transfer = ({ navigation }) => {
	const [amount, setAmount] = useState(0)
	const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const flowAccount = useFlowAccount()
	const dispatch = useDispatch()

	const submit = async () => {
		try {
			setLoading(true)

			if (flowAccount) {
				await depositIntoPool(amount.toString(), flowAccount?.address, flowAccount?.privateKey)
				await getAccount(flowAccount?.address, dispatch)

				navigation.navigate('Dashboard')
			}
		} catch (err) {

		} finally {
			setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<TextInput value={`$${amount.toString()}`} onChangeText={t => setAmount(Number(t.replace('$', '')))} placeholder='$0' textAlign='center' style={styles.textinput} autoFocus inputMode='numeric' keyboardType='number-pad' />
			<View style={{ width: '100%', paddingLeft: 20, paddingRight: 15 }}>
				<Text style={styles.directionText}>From:</Text>
				<View style={styles.transferItem}>
					<View style={{ flexDirection: 'row' }}>
						<Image style={styles.image} source={values.bank.imageSource} />
						<View style={{ marginLeft: 15 }}>
							<Text style={styles.name}>TD Bank Checking - 0000</Text>
							<Text>Balance: $100</Text>
						</View>
					</View>
					{/* <FeatherIcon size={28} name='chevron-right' /> */}
				</View>
			</View>

			<View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
				<FeatherIcon size={20} name='arrow-down' />
			</View>

			<View style={{ width: '100%', paddingLeft: 20, paddingRight: 15 }}>
				<Text style={styles.directionText}>To:</Text>
				<View style={styles.transferItem}>
					<View style={{ flexDirection: 'row' }}>
						<Image style={styles.image} source={values.increment.imageSource} />
						<View style={{ marginLeft: 15 }}>
							<Text style={styles.name}>Increment Fi - USDC Pool</Text>
							<Text>Balance: $0</Text>
						</View>
					</View>
					{/* <FeatherIcon size={28} name='chevron-right' /> */}
				</View>
			</View>

			<TouchableOpacity style={{ width: '100%', marginTop: 50 }} onPress={() => setShowModal(true)}>
				<View style={styles.button}>
					<Text style={styles.buttonText}>Continue</Text>
				</View>
			</TouchableOpacity>

			<Modal presentationStyle='overFullScreen' transparent visible={showModal} animationType='fade'>
				<View style={styles.transparency}>
					<View style={styles.modal}>
						<Text style={styles.modalTitle}>Confirm Details</Text>
						<Text style={styles.modalSubtitle}>Amount:</Text>
						<Text style={styles.modalAmount}>${amount}</Text>

						<Text style={styles.modalSubtitle}>Available:</Text>
						<Text style={styles.modalSubtitleValue}>In a few seconds</Text>

						<Text style={styles.modalSubtitle}>From: </Text>
						<Text style={styles.modalSubtitleValue}>TD Bank</Text>

						<Text style={styles.modalSubtitle}>To: </Text>
						<Text style={styles.modalSubtitleValue}>Incriment Fi - USDC Pool</Text>


						<TouchableOpacity style={{ width: '100%', marginTop: 20 }} onPress={submit}>
							<View style={styles.button}>
								{loading ? <ActivityIndicator color='white' animating /> : <Text style={styles.buttonText}>Confirm</Text>}

							</View>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingTop: 0,
		alignItems: 'center',
		backgroundColor: 'white'
	},
	transferItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 20,
		paddingBottom: 20
	},
	textinput: {
		fontSize: 50,
		fontWeight: 'bold',
		width: 200,
		height: 120,
		marginTop: 0

	},
	directionText: {
		fontWeight: 'bold',
	},
	name: {
		fontSize: 15,
		fontWeight: '400',
		marginBottom: 4
	},
	image: {
		width: 35,
		height: 35,
		borderRadius: 70
	},
	button: {
		width: '100%',
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
	modal: {
		width: '100%',
		borderTopRightRadius: 40,
		borderTopLeftRadius: 40,
		backgroundColor: 'white',
		height: '65%',
		paddingTop: 35,
		padding: 25
	},
	modalAmount: {
		fontSize: 55,
		fontWeight: 'bold',
		marginBottom: 20
	},
	transparency: {
		backgroundColor: 'rgba(0,0,0,0.6)',
		width: '100%',
		height: '100%',
		justifyContent: 'flex-end'

	},
	modalTitle: {
		fontSize: 30,
		fontWeight: 'bold',
		marginBottom: 30,
	},
	modalSubtitle: {
		fontSize: 18,
		fontWeight: '400',
		marginBottom: 5,
	},
	modalSubtitleValue: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 20,
	}

})

export default Transfer