const Address = require('../../model/Addres')

const userAddAddress = async (req, res) => {
    try {
        const { name, phone, address, district, state, city, pincode, alternatePhone, landmark, user } = req.body;
        console.log(name, phone, address, district, state, city, pincode, alternatePhone, landmark, user); 

        if (!name || !phone || !address || !district || !state || !city || !pincode || !user) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const newAddress = new Address({
            name,
            phone,
            address,
            district,
            state,
            city,
            pincode,
            alternatePhone,
            landmark,
            user
        });

        const savedAddress = await newAddress.save();

        res.status(201).json({
            message: 'Address added successfully',
            address: savedAddress                                             
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while adding the address',
            error: error.message
        });
    }
};


module.exports = {
    userAddAddress,
};