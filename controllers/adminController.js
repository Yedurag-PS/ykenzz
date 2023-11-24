const admindatas = require('../models/adminMongo')
const userdatas = require('../models/userMongo')
const orderdatas = require ('../models/orderMongo')



//admin login page loading
 const loadadminlogin = (req,res)=>{
     try {
      if(req.session.admin){
         res.redirect('/admin/adminhome')
      }
      
        res.render('adminlogin')
      
    } catch (error) {
        console.log(error.message);
    }
 }

 
// admin verifying to adminpage
 const verifyadmindata = async (req,res)=>{
   try {
   if(req.session.admin){
      res.redirect('/admin/adminhome')
      console.log("haaai2");
   } 
   const Adminname = req.body.adminname
   const Adminpassword = req.body.adminpassword

   const admindetails = await admindatas.findOne({adminname : Adminname})

   if(admindetails){

      if (admindetails.adminpassword=== Adminpassword){
         req.session.admin = admindetails
         res.redirect('/admin/adminhome')
      }else{
         // invalid password
         var err = "Password is Incorrect"
         res.render('adminlogin',{err})
      }
      
       }else{
      // invalid username
        var err = " Usename is Inacorrect"
        res.render('adminlogin',{err})   
       }
      
    }
   catch (error) {
      console.log(error.message);  
   }
}


// loading admin home page 
const loadadminhome = async(req,res)=>{  
   try {
      if(req.session.admin){

         const today1 = new Date();
         const currentMonth = today1.getMonth() + 1; // +1 because months are 0-based
 
        const monthlySales = await orderdatas.aggregate([
         {
          $match: {
          delevery_status: "Delivered",
          order_date: {
          $lte: today1 // Only include orders up to the current date
            }
         }
       },
      {
        $group: {
         _id: {
          $month: '$order_date'
         },
         count: { $sum: 1 }
       }
     },
     {
       $sort: {
         '_id': 1
       }
     }   
    ]);
      
      const monthlySalesArray = Array.from({ length: currentMonth }, (_, index) => {
        const monthData = monthlySales.find((item) => item._id === index + 1);
        return monthData ? monthData.count : 0;
      });
 
 
 
 
         const today = new Date();
         const lastYear = new Date(today);
         lastYear.setFullYear(lastYear.getFullYear() - 1);
         
         const monthlySalesPreviousYear = await orderdatas.aggregate([
           {
             $match: {
               delivery_status: "Delivered",
               order_date: {
                 $gte: new Date(lastYear.getFullYear() - 1, 0, 1),
                 $lt: new Date(lastYear.getFullYear(), 0, 1)
               }
             }
           },
           {
             $group: {
               _id: {
                 $month: '$order_date'
               },
               count: { $sum: 1 }
             }
           },
           {
             $sort: {
               '_id': 1
             }
           }
         ]);
         
         const monthlySalesArrayPreviousYear = Array.from({ length: 12 }, (_, index) => {
           const monthData = monthlySalesPreviousYear.find((item) => item._id === index + 1);
           return monthData ? monthData.count : 0;
         });

         const revenue = await orderdatas.aggregate([
            {
                $match: {
                    delevery_status: "Delivered",
                },
            },
            {
                $group: {
                    _id: null,
                    totalprice: { $sum: { $toDouble: "$total_price" } },
                    count: { $sum: 1 },
                },
            },
        ]);

        const usercount = await userdatas.countDocuments()
          res.render('indexadmin',{monthlySalesArray,revenue,usercount})  

      }else{
         res.redirect('/admin')
      }
   } catch (error) {
      console.log(error.message);
   }
}

// logout by admin
const adminlogout = async (req,res)=>{
   try {
      if(req.session.admin){
         req.session.destroy()
         res.redirect('/admin')
      }
      
   } catch (error) {
      console.log(error.message);
   }
}

 

 

module.exports = {
     loadadminlogin,
     loadadminhome, 
     verifyadmindata,
     adminlogout,
}          