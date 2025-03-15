import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    first_name: '',
    email: '',
    role: '',
    access_token: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { first_name, email, role, access_token } = action.payload;
            console.log('payload', action.payload)
            state.first_name = first_name || email;  // Lấy first_name thay vì name
            state.email = email;
            state.role = role;
            state.access_token = access_token;
        },

        resetUser: (state) => {
            state.first_name = '';
            state.email = '';
            state.role = '';
            state.access_token = '';
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer