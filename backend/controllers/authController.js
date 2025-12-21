import bcrypt from "bcrypt"
import User from "../models/user.js"

export const register = async (req , res ) => {
    try {
        //request data frm thebody
        const { email , password} = req.body ;
        //validation
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
            //check if we already have this user
        } const existingUser = await User.findOne({ where: { email } });
        if(existingUser){
            return res.status(409).json({message: "user alredy exist"});
            //password hash , 10 is  2^10
        }const hashedPassword = await bcrypt.hash(password, 10);
        await User.create(
            {
                email,
                password: hashedPassword,
            });
            return res.status(201).json({message: "User registered successfully"});
    }catch (error){
        console.error("Register error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }

    }

