const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        date_of_birth: { type: Date, required: false },  // Changed to Date
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["ADMIN", "MENTOR", "CANDIDATE", "INTERN", "HR"],
            default: "CANDIDATE"
        },
        phone: { type: String, required: true },  // Changed to String
        last_login: { type: Date },  // Changed to Date
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
