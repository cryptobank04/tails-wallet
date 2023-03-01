import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import PlaidLink, {
	LinkSuccess,
	LinkExit
} from 'react-native-plaid-link-sdk';
import FeatherIcon from 'react-native-vector-icons/Feather'
import FA from 'react-native-vector-icons/FontAwesome'
import { getPlaidLinkToken } from './api';

import { useFlowAccount, useUser } from './hooks'

const Dashboard = ({ navigation }: any) => {
	const user = useUser()
	const flowAccount = useFlowAccount()
	const [linkToken, setLinkToken] = useState()
	const [bankAccount, setBankAccount] = useState(undefined)


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
				<Text style={styles.balance}>${flowAccount?.balance || 0} USDC</Text>
				<View><Text>{flowAccount?.address}</Text></View>

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
		</View>
	)
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		backgroundColor: '#FAF9F6',
		paddingLeft: 20,
		paddingRight: 20,
		// paddingTop: 30
	},
	networth: {
		fontWeight: 'bold',
		fontSize: 18,
		color: 'grey',
		marginBottom: 8
	},
	balance: {
		fontWeight: '800',
		fontSize: 50,
		marginBottom: 30,
		color: '#673ab7'
	},
	boxView: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	box: {
		backgroundColor: '#FFFFFF',
		borderRadius: 14,
		height: 180,
		width: 180,
		padding: 20,
		justifyContent: 'space-between',
		marginTop: 40
	},
	boxHeader: {
		fontSize: 15,
		fontWeight: 'bold',
		letterSpacing: .7,
		color: '#ad8fd5',
		// marginBottom: 10
	},
	boxSubheader: {
		fontWeight: 'bold',
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