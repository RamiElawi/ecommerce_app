// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');

// const user=sequelize.define('user',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     name:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     email:{
//         type:Sequelize.STRING,
//         allowNull:false
//     }
// })
// module.exports=user;

// const GetDb=require('../util/database').getDb;

// const mongodb=require('mongodb')

// class user{
//     constructor(username,email,cart,id){
//         this.name=username;
//         this.email=email;
//         this.cart=cart
//         this._id=id;
//     }

//     Save(){
//         const db=GetDb();
//         return db.collection('users').insertOne(this).then(user=>{
//             console.log(user)
//         }).catch(err=>{
//             console.log(err)
//         })
//     }

//     addToCart(product){
//         let newquantity=1;
//         const updateCartItems=[...this.cart.items];
//         const cartProductIndex=this.cart.items.findIndex(cp=>{
//             return cp.productId.toString() === product._id.toString()
//         })
//         if(cartProductIndex >= 0){
//             let oldQuantity=this.cart.items[cartProductIndex].quantity;
//             newquantity=oldQuantity+1;
//             updateCartItems[cartProductIndex].quantity=newquantity
//         }else{
//             updateCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:newquantity})
//         }
//         const updateCart={items:updateCartItems};
//         const db=GetDb();
//         return db.collection('users')
//         .updateOne({_id:new mongodb.ObjectId(this._id)}
//          , {$set:{cart:updateCart}} ) 
//     }

//     getCart(){
//         const db=GetDb();
//         const produtcIds=this.cart.items.map(i=>{
//             return i.productId;
//         })
//         return db.collection('products')
//         .find({_id:{$in:produtcIds}})
//         .toArray()
//         .then(products=>{
//             return products.map(p=>{
//                 return {...p,
//                 quantity:this.cart.items.find(i=>{
//                     return i.productId.toString() === p._id.toString();
//                 }).quantity
//                 }
//             })
//         })
//     }

//     addOrder(){
//         const db =GetDb();
//         return this.getCart()
//         .then(products=>{
//             const order={
//                 items:products,
//                 user:{
//                     _id:new mongodb.ObjectId(this._id),
//                     name:this.name
//                 }
//             }
//             return db.collection('orders')
//             .insertOne(order)
//         })
//         .then(()=>{
//             this.cart={items:[]};
//             return db.collection('users').updateOne(
//                 {_id:new mongodb.ObjectId(this._id)},
//                 {$set:{cart:{items:[]}}}
//             )
//         })
//     }
//     getOrders(){
//         const db=GetDb();
//         return db.collection('orders').find({'user._id':new mongodb.ObjectId(this._id)}).toArray()
//     }

//     deleteFromCart(prodId){
//         const updateCartItems=this.cart.items.filter(item=>{
//             return item.productId != prodId
//         })
//         const db=GetDb();
//         return db
//         .collection('users')
//         .updateOne(
//             {_id:new mongodb.ObjectId(this._id)},
//             {$set:{cart:{items:updateCartItems}}}
//         )
//     }

//     static findById(userId){
//         const db=GetDb();
//         return db.collection('users').findOne({_id:new mongodb.ObjectId(userId)}).then((user)=>{
//             console.log('Done');
//             return user
//         })
//         .catch(err=>{
//             console.log(err);
//         })
//     }

// }

// module.exports=user



const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    resetTokenExpiration:Date,
    cart:{
        items:[{
            productId:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }]
    }
})

userSchema.methods.addToCart=function(product){
    let newquantity=1;
        const updateCartItems=[...this.cart.items];
        const cartProductIndex=this.cart.items.findIndex(cp=>{
            return cp.productId.toString() === product._id.toString()
        })
        if(cartProductIndex >= 0){
            let oldQuantity=this.cart.items[cartProductIndex].quantity;
            newquantity=oldQuantity+1;
            updateCartItems[cartProductIndex].quantity=newquantity
        }else{
            updateCartItems.push({productId:(product._id),quantity:newquantity})
        }
        const updateCart={items:updateCartItems};
        this.cart=updateCart;
        return this.save()
}

userSchema.methods.removeFromCart=function(prodId){
    const updateCartItems=this.cart.items.filter(item=>{
        return item.productId.toString() !== prodId.toString()
    })
    this.cart.items=updateCartItems;
    return this.save()
}
userSchema.methods.clearCart=function(){
    this.cart={items:[]};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);
