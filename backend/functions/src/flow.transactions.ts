// @ts-ignore
import * as fcl from "@onflow/fcl";

import {
	encodeKey, ECDSA_P256,
	SHA3_256,
	// @ts-ignore
} from "@onflow/util-encode-key"


import FlowService from './flow'

const accountCreatedEventType = "flow.AccountCreated"

export const createAccount = async (adminsigner: any, newAccountPrivateKey: string) => {
	const newSigner = new FlowService().signWithKey(newAccountPrivateKey, "")

	const transactionId = await fcl.mutate({
		cadence: `transaction() {
			prepare(signer: AuthAccount) {
				let account = AuthAccount(payer: signer)
			}
		}`,
		payer: adminsigner,
		proposer: newSigner,
		authorizations: [newSigner]
	})

	const transaction = await fcl.tx(transactionId).onceSealed()
	console.log("transaction", transaction)
}


const txCreateAccount = `
transaction(publicKey: String) {
  prepare(signer: AuthAccount) {
    let account = AuthAccount(payer: signer)
    account.addPublicKey(publicKey.decodeHex())
	}
}
`

export const createAccount2 = async (publicKey: string) => {
	const adminSigner = await new FlowService().authorizeMinter()

	const encodedPublicKey = encodeKey(publicKey, ECDSA_P256, SHA3_256, 1000)
	console.log('before encoding', publicKey)
	console.log('encoded key', encodedPublicKey)

	const transactionId = await fcl.mutate({
		cadence: txCreateAccount,
		payer: adminSigner,
		proposer: adminSigner,
		authorizations: [adminSigner],
		// @ts-ignore
		args: (arg, t) => [arg(encodedPublicKey, t.String)],
	})

	const transaction = await fcl.tx(transactionId).onceSealed()

	const accountCreatedEvent = transaction.events.find(
		(event: fcl.Event) => event.type === accountCreatedEventType
	)

	const address = accountCreatedEvent.data.address

	console.log("transaction", transaction)

	return address
}


// FlowNS
const queryHash = `
import Flowns from 0xFlowns
import Domains from 0xDomains

pub fun main(name: String, root: String) : {String: AnyStruct} {
  let prefix = "0x"
  let rootHash = Flowns.hash(node: "", lable: root)
  let nameHash = prefix.concat(Flowns.hash(node: rootHash, lable: name))
  var rootId = Domains.getDomainId(prefix.concat(rootHash))
  var isAvailable =  Flowns.available(nameHash: nameHash)

  return { "hash": nameHash , "id": rootId, "name": name, "root": root, "isAvailable": isAvailable }
}`

export const getHashAndDomainId = async (name: string) => {
	const response = await fcl.query({
		cadence: queryHash,
		//@ts-ignore
		args: (arg, t) => [arg(name, t.String), arg("fn", t.String)]
	})

	console.log('Hash Response', response)

	return response

}


const registerDomaintx = `
import Flowns from 0xFlowns
import Domains from 0xDomains
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
/*
	domainId: root domain id , .fn root domain id is 1 in testnet 0 in mainnet
  name: the raw domain name ex: flownstest123
	duration: 24 * 60 * 60 * 365 : '31536000.00' the minimum value is 31536000.00
	amount: price of the rent fee, can bigger than the price * duration ,and not give change
	refer: address of the refer, can get 20% return when user use this address as refer, note: the return will deposit to refer's domain resource's vaults
*/
transaction(domainId: UInt64, name: String, duration: UFix64, amount: UFix64, refer: Address) {
  let collectionCap: Capability<&{NonFungibleToken.Receiver}>
  let vault: @FungibleToken.Vault
  prepare(account: AuthAccount, account2: AuthAccount) {
    
    if account.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath).check() == false {
      if account.borrow<&Domains.Collection>(from: Domains.CollectionStoragePath) !=nil {
        account.unlink(Domains.CollectionPublicPath)
        account.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.CollectionPublicPath, target: Domains.CollectionStoragePath)
      } else {
        account.save(<- Domains.createEmptyCollection(), to: Domains.CollectionStoragePath)
        account.link<&Domains.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, Domains.CollectionPublic}>(Domains.CollectionPublicPath, target: Domains.CollectionStoragePath)
      }
    }
    self.collectionCap = account.getCapability<&{NonFungibleToken.Receiver}>(Domains.CollectionPublicPath)
    let vaultRef = account2.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow owner's Vault reference")
    self.vault <- vaultRef.withdraw(amount: amount)
  }

  execute {
    Flowns.registerDomain(domainId: domainId, name: name, duration: duration, feeTokens: <- self.vault, receiver: self.collectionCap, refer: refer)
  }
}
`

export const registerDomain = async (name: string, address: string, pk: string) => {
	const adminSigner = await new FlowService().authorizeMinter()
	const userSigner = await new FlowService().signer(address, pk)

	const transactionId = await fcl.mutate({
		cadence: registerDomaintx,
		payer: adminSigner,
		proposer: userSigner,
		authorizations: [userSigner, adminSigner],
		limit: 9999,
		// @ts-ignore
		args: (arg, t) => [arg(1, t.UInt64), arg(name, t.String), arg("31536000.00", t.UFix64), arg("6.0", t.UFix64), arg("0x3c09a556ecca42dc", t.Address)],
	})

	const transaction = await fcl.tx(transactionId).onceSealed()


	console.log("transaction", transaction)

	return transaction
}


/// Increment Fi

const lendingPoolDepositTx = `
import FiatToken from 0xFiatToken
import FungibleToken from 0xFungibleToken
import LendingPool from 0xLendingPool

transaction(amountDeposit: UFix64, supplierAddress: Address) {
    let USDCVault: &FiatToken.Vault
    let supplierAddress: Address

    prepare(signer: AuthAccount) {
        let usdcStoragePath = /storage/USDCVault
        if (signer.borrow<&FiatToken.Vault>(from: usdcStoragePath) == nil) {
            signer.save(<-FiatToken.createEmptyVault(), to: usdcStoragePath)
            signer.link<&FiatToken.Vault{FungibleToken.Receiver}>(/public/USDCVaultReceiver, target: usdcStoragePath)
            signer.link<&FiatToken.Vault{FungibleToken.Balance}>(/public/USDCVaultBalance, target: usdcStoragePath)
        }
        self.USDCVault = signer.borrow<&FiatToken.Vault>(from: usdcStoragePath) ?? panic("cannot borrow reference to USDC Vault")
        self.supplierAddress = signer.address
    }

    execute {
        let inUnderlyingVault <- self.USDCVault.withdraw(amount: amountDeposit)
        LendingPool.supply(supplierAddr: supplierAddress, inUnderlyingVault: <-inUnderlyingVault)
    }
}`

export const depositIntoUSDC = async (amount: string, supplierAddress: string, pk: string) => {
	const adminSigner = await new FlowService().authorizeMinter()
	const userSigner = await new FlowService().signer(supplierAddress, pk)

	const transactionId = await fcl.mutate({
		cadence: lendingPoolDepositTx,
		payer: adminSigner,
		proposer: userSigner,
		authorizations: [adminSigner],
		limit: 9999,
		// @ts-ignore
		args: (arg, t) => [arg(amount, t.UFix64), arg(supplierAddress, t.Address)]
	})

	const transaction = await fcl.tx(transactionId).onceSealed()

	console.log('Transaction', transaction)

	return transaction
}


const transferUSDCtx = `
import FiatToken from 0xFiatToken
import FungibleToken from 0xFungibleToken

transaction(amount: UFix64, to: Address) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {

        // Get the recipient's public account object
        let recipient = getAccount(to)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipient.getCapability(FiatToken.VaultReceiverPubPath)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.sentVault)
    }
}`

export const transferUSDC = async (amount: string, address: string, pk: string) => {
	const adminSigner = await new FlowService().authorizeMinter()

	const transactionId = await fcl.mutate({
		cadence: transferUSDCtx,
		payer: adminSigner,
		proposer: adminSigner,
		authorizations: [adminSigner],
		limit: 9999,
		// @ts-ignore
		args: (arg, t) => [arg(amount, t.UFix64), arg(address, t.Address)]
	})

	const transaction = await fcl.tx(transactionId).onceSealed()

	return transaction
}


// @ts-ignore
const swaptx = `
import FungibleToken from 0xFungibleToken
import SwapRouter from 0xSwapRouter

transaction(
    exactAmountIn: UFix64,
    amountOutMin: UFix64,
    path: [String],
    to: Address,
    deadline: UFix64
) {
    prepare(userAccount: AuthAccount) {
        let tokenInVaultPath = /storage/flowTokenVault
        let tokenOutReceiverPath = /public/USDCVaultReceiver

        let inVaultRef = userAccount.borrow<&FungibleToken.Vault>(from: tokenInVaultPath)
            ?? panic("Could not borrow reference to the owner's in FT.Vault")
        /// Note: Receiver (to) should already have out FT.Vault initialized, otherwise tx reverts.
        let outReceiverRef = getAccount(to).getCapability(tokenOutReceiverPath)
            .borrow<&{FungibleToken.Receiver}>()
        

		
		if outReceiverRef == nil {
            userAccount.save(<-getAccount(Token1Addr).contracts.borrow<&FungibleToken>(name: Token1Name)!.createEmptyVault(), to: tokenOutVaultPath)
            userAccount.link<&{FungibleToken.Receiver}>(tokenOutReceiverPath, target: tokenOutVaultPath)
            userAccount.link<&{FungibleToken.Balance}>(tokenOutBalancePath, target: tokenOutVaultPath)
            outReceiverRef = userAccount.borrow<&FungibleToken.Vault>(from: tokenOutVaultPath)
        }


        let exactVaultIn <- inVaultRef.withdraw(amount: exactAmountIn)
        let vaultOut <- SwapRouter.swapExactTokensForTokens(
            exactVaultIn: <-exactVaultIn,
            amountOutMin: amountOutMin,
            tokenKeyPath: path,
            deadline: deadline
        )
        outReceiverRef.deposit(from: <-vaultOut)
    }
}
`

export const swap = async (amount: number, supplierAddress: string) => {
	const adminSigner = await new FlowService().authorizeMinter()

	// @ts-ignore
	const transactionId = await fcl.mutate({
		cadence: lendingPoolDepositTx,
		payer: adminSigner,
		proposer: adminSigner,
		authorizations: [adminSigner],
		// @ts-ignore
		args: (arg, t) => [arg(amount, t.UFix64), arg(supplierAddress, t.Address)]
	})
}

// @ts-ignore
const setupUSDC = `
import FungibleToken from 0xFungibleToken  
import FiatToken from 0xFiatToken     

transaction() {
    prepare(signer: AuthAccount) {
        let vaultPath = /storage/USDCVault
        let receiverPath = /public/USDCVaultReceiver
        let balancePath = /public/USDCVaultBalance

        if signer.borrow<&FungibleToken.Vault>(from: vaultPath) == nil {
            signer.save(<- FiatToken.createEmptyVault(), to: vaultPath)
            signer.link<&FiatToken.Vault{FungibleToken.Receiver}>(receiverPath, target: vaultPath)
            signer.link<&FiatToken.Vault{FungibleToken.Balance}>(balancePath, target: vaultPath)
        }
    }
}
`

export const createUSDCVault = async (address: string, pk: string) => {
	const adminSigner = await new FlowService().authorizeMinter()
	const userSigner = await new FlowService().signer(address, pk)

	// @ts-ignore
	const transactionId = await fcl.mutate({
		cadence: setupUSDC,
		payer: adminSigner,
		proposer: userSigner,
		authorizations: [userSigner],
	})

	const transaction = await fcl.tx(transactionId).onceSealed()

	console.log('Approval Transaction', transaction)
}

const balanceQuery = `
import LendingPool from 0xLendingPool
import LendingInterfaces from 0x8bc9e24c307d249b
import LendingConfig from 0x8bc9e24c307d249b

pub fun main(account: Address): UInt256 {
	let lendingPool = getAccount(0xLendingPool)

	let lendingPoolCapability = lendingPool.getCapability<&{LendingInterfaces.PoolPublic}>(LendingConfig.PoolPublicPublicPath)
	let poolReference = lendingPoolCapability.borrow()
		   ?? panic("Could not borrow a reference to the Pool capability")

	return poolReference.getAccountLpTokenBalanceScaled(account: account)
}
`

export const getPoolBalance = async (address: string) => {
	const balance = await fcl.query({
		cadence: balanceQuery,
		// @ts-ignore
		args: (arg, t) => [arg(address, t.Address)]

	})

	return balance
}

const flownsDomainQuery = `
import Flowns from 0xFlowns
import Domains from 0xFlowns

 pub fun main(address: Address): String? {
      
    let account = getAccount(address)
    let collectionCap = account.getCapability<&{Domains.CollectionPublic}>(Domains.CollectionPublicPath) 
  
    if collectionCap.check() != true {
      return nil
    }
  
    var flownsName = ""
    let collection = collectionCap.borrow()!
    let ids = collection.getIDs()
    flownsName = collection.borrowDomain(id: ids[0])!.getDomainName()
    for id in ids {
      let domain = collection.borrowDomain(id: id)!
      let isDefault = domain.getText(key: "isDefault")
      if isDefault == "true" {
        flownsName = domain.getDomainName()
        break
      }
    }
  
    return flownsName
  }`

export const getFlownsDomain = async (address: string) => {
	const flownsName = await fcl.query({
		cadence: flownsDomainQuery,
		// @ts-ignore
		args: (arg, t) => [arg(address, t.Address)]

	})

	return flownsName
}

