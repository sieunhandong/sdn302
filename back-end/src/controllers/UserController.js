const User = require("../models/UserModel");

const createUser = async (req, res, next) => {
    try {
        const { first_name, last_name, date_of_birth, email, password, confirmPassword, phone } = req.body;

        const existingCustomer = await User.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({
                status: 400,
                errorType: "Payload Exists",
                message: "Add customer failed",
                data:
                {
                    field: "email",
                    message: "Email already exists"

                }

            });
        }
        if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            })
        }
        const newCustomer = new User({
            first_name,
            last_name,
            date_of_birth,
            email,
            password,
            phone
        });

        await newCustomer.save();

        res.status(201).json({
            status: "success",
            message: "User create successfully",
            data: {
                customer: newCustomer
            }

        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createUser
};
