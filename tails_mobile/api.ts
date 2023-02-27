import {
	GoogleSignin, GoogleSigninButton,
	statusCodes,
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

export const createFlowAccount = async (dispatch?: Dispatch) => {
	const resp = await fetch(`${baseUrl}/createAccount`)
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

