import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectoinSlice'
import { BASE_URL } from '../utils/constants'
import { Link } from 'react-router-dom'


const Connections = () => {
    const dispatch=useDispatch()
    const connections=useSelector(store=>store.connections)

    const fetchConnections=async()=>{
     try{
           const res=await axios.get(BASE_URL+"/user/connections",{withCredentials:true})
        dispatch(addConnections(res.data.data))
     }
     catch(err){
        console.error(err)
     }
    }
    useEffect(()=>{
        fetchConnections()
    },[])
    if(!connections) return
    if(connections.length===0) return <h1>No connections found</h1>

  return (
  <div className="text-center my-10 px-3">
    <h1 className="font-bold text-2xl sm:text-3xl">Connections</h1>

    {connections.map((connection) => {
      const { _id, firstName, lastName, photoUrl, about, gender, age } = connection;

      return (
        <div
          key={_id}
          className="flex flex-col sm:flex-row items-center sm:justify-between m-4 p-4 bg-base-300 w-full max-w-2xl mx-auto rounded-lg gap-4"
        >
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
            
            <img
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              src={photoUrl}
              alt=""
            />

            <div>
              <h1 className="font-bold text-lg">
                {firstName + " " + lastName}
              </h1>

              {age && gender && <p>{age + " " + gender}</p>}

              <p className="text-sm">{about}</p>
            </div>
          </div>

          
          <div>
            <Link to={"/chat/" + _id}>
              <button className="btn btn-primary w-full sm:w-auto">
                Chat
              </button>
            </Link>
          </div>
        </div>
      );
    })}
  </div>
);
}

export default Connections
