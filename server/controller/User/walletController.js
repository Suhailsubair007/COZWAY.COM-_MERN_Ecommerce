const Wallet = require('../../model/Wallet');



const getUserWallet = async (req, res) => {
    try {
        const { userId } = req.query;

        let wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            wallet = new Wallet({
                user: userId,
                balance: 0,
                transactions: []
            })
        }

        wallet?.transactions.sort((a, b) =>
            new Date(b.transaction_date) - new Date(a.transaction_date)
        );

        res.status(200).json({
            sucess: true,
            message: "fetchedd...",
            wallet
        })

    } catch (error) {
        console.log(error)
    }
}


const addAmountToWallet = async (req, res) => {
    try {
        console.log("oooooooooooooooo")
        const { userId, amount } = req.body;

        let wallet = await Wallet.findOne({ user: userId })
        if (!wallet) {
            wallet = new Wallet({
                user: userId,
                balance: 0
            })
        }

        wallet.balance += amount;
        const transactions = {
            transaction_date: new Date(),
            transaction_type: "credit",
            transaction_status: "completed",
            amount: amount,
        }

        wallet.transactions.push(transactions);
        await wallet.save();

        res.status(200).json({
            sucess: true,
            wallet,
            message: "Wallet updated sucessfully.."
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess: false,
            message: "Server error"
        })
    }
}


module.exports = {
    addAmountToWallet,
    getUserWallet
}