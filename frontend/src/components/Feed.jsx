
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants'
import { addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'



const Feed = () => {
  const dispatch=useDispatch()
  const feed=useSelector(store=>store.feed)
 const getFeed=async()=>{
    
  try{
if(feed) return
     const res=await axios.get(BASE_URL+"/feed",{withCredentials:true})
    console.log(res)
    dispatch(addFeed(res?.data?.data))

  }
  catch(err){
  console.error(err)
  }
 }
 useEffect(()=>{
  getFeed()
 },[])
 if(!feed) return
 if(feed.length<=0) return <h1> Feed is empty</h1>
  return (
    <div className='flex justify-center'>
      {feed&&<UserCard user={feed[0]} />}
    </div>
  )
}

export default Feed

