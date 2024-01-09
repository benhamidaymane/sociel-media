import express from 'express';
import User from '../models/User.js'
import bcrybt from 'bcrypt'

const router = express.Router();

router.post("/register", async (req, res) => {
 
  const salt = await bcrybt.genSalt(10)
  const hashachpasword=await bcrybt.hash(req.body.password,salt)

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashachpasword,
  });


  try {
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res
  }
});

// Login

router.post("/login", async (req,res)=>{
  try{
    const user =  await  User.findOne({ email:req.body.email })
    !user && res.status(404).send("user not found ")

    const validPassword =await bcrybt.compare(req.body.password,user.password)
    !validPassword && res.status(404).json("wrong password ")

    res.status(200).json(user)

  }catch(err){
    res.status(500).json(err)

  }
    
})

export default  router;
