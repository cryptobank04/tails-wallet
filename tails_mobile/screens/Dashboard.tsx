import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import FA from 'react-native-vector-icons/FontAwesome'
import { getPlaidLinkToken } from '../api';
import QRCode from 'react-native-qrcode-svg';

import { useDispatch, useFlowAccount, useShowModal, useUser } from '../hooks'

const Dashboard = ({ navigation }: any) => {
	const user = useUser()
	const flowAccount = useFlowAccount()
	const showModal = useShowModal()
	const [linkToken, setLinkToken] = useState()
	const dispatch = useDispatch()


	useEffect(() => {
		const fetchLinkToken = async () => {
			const linkTokenData = await getPlaidLinkToken(user.user.id)
			setLinkToken(linkTokenData.linkToken.link_token)
		}

		fetchLinkToken()


	}, [])

	if (!linkToken) return
	< View />


	return (
		<View style={styles.background}>
			<View>
				<Text style={styles.networth}>Balance</Text>
				<Text style={styles.balance}>{flowAccount?.balance || 0} USDC</Text>
				{/* <View><Text>{flowAccount?.address}</Text></View> */}

			</View>

			<View style={styles.boxView}>
				<TouchableOpacity style={styles.box} onPress={() => {
					navigation.navigate('Transfer')
				}} >
					{/* <View style={styles.box}> */}
					<Text style={styles.boxHeader}>Increment.Fi</Text>
					<Text style={styles.boxSubheader}>Earn 8% APY with Increment.Fi Pools</Text>
					<View style={{ alignItems: 'flex-end' }}>
						<FA size={15} name='arrow-right' />

					</View>
					{/* </View> */}
				</TouchableOpacity>

				<TouchableOpacity style={styles.box} onPress={() => {
					navigation.navigate('BankAccounts', { user: user })
				}} >
					{/* <View style={styles.box}> */}
					<Text style={styles.boxHeader}>Bank Accounts</Text>
					<Text style={styles.boxSubheader}>Link or view a bank account</Text>
					<View style={{ alignItems: 'flex-end' }}>
						<FA size={15} name='arrow-right' />
					</View>
					{/* </View> */}
				</TouchableOpacity>
			</View>

			<Modal presentationStyle='overFullScreen' transparent visible={showModal} animationType='fade'>
				<View style={styles.transparency}>
					<View style={styles.modal}>
						<Text style={{ fontSize: 40, fontWeight: 'bold', marginBottom: 30 }}>Deposit Funds</Text>

						<QRCode value={flowAccount?.address || ''} size={120} />
						<Text style={{ marginTop: 30, fontSize: 25, fontWeight: '400' }}>{flowAccount?.address}</Text>
						<View style={{ width: '80%', backgroundColor: 'grey', height: 1, borderRadius: 1, marginTop: 10 }} />
						<Text style={{ marginTop: 10, fontSize: 25, fontWeight: '400' }}>{flowAccount?.flownsName}.fn</Text>

						<Text style={{ fontSize: 20, fontStyle: 18, fontWeight: '400', marginTop: 50, textAlign: 'center' }}>Scan QR code to deposit funds, or use Flowns name.</Text>
						<TouchableOpacity style={{ width: '100%', marginTop: 20 }} onPress={() => dispatch({ type: 'set_show_modal', showModal: !showModal })}>
							<View style={styles.button}>
								<Text style={styles.buttonText}>Close</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>

		</View>
	)
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		backgroundColor: '#1b1c1c',
		paddingLeft: 20,
		paddingRight: 20,
		// paddingTop: 30
	},
	networth: {
		fontWeight: 'bold',
		fontSize: 18,
		color: 'grey',
		marginTop: 30,
		marginBottom: 8
	},
	button: {
		width: '100%',
		borderRadius: 25,
		alignItems: 'center',
		justifyContent: 'center',
		height: 60,
		backgroundColor: '#673ab7'
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
		padding: 25,
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	balance: {
		fontWeight: '800',
		fontSize: 50,
		marginBottom: 30,
		color: '#ffffff'
	},
	boxView: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	box: {
		backgroundColor: '#ad8fd5',
		borderRadius: 18,
		height: 180,
		width: 180,
		padding: 20,
		justifyContent: 'space-between',
		marginTop: 40
	},
	transparency: {
		backgroundColor: 'rgba(0,0,0,0.6)',
		width: '100%',
		height: '100%',
		justifyContent: 'flex-end'

	},
	boxHeader: {
		fontSize: 15,
		fontWeight: 'bold',
		letterSpacing: .7,
		color: '#ffffff',
		// marginBottom: 10
	},
	boxSubheader: {
		fontWeight: 'bold',
		lineHeight: 18
	},
	subtitle: {
		fontWeight: 'bold',
		fontSize: 20,
		marginBottom: 16
	},
	addBankComponent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 20,
		paddingBottom: 20
	},
	addBankText: {
		fontSize: 18,
		fontWeight: '400',
		marginLeft: 12
	},
	bankItemText: {
		fontSize: 17,
		fontWeight: '400',
		marginBottom: 4,
	},
	bankAccountText: {
		fontSize: 13,
		fontWeight: '400',
	},
	bankItem: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	bankLogo: {
		width: 32,
		height: 32,
		borderRadius: 64
	}
})

export default Dashboard