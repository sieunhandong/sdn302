const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const { genneralRefreshToken, genneralAccessToken } = require("./JwtController");

const createUser = async (req, res, next) => {
    try {
        const { roll_number, first_name, last_name, avatar, gender, date_of_birth, email, password, confirmPassword, phone } = req.body;
        console.log(req.body)
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
            roll_number,
            first_name,
            last_name,
            avatar,
            gender,
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
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                message: "Email or Password is required",
            });
        }
        console.log(req.body)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Login failded",
                data:
                {
                    field: "email",
                    message: "Email is not defined"

                }

            });
        }

        if (user.status) {
            return res.status(400).json({
                status: 400,
                message: "The User not ative"
            })
        }
        const comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({
                status: 400,
                message: 'The Password is incorrect'
            })
        }
        user.last_login = new Date();
        await user.save()

        const access_token = genneralAccessToken({
            id: user.id,
            role: user.role
        })

        const refresh_token = genneralRefreshToken({
            id: user.id,
            role: user.role
        })
        res.status(201).json({
            status: "success",
            message: "User login successfully",
            data: {
                id: user.id,
                role: user.role,
                access_token,
                refresh_token,
                last_login: user.last_login
            }

        });
    } catch (error) {
        next(error);
    }
};
const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const {
            first_name,
            last_name,
            avatar,
            gender,
            date_of_birth,
            phone } = req.body;

        // Kiểm tra xem id có hợp lệ không trước khi truy vấn
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reject({ statusCode: 400, message: "Invalid User ID format" });
        }
        const user = await User.findOne({
            _id: id
        })

        if (user === null) {
            res.status(400).json({
                status: 'OK',
                message: 'The user is not defined'
            })
        }
        const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true })

        res.status(200).json({
            status: 200,
            message: 'User updated success',
            data: {
                _id: updateUser._id,
                first_name: updateUser.first_name,
                last_name: updateUser.last_name,
                avatar: updateUser.avatar,
                gender: updateUser.gender,
                date_of_birth: updateUser.date_of_birth,
                phone: updateUser.phone,
            }
        })
    } catch (e) {
        next(e)
    }
}
const getAllUsers = async () => {
    try {
        const users = await User.find({}, { password: 0 }); // Không trả về mật khẩu
        resolve({
            status: 'OK',
            message: 'Get all users successfully',
            data: users
        });
    } catch (e) {
        reject(e);
    }
}
const changePassword = async (req, res, next) => {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = req.body
        console.log("Received data:", { email, oldPassword, newPassword, confirmPassword });

        // Kiểm tra thông tin đầu vào
        if (!email || !oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: "Please provide all required fields"
            });
        }
        // Tìm kiếm user trong DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 'ERR',
                message: "User not found"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: "New password and confirm password do not match"
            });
        }

        // Kiểm tra mật khẩu cũ
        const isOldPasswordValid = await bcrypt.compareSync(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({
                status: 'ERR',
                message: "Old password is incorrect"
            });
        }

        // Kiểm tra nếu mật khẩu mới trùng mật khẩu cũ
        const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSameAsOld) {
            return res.status(400).json({
                status: 'ERR',
                message: "New password must be different from the old password"
            });
        }

        // Mã hóa mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;

        // Lưu vào DB
        await user.save();

        return res.status(200).json({
            status: 'OK',
            message: "Password updated successfully"
        });

    } catch (error) {
        next(error)
    }
};
module.exports = {
    createUser,
    login,
    updateUser,
    getAllUsers,
    changePassword
};
