import * as functions from "firebase-functions";
// import { createAccount2 } from "./flow.transactions";
import { Client, environments } from 'plaid';
import { createAccount2, registerDomain } from "./flow.transactions";
const { exec } = require('node:child_process')


const plaidClient = new Client({
	clientID: "63f6ce5dd3c77d001200fb73",
	secret: "09afe9cac60eace50e47bf394e9971",
	env: environments.sandbox,
	options: {},
});


let uneededOutputString = "❗Versionwarning:anewversionofFlowCLIisavailable(v0.46.2).Readtheinstallationguideforupgradeinstructions:https://docs.onflow.org/flow-cli/install🔴️Storeprivatekeysafelyanddon'tsharewithanyone!"

export const test = functions.https.onRequest(async (_, res) => {
	// const data = await getHashAndDomainId('somethingw')
	// await approveUSDC()
	// res.send(data)
	// const data = await depositIntoUSDC("1.0", "0x2fa08cf248980f95")
	const resp = await registerDomain('somenamesss')
	res.send(resp)
})


// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const createAccount = functions.https.onRequest(async (request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });




	exec('flow keys generate', async (err: any, output: any) => {
		console.log('ERR', err)
		let nospaces = String(output).replace(/\s/g, '').replace(uneededOutputString, '')
		nospaces = nospaces.substring(0, nospaces.indexOf('Mnemonic'))

		const privateKey = nospaces.substring(0, nospaces.indexOf('PublicKey')).replace('PrivateKey', '')
		const publicKey = nospaces.replace('PrivateKey', '').replace(privateKey, '').replace('PublicKey', '')

		console.log('PrivateKey', privateKey)
		console.log('PublicKey', publicKey)

		const address = await createAccount2(publicKey)

		console.log('ADDRESS', address)

		response.send({
			privateKey,
			publicKey,
			address
		});
	})




});


export const plaidLinkToken = functions.https.onRequest(async (req, res) => {
	const id = req.query.id as string



	try {

		const tokenConfig = {
			user: {
				client_user_id: id,
			},
			client_name: 'Tails',
			country_codes: ['US'],
			products: ['auth'],
			language: 'en',
			webhook: process.env.PLAID_WEBHOOK,
		};


		// tokenConfig.redirect_uri = PLAID_REDIRECT_URI;


		const tokenResponse = await plaidClient.createLinkToken(tokenConfig);

		console.log('Token response', tokenResponse)
		res.send({ linkToken: tokenResponse })
	} catch (e: any) {

		throw new functions.https.HttpsError('internal', (e as Error).message);
	}
});
