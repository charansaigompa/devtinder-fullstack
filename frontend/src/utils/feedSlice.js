import { createSlice } from "@reduxjs/toolkit";

const feedSlice=createSlice({
    name:"feed",  
    initialState:null,
    reducers:{
        addFeed:(state,action)=>{
            return action.payload
        },
        removeFeed:(state,action)=>{
            const newFeed=state.filter((feed)=>feed._id!==action.payload)
            return newFeed
        },
        deleteFeed:(state,actiion)=>{
            return null
        }
    }
})

export const{addFeed,removeFeed,deleteFeed}=feedSlice.actions
export default feedSlice.reducer
