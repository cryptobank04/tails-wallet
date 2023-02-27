import * as functions from "firebase-functions";
// import { createAccount2 } from "./flow.transactions";
import { Client, environments } from 'plaid';
import { createAccount2, createUSDCVault, depositIntoUSDC, getFlownsDomain, getPoolBalance, registerDomain, transferUSDC } from "./flow.transactions";
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
	// const data = await depositIntoUSDC("1.0", "0x895840490ce25091")
	// const resp = await registerDomain('somenamesss2222', )
	// console.log('Resp', resp)
	// res.send(data)
	// await getPoolBalance("0x05644a149e8ac162")
})


// createAccount - creates an account for the user.
// The account creation process involves 3 steps:
// 1. Generate private/public key pair + address for the user wallet
// 2. Create USDC vault for the new account/user
// 3. Register a Flowns Domain for the user

// The Gas fees for these transactions are paid by the Admin, so the user has
// a smoother onboarding experience.
export const createAccount = functions.https.onRequest(async (req, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
	const flownsName = req.query.flownsName as string


	// Hacky way of creating a wallet for testnet using Flow CLI. I could not find
	// an easy way to generate a wallet in node/JS using your api. I recommend creating
	// a simple method (or showing an example) in JS that allows for wallet creation. JS
	// is a really popular language, so it was a bit disappointing there didnt seem to be 
	// support for this in your api/sdk. If there was, I was unable to find documentation 
	// on easily doing this.
	exec('flow keys generate', async (err: any, output: any) => {
		console.log('ERR', err)
		let nospaces = String(output).replace(/\s/g, '').replace(uneededOutputString, '')
		nospaces = nospaces.substring(0, nospaces.indexOf('Mnemonic'))

		const privateKey = nospaces.substring(0, nospaces.indexOf('PublicKey')).replace('PrivateKey', '')
		const publicKey = nospaces.replace('PrivateKey', '').replace(privateKey, '').replace('PublicKey', '')

		console.log('PrivateKey', privateKey)
		console.log('PublicKey', publicKey)

		const address = await createAccount2(publicKey)

		await createUSDCVault(address, privateKey),
			await registerDomain(flownsName, address, privateKey)




		console.log('ADDRESS', address)


		response.send({
			privateKey,
			publicKey,
			address,
			flownsName
		});
	})




});


// plaidLinkToken - generates the plaid linktoken required to link a users 
// bank account to the app

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

// depositIntoPool - allows user to deposit funds into a pool. Since we are 
// moving funds from a bank account to a wallet, we needed to simulat this process
// using our Admin wallet to USDC tokens. In a production application the Admin wallet
// would be replaced by an onramp partner such as Wyre, or Moonpay.
export const depositIntoPool = functions.https.onRequest(async (req, res) => {
	const depositAmount = req.query.depositAmount as string
	const address = req.query.address as string
	const pk = req.query.pk as string

	await transferUSDC(`${depositAmount}.00`, address, pk)
	const data = await depositIntoUSDC(`${depositAmount}.00`, address, pk)

	res.send(data)
})

// getAccount - simply queries user's flow account along with Flowns domain
export const getAccount = functions.https.onRequest(async (req, res) => {
	const address = req.query.address as string
	// 1. get domain name
	const flownsName = await getFlownsDomain(address)

	// 2. get poolBalance
	const poolBalance = await getPoolBalance(address)

	res.send({
		poolBalance,
		flownsName
	})
})