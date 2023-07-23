// const fs=require('fs');
// const path=require('path');
// const p=path.join(path.dirname( process.mainModule.filename),'data','cart.json')

// module.exports=class Cart{
//     static addProduct(id,productPrice){
//         fs.readFile(p,(err,fileContent)=>{
//             let cart={product:[],totalPrice:0};
//             if(!err){
//                 cart=JSON.parse(fileContent);
//             }
//             const exsistingProdctIndex=cart.product.findIndex(prod=>prod.id === id);
//             const exsistingProdct=cart.product[exsistingProdctIndex];
//             let updatedProduct;
//             if(exsistingProdct){
//                 updatedProduct={...exsistingProdct};
//                 updatedProduct.qty += 1;
//                 cart.product=[...cart.product];
//                 cart.product[exsistingProdctIndex]=updatedProduct
//             }else{
//                 updatedProduct={id:id,qty:1};
//                 cart.product=[...cart.product,updatedProduct]
//             }
//             cart.totalPrice += +productPrice;
//             fs.writeFile(p,JSON.stringify(cart),(err)=>{
//                 console.log(err);
//             })
//         })
//     }

//     static deleteProduct(id,priceProduct){
//         fs.readFile(p,(err,fileContent)=>{
//             if(err){
//                 return;
//             }
//             const updateCart={...JSON.parse(fileContent)};
//             const product= updateCart.product.find(prod=>prod.id===id);
//             if(!product){
//                 return;
//             }
//             const productQty=product.qty;
//             updateCart.product=updateCart.product.filter(prod=>prod.id!==id);
//             updateCart.totalPrice=updateCart.totalPrice - priceProduct * productQty;
//             fs.writeFile(p,JSON.stringify(updateCart),(err)=>{
//                 console.log(err);
//             })

//         })
//     }

//     static getCart(cb){
//         fs.readFile(p,(err,fileContent)=>{
//             const cart=JSON.parse(fileContent);
//             if(err){
//                 cb(null);
//             }else{
//                 cb(cart);
//             }
//         })
//     } 
// }

const Sequelize=require('sequelize');

const sequelize=require('../util/database');

// const cartItem=sequelize.define('cartItem',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },
//     quantity:Sequelize.INTEGER,
//     price:Sequelize.DOUBLE
// }
// );

// module.exports=cartItem;
