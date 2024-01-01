import asyncHandler from 'express-async-handler'
import User from '../models/userModels.js';
import generateToken from '../utils/generateToken.js';

// desc  : to authrise the user
// route : POST /api/users/auth
// access: Public
const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password)))
    {
        generateToken(res,user._id);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        })
    }
    else{
        res.status(400);
        throw new Error("Invalid credentials");
    }

}); 

// desc  : to register the user
// route : POST /api/users
// access: Public
const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;
    const userExit = await User.findOne({email})
     if(userExit){
        res.status(400);
        throw new Error("User already exists");
     }

    const user = await User.create({name,email,password});
    if(user)
    {
        generateToken(res,user._id);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email
        })
    }
    else{
        res.status(400);
        throw new Error("user is not created");
    }
    
}); 

// desc  : to logout the user
// route : POST /api/users/logout
// access: Public
const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt', '',{
        httpOnly:true,
        expires: new Date(0),
    })
    res.status(200).json({message:"user loggedout"});
}); 

// desc  : get user profile
// route : GET /api/users/profile
// access: Private
const getUserProfile = asyncHandler(async(req,res)=>{
    const user = {
        _id:req.user._id,
        name:req.user.name,
        email:req.user.email
    }
    res.status(200).json(user);
});

// desc  : update user profile
// route : PUT /api/users/profile
// access: Private
const updateUserProfile = asyncHandler(async(req,res)=>{
     const user = await User.findOne(req.user._id);
     if(user)
       {
          user.name = req.body.name || user.name;
          user.email = req.body.email || user.email;

          if(req.body.password)
          {
            user.password = req.body.password;
          }

          const updatedUser = await user.save();

          res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email
          });
       }
       else{
        res.status(404);
        throw new Error("user not found");
       }
    res.status(200).json({message:"update user profile"});
});
   

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}