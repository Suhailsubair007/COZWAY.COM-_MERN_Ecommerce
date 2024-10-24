const User = require("../../model/User");


const getCoutomers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users) {
            res.status(200).json({
                users

            });
            console.log(users)
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const updateCoustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_blocked } = req.body;
        console.log(is_blocked)
        console.log(id)

        const updateStats = await User.findByIdAndUpdate(id, { is_blocked }, { new: true })
        console.log(updateStats);
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
