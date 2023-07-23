const {validationResult}=require('express-validator')
const Product=require('../models/product');
const fileHelper=require('../util/file.js')
exports.getAddProduct=(req,res,next)=>{
    res.render('admin/edit-product',
    {docTitle: 'Add Products'
    , path:'/admin/add-product'
    , edite:false
    ,hasError:false
    ,validationError:null
    ,erorrMessage:null
  })
}

exports.postAddProduct=(req,res,next)=>{
    // product.push({title:req.body.title});
    const title=req.body.title;
    const price=req.body.price;
    const image=req.file;
    const description=req.body.description;
    console.log("image",image)
    if(!image){
        return res.status(422).render('admin/edit-product',
        {docTitle: 'Add Products'
        , path:'/admin/add-product'
        , edite:false
        ,hasError:true
        ,validationError:[]
        ,erorrMessage:'attached file is not image'
        ,product:{
            title:title,
            price:price,
            description:description
        }
    })
    }
    
    const errors=validationResult(req)
    // const product=new Product(null,title,price,description);
    // req.user
    // .createProduct({
    //     title:title,
    //     price:price,
    //     description:description
    // })
    // const product=new Product(title,price,description,null,req.user._id );
    if(!errors.isEmpty()){
        return res.status(422)
            .render('admin/edit-product',
            {docTitle: 'Add Products'
            , path:'/admin/add-product'
            , edite:false
            ,hasError:true
            ,validationError:errors.array()[0].param
            ,erorrMessage:errors.array()[0].msg
            ,product:{
                title:title,
                price:price,
                description:description
            }
        })
    }
    const imgUrl=image.path;
    const product=new Product({
        title:title
        ,price:price,
        imgUrl:imgUrl
        ,description:description
        ,userId:req.user
    })
    product.save()
    .then(result=>{
        res.redirect('/admin/products')
    }).catch(err=>{
        console.log(err)     
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    });
    // product.Save()
    // .then(()=>{
    //     res.redirect('/')
    // })
    // .catch( err => console.log(err));
}

exports.getEditProduct=(req,res,next)=>{
    const editingMode=req.query.edite;
    if(!editingMode){
        return res.redirect('/');
    }
    const prodId=req.params.productId;
    // Product.findByPk(prodId)
    // req.user.getProducts({where:{id:prodId}})
    Product.findById(prodId)
    .then(product=>{
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product'
        ,{docTitle: 'Edit Product'
        ,path:'/admin/edit-product'
        ,edite:editingMode
        ,product:product
        ,hasError:false
        ,validationError:null
        ,erorrMessage:null
        })
    }).catch(err=>{
        console.log(err)
        // const error=new Error(err);
        // error.httpStatusCode=500;
        // return next(error);
    })
}
exports.postEditProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    const updateTitle=req.body.title;
    const updatePrice=req.body.price;
    const updateImage=req.file;
    const updateDescription=req.body.description;
    const errors=validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(422)
            .render('admin/edit-product',
            {docTitle: 'Edit Products'
            , path:'/admin/edit-product'
            , edite:true
            ,hasError:true
            ,validationError:errors.array()[0].param
            ,erorrMessage:errors.array()[0].msg
            ,product:{
                title:updateTitle,
                price:updatePrice,
                description:updateDescription,
                _id:prodId
            }
        })
    } 
    Product.findById(prodId)
    .then(product=>{
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/')
        }
        product.title=updateTitle
        product.price=updatePrice
        if(updateImage){
            fileHelper.deleteFile(product.imgUrl)
            product.imgUrl=updateImage.path
        }
        product.description=updateDescription
        return product.save().then(result=>{
            console.log('Done')
            res.redirect('/admin/products');
        })
    })
    .catch(err=>{
        // res.redirect('/500')
        console.log(err)
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    });
    // const updateProdcut=new Product(updateTitle,updatePrice,updateDescription,prodId)
    // updateProdcut.Save().then(()=>{
    //     res.redirect('/admin/products');
    // }).catch(err=>console.log(err));
}

exports.getadminProducts=(req,res,next)=>{
    // Product.findAll()
    // req.user.getProducts()
    // Product.fetchAll()
    Product.find({userId:req.user._id})
    // .select('title _id')
    // .populate('userId',"name")
    .then(rows=>{
        console.log(rows)
        res.render('admin/product-list',
        {prods:rows
        ,docTitle:'Admin Product'
        ,path:'/admin/products'
    })
    })
    .catch(err=>{
        console.log(err)
        const error=new Error(err);
        error.httpStatusCode=500;
        return next(error);
    });
}
exports.deleteProduct=(req,res,next)=>{
    const prodId=req.params.productId;
    // Product.findByIdAndRemove(prodId)
    Product.findById(prodId)
    .then(product=>{
        if(!product){
            return next(new Error('no have product'))
        }
        fileHelper.deleteFile(product.imgUrl);
        product.deleteOne({_id:prodId,userId:req.user._id})
    })
    .then(()=>{
        res.status(200).json({message:'the product is deleting'})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({message:'the deleting is failed'})
        // const error=new Error(err);
        // error.httpStatusCode=500;
        // return next(error);
    });

    // Product.destroy({where:{id:prodId}}).then(()=>{
    //         res.redirect('/admin/products')
    // }).catch(err=>console.log(err));
    
    // Product.deleteById(prodId).then(()=>{
    //     res.redirect('/admin/products')
    // }).catch(err=>console.log(err));
}