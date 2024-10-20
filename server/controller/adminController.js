const User = require("../model/User");
const Category = require('../model/Category');
const bcrypt = require("bcrypt");
const Product = require('../model/Product')
const Admin = require('../model/Admin')
const genarateAccesTocken = require('../utils/genarateAccesTocken')
const genarateRefreshTocken = require('../utils/genarateRefreshTocken')

const securePassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log(error);
    }
};

const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        const hashedPassword = await securePassword(password);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();
        res.status(201).json({ message: 'User registered successfully', user: { email, name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email)
        console.log(password)
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const admin = await Admin.findOne({ email });
        console.log(admin)
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        genarateAccesTocken(res, admin._id); 
        genarateRefreshTocken(res, admin._id); 

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            admin: {
                name: admin.name,
                email: admin.email,
                _id: admin._id
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};



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

const AdminLogout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie('refreshToken');
    res.status(200).json("admin logged out successfully");
};



module.exports = {
    getCoutomers,
    updateCoustomerStatus,
    registerAdmin,
    AdminLogin,
    AdminLogout,
};



