import { createSlice } from "@reduxjs/toolkit";

const requestSlice=createSlice({
    name:"requests",
    initialState:null,
    reducers:{
        addRequests:(state,action)=>{
            return action.payload
        },
        removeRequest:(state,action)=>{
                 const newArr=state.filter((req)=>req._id!==action.payload)
                 return newArr
        },
        deleteRequest:(state,action)=>{
            return null
        }
    }

})

export const{addRequests,removeRequest,deleteRequest}=requestSlice.actions
export default requestSlice.reducer