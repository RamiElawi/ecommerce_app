// const path=require('path');

// const fs=require('fs'); 

// const Cart =require('./cart')

// const p=path.join(path.dirname(process.mainModule.filename),'data','products.json');

// const getProductFromFiel=(cb)=>{
//         fs.readFile(p,(err,fileContent)=>{
//             if(err){
//                 return cb([]);
//             }
//             cb(JSON.parse(fileContent)) 
//         })
// }

// module.exports=class Product{
//     constructor(t,p,d,id){
//         this.title=t;
//         this.price=p;
//         this.description=d;
//         this.id=id;
//     }

//     Save(){
        
//         getProductFromFiel(products=>{
//             if(this.id){
//                 const exsistingProductIndex=products.findIndex(prod=>prod.id===this.id)
//                 const updateProduct=[...products];
//                 updateProduct[exsistingProductIndex]=this;
//                 fs.writeFile(p,JSON.stringify(updateProduct),(err)=>{
//                     console.log(err);
//                 });
//             }else{
//                 this.id = Math.random().toString();
//                 products.push(this); 
//                     fs.writeFile(p,JSON.stringify(products),(err)=>{
//                         console.log(err);
//                     });
//             }
//         })
//     } 


//     static fetchAll(cb){
//         getProductFromFiel(cb);
//     }
    
    

//     static findById(id,cb){
//         getProductFromFiel(products=>{
//             const product=products.find(prod=>prod.id === id);
//             cb(product);
//         })
//     }

    
//     static deleteById(id){
//         getProductFromFiel(products=>{
//             const product=products.find(prod=>prod.id===id)
//             const Updateproduct=products.filter(prod=>prod.id !== id);
//             fs.writeFile(p,JSON.stringify(Updateproduct),err=>{
//                 if(!err){
//                     Cart.deleteProduct(id,product.price)
//                 }
//             })
//         })
//     }
// }


// const Cart=require('./cart')

// const db=require('../util/database');

// module.exports=class Product{
//     constructor(id,t,p,d){
//         this.title=t;
//         this.price=p;
//         this.description=d;
//         this.id=id;
//     }

//     Save(){
//         return db.execute('INSERT INTO products (title,price,description) VALUES (?,?,?)'
//         ,[this.title,this.price,this.description]);
//     }

//     static fetchAll(){
//         return db.execute('SELECT * FROM products')
//     }

//     static findById(id){
//         return db.execute('SELECT * FROM products WHERE products.id = ?',[id])
//     }

//     static deleteById(id){
//         return db.execute('DELETE * FORM products')
//     }
// }



// const Sequelize=require('sequelize');

// const sequelize=require('../util/database');

// const Product=sequelize.define('product',{
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     title:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
//     price:{
//         type:Sequelize.DOUBLE,
//         allowNull:false
//     },
//     description:{
//         type:Sequelize.STRING,
//         allowNull:false
//     }
// });


// module.exports=Product;


// with mongodb

// const GetDb=require('../util/database').getDb;

// const mongodb=require('mongodb');

// class Product{
//     constructor(title,price,description,id,userId){
//         this.title=title;
//         this.price=price;
//         this.description=description;
//         this._id=id ?new mongodb.ObjectId(id):null;
//         this.userId=userId;
//     }

//     Save(){
//         const db=GetDb();
//         let dbOp;
//         if(this._id){
//             dbOp=db
//             .collection('products')
//             .updateOne({ _id:this._id } , { $set: this } );
//         }else{
//             dbOp=db
//             .collection('products')
//             .insertOne(this);
//         }
//         return dbOp
//         .then(result=>{
//             console.log("this is results",result);
//         })
//         .catch(err=>{
//             console.log(err);
//         })
//     }

//     static fetchAll(){
//         const db=GetDb();
//         return db.collection('products')
//         .find()
//         .toArray()
//         .then(products=>{
//             console.log(products);
//             return products;
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     } 

//     static findById(prodId){
//         const db=GetDb();
//         return db.collection('products')
//         .find({_id:new mongodb.ObjectId(prodId)})
//         .next()
//         .then(product=>{
//             console.log(product)
//             return product
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     }

//     static deleteById(prodId){
//         const db=GetDb();
//         return db.collection('products')
//         .deleteOne({_id:new mongodb.ObjectId(prodId)})
//         .then(()=>{
//             console.log('Done')
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     }
// }
// module.exports=Product;

const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const productsSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imgUrl:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports=mongoose.model('Product',productsSchema);