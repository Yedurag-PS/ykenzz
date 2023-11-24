const coupondatas = require('../models/couponMongo')



// loading addcoupon page for admin
const loadAddCouponPage = async (req,res)=>{
    try {
   res.render('addcoupon')
    } catch (error) {
        console.log(error.message);
    }
}


// add coupon by admin
const addCoupon = async (req,res)=>{
    try {
        const check = req.body.code
        const exist = await coupondatas.findOne({couponCode:check})

        if(exist){
            res.render('addcoupon',{msg:"This coupon already Exist"})
        }else{
           const coupon = new coupondatas ({
            couponCode:req.body.code,
            start_date:req.body.date,
            expired_date:req.body.expdate,
            coupon_descount:req.body.descount
           })
              await coupon.save()
              setTimeout(() => {
                res.redirect('/admin/adminhome/addcoupon')

              },1500);
        }
    } catch (error) {
        console.log(error.message);
    }
}


// coupon list loading for admin
const couponList = async(req,res)=>{
    try {
        const coupon = await coupondatas.find({})
        res.render('coupon-list',{coupon})
    } catch (error) {
        console.log(error.message);
    }
}

// delete coupon by admin
const deleteCoupon = async (req,res)=>{
    try {
        const id = req.query.id
       const deletecoupon = await coupondatas.findByIdAndDelete(id);
       if(!deletecoupon){
        return res.status(404).send('Coupon not found');
       }
       res.redirect('/admin/adminhome/couponlist')
    } catch (error) {
        console.log(error.message);
    }
}

 
// exporting all controllers
module.exports = ({
    loadAddCouponPage,
    addCoupon,
    couponList,
    deleteCoupon
     
})   