const express=require('express');
const {check,body}=require('express-validator')
const router=express.Router();
const User=require('../models/user')
const authController=require('../controllers/auth')

router.get('/login',authController.getLogin)

router.get('/signup',authController.getSignup)

router.post('/login',
[
    check('email')
.isEmail()
.withMessage('Please enter a vailed emai address')
.normalizeEmail()
,
body('password')
.isLength({min:5})
.isAlphanumeric()
.trim()
]
,authController.postLogin)

router.post('/logout',authController.postLogout)

router.post('/signup'
,[
check('email')
.isEmail()
.withMessage('Please enter a valied email')
.custom( ( value,{req})=>{
    // if(value === 'test@test.com'){
    //     throw new Error('this email is forbidden');
    // }
    // return true;
    return User.findOne({email:value})
    .then(userDoc=>{
        if(userDoc){
            return Promise.reject('Email exist already,Please pick a different one.')
        }
    })
}).normalizeEmail()
,body('password','please enter a password with only number and text and at least 5 character')
.isLength({min:5})
.isAlphanumeric()
.trim()
,body('confirmPassword')
.trim()
.custom((value,{req})=>{
    if(value !== req.body.password){
        throw new Error('Password have to match!')
    }
    return true
    })
]
,authController.postSignup)

router.get('/reset',authController.getReset)

router.post('/reset',authController.postReset)

router.get('/reset/:token',authController.getNewpassword)

router.post('/new-password',authController.postNewPassword)
module.exports=router;