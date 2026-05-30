const mongoose=require("mongoose");
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50,
        
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:50,

    },
   emailId: {
         type:String,
         required:true,
         unique:true,
         lowercase:true,
         trim:true,
         minLength:4,
        maxLength:50,
        validate(value){
          if(!validator.isEmail(value)){
            throw new Error("Invalid email address"+value)
          }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:4,
        validate(value){
          if(!validator.isStrongPassword(value)){
            throw new Error("Invalid Password "+value)
          }
   }
       
    },
    age:{
        type:Number,
    },
   gender:{
    type:String,
    validate(value){
        if(!["male","female","others"].includes(value))
        {
            throw new Error("not valid")
        }
    }
   },
   about:{
    type:String,
    default:"This is default about of user",
    maxLength:100,
   },
   skills:{
    type:[String],
   },
   photoUrl:{
    type:String,
    default:"https://tse1.mm.bing.net/th/id/OIP.mP1RB8xuQaHAvUkonYY6HwHaHK?pid=Api&P=0&h=180",
    validate(value){
          if(!validator.isURL(value)){
            throw new Error("Invalid url "+value)
          }
   }
}},{
    timestamps:true,
});

userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token
}

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const passwordHash=user.password
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash)
    return isPasswordValid;
}
module.exports =mongoose.model("User",userSchema)

