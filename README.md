# tails-wallet

Tails allows users to easily invest in Defi by allowing users to transfer funds directly from bank to protocol. 


Project Details.
The tails-wallet project is a monorepo that contains a react native front end, located in the `tails_mobile` directory. The backend cloud functions are located in the `backend` directory.

To run the project follow the steps below. Please note you will need to have the [react native enviornment set up](https://reactnative.dev/docs/environment-setup), and also will need to install [firebase-tools](https://firebase.google.com/docs/cli) on your machine.

To run the mobile app:
1. `cd tails_mobile`
2. `yarn`
3. `cd ios && pod install`
4. `npx react-native run-ios` from `tails_mobile` root



To run the `backend` project:
1. `npm install -g firebase-tools`
2. `npm install`
3. `cd functions && npm run serve`

Now you are running the endpoints locally.


On the backend we have 3 endpoints:
`createAccount` - This endpoint creates a firebase account for the user + also generates wallet private/public key pair + FLOW account address

`plaidLinkToken` - This endpoint generates a Plaid Link Token to allow the user to connect their bank account to the Tails app.

`depositIntoPool` - This endpoint allows users to deposit funds into the IncrementFi pool. 

`getAccount` - This endpoint gets the account FlownsName + USDC pool balance
