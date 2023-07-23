const express=require('express');
const path=require('path');
const app=express();
const mongoose=require('mongoose')
const session=require('express-session');
const mongodbStor=require('connect-mongodb-session')(session);
const bodyparser=require('body-parser');
const csrf=require('csurf');
const flash=require('connect-flash');
const MONGODB_URI='mongodb+srv://Ramielawi:rami1234@firstproject.tezbk4n.mongodb.net/shop?retryWrites=true&w=majority';
const multer=require('multer')
const mimetype=require('mime-types')
const store=new mongodbStor({
    uri:MONGODB_URI,
    collection:'sessions'
})
const isAuth=require('./middelware/is-auth')
const adminRouter=require('./routes/admin'); 

const shopRouter=require('./routes/shop'); 

const authRouter=require('./routes/auth'); 

const Controller404=require('./controllers/404')

const User=require('./models/user.js')

const mongoconnect=require('./util/database').mongoconnect;
// const db=require('./util/database');

// const sequelize=require('./util/database');

// const Product=require('./models/product');
// const User=require('./models/user');
// const Cart=require('./models/cart');
// const CartItem=require('./models/cart-Item');
// const Order=require('./models/order');
// const OrderItem=require('./models/order-item');

app.set('view engine','pug');

app.set('views','views');

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+'-'+file.originalname)
    }
})

const fileFilter= (req,file,cb)=>{
    if(file.mimetype === 'Image/png' || file.mimetype =='Image/jpg' || file.mimetype == 'Image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
// db.execute('SELECT * FROM products')
// .then(result=>console.log(result[0]))
// .catch(err=>console.log(err));

app.use(bodyparser.urlencoded({extended:false}));
app.use(multer({dest:'images'}).single('Image'))
app.use(express.static(path.join(__dirname,'public')))
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(session({secret:'my secret',resave:false,saveUninitialized:false,store:store}))

const csrfProtection=csrf() 

app.use(flash())
app.use(csrfProtection);

app.use((req,res,next)=>{
    res.locals.isAuthentcated=req.session.isLoggedIn;
    res.locals.csrfToken=req.csrfToken();
    next();
})

app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        if(!user){
            return next();
        }
        req.user=user
        next();
    }).catch(err=>{
        next(new Error(err)) 
    });

})



app.use('/admin',adminRouter);

app.use(shopRouter)

app.use(authRouter)

app.get('/500',Controller404.get500)
app.use(Controller404.get404)

app.use((error,req,res,next)=>{
    // res.redirect('/500')
    console.log(error)
    // res.status(500).render('500',{
    //     path:'/500',
    //     docTitle:'Error!',
    //     isAuthentcated:req.session.isLoggedIn
    // })
})

// 
// Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product,{through:CartItem});
// Product.belongsToMany(Cart,{through:CartItem});
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product,{through:OrderItem})

// // sequelize.sync({force:true})
// sequelize.sync()
// .then(()=>{
//     return User.findByPk(1)
// }).then( user=>{
//     if(!user){
//         return User.create({name:'Rami',email:'elawi@gamil.com'})
//     }
//     return user;
// }).then(user=>{
//     return user.createCart()
// })
// .then(cart=>{
//     app.listen(4040);
// })
// .catch(err=>{
//     console.log(err);
// })



// const server=http.createServer(app);

// server.listen(4040);


// Mongo dataBase
// mongoconnect(client=>{
//     console.log(client);
//     app.listen(4040);
// })

mongoose.connect(MONGODB_URI)
.then(result=>{
    app.listen(4040)
})
.catch(err=>{
    console.log(err)
})