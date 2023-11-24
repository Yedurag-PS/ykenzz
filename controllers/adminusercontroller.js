const userdatas = require('../models/userMongo')






// registered sers listpage loading foe admin   

const loaduserslist = async (req,res)=>{
    try {
      let page = parseInt(req.query.page);
       let limit = 4
      let skip = page * 4
      const userData = await userdatas.find({}).skip(skip).limit(limit)    
       res.render('userslist',{userData,page})
    } catch (error) {
       console.log(error.message);
    }
 }
 
 
 


 //user unblocking by admin
 const userlist = async (req,res)=>{
   try {
      let page = parseInt(req.query.page);
       let limit = 4
      let skip = page * 4
      const id = req.query.id
       const userData = await userdatas.find({}).skip(skip).limit(limit)    

      const userunlisted = await userdatas.findByIdAndUpdate({_id:id},{
         $set:{
            isListed:true
         }
      })
       res.render('userslist',{userData,page})

   } catch (error) {
      console.log(error.message);   
   }
 }


 //user blocking by admin
 const userunlist = async (req,res)=>{
   try {
      let page = parseInt(req.query.page);
       let limit = 4
      let skip = page * 4
      
      const id = req.query.id
      const userData = await userdatas.find({}).skip(skip).limit(limit)    
      const userunlisted = await userdatas.findByIdAndUpdate({_id:id},{
         $set:{
            isListed:false
         }
      })
      if( req.session.user){
         req.session.destroy()
      }
       res.render('userslist',{userData,page})

   } catch (error) {
      console.log(error.message);
   }
 }




// exporting all controllers
 module.exports = {
    loaduserslist,
    userunlist,
    userlist
 }