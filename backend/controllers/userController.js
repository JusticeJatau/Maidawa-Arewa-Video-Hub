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

const editUser = async (req, res) => {
    const updateData = {...req.body}

    try{
        // Handle status mapping if isActive is provided (for admin panels maybe)
        if(typeof req.body.isActive === "boolean"){
            updateData.status = req.body.isActive ? "active":"inactive";
            delete updateData.isActive;
        }

        // Remove sensitive fields that shouldn't be updated directly
        delete updateData.password;
        delete updateData.role; // Prevent role changes from profile
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.lastLogin; // Don't manually update lastLogin

        // Validate username if provided (check for uniqueness)
        if (updateData.username) {
            // Check username length requirements from schema
            if (updateData.username.length < 3 || updateData.username.length > 30) {
                return res.status(400).json({ 
                    message: "Username must be between 3 and 30 characters" 
                });
            }

            const existingUser = await User.findOne({
                username: updateData.username,
                _id: { $ne: req.params.id } // Exclude current user
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    message: "Username already taken" 
                });
            }
        }

        // Validate email if provided (check for uniqueness)
        if (updateData.email) {
            const existingUser = await User.findOne({
                email: updateData.email,
                _id: { $ne: req.params.id }
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    message: "Email already in use" 
                });
            }
        }

        // Validate phone number format if provided (matches your schema regex)
        if (updateData.phone && updateData.phone !== '') {
            const phoneRegex = /^[0-9+\-() ]*$/;
            if (!phoneRegex.test(updateData.phone)) {
                return res.status(400).json({ 
                    message: "Invalid phone number format" 
                });
            }
        }

        // Clean up empty strings for optional fields
        // Fields that should be null instead of empty string (optional unique fields)
        const nullFields = ['phone', 'username'];
        nullFields.forEach(field => {
            if (updateData[field] === '') {
                updateData[field] = null;
            }
        });

        // Fields that can be empty string (bio, address, city, country)
        const emptyStringFields = ['bio', 'address', 'city', 'country'];
        emptyStringFields.forEach(field => {
            if (updateData[field] === undefined) {
                updateData[field] = ''; // Set default empty string if not provided
            }
        });

        // Ensure preferences object is properly structured
        if (updateData.preferences) {
            // Only update provided preference fields
            const validPreferenceKeys = ['emailNotifications', 'pushNotifications', 'saveHistory'];
            Object.keys(updateData.preferences).forEach(key => {
                if (!validPreferenceKeys.includes(key)) {
                    delete updateData.preferences[key];
                }
            });
        }

        // Log the update data for debugging
        console.log(`Updating user ${req.params.id} with data:`, updateData);

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData }, // Use $set to only update provided fields
            { 
                new: true, 
                runValidators: true,
                select: '-password' // Exclude password from returned document
            }
        );

        if(!user){
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Return success response with user data
        res.status(200).json({
            success: true,
            user: user,
            message: "Profile updated successfully"
        });

    }catch(error){
        console.error('Error updating user:', error);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false,
                message: `${field} already exists` 
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                message: messages.join(', ') 
            });
        }

        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
}

const updateAvatar = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const avatarUrl = `https://${B2_BUCKET_NAME}.s3.${process.env.B2_REGION}.backblazeb2.com/${req.file.key}`;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: avatarUrl },
        { new: true, select: '-password' }
      );

      res.json({ success: true, avatarUrl, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
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

export { getUsersBySearch, getUsers, editUser, deleteUser, updateRole, updateAvatar }