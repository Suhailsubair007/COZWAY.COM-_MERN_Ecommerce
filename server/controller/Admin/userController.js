const User = require("../../model/User");


//GET ---Get the data of the users in the admin side....
const getCoutomers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users) {
            res.status(200).json({
                users

            });
        }
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//PATCH---to change the active ststus of the user by the admin....
const updateCoustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_blocked } = req.body;

        const updateStats = await User.findByIdAndUpdate(id, { is_blocked }, { new: true })
        if (!updateStats) {
            return res.status(404).json({ message: 'Product not found..' });
        }

        res.status(200).json(updateStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating category status' });
    }

}





module.exports = {
    getCoutomers,
    updateCoustomerStatus,
};
