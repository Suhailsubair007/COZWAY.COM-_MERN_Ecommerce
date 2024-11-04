const User = require("../../model/User");
const bcrypt = require("bcrypt");
const otpGenarator = require('otp-generator');
const OTP = require('../../model/otpModel')
const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); ('google-auth-library');
const genarateAccesTocken = require('../../utils/genarateAccesTocken')
const genarateRefreshTocken = require('../../utils/genarateRefreshTocken')


const securePassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log(error);
    }
};


//User registration controller....
const registerUser = async (req, res) => {
    const { name, email, phone, password } = req.body;
    console.log(req.body);
    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await securePassword(password);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            is_blocked: false
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: { email, name, phone } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


//Login user controller and setting the access and refresh tocken to the cookies..
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const finduser = await User.findOne({ email });
        if (!finduser) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        if (finduser.is_blocked) {
            return res.status(403).json({ success: false, message: "User is blocked. Please contact support." });
        }
        const PasswordMatching = await bcrypt.compare(password, finduser.password);
        console.log(PasswordMatching)
        if (PasswordMatching) {
            genarateAccesTocken(res, finduser._id);
            genarateRefreshTocken(res, finduser._id);
            res.status(200).json({
                success: true,
                message: "User logged in successfully...",
                user: {
                    name: finduser.name,
                    email: finduser.email,
                    id: finduser._id,
                }
            });

        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}


//Logout the user and clear access and refresh tocken from the cookiee..
const UserLogout = (req, res) => {
    res.clearCookie("accessTocken");
    res.clearCookie('refreshToken');
    res.status(200).json("User logged out successfully");
};


//send OTP for signup....
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const userPresent = await User.findOne({ email });
        console.log(userPresent)

        if (userPresent) {
            return res.status(409).json({
                sucess: false,
                message: 'User alredy registered..',
            });
        }
        let otp = otpGenarator.generate(5, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenarator.generate(5, {
                upperCaseAlphabets: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',                              
            otp,
        });
        console.log(res.data)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}


//send OTP for forgot password....
const sendOTPForPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let otp = otpGenarator.generate(5, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        
        let existingOtp = await OTP.findOne({ otp });
        while (existingOtp) {
            otp = otpGenarator.generate(5, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            existingOtp = await OTP.findOne({ otp });
        }
        await OTP.create({ email, otp });

        res.status(200).json({ success: true, message: 'OTP sent successfully', otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

//Cntroller for google signup
const googleSignIn = async (req, res) => {
    console.log(req.body);

    const { email, name, sub: googleId } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user.is_blocked) {
            return res.status(403).json({ success: false, message: "User is blocked. Please contact support." });
        }

        if (!user) {
            user = new User({
                name,
                email,
                googleId,
                createdAt: new Date(),
            });

            await user.save();
        }
        genarateAccesTocken(res, user._id);
        genarateRefreshTocken(res, user._id);

        return res.status(200).json({
            message: 'User successfully signed in',
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
            },
        });

    } catch (error) {
        console.error('Error during Google sign-in:', error);
        return res.status(500).json({ message: 'Failed to authenticate Google user' });
    }
};


//contorller for google login...
const googleLoginUser = async (req, res) => {
    const { email, name } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user && user.is_blocked) {
            return res.status(403).json({
                success: false,
                message: "User is blocked. Please contact support.",
            });
        }

        if (!user) {
            user = new User({
                email,
                name,
                googleId: req.body.sub,
            });
            await user.save();
        }

        genarateAccesTocken(res, user._id);
        genarateRefreshTocken(res, user._id);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// controller to verify OTP for reset passwowdd...
const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const validOtp = await OTP.findOne({ email, otp });

        if (!validOtp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        await OTP.deleteOne({ email, otp });
        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// update the password...
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const hashedPassword = await securePassword(newPassword);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



module.exports = {
    registerUser,
    sendOTP,
    login,
    UserLogout,
    googleSignIn,
    googleLoginUser,
    sendOTPForPasswordReset,
    verifyResetOTP,
    resetPassword
};