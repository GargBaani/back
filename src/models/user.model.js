import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema=new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true // for optimising the searching field
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },fullName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true // for optimising the searching field
    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String
    },
    // this is in itself very complex for this we use mongoose-aggregate-paginate-v2 package
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'Password is required'] // sath mein custommsg bhi likh skte hai to display in case if that field is left unfilled
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})

// for encryption of msges
userSchema.pre("save",async function(next){
    if(!this.isModified('password'))return next();
    this.password=bcrypt.hash(this.password,10)
    next()
})
// for checking if password is correct or not
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
        _id:this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User=mongoose.model("User",userSchema)