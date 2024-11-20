const User = require('../../model/User')
const Wallet = require('../../model/Wallet')

const getReferralCode = async (req, res) => {
    try {
        const userId = req.user;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "Referral code retrieved successfully",
            referralCode: user.referralCode,
        });
    } catch (error) {
        console.error("Error fetching referral code:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const getHasSeen = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            hasSeen: user.hasSeen,
        });
    } catch (error) {
        console.error("Error fetching...:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const applyReferralCode = async (req, res) => {
    try {
        const { code, seen } = req.body;
        const userId = req.user;

        if (!code || !userId) {
            return res.status(400).json({
                message: "Referral code and User ID are required"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const referredUser = await User.findOne({ referralCode: code });
        if (!referredUser) {
            return res.status(404).json({
                message: "Referred user not found"
            });
        }

        let userWallet = await Wallet.findOne({ user: user._id });
        let referredWallet = await Wallet.findOne({ user: referredUser._id });

        if (!userWallet) {
            userWallet = new Wallet({
                user: userId,
                balance: 0,
                transactions: []
            });
        }
        if (!referredWallet) {
            referredWallet = new Wallet({
                user: referredUser._id,
                balance: 0,
                transactions: []
            });
        }

        if (user.hasSeen === false) {
            user.hasSeen = true;
            await user.save();
        }

        const transactionAmount = 200;

        const transactionDate = new Date();
        const userTransaction = {
            transaction_date: transactionDate,
            transaction_type: "credit",
            transaction_status: "completed",
            amount: transactionAmount,
        };

        const referredTransaction = {
            transaction_date: transactionDate,
            transaction_type: "credit",
            transaction_status: "completed",
            amount: transactionAmount,
        };


        userWallet.balance += transactionAmount;
        userWallet.transactions.push(userTransaction);
        await userWallet.save();

        referredWallet.balance += transactionAmount;
        referredWallet.transactions.push(referredTransaction);
        await referredWallet.save();

        return res.status(200).json({
            message: "Referral code applied successfully",
            userWalletBalance: userWallet.balance,
            referredWalletBalance: referredWallet.balance,
        });
    } catch (error) {
        console.error("Error applying referral code:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const skipRefferalOffer = async (req, res) => {
    try {

        const userId = req.user;
        console.log("skip ile user id--->", userId)

        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).json({
                sucess: false,
                message: "User not found!"
            })
        }

        user.hasSeen = true;
        await user.save()

        res.status(200).json({
            sucess: true,
            message: "Skipped",
            hasSeen: user.hasSeen
        })


    } catch (error) {
        console.error("Error applying referral code:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    applyReferralCode,
    getHasSeen,
    getReferralCode,
    skipRefferalOffer
}