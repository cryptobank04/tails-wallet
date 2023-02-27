import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import PlaidLink, {
	LinkSuccess,
	LinkExit
} from 'react-native-plaid-link-sdk';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { getPlaidLinkToken } from './api';

import { useUser } from './hooks'

const Dashboard = () => {
	const user = useUser()
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
		<View style={{ flex: 1, backgroundColor: 'white', paddingLeft: 20, paddingRight: 20, paddingTop: 30 }}>
			<View>
				<Text style={styles.networth}>Net Worth</Text>
				<Text style={styles.balance}>$5,000</Text>
			</View>

			<Text style={styles.subtitle}>Linked Bank Accounts</Text>
			{bankAccount !== undefined &&
				(
					<View style={styles.bankItem}>
						<View>
							<Image style={styles.bankLogo} source={require('./assets/td_logo.png')} />
						</View>
						<View style={{ marginLeft: 10 }}>
							<Text style={styles.bankItemText}>TD Bank Checking</Text>
							<Text style={styles.bankAccountText}>Checking Account &#8226; &#8226; &#8226; &#8226; 0000</Text>
						</View>
					</View>
				)
			}
			<PlaidLink
				tokenConfig={{
					token: linkToken,
					noLoadingState: false,
				}}
				onSuccess={async (success: LinkSuccess) => {
					setBankAccount(success)

				}}
				onExit={(response: LinkExit) => {
					console.log(response);
				}}>
				<View style={styles.addBankComponent}>
					<View style={{ flexDirection: 'row' }}>
						<FeatherIcon size={30} name='plus-circle' />
						<Text style={styles.addBankText}>Link A Bank Account</Text>
					</View>
					<FeatherIcon size={25} name='chevron-right' />
				</View>
			</PlaidLink>

			<View style={{ marginTop: 20 }}>
				<View style={{ flexDirection: 'row' }}>
					<FeatherIcon size={20} name='trending-up' />
					<Text style={{ marginLeft: 7, marginBottom: 10, fontWeight: 'bold', fontSize: 17, color: 'grey' }}>Earn with Increment.Fi</Text>
				</View>
				<Text style={{ fontSize: 19, fontWeight: '400', lineHeight: 27 }}>Earn with Increment.fi by investing your stables into LP Pools.</Text>

			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	networth: {
		fontWeight: 'bold',
		fontSize: 18,
		color: 'grey',
		marginBottom: 4
	},
	balance: {
		fontWeight: 'bold',
		fontSize: 34,
		marginBottom: 30
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