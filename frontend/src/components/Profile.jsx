import React from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'


const Profile = () => {
  const user=useSelector(store=>store.user)
  if(!user) return <h1>Loading</h1>
  return (
    <div className='mb-35'>
      <EditProfile user={user}/>
    </div>
  )
}

export default Profile
