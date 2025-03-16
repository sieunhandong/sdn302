const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
    {
        roll_number: { type: String, required: false, unique: true },
        first_name: { type: String, required: false },
        last_name: { type: String, required: false },
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
        phone: { type: String, required: false },
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
// Tạo roll_number nếu không nhập
userSchema.pre("save", async function (next) {
    if (!this.roll_number) {
        let newRollNumber;
        let isDuplicate = true;

        // Lặp để tránh trùng roll_number
        while (isDuplicate) {
            newRollNumber = `RN${Math.floor(100000 + Math.random() * 900000)}`; 
            const existingUser = await mongoose.model("User").findOne({ roll_number: newRollNumber });
            if (!existingUser) {
                isDuplicate = false;
            }
        }

        this.roll_number = newRollNumber;
    }
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
