// @ts-ignore
import * as fcl from "@onflow/fcl"

// @ts-ignore
import { SHA3 } from "sha3";

var EC = require('elliptic').ec;



const ec = new EC("p256");

fcl.config()
	.put("accessNode.api", "https://rest-testnet.onflow.org")
	.put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
	.put("app.detail.title", "Tails")
	.put('flow.network', 'testnet')
	.put("0xFlowns", "0xb05b2abb42335e88")
	.put("0xDomains", "0xb05b2abb42335e88")
	.put("0xFungibleToken", "0x9a0766d93b6608b7")
	.put("0xNonFungibleToken", "0x631e88ae7f1d7c20")
	.put("0xFiatToken", "0xa983fecbed621163")
	.put("0xLendingPool", "0x97d2f3b55c6a6a75")
	.put("0xSwapRouter", "0xa6850776a94e6551")
	.put("0xSwapError", "0xa6850776a94e6551")


// WARNING: For hackathon purposes we've simply pasted the Admin 
// privatekey in the backend. In production there would be a lot more
// work involved to ensure the admin privatekey is protected
let PRIVATE_KEY = 'ced358e70fcde6aae63778f3fa204c519f4610c91f88ac581954b879971fce65'
// let PUBLIC_KEY = '851a0f804f6dd23fb6d007736a193d8ca99a7fbf4494cf80e35bc51aa143179b823dcfd82cf59fcb64e681c6944826c4e4b38ce8ca9c824571f6413ec0ff6e6d'

class FlowService {
	adminFlowAddress: string = "0x2fa08cf248980f95";
	adminPrivateKey: string = PRIVATE_KEY;
	accountIndex: number = 0;

	authorizeMinter = () => {
		return async (account = {}) => {
			const user = await this.getAccount(this.adminFlowAddress);
			const key = user.keys[this.accountIndex];

			const sign = this.signWithKey;
			const pk = this.adminPrivateKey;

			return {
				...account,
				tempId: `${user.address}-${key.index}`,
				addr: fcl.sansPrefix(user.address),
				keyId: Number(key.index),
				signingFunction: (signable: any) => {
					return {
						addr: fcl.withPrefix(user.address),
						keyId: Number(key.index),
						signature: sign(pk, signable.message),
					};
				},
			};
		};
	};

	getAccount = async (addr: string) => {
		const { account } = await fcl.send([fcl.getAccount(addr)]);
		return account;
	};

	getPublicKey = (privateKey: string) => {
		const pair = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
		// const pair = ec.genKeyPair()
		const points = pair.getPublic()
		const pub = points.encode('hex');
		const key = ec.keyFromPublic(pub, 'hex');
		console.log('pair.pub', pair.pub)
		console.log('✅✅✅✅✅✅', pub)
		console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨', key)

		// return pair.getPublic().encode("hex")
	}

	signWithKey = (privateKey: string, msg: string) => {
		const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
		const sig = key.sign(this.hashMsg(msg));
		const n = 32;
		const r = sig.r.toArrayLike(Buffer, "be", n);
		const s = sig.s.toArrayLike(Buffer, "be", n);
		return Buffer.concat([r, s]).toString("hex");
	};

	hashMsg = (msg: string) => {
		const sha = new SHA3(256);
		sha.update(Buffer.from(msg, "hex"));
		return sha.digest();
	};

	// @ts-ignore
	sendTx = async ({ transaction, args, proposer, authorizations, payer, skipSeal
	}) => {
		const response = await fcl.mutate(
			{
				cadence: transaction,
				// @ts-ignore
				args: (_arg, _t) => args,
				proposer,
				authorizations,
				payer,
				limit: 9999,
			},
		)

		if (skipSeal) return response;
		return await fcl.tx(response).onceSealed();
	};

	// @ts-ignore
	async executeScript({ script, args }) {
		return await fcl.query(
			{
				cadence: script,
				// @ts-ignore
				args: (_arg, _t) => args,
			},
		);
	}

	async getLatestBlockHeight() {
		const block = await fcl.send([fcl.getBlock(true)]);
		const decoded = await fcl.decode(block);
		return decoded.height;
	}
}


export const createWallet = async () => {

}


export default FlowService;