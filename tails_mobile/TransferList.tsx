import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather'

const bankimageUri = 'https://cdn-icons-png.flaticon.com/512/8912/8912559.png'

const TransferList = ({ navigation }) => {



	return (<View style={{ flex: 1, padding: 20 }}>
		<TouchableOpacity onPress={() => {
			navigation.navigate('Transfer')
		}}>
			<View style={styles.item}>
				<View style={{ flexDirection: 'row' }}>
					<Image source={{ uri: bankimageUri }} style={{ width: 23, height: 23 }} />
					<Text style={styles.itemText}>Fund your Tails Wallet</Text>
				</View>
				<FeatherIcon size={25} name='chevron-right' />

			</View>
		</TouchableOpacity>

		<Text style={styles.subtitle}>Earn w/ Increment.fi</Text>
		<TouchableOpacity>
			<View style={styles.item}>
				<View style={{ flexDirection: 'row' }}>
					<Image source={require('./assets/increment_logo.png')} style={{ width: 23, height: 23 }} />
					<Text style={styles.itemText}>Deposit into Increment.fi </Text>

				</View>
				<FeatherIcon size={25} name='chevron-right' />

			</View>
		</TouchableOpacity>
		<TouchableOpacity>
			<View style={styles.item}>
				<View style={{ flexDirection: 'row' }}>
					<Image source={require('./assets/increment_logo.png')} style={{ width: 23, height: 23 }} />
					<Text style={styles.itemText}>Withdraw from Increment.fi</Text>
				</View>
				<FeatherIcon size={25} name='chevron-right' />
			</View>
		</TouchableOpacity>

		<TouchableOpacity>
			<View style={styles.item}>
				<View style={{ flexDirection: 'row' }}>
					<FeatherIcon name='refresh-ccw' size={23} />
					<Text style={styles.itemText}>Swap Tokens</Text>
				</View>
				<FeatherIcon size={25} name='chevron-right' />
			</View>
		</TouchableOpacity>


	</View>)
}

const styles = StyleSheet.create({
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
		fontWeight: '400',
		marginLeft: 20
	},
	subtitle: {
		fontWeight: 'bold',
		fontSize: 20,
		marginBottom: 20
	},
})

export default TransferList