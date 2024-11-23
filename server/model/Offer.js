const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    offer_value: {
        type: Number,
        required: true,
    },
    target_type: {
        type: String,
        enum: ['product', 'category'],
        required: true,
    },
    target_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    target_name: {
        type: String,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    }

})

offerSchema.index({ end_date: 1 }, { expireAfterSeconds: 0 });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer