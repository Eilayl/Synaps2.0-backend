const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user:{
        name:{ type: String, required: true },
        phone:{ type: String, required: true },
        email:{ type: String, required: true },
        company:{ type: String, required: true },
    },
    problemProperties:{
        title: { type: String, required: true },
        recruitment_sentence: { type: String, required: true },
        customers: [{type: String, required: true }],
        kpis: [{type: String, required: true }],
        summary: { type: String, required: true },
        description: { type: String, required: true },
    }
})

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;