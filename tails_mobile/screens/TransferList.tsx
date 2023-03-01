import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather'

const TransferList = () => {

	return (
		<View style={styles.background}>
			<Text style={styles.subtitle}>Earn with Increment.fi</Text>
			<TouchableOpacity>
				<View style={styles.item}>
					<View style={{ flexDirection: 'row' }}>
						<Image source={require('../assets/increment_logo.png')} style={{ width: 23, height: 23 }} />
						<Text style={styles.itemText}>Deposit into Increment.fi </Text>

					</View>
					<FeatherIcon size={25} name='chevron-right' color='#ffffff'/>

				</View>
			</TouchableOpacity>
			<TouchableOpacity>
				<View style={styles.item}>
					<View style={{ flexDirection: 'row' }}>
						<Image source={require('../assets/increment_logo.png')} style={{ width: 23, height: 23 }} />
						<Text style={styles.itemText}>Withdraw from Increment.fi</Text>
					</View>
					<FeatherIcon size={25} name='chevron-right' color='#ffffff'/>
				</View>
			</TouchableOpacity>

			<TouchableOpacity>
				<View style={styles.item}>
					<View style={{ flexDirection: 'row' }}>
						<FeatherIcon name='refresh-ccw' size={23} color='#673ab7'/>
						<Text style={styles.itemText}>Swap Tokens</Text>
					</View>
					<FeatherIcon size={25} name='chevron-right' color='#ffffff' />
				</View>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	background: {
		flex: 1, 
		padding: 20,
		backgroundColor: '#1b1c1c'
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 20,
		paddingBottom: 20,
		marginBottom: 20
	},
	itemText: {
		fontSize: 18,
		fontWeight: '700',
		marginLeft: 20,
		color: '#ffffff',
		letterSpacing: .5
	},
	subtitle: {
		fontWeight: '700',
		fontSize: 20,
		marginTop: 20,
		marginBottom: 20,
		color: '#ad8fd5',
		letterSpacing: .4
	},
})

export default TransferList