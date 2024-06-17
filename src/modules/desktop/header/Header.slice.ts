import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const initialState:{open:boolean} = {
    open: false
}

export const mobBurger = createSlice({
    name: 'mobBurger',
    initialState,
    reducers: {
        setMobBurger: (state) => {
            state.open = !state.open
        },
       
        },
    },

    // extraReducers: (builder) => {
    //     builder.addMatcher(
    //         isAnyOf(WalletActions.endpoints.checkBalance.matchFulfilled), //updated
    //         (state, action) => { state.balance = action.payload }
    //     );
    // },
)

export const { setMobBurger } = mobBurger.actions