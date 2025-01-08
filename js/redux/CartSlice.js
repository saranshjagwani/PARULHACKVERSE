// redux/CartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
const initialState = [];
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.find((item) => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            }
            else {
                state.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            return state.filter((item) => item.id !== action.payload);
        },
        decrementQuantity: (state, action) => {
            const item = state.find((item) => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
            else {
                return state.filter((item) => item.id !== action.payload);
            }
        },
        clearCart: () => {
            return [];
        },
    },
});
export const { addToCart, removeFromCart, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
