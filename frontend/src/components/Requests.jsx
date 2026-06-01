import axios from "axios";
import React, { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  if (!requests) return;
  if (requests.length === 0) return <h1 className="text-center text-white text-2xl m-2">No requests found</h1>;

  return (
  <div className="text-center my-10 px-3">
    <h1 className="font-bold text-2xl sm:text-3xl">Requests</h1>

    {requests.map((request) => {
      const { _id, firstName, lastName, photoUrl, about, gender, age } =
        request.fromUserId;

      return (
        <div
          key={_id}
          className="flex flex-col sm:flex-row items-center sm:justify-between 
                     w-full max-w-2xl mx-auto m-4 p-4 rounded-lg bg-base-300 gap-4"
        >
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
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

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              className="btn btn-primary w-full sm:w-auto"
              onClick={() => reviewRequest("rejected", request._id)}
            >
              Reject
            </button>

            <button
              className="btn btn-secondary w-full sm:w-auto"
              onClick={() => reviewRequest("accepted", request._id)}
            >
              Accept
            </button>
          </div>
        </div>
      );
    })}
  </div>
);
};

export default Requests;
