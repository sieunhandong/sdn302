const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        roll_number: { type: String, required: true , unique: true},
        first_name: { type: String, required: [true, 'First name is require'] },
        last_name: { type: String, required: [true, 'Last name is require'] },
        avatar: { type: String },
        gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
        date_of_birth: { type: Date, required: false },
        email: { type: String, required: [true, 'Email is require'], unique: true },
        password: { type: String, required: [true, 'Password is require'] },
        role: {
            type: String,
            enum: ["ADMIN", "MENTOR", "CANDIDATE", "INTERN", "HR"],
            default: "CANDIDATE"
        },
        phone: { type: String, required: [true, 'Phone is require'] },
        specialization: { type: String },
        last_login: { type: Date },  // Changed to Date
        is_active: {
            type: Boolean, default: true, required: false
        },
        access_token: { type: String, required: false },
        refresh_token: { type: String, required: false },
    }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
const User = mongoose.model("User", userSchema);
module.exports = User;
