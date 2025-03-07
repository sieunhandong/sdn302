const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require('./routes');
const bodyParser = require("body-parser");
dotenv.config()

const app = express()
const port = process.env.PORT || 9999



app.use(bodyParser.json())
//middleware
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Xử lý lỗi validation của Mongoose
    if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.keys(err.errors).map(field => ({
            field,
            message: err.errors[field].message
        }));

        return res.status(statusCode).json({
            status: statusCode,
            errorType: "Validation Error",
            errors
        });
    }
});
routes(app);
mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect DB success!')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log('Server is running in port: ', + port)
})