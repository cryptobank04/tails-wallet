import {
	GoogleSignin,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { Dispatch } from './store';

GoogleSignin.configure({
	webClientId: '773954062472-mipdmdb36plh2dvu7b59t5faod3ns54q.apps.googleusercontent.com',
	offlineAccess: false,
	profileImageSize: 150,
});

const baseUrl = 'http://127.0.0.1:5001/tails-62713/us-central1'


export const getPlaidLinkToken = async (userId: string) => {
	const resp = await fetch(`${baseUrl}/plaidLinkToken?id=${userId}`)
	const linkTokenData = await resp.json()

	return linkTokenData
}

export const createFlowAccount = async (flownsName: string, dispatch?: Dispatch) => {
	const resp = await fetch(`${baseUrl}/createAccount?flownsName=${flownsName}`)
	const flowAccount = await resp.json()

	if (dispatch)
		dispatch({ type: "set_flow_account", flowAccount })

	return flowAccount
}


export const createTailsAccount = async (dispatch?: Dispatch) => {
	await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

	const { idToken } = await GoogleSignin.signIn();
	const googleCredential = auth.GoogleAuthProvider.credential(idToken);
	const firebaseUser = await auth().signInWithCredential(googleCredential);

	if (dispatch)
		dispatch({ type: "set_user", user: firebaseUser })


	return firebaseUser
}

// NOTE: In production we would not pass the private key to the backend
// we would either:
// 1. Sign the transaction completely on the client
// 2. Create a custodial solution where the pks, are stored and managed
// by the backend using some sort of private key management service provider
export const depositIntoPool = async (amount: string, address: string, pk: string) => {
	const resp = await fetch(`${baseUrl}/depositIntoPool?depositAmount=${amount}&address=${address}&pk=${pk}`)
	const respJson = await resp.json()

	console.log('response', respJson)
}


export const getAccount = async (address: string, dispatch: Dispatch) => {
	const resp = await fetch(`${baseUrl}/getAccount?address=${address}`)
	const accountData = await resp.json()

	dispatch({ type: 'update_account_balance', balance: accountData.poolBalance })
}
