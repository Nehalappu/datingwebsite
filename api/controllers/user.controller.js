
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test=(req,res)=>{
    res.send("working api");
}

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Password validation and hashing
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters long'));
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Username validation
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
      }
      if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'));
      }
      if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
        return next(errorHandler(400, 'Username can only contain letters and numbers'));
      }
    }

    // Prepare update fields
    const updateFields = {
      username: req.body.username,
      email: req.body.email,
    };

    if (req.body.password) {
      updateFields.password = req.body.password; // Only add password if provided
    }

    if (req.body.profilePicture) {
      updateFields.profilePicture = req.body.profilePicture; // Only add profile picture if provided
    }

    // Update the user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });

    if (!updatedUser) {
      return next(errorHandler(404, 'Failed to update user'));
    }

    // Exclude password from the response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


// export const updateAdditionalDetails = async (req, res) => {
//   const { userId } = req.params;
//   const { profilePicture, preference } = req.body; // Extract image URL and preference

//   try {
//       // Find user by ID and update their details
//       const user = await User.findById(userId);

//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       // Update user details
//       user.profilePicture = profilePicture; // Update the profile picture
//       user.preference = preference; // Update user preference
//       await user.save(); // Save changes to the database

//       return res.status(200).json({ message: 'User details updated successfully', user });
//   } catch (error) {
//       console.error('Error updating user details:', error);
//       return res.status(500).json({ message: 'Internal server error', error });
//   }
// };

export const updateAdditionalDetails = async (req, res) => {
  const { image, preference } = req.body;
  const userId = req.params.id;

  try {
      const updatedUser = await User.findByIdAndUpdate(userId, { image, preference }, { new: true });
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(updatedUser);
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};