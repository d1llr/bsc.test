import { Order } from "@/modules/desktop/UserStats"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type PoolsType = {
    id: Number,
    start: string,
    canGetReward: boolean
}


type IInitialState = {
    user_address: string,
    all_user_tickets: number | null,
    user_orders: Order[] | undefined,
    total_tickets: number | null,
    nodes: PoolsType[] | undefined,
    nodesStatus: 'Uninitialized' | 'pending' | 'fulfilled',
    available_tickets: number | null,
    maxTicketInPool: number | null
}


const initialState: IInitialState = {
    user_address: '',
    maxTicketInPool: null,
    user_orders: undefined,
    all_user_tickets: null,
    total_tickets: null,
    nodes: [],
    nodesStatus: 'Uninitialized',
    available_tickets: null,
}

export const RedeSlice = createSlice({
    name: "RedeSlice",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setAddress: (state, action: PayloadAction<string>) => {
            state.user_address = action.payload
        },
        setTotalTickets: (state, action: PayloadAction<number>) => {
            state.total_tickets = action.payload
        },
        setUserOrders: (state, action: PayloadAction<Order>) => {
            state.user_orders?.push(action.payload)
        },
        setMaxTicketInPool: (state, action: PayloadAction<number>) => {
            state.maxTicketInPool = action.payload
        },
        setNodes: (state, action: PayloadAction<PoolsType[]>) => {
            state.nodes = action.payload
        },
        clearPools: (state) => {
            state.nodes = []
        },
        setPullStatus: (state, action: PayloadAction<'Uninitialized' | 'pending' | 'fulfilled'>) => {
            state.nodesStatus = action.payload
        },
        setAvailableTickets: (state, action: PayloadAction<number>) => {
            state.available_tickets = action.payload
        },
        setAllUserTickets: (state, action: PayloadAction<number>) => {
            state.all_user_tickets = action.payload
        },


    },
})

export const { clearPools, setMaxTicketInPool, setUserOrders, setPullStatus, setAddress, setTotalTickets, setNodes, setAvailableTickets, setAllUserTickets } = RedeSlice.actions