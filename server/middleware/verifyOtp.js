const OTP = require('../model/otpModel');

//OTP verification middleware.....
const verifyOTP = async (req, res, next) => {
    
    const { email, otp } = req.body;
    try {
        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
};

module.exports = verifyOTP;
  