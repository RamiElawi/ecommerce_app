const Product=require('../models/product')
const Cart=require('../models/cart')
const Order=require('../models/order')
const cartItem = require('../models/cart-Item')
const { populate } = require('../models/user')
const fs=require('fs');
const path=require('path')
const PDFdocumetn=require('pdfkit')
const { sensitiveHeaders } = require('http2')
const stripe=require('stripe')('sk_test_51LkrmJHr5O4xNa164Fei9zYV60hJ4tdu951vjvNN4o7RqX5N4ABLGdqzyt3qm12QyKi7SmuIeoShhIgeqLqbydBj00RNk02B0J')
let ITEM_PER_PAGE=1;
exports.getProducts=(req,res,next)=>{
    const page=+req.query.page || 1;
    let totalItem;
    // console.log(adminData.products)
    // res.sendFile(path.join(__dirname,'..','views','shop.html'))
    // const products=adminData.products;
    // Product.fetchAll()
    Product.find().countDocuments()
    .then(numberProdut=>{
        totalItem=numberProdut;
        return Product.find()
        .skip((page-1)*ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
    })
    .then(product=>{
        res.render('shop/product-list'
        ,{prods:product
        ,docTitle:'Products'
        ,path:'/products'
        ,currentPage:page
        ,hasNextPage:ITEM_PER_PAGE * page < totalItem
        ,hasPreviousPage:page > 1
        ,nextPage:page + 1
        ,previousPage:page - 1
        ,lastPage:Math.ceil(totalItem / ITEM_PER_PAGE)
    })
    }).catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })
    
    // Product.fetchAll()
    // .then(([rows,fieldData])=>{
    //     res.render('shop/product-list',{prods:rows,docTitle:'All Products',path:'/products'})
    // })
    // .catch(err=>console.log(err));
}
exports.getProductId=(req,res,next)=>{
    const prodId=req.params.productId;
    // Product.findAll({where:{id:prodId}})
    Product.findById(prodId)
    // Product.findOne()
    .then(product=>{
        res.render('shop/product-detail'
        ,{product:product
        ,docTitle:product.title
        ,path:'/products'})
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    });
    // Product.findByPk(prodId)
    // .then(rows=>{
    //     res.render('shop/product-detail',{product:rows,docTitle:rows.title,path:'/products'})
    // })
    // .catch(err=>console.log(err));
}

// 
exports.getCart=(req,res,next)=>{
    req.user
    // .getCart()
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user=>{
        // return cart.getProducts()
        // .then(productCart=>{
        const product=user.cart.items
        res.render('shop/cart',
            {docTitle:'Your Cart'
            ,path:'/cart',
            Products:product
            // totalPrice:cart.totalPrice
            })
        }).catch(err=>{
            const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
        })
    // })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })

    // Cart.getCart(cart=>{    
    //     const Productcart=[];
    //     Product.fetchAll(products=>{
    //         for ( item of products) {
    //             const cartProductData=cart.product.find(prod=>prod.id === item.id);
    //             if(cartProductData){
    //                 Productcart.push({productData:item , qty: cartProductData.qty})
    //             }
    //         }
    //         res.render('shop/cart',
    //         {docTitle:'Your Cart'
    //         ,path:'/cart',
    //         Products:Productcart,
    //         totalPrice:cart.totalPrice
    //         })
    //     })
    // })

}

exports.postCart=(req,res,next)=>{
    const prodId=req.body.productId;
    Product.findById(prodId)
    .then(product=>{
        return req.user.addToCart(product);
    }).then(result=>{
        res.redirect('/cart');
        console.log(result)
    }).catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })
    // let fetchedCart;
    // let newQuantity=1;
    // let totalPrice=0;
    // req.user.getCart()
    // .then(cart=>{
    //     fetchedCart=cart;
    //     return cart.getProducts({where:{id:prodId}})
    // })
    // .then(products=>{
    //     let product;
    //     if(products.length>0){
    //         product=products[0];
    //     }
    //     if(product){
    //         const oldQuantity=product.cartItem.quantity
    //         newQuantity=oldQuantity + 1;
    //         return product
    //     }
    //     return Product.findByPk(prodId) 
    // })
    // .then(product=>{
    //     totalPrice= newQuantity * product.price
    //     return fetchedCart.addProduct(product,{
    //         through:{quantity:newQuantity,price:totalPrice}
    //     });
    // })
    // .then(()=>{
    //     res.redirect('/cart');
    // })
    // .catch(err=>console.log(err))

    // Product.findById(prodId).then(([rows])=>{
    //     Cart.addProduct(prodId,product.price);
    // }).catch(err=>console.log(err));
    // res.redirect('/cart')
}

exports.getIndex=(req,res,next)=>{
    // Product.findAll()
    // Product.fetchAll()
    const page=+req.query.page || 1;
    let totalItem;
    Product.find().countDocuments()
    .then(numberProdut=>{
        totalItem=numberProdut;
        return Product.find()
        .skip((page-1)*ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
    })
    .then(product=>{
        res.render('shop/index'
        ,{prods:product
        ,docTitle:'Shop'
        ,path:'/'
        ,currentPage:page
        ,hasNextPage:ITEM_PER_PAGE * page < totalItem
        ,hasPreviousPage:page > 1
        ,nextPage:page + 1
        ,previousPage:page - 1
        ,lastPage:Math.ceil(totalItem / ITEM_PER_PAGE)
    })
    }).catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    });
    // Product.fetchAll()
    // .then(([rows,fieldData])=>{
        //     res.render('shop/index',{prods:rows,docTitle:'Shop',path:'/'})
    // })
    // .catch(err=>console.log(err));
    
}
exports.getCheckout=(req,res,next)=>{
    let product;
    let total=0;
    req.user
    .populate('cart.items.productId')
    .then(user=>{
        product=user.cart.items
        total=0;
        product.forEach(p=>{
            total+=p.quantity*p.productId.price
        })

        return stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:product.map(p=>{
                return {
                    name:p.productId.title,
                    description:p.productId.description,
                    amount:p.productId.price * 100,
                    currency:'usd',
                    quantity:p.quantity
                }
            }),
            success_url:req.protocol+'://'+req.get('host')+'/checkout/success',
            cancel_url:req.protocol+'://'+req.get('host')+'/checkout/cancel'
        })

        
        })
        .then(session=>{
            res.render('shop/checkout',
            {docTitle:'Checkout'
            ,path:'/checkout',
            Products:product,
            totalPrice:total,
            sessionId:session.id
        })
        })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })

}
exports.postdeleteCart=(req,res,next)=>{
    const prodId=req.body.productId;
    // .then(cart=>{
        // return cart.getProducts({where:{id:prodId}});
        // })
        // .then(products=>{
            // const product=products[0];
            // return product.deleteOne()
            // })
    req.user.removeFromCart(prodId)
    .then(()=>{
            res.redirect('/cart')
        })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })
    // Product.findById(prodId)
    // .then(([rows])=>{
    //     Cart.deleteProduct(prodId,rows.price)
    //     res.redirect('/cart')
    // })
    // .catch(err=>console.log(err)) ;
}
// exports.postOrder=(req,res,next)=>{
exports.getCheckoutsuccess=(req,res,next)=>{
    // let fetchedCart;
    // req.user
    // .getCart()
    // .then(cart=>{
    //     fetchedCart=cart;
    //     return cart.getProducts()
    // })
    // .then(products=>{
    //     return req.user.createOrder()
    //     .then(order=>{
    //         return order.addProducts(products.map(product=>{
    //             product.orderItem={quantity:product.cartItem.quantity};
    //             return product;
    //         }))
    //     })
    //     .catch(err=>console.log(err))
    // })
    // .then(()=>{
    //     return fetchedCart.setProducts(null);
    // })
    // .addOrder()
    // with mongooes

    req.user
    .populate('cart.items.productId')
    .then(user=>{
        const product=user.cart.items.map(i=>{
            return {quantity:i.quantity,product:{...i.productId._doc}}
        })
        const order=new Order({
            user:{
                email:req.user.email,
                userId:req.user
            },
            products:product
        })
        return order.save()
    }).then(()=>{
        req.user.clearCart()
    })
    .then(()=>{
        res.redirect('/orders')
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })
}
exports.getOrders=(req,res,next)=>{
    Order.find({'user.userId':req.user._id})
    // .getOrders()
    // .getOrders({include:['products']})
    .then(orders=>{
        res.render('shop/orders',{docTitle:'Your Orders',path:'/orders',orders:orders})
    })
    .catch(err=>{
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    })
}
exports.getInvoice=(req,res,next)=>{
    const orderId=req.params.orderId;
    Order.findById(orderId)
    .then(order=>{
        if(!order){
            return next(new Error('No order Found'))
        }
        if(order.user.userId.toString() !== req.user._id.toString()){
            return next(new Error('unauthorized'))
        }
        const invoiceName='invoice-' + orderId + '.pdf';
        res.setHeader('content-type','application/pdf')
        res.setHeader('content-Disposition','attachment; filename="'+invoiceName+'"')
        const invoicePath=path.join('data','invoices',invoiceName)
        const pdfDoc=new PDFdocumetn()
        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res)
        pdfDoc.fontSize(26).text('Invoice',{underline:true})
        pdfDoc.text('----------------------')
        let totalPrice=0;
        order.products.forEach(p=>{
            totalPrice+=p.quantity * p.product.price  
            pdfDoc.text(`${p.product.title} - ${p.quantity} x $${p.product.price}`)
        })
        pdfDoc.text(`------`)
        pdfDoc.text(`Totlal Price = $${totalPrice}`)
        pdfDoc.end()
        // fs.readFile(path.join('data','invoices',invoiceName),(err,data)=>{
        // if(err){
        //     return next(err)
        // }
        // res.setHeader('content-type','application/pdf')
        // res.setHeader('content-Disposition','attachment; filename="'+invoiceName+'"')
        // res.send(data)

        // const file =fs.createReadStream(invoicePath)
        // res.setHeader('content-type','application/pdf')
        // res.setHeader('content-Disposition','attachment; filename="'+invoiceName+'"')
        // file.pipe(res)
    })
    .catch(err=>{
        next(err)
    })
    
}