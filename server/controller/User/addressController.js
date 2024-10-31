const { IdentityPoolClient } = require('google-auth-library');
const Address = require('../../model/Addres')


//adding new address in the profile page for a purticulasr user

const userAddAddress = async (req, res) => {
    try {
        const { name, phone, address, district, state, city, pincode, alternatePhone, landmark, user } = req.body;
        // console.log(name, phone, address, district, state, city, pincode, alternatePhone, landmark, user);
        console.log(user)

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
        console.log("Address save ayyiii..",savedAddress);                  

        res.status(201).json({
            message: 'Address added successfully',
            address: savedAddress
        });
    } catch (error) {
        console.error("Error addinggg address:", error); 
        res.status(500).json({
            message: 'An error occurred while adding the address',
            error: error.message
        });
    }
};



// Getting user address that are avilabe to diplay in the profile and chaeckout page..

const getUserAddresses = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const addresses = await Address.find({ user: userId });

        if (addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user' });
        }

        res.status(200).json({
            message: 'Addresses fetched successfully',
            addresses
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while fetching addresses',
            error: error.message
        });
    }
};


// controller for delete the purlicular address fom the db... findbyid and delete

const deleteUserAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        console.log(addressId)

        if (!addressId) {
            return res.status(400).json({ message: 'Address ID is required' });
        }

        const deletedAddress = await Address.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({
            message: 'Address deleted successfully',
            address: deletedAddress
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while deleting the address',
            error: error.message
        });
    }
};


//Used for fetching the details of the purticular address

const getAddressById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!IdentityPoolClient) {
            return res.status(400).json({ message: 'Address ID is required' });
        }

        const address = await Address.findById(id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({
            message: 'Address fetched successfully',
            address
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while fetching the address',
            error: error.message
        });
    }
};



// Updating a specific address with individual fields

const updateUserAddress = async (req, res) => {
    try {
        console.log("request vannuu......")
        const { id } = req.params;
        console.log(id)
        const { name, phone, address, district, state, city, pincode, alternatePhone, landmark } = req.body;
        console.log(name)

        if (!id) {
            console.log("id illaaa------>>>>>>");
            return res.status(400).json({ message: 'Address ID is required' });
        }



        const updateFields = {};
        if (name) updateFields.name = name;
        if (phone) updateFields.phone = phone;
        if (address) updateFields.address = address;
        if (district) updateFields.district = district;
        if (state) updateFields.state = state;
        if (city) updateFields.city = city;
        if (pincode) updateFields.pincode = pincode;
        if (alternatePhone) updateFields.alternatePhone = alternatePhone;
        if (landmark) updateFields.landmark = landmark;

        console.log("updated fieldsssss......",updateFields)

        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } 
        );
        console.log("updated fieldsssss......",updateUserAddress)

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({
            message: 'Address updated successfully',
            address: updatedAddress
        });
    } catch (error) {
        console.error("Error updating address:", error); 
        res.status(500).json({
            message: 'An error occurred while updating the address',
            error: error.message
        });
    }
};




module.exports = {
    userAddAddress,
    getUserAddresses,
    deleteUserAddress,
    getAddressById,
    updateUserAddress
};