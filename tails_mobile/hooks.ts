import { AppContext, AppState, Dispatch } from "./store";
import { useContextSelector } from 'use-context-selector'
import { Context } from "react";

export const useDispatch = () => useContextSelector(AppContext, (state: [AppState, Dispatch]) => state[1])
export const useUser = () => useContextSelector(AppContext, (state: [AppState, Dispatch]) => state[0].user)
export const useFlowAccount = () => useContextSelector(AppContext, (state: [AppState, Dispatch]) => state[0].flowAccount)