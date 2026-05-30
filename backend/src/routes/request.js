const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status type:" + status);
      }
      const toUser=await User.findById(toUserId)
      if(!toUser){
        return res.status(404).json({message:"user not found"})
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          message:"connection request already exist"
        });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "request done",
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  },
);

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const loggedInUser=req.user;
    const{status,requestId}=req.params
    const allowedStatus=["accepted","rejected"]
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Invalid status: "+status})
    }
    const connectionRequest=await ConnectionRequest.findOne(
      {
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested",
      }
    )
    if(!connectionRequest){
      return res.status(400).json({
        message:"connection request not found",
      })
    }
      connectionRequest.status=status;
      const data=await connectionRequest.save()
      res.json({
        message:"connection request"+status,
        data:data,
      })
    }
    
  
  catch(err){
    res.status(400).send("ERROR: "+err.message)
  }
})

module.exports = requestRouter;
