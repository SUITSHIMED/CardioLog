import bcrypt from "bcrypt"
import User from "../models/user.js"

export const register = async (req , res ) => {
    try {
        //request data frm thebody sent by the client side
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

    };
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    console.log("Input Password:", password);
  console.log("Stored Hash in DB:", user?.password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      userId: user.id.toString(), 
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

