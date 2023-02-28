import AsyncStorage from '@react-native-community/async-storage';
import React, { useReducer, useState } from 'react';
import { createContext } from 'use-context-selector';

interface FlowAccount {
	address: string;
	privateKey: string;
	publicKey: string;
	flownsName: string;
	balance: string;
}

export interface AppState {
	user?: {};
	flowAccount?: FlowAccount
}

type Action =
	| { type: 'set_user'; user: {} }
	| { type: 'set_flow_account'; flowAccount: FlowAccount }
	| { type: 'update_account_balance'; balance: string }


export type Dispatch = (action: Action) => void;



export const initialState: AppState = {
	user: undefined,
	flowAccount: undefined,
}


const reducer = (state: AppState, action: Action) => {
	console.log('ACTION', action)
	switch (action.type) {
		case 'set_user': return { ...state, user: action.user }
		case 'set_flow_account': return { ...state, flowAccount: action.flowAccount }
		case 'update_account_balance': return { ...state, flowAccount: { ...state.flowAccount, balance: action.balance } }
		default: return state
	}
}

export const useAppState = () => useReducer(reducer, initialState)
export const AppContext = createContext<[AppState, Dispatch]>([initialState, () => null])