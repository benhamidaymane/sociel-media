import express from 'express';
import Conversation from "../models/Conversation.js"

const router = express.Router();

//new conv
router.post("/",async (req,res)  =>{
    const newConversation = new Conversation({
        member:[req.body.senderId, req.body.receiverId]
    })
    try {
        const savedConversation = await newConversation.save() 
        res.status(200).json(savedConversation)
        
    } catch (error) {
        res.status(500).json(error)
    }
})
//get conv of a user 
router.get("/:userId",async (req,res)=>{
    try{
       const conversation = await Conversation.find({
          member:{$in:[req.params.userId]}
       })
       res.status(200).json(conversation)
    }catch(err){
        res.status(500).json(err)
        
    }
})

export default router