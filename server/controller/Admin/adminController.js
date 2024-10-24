const bcrypt = require("bcrypt");
const Admin = require('../../model/Admin')
const genarateAccesTocken = require('../../utils/genarateAccesTocken')
const genarateRefreshTocken = require('../../utils/genarateRefreshTocken')

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


const AdminLogout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie('refreshToken');
    res.status(200).json("admin logged out successfully");
};



module.exports = {
    registerAdmin,
    AdminLogin,
    AdminLogout,
};