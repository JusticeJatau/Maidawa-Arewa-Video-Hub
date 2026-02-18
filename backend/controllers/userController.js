import User from "../models/User.js";

const getUsersBySearch = async (req, res) =>{
    const { name } = req.body
    const users = await User.find({name: name}).sort({createdAt: -1})
    res.json(users)
}

const getUsers = async (req, res) =>{
    try{
        const users = await User.find().select("-password").sort({createAt: -1})
        res.status(201).json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const editUser = async (req, res) =>{
    const updateData = {...req.body}

    try{
        // console.log(req.body)
        if(typeof req.body.isActive === "boolean"){
            updateData.status = req.body.isActive ? "active":"inactive";
            delete updateData.isActive;
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new:true, runValidators: true}
        )

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json(user)
    }catch(error){
        res.status(400).json({message: error.message})
    }
}

const deleteUser = async (req, res) =>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        res.status(200).json({message: "User deleted"})
    }catch(error){
        res.status(400).json({message: "Invalid ID"})
    }
}

const updateRole = async (req, res) =>{
    const users = await User.updateMany(
        {role: "user"},
        {$set: {role: "viewer"}}
    )

    if(!users){
        res.status(404).json({message: "Users not found"})
    }

    res.status(201).json(users)
}

export { getUsersBySearch, getUsers, editUser, deleteUser, updateRole }