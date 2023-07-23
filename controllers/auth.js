const User=require('../models/user')
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const dotenv=require('dotenv');
const sendGrid=require('nodemailer-sendgrid-transport');
const crypto=require('crypto');
const {validationResult}=require('express-validator')
dotenv.config();

// const transport=nodemailer.createTransport(sendGrid({
//     auth:{
//         api_key:''
//     }
// }))

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: '948ebb3cebde5faacf094b5e4792f8dc-381f2624-c0cabe1a',
});
mg.messages
	.create(sandboxc785d74d5e624739b1ea84cc5d64d041.mailgun.org, {
		from: "Mailgun Sandbox <postmaster@sandboxc785d74d5e624739b1ea84cc5d64d041.mailgun.org>",
		to: ["elawirse@gmail.com"],
		subject: "Hello",
		text: "Testing some Mailgun awesomness!",
	})
	.then(msg => console.log(msg)) // logs response data
	.catch(err => console.log(err))



exports.getLogin=(req,res,next)=>{
    // const isLoggedIn = req.get('Cookie').split('=')[1]==='true';
    console.log(req.session.isLoggedIn)
    let message=req.flash('erorr');
    if(message.length > 0){
        message=message[0]
    }else{
        message=null;
    }
    res.render('auth/login',{
        path:'/login',
        docTitle:'Login',
        erorrMessage:message,
        oldInput:{
            email:'',
            password:'',
        },
        validationError:[]
    })
}
exports.getSignup=(req,res,next)=>{
    let message=req.flash('erorrSignup')
    if(message.length>0){
        message=message[0]
    }else{
        message=null
    }
    res.render('auth/signup'
    ,{path:'/signup'
    ,docTitle:'Sign Up'
    ,erorrSignup:message,
    oldInput:{
        email:"",
        password:"",
        confirmPassword:""
    },
    validationError:[]
})
}

exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login',{
        path:'/login',
        docTitle:'Login',
        erorrMessage:errors.array()[0].msg,
        validationError:errors.array()[0].param,
        oldInput:{email:email,password:password}
        })
    }
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.status(422).render('auth/login',{
                path:'/login',
                docTitle:'Login',
                erorrMessage:'this email is not exsest',
                validationError:[],
                oldInput:{email:email,password:password}
            })
        }
        bcrypt.compare(password,user.password)
        .then(doMatch=>{
            if(doMatch){
                req.session.isLoggedIn=true
                req.session.user=user
                return req.session.save(err=>{
                    console.log(err)
                    res.redirect('/')
                }) 
            }
            return res.status(422).render('auth/login',{
                path:'/login',
                docTitle:'Login',
                erorrMessage:'this password is not currect',
                validationError:[],
                oldInput:{email:email,password:password}
                })
        }).catch(err=>{
            console.log(err);
            res.redirect('/login')
        })
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })
    
}

exports.postLogout=(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/')
    })
}

exports.postSignup=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup'
        ,{path:'/signup'
        ,docTitle:'Sign Up'
        ,erorrSignup:errors.array()[0].msg,
        oldInput:{email:email,password:password,confirmPassword:req.body.confirmPassword},
        validationError:errors.array()[0].param
        })
    }
    bcrypt
        .hash(password,12)
        .then(hashpassword=>{
            const user=new User({
                email:email,
                password:hashpassword,
                cart:{items:[]}
            });
            return user.save()
        })
        .then(()=>{
            res.redirect('/login')
            return transport.sendMail({
                to:email,
                from:"shop@node-complete.com",
                subject:"Sigh succeeded",
                html:"<h1>You succefully sign up!</h1>"
            })
        })
        .catch(err=>{
            const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
        })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })
}

exports.getReset=(req,res,next)=>{
    let message=req.flash('erorr');
    if(message.length > 0){
        message=message[0]
    }else{  
        message=null
    }
    res.render('auth/reset',{
        path:'/reset',
        docTitle:'Reset',
        erorrMessage:message
    })
}
exports.postReset=(req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            return res.redirect('/reset');
        }
        const Token=buffer.toString('hex')
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                req.flash('erorr',"not account with that email found");
                return res.redirect('/reset')
            }
            user.resetToken=Token;
            user.resetTokenExpiration=Date.now() + 3600000;
            return user.save();
        })
        .then(result=>{
            res.redirect('/')
            return transport.sendMail({
                to:rq.body.email,
                from:'shop@node-complete.com',
                subject:'password Reset',
                html:`
                    <p>You requested a password reset</p>
                    <p>Click this <a href='http://localhost:4040/reset/${Token}'>link</a> to set an new password </p>
                `
            })
        })
        .catch(err=>{
            const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
        })
    })
}
exports.getNewpassword=(req,res,next)=>{
    const token=req.params.token;
    User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
    .then(user=>{
        let message=req.flash('erorr');
    if(message.length>0){
        message=message[0];
    }else{
        message=null
    }
    res.render('auth/new-password',{
        path:'/new-password',
        docTitle:'Change Password',
        erorrMessage:message,
        userId:user._id.toString(),
        passwordToken:token
        })
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })
} 
exports.postNewPassword=(req,res,next)=>{
    const newPassword=req.body.new-password;
    const userId=req.body.userId;
    const passwordToken=req.body.passwordToken;
    let resetUser;
    User.findOne({_id:userId,resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()}})
    .then(user=>{
        resetUser=user;
        return bcrypt.hash(12,newPassword) 
    })
    .then(hashPassword=>{
        resetUser.password=hashPassword;
        resetUser.resetToken=null;
        resetUser.resetTokenExpiration=null;
        return resetUser.save();
    })
    .then(result=>{
        res.redirect('/login');
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })
}