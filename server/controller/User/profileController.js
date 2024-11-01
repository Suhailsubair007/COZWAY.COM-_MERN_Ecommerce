const User = require('../../model/User')

// controller for update frofile details in the profile page...
const updateProfile = async (req, res) => {
    const userId = req.params.id;
    const { name, phone } = req.body;


    const updateFields = {};

    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                name: updatedUser.name,
                phone: updatedUser.phone,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



// To get data to display in the profile page...
const getUserData = async (req, res) => {
    const userId = req.params.id;

    try {

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};




module.exports = {
    updateProfile,
    getUserData,
};