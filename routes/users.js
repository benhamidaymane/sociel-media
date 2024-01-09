// routes/users.js
import express from 'express';
import bcrypt from 'bcrypt'
import User from "../models/User.js"

const router = express.Router();

//update user
router.put("/:id",async (req,res)=>{
  if (req.body.userId===req.params.id ) {
    if(req.body.password){
      try{
        const salt = await bcrypt.genSalt(10)
        req.body.password=await bcrypt.hash(req.body.password,salt)
      }catch(err){
        return res.status(500).json(err)
      }
    }
    try{
      const user = await User.findByIdAndUpdate(req.params.id,{
        $set:req.body
      });
      res.status(200).json("Account has been updated")
    }catch(err){
      return res.status(500).json(err)
    }
  }else{
    return res.status(403).json('you can update only your account! ')
  }
})

//get friends
router.get("/friends/:userId",async(req,res)=>{
  try {
    const user = await User.findById(req.params.userId)
    const friends = await Promise.all(
      user.followins.map(friendId=>{
        return User.findById(friendId)
      })
    )
    let friendList=[]
    friends.map((friend)=>{
      const {_id,username,profilePicture}=friend
      friendList.push({_id,username,profilePicture})
    })
    return res.status(200).json(friendList)
  } catch (error) {
    return  res.status(500).json(error)
  }
})

// delete user 

router.delete("/:id",async (req,res)=>{
  if (req.body.userId===req.params.id ) {

    try{
      await User.findByIdAndDelete(req.params.id);
      return  res.status(200).json("Account has been deleted")
    }catch(err){
      return res.status(500).json("have benn error")
    }
  }else{
    return res.status(403).json('you can delete  only your account! ')
  }
})

// get a user 
router.get("/",async(req,res)=>{
  const userId=req.query.userId
  const username=req.query.username
  try{
      const user = userId 
      ? await   User.findById(userId)
      : await   User.findOne({username:username});
      const {password,updatedAt, ...other} =user._doc
      res.status(200).json(user)
  }catch(err){
    res.status(500).json("hav benn erorr")
  }
})

// follow a user 
router.put("/:id/follow",async (req,res)=>{
  if(req.body.userId !== req.params.id){
    try{
      const user = await User.findById(req.params.id)
      const currectUser = await User.findById(req.body.userId)
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({$push:{followers:req.body.userId}})
        await currectUser.updateOne({$push:{followins:req.params.id}})
        res.status(200).json("user has been followed ")
      }else{
        res.status(403).json(" you allready follow this user ")
      }
  
    }catch(err){
      res.status(500).json(err)
    }

  }else{
    res.status(403).json('you cant follow your self ')
  }
})
//unfolow a user 
router.put("/:id/unfollow",async (req,res)=>{
  if(req.body.userId !== req.params.id){
    try{
      const user = await User.findById(req.params.id)
      const currectUser = await User.findById(req.body.userId)
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({$pull:{followers:req.body.userId}})
        await currectUser.updateOne({$pull:{followins:req.params.id}})
        res.status(200).json("user has been Infollowed ")
      }else{
        res.status(403).json(" you allready Infollow this user ")
      }
  
    }catch(err){
      res.status(500).json(err)
    }

  }else{
    res.status(403).json('you cant Infollow your self ')
  }
})


export default router;
