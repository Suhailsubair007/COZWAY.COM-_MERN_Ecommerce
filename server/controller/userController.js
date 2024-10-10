const User = require("../model/User");
const bcrypt = require("bcrypt");
const otpGenarator = require('otp-generator');
const OTP = require('../model/otpModel')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); ('google-auth-library');


const securePassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log(error);
    }
};


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

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const userPresent = await User.findOne({ email });

        if (userPresent) {
            return res.status(401).json({
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const finduser = await User.findOne({ email });
        if (!finduser) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const PasswordMatching = await bcrypt.compare(password, finduser.password);
        console.log(PasswordMatching)
        if (PasswordMatching) {
            res.status(200).json({
                success: true,
                message: "User logged in successfully...",
                name: finduser.name,
                email: finduser.email,
                _id: finduser._id
            });

        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const googleSignIn = async (req, res) => {
    console.log(req.body);

    // Destructure 'email', 'name', and 'googleId' directly from 'req.body'
    const { email, name, sub: googleId } = req.body;

    try {
        // Check if the user already exists in the database
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if not found
            user = new User({
                name,
                email,
                googleId,
                createdAt: new Date(),
            });

            await user.save();
        }

        // Respond with success and user details
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


const googleLoginUser = async (req, res) => {
    const { email, name } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name,
                googleId: req.body.sub,
            });
            await user.save();
        }
        return res.status(200).json({ sucess: true, message: 'Jayy jawann rakshapettu' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};





module.exports = {
    registerUser,
    sendOTP,
    login,
    googleSignIn,
    googleLoginUser,
};
