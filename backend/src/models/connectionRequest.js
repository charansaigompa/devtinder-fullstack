const mongoose=require('mongoose')
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",

    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},{
    timestamps:true ,
})  
connectionRequestSchema.index({fromUserId:1,toUserId:1},{unique:true},)

connectionRequestSchema.pre("save", async function () {
  const connectionRequest = this;
  // Check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection to yourself");

  }
  
});

const connectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports=connectionRequestModel;