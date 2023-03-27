import { emailRegister } from "../helpers/emails.js";
import idGenerate from "../helpers/idGenerate.js";
import jwtGenerate from "../helpers/jwtGenerate.js";
import User from "../model/User.js";

const register = async (req, res) => {
  //avoid duplicate users

  const { email } = req.body;

  const userExisting = await User.findOne({ email });

  if (userExisting) {
    const error = new Error("This email already exist");

    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);

    user.token = idGenerate();
    await user.save();

    //send email to confirm

    emailRegister({
      email: user.email,
      name: user.name,
      token: user.token,
    });

    res.json({
      msg: "User created succesfully, check your email inbox to confirm account ",
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


const confirm = async (req,res) => {
    const {token} = req.params;

    const userToConfirm = await User.findOne({token});

    if(!userToConfirm) {
        const error = new Error('Invalid Token');
        return res.status(400).json({msg: error.message});
    }

    try {
        userToConfirm.confirmed= true
        userToConfirm.token = ''

        await userToConfirm.save()

        res.status(200).json({msg: 'Account confirmed succesfully'})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


const login = async (req,res) => {
    const {email,password} = req.body

    const user = await User.findOne({email})

    if(!user) {
        const error = new Error('User no exist')

        return res.status(404).json({msg: error.message})
    }

    //user confirm?

    if(!user.confirmed) {
        const error = new Error('User no confirmed')

        return res.status(404).json({msg: error.message})
    }

    //verify password 

    if(await user.verifyPassword(password)) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: jwtGenerate(user._id)
        })
    } else {
        const error = new Error('Incorrect password')

        return res.status(403).json({msg:error.message})
    }
}

const profile = async (req,res) => {
    const {user} = req

    res.json({user:user})
}


const getAllUsers =  async(req,res) => {
  
  try {
      const users = await User.find({ _id: { $ne: req.user._id } }).select('-password  -confirmed -token -__v')

     res.status(200).json(users)
  } catch (error) {
    console.log(error)
  }


}

export { register, confirm, login, profile,getAllUsers };
