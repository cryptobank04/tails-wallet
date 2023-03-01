import React, {useEffect, useState} from 'react'
import { 
  View, 
  SafeAreaView,
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image 
} from 'react-native'

import { getPlaidLinkToken } from '../api';

import PlaidLink, {
	LinkSuccess,
	LinkExit
} from 'react-native-plaid-link-sdk';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { useUser } from '../hooks'


const BankAccounts = () => {
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

  return (
    <SafeAreaView style={styles.background}>
      <Text style={styles.subtitle}>Linked Bank Accounts</Text>

			{bankAccount !== undefined &&
				(
					<View style={styles.bankItem}>
						<View>
							<Image style={styles.bankLogo} source={require('../assets/td_logo.png')} />
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
						<FeatherIcon size={23} name='plus-circle' color='#c8c8c8'/>
						<Text style={styles.addBankText}>Link A Bank Account</Text>
					</View>
					<FeatherIcon size={23} name='chevron-right' color='#c8c8c8' />
				</View>
			</PlaidLink>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
	background: {
		display: 'flex',
		flex: 1, 
		backgroundColor: '#1b1c1c', 
		// paddingTop: 20,
		// paddingTop: 30
	},
	networth: {
		fontWeight: 'bold',
		fontSize: 18,
		color: 'grey',
		marginBottom: 4
	},
	balance: {
		fontWeight: '800',
		fontSize: 40,
		marginBottom: 30
	},
	boxView: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	box: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		height: 180,
		width: 180,
		padding:20,
		justifyContent: 'space-between'
	},
	boxHeader: {
		fontSize: 15,
		fontWeight: 'bold',
		letterSpacing: .7,
		color: 'grey',
		// marginBottom: 10
	},
	boxSubheader: {
		fontWeight: 'bold',
	},
	subtitle: {
		fontWeight: 'bold',
		fontSize: 20,
		marginBottom: 16,
		marginTop: 20,
		marginLeft: 20,
		color: '#ffffff'
	},
	addBankComponent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 50,
		// paddingBottom: 20,
		padding: 20
	},
	addBankText: {
		fontSize: 18,
		fontWeight: '400',
		marginLeft: 12,
		alignSelf: 'center',
		color: '#c8c8c8'
	},
	bankItemText: {
		fontSize: 17,
		fontWeight: '400',
		marginBottom: 4,
		color: '#ffffff'
	},
	bankAccountText: {
		fontSize: 13,
		fontWeight: '400',
		color:'#ffffff'
	},
	bankItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 20,
	},
	bankLogo: {
		width: 32,
		height: 32,
		borderRadius: 64
	}
})

export default BankAccounts