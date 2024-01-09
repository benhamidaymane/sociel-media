import express from 'express';
import Post from '../models/Post.js'
import User from '../models/User.js';


const router = express.Router();

// create a post 

router.post("/", async(req,res)=>{

    const newPost= new Post(req.body)
    try{
       const savedpost=await newPost.save()
       res.status(200).json(savedpost)
    }catch(err){
      res.status(500).json(err)
    }

})
// update a post 

router.put("/:id/",async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
        await post.updateOne({$set:req.body})
        res.status(200).json("the post hass been updated ")
    }else{
        res.status(403).json(" you can update onlu your post ")
    }
        
    } catch (error) {
        res.status(500).json(error)
    }
})
// delete a post 
router.delete("/:id/",async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
        await post.deleteOne()
        res.status(200).json("the post hass been deleted ")
    }else{
        res.status(403).json(" you can delete  only your post ")
    }
        
    } catch (error) {
        res.status(500).json(error)
    }
})
// like a post 
router.put("/:id/like",async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("the post has benn liked ")
            
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("the post has benn disliked ")
            
        }
    } catch (err) {
        res.status(500).json(err)

    }
}

)
// get a post 

router.get("/:id",async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})
// get timeline post 

router.get("/timeline/:userId",async(req,res)=>{
    
    try {
        const currentuser= await User.findById(req.params.userId)
        const userPosts = await Post.find({userId:currentuser.id})
        const friendposts= await Promise.all(
            currentuser.followins.map((friendid)=>{
                return Post.find({userId:friendid})
            })
        )
        res.json(userPosts.concat(...friendposts))
    } catch (error) {
        res.status(500).json(error)
    }
})

//get user all posts 
router.get("/profile/:username",async(req,res)=>{
    
    try {
        const user = await  User.findOne({username:req.params.username})
        const posts = await Post.find({userId:user._id})
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
})



export default router 