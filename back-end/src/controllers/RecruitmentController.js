const Recruitment = require("../models/RecruitmentModel");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

const createRecruitment = async (req, res, next) => {
    try {
        const sender_id = req.user.payload.id; // Lấy ID từ middleware
        console.log(sender_id)
        const { receiver_id, recruit_description, recruit_img, recruit_title, date_start, date_end } = req.body;

        console.log(req.body);

        if (!mongoose.Types.ObjectId.isValid(receiver_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid receiver_id",
            });
        }

        // Tạo recruitment mới
        const newRecruitment = new Recruitment({
            sender_id, // ID của mentor từ middleware
            receiver_id, // ID của HR từ request body
            recruit_description,
            recruit_img,
            recruit_title,
            date_start,
            date_end,
        });

        await newRecruitment.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Recruitment sent successfully",
            data: {
                recruitment: newRecruitment,
            },
        });
    } catch (error) {
        next(error);
    }
};


// const updateUser = async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const {
//             first_name,
//             last_name,
//             avatar,
//             gender,
//             date_of_birth,
//             phone } = req.body;

//         // Kiểm tra xem id có hợp lệ không trước khi truy vấn
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return reject({ statusCode: 400, message: "Invalid User ID format" });
//         }
//         const user = await User.findOne({
//             _id: id
//         })

//         if (user === null) {
//             res.status(400).json({
//                 status: 'OK',
//                 message: 'The user is not defined'
//             })
//         }
//         const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true })

//         res.status(200).json({
//             status: 200,
//             message: 'User updated success',
//             data: {
//                 _id: updateUser._id,
//                 first_name: updateUser.first_name,
//                 last_name: updateUser.last_name,
//                 avatar: updateUser.avatar,
//                 gender: updateUser.gender,
//                 date_of_birth: updateUser.date_of_birth,
//                 phone: updateUser.phone,
//             }
//         })
//     } catch (e) {
//         next(e)
//     }
// }
// const getAllUsers = async () => {
//     try {
//         const users = await User.find({}, { password: 0 }); // Không trả về mật khẩu
//         resolve({
//             status: 'OK',
//             message: 'Get all users successfully',
//             data: users
//         });
//     } catch (e) {
//         reject(e);
//     }
// }

module.exports = {
    createRecruitment
};
