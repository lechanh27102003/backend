const User = require('../models/User');
const createError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer= require ('nodemailer');
const UserToken = require ('../models/UserToken');

exports.signup = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        
        if(user) {
            return next(new createError('User already exists!',400));
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
    
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
        });

        //Assign JWT (json web token) to users
        const token = jwt.sign({_id: newUser._id}, 'process.env.JWT_SECRET', {
            expiresIn: '90d',
        });

        res.status(201).json ({
            status:'success',
            message:'User registered successfully',
        token,
        });
    } catch (error) {
        next(error);
    }
};

//Loggin user
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return next(new createError('User not found', 400));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return next(new createError('Invalid email or password', 401));
        }

        // Kiểm tra nếu tên người dùng là "admin123" thì cập nhật vai trò là "admin"
        if (user.name === 'admin123') {
            user.role = 'admin';
            await user.save();
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '90d',
        });

        // Chuyển hướng đến trang admin hoặc trang chủ tùy thuộc vào vai trò của người dùng
        const redirectUrl = user.role === 'admin' ? '/admin/dashboard' : '';

        res.status(200).json({
            status: 'success',
            token,
            message: 'Login successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            redirectUrl
        });
    } catch (error) {
        next(error); 
    }
};

exports.sendEmail = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({ email:{$regex: '^'+email+'$', $options:'i'} });
    if (!user) {
        return next(new createError('User not found', 400));
    }
    const payload = {
        email:user.email
    }
    const expiryTime = 300;
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiryTime});
    const newToken = new UserToken({
        userId:user._id,
        token:token
    });
    const mailTransporter = nodemailer.createTransport ({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: "safjvgecdyhbmmyd"
        }
    });
    const resetUrl = `${process.env.LIVE_URL}/reset/${token}`;

        const mailDetails = {
        from: "plantiqueshop01@gmail.com",
        to: email,
        subject: "Reset Password",
        html: 
        `<html>
        <head>
        <title>Reset Password</title>
        </head>
        <body>
        <h1>Reset Password Request</h1>
        <p>Dear ${user.name},</p>
        <p>We have received a reset password request for your account with Plantiqueshop. To complete the reset password request, please Click on the button below.</p>
        <p>${resetUrl}</p>
        <p>Please note that this link is only valid for 5 minutes. If you did not request a password reset, please disregard this message.</p>
        <p>Thank you,</p>
        <p>The Plantiqueshop Team</p>
        </html>`
        ,
        
    };
    mailTransporter.sendMail(mailDetails, async(err, data)=> {
        if (err) {
            console.log(err);
            return next(new createError('Something went wrong while sending the email', 500))
        } else {
            await newToken.save();
            res.status(200).json({
                status:'success',
                message: 'Email sent successfully'
            });

        }
});
};

exports.resetPassword = async (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;

    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
        if (err) {
            return next(new createError('Reset Link is Expired!', 500));
        } else {
            const response = data;
            const user = await User.findOne({ email:{$regex: '^'+response.email+'$', $options:'i'} });
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            user.password = encryptedPassword;
            try {
                const updatedUser = await User.findOneAndUpdate (
                    {_id:user._id},
                    {$set:user},
                    {new:true}

                ) ;
                // Log thông tin người dùng đã cập nhật mật khẩu thành công
                console.log('User updated:', updatedUser);
                res.status(200).json({
                    status:'success',
                    message: 'Reset password successfully'
                });
            } catch (error) {
                return next(new createError("Something went wrong while resetting password", 500));
            }
}})
}
