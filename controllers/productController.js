const productdatas = require('../models/productMongo')
const categorydtatas = require('../models/categoryMongo')


// productlist page loading for adming 
const loadproductlist = async (req,res) =>{
      try {
        const currentPage = parseInt(req.query.page) || 1
        const productData = await productdatas.find({})
        res.render('page-products-list',{productData,currentPage})
      } catch (error) {
        console.log(error.message);
      }
}

 
// product adding page loading for admin 
const loadaddproductpage = async (req,res)=>{
    try {
         const categoryData =  await categorydtatas.find({})
        res.render('page-addproduct',{categoryData})
    } catch (error) {
        console.log(error.message);
    }
}

 
// adding a produact by admin 
const addproduct = async (req,res)=>{
    try {
            const images = [];
    for (let i = 0; i < req.files.length; i++) {
      images.push(req.files[i].filename);
    }
            const product = new productdatas({
                prdctname:req.body.name,
                prdctdescription:req.body.description,
                prdctprice:req.body.price,
                prdctofferprice:req.body.offerprice,
                prdctcategory:req.body.category,
                prdctstock:req.body.stock,
                prdctimage:images
            })
            await product.save()
            res.redirect('/admin/adminhome/addproduct')
     } catch (error) {
        console.log(error.message);
    }   
}


// edit product page loading for admin
const loadeditproduct = async (req,res)=>{
    try {
        const id = req.query.id
        const product = await productdatas.findOne({_id : id})
        const categoryData = await categorydtatas.find({})
          res.render('edit-product',{product,categoryData})
    } catch (error) {
        console.log(error.message);
    }
}


// edit a product by admin 
const editproduct = async (req,res)=>{
    try {
        const id = req.query.id
        const images=[]
        const product = await productdatas.findOne({_id : id})
        for (let i = 0; i < req.files.length; i++) {
            images.push(req.files[i].filename);
          }
        for (let i = 0; i < product.prdctimage.length; i++) {
            images.push(product.prdctimage[i]);
          }
          const updateproduct = await productdatas.findByIdAndUpdate({_id:id},{
            $set:{
                prdctname:req.body.name,
                prdctdescription:req.body.description,
                prdctprice:req.body.price,
                prdctofferprice:req.body.offerprice,
                prdctcategory:req.body.category,
                prdctstock:req.body.stock,
                prdctimage:images
            }
          })
          if(updateproduct){
            res.redirect('/admin/adminhome/productlist')
          }
    } catch (error) {
        console.log( error.message);
    }
} 

 
// blocking a product by admin 
 const unlistproduct = async (req,res)=>{
    try {
        const id = req.query.id
        const productData = await productdatas.find({})
        const unlisted = await productdatas.findByIdAndUpdate({_id:id},{
            $set:{
                prdctislisted:false
            }
        })    
        res.redirect('/admin/adminhome/productlist')
    } catch (error) {
        console.log(error.message);
    }
 }              


// unblocking a product by admin
 const listproduct = async (req,res)=>{
      try {
        const id = req.query.id
        const productData = await productdatas.find({})
        const listed = await productdatas.findByIdAndUpdate({_id:id},{
            $set:{
                prdctislisted:true
            }
        })
            res.redirect('/admin/adminhome/productlist')
      } catch (error) {
        console.log(error.message);
      }
 }

//  
 const deleteimage = async (req,res)=>{
    try {
        const id = req.query.id
        const product = req.query.imgname
        const categoryData = await categorydtatas.find({})
        const updatedProduct = await productdatas.findByIdAndUpdate(
            id,
            { $pull: { prdctimage: product } },
            { new: true } // To get the updated product
          );          
        res.redirect('/admin/adminhome/productlist')
     } catch (error) {
     console.log(error.message);   
    }
 }
 
// exporting all controllers
module.exports={
    loadproductlist,
    loadaddproductpage,
    addproduct,
    loadeditproduct,
    editproduct,   
    unlistproduct,
    listproduct ,
    deleteimage
}

 