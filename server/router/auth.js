const express = require("express")
const User = require("../model/User")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jsonwebtoken = require("jsonwebtoken")




router.get("/",(req,res)=>{
    res.send("hello from router folder")
})



router.post("/register" , async (req,res)=>{
    const {name,email,contact,password,cpassword} = req.body

    if(!name || !email || !contact || !password || !cpassword){
        return res.status(422).json({error:"please fill all the details"})
    }
    try {
        const userExist = await User.findOne({email:email})
        if(userExist){
            res.status(422).json({error:"user already exists"})
        }else if(password!=cpassword){
            res.status(400).json({error:"please fill the value of both the password correctly"})
        }

        const user = new User({name,email,contact,password,cpassword})

        // HASHING PASSWORD IN USERMODEL



        const userRegister = await user.save();
        
        if(userRegister){
            res.status(200).json({success:"user registered successfully"})
        }
    } catch (error) {
        res.status(500).json({error:"user registration unsuccessful"})
    }
})





router.post("/signin" , async (req,res)=>{
    try {
        const {email,password} = req.body
    
        if(!email || !password ){
            return res.status(422).json({error:"please fill all the details"})
        }
        const userLogin = await User.findOne({email:email})
        if(userLogin){

            const isMatching = await bcrypt.compare(password,userLogin.password)


            // APPLYING JSONWEBTOKEN

            const token = await userLogin.generateAuthToken();

            res.cookie("jsonwebtoken",token , {
                expires:new Date(Date.now()+300000),
                httpOnly:true
            })

    
            if(isMatching){
                res.status(200).json({success:"Login successful",userLogin})
            }else{
                res.status(404).json({error:"invalid credentials"})
            }
        }else{
            res.status(404).json({error:"invalid credentials"})
        }
        
    } catch (error) {
        res.status(500).json({error:"user login unsuccessful"})
    }
})

module.exports = router