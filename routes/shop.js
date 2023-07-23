const express=require('express');
const path=require('path');
const router=express.Router();
const shopController=require('../controllers/shop')
const isAuth=require('../middelware/is-auth')

router.get('/',shopController.getIndex);

// I am add That

router.post('/cart',isAuth,shopController.postCart)

router.get('/cart',isAuth,shopController.getCart)

router.post('/cart-delete-item',isAuth,shopController.postdeleteCart)

router.get('/orders',isAuth,shopController.getOrders)

router.get('/products',shopController.getProducts);

router.get('/products/:productId',shopController.getProductId);

router.get('/checkout',isAuth,shopController.getCheckout);

router.get('/checkout/success',isAuth,shopController.getCheckoutsuccess)

router.get('/checkout/cancel',isAuth,shopController.getCheckout)

// router.post('/create-order',isAuth,shopController.postOrder)

router.get('/order/:orderId',isAuth,shopController.getInvoice);


module.exports=router;