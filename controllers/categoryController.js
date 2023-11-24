const categorydatas = require('../models/categoryMongo')
 


// category addingpage loading for admin
const loadcategory = async (req,res)=>{
    try {
        res.render('page-categories')
    } catch (error) {
        console.log(error.message);
    }
}  

// addmin category by admin
const addcategory = async (req,res)=>{
    try {
      const categoryDetails = await categorydatas.findOne({Categoryname: {$regex : req.body.categoryname , $options:'i'}})
        if(categoryDetails){
            res.render('page-categories')
        }else{
           
            const category = new categorydatas ({
                Categoryname : req.body.categoryname,
                Categoryimage:req.file.filename
            }) 
            category.save()
            res.redirect('/admin/adminhome/addcategories')
        }
    } catch (error) {
        console.log(error.message);
    }
}



// category list page loadin for adminn
const loadcategorylist = async (req,res)=>{
    try {
        const categoryData = await categorydatas.find({})
        res.render('page-categories-list',{categoryData})
    } catch (error) {
        console.log(error.message);
    }
}

// category edit page loading for admin 

const loadEditCategory = async (req,res)=>{
    try {
        const id = req.query.id
         const category = await categorydatas.find({_id:id})
         res.render('edit-category',{category})
    } catch (error) {
        console.log(error.message); 
    }
}

// edit category by admin by admin 
const editctegory = async (req,res)=>{
    try {
        const id = req.query.id
        const updateCategory = await categorydatas.findByIdAndUpdate({_id:id},{
        $set :{
            Categoryname : req.body.categoryname,
            Categoryimage:req.file.filename
        }
    })
    if(updateCategory){
        res.redirect('/admin/adminhome/categorylist')
    }
        
    } catch (error) {
        console.log(error.message);
    }
}


// category blocking by admin 
const categoryunlisted = async (req,res)=>{
    try {
        const id = req.query.id
        const categoryData = await categorydatas.find({})
        const unlisted = await categorydatas.findByIdAndUpdate({_id:id},{
            $set:{
             Categoryislisted:false
            }
        })
            res.redirect('/admin/adminhome/categorylist')
    } catch (error) {
        console.log(error.message);
    }
}

// category unblocking by admin 
const categorylisted = async (req,res)=>{
    try {
        const id = req.query.id
        const categoryData = await categorydatas.find({})
        const unlisted = await categorydatas.findByIdAndUpdate({_id:id},{
            $set:{
             Categoryislisted:true
            }
        })
        res.redirect('/admin/adminhome/categorylist')
    } catch (error) {
        console.log(error.message);
    }
}





// exporting the functions 
module.exports ={
    loadcategory,
    addcategory,
    loadcategorylist,
    loadEditCategory,
    editctegory,
    categoryunlisted,
    categorylisted
}


