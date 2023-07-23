const express=require('express');

const path=require('path');

const router=express.Router();

const adminController=require('../controllers/admin');

const isAuth=require('../middelware/is-auth')

const {body}=require('express-validator')
// /admin/add-proudct => GET
router.get('/add-product',isAuth,adminController.getAddProduct);

// /admin/add-proudct => POST
router.post('/add-product',
[
    body('title')
    // .isAlphanumeric()
    .isLength({min:3})
    .trim(),
    body('price')
    .isFloat()
    // body('UrlImage')
    // .isURL()
    ,
    body('description')
    .isLength({min:5,max:500})
    .trim()

]
,isAuth,adminController.postAddProduct);
// I add That
router.get('/products',isAuth,adminController.getadminProducts);

router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);

router.post('/edit-product',
[
    body('title')
    // .isAlphanumeric()
    .isLength({min:3})
    .trim(),
    body('price')
    .isFloat()
    // body('UrlImage')
    // .isURL()
    ,
    body('description')
    .isLength({min:5,max:500})
    .trim()
]
,isAuth,adminController.postEditProduct);

router.delete('/product/:productId',isAuth,adminController.deleteProduct)

module.exports=router;