const bannerdatas = require('../models/bannerModel')

// loading banner page foe admin
const loadAddBannerpage = async (req,res)=>{
    try {
        res.render('addbanner')
    } catch (error) {
        console.log(error.message);
    }
}


// adding banner by admin
const addBanner = async (req,res)=>{
    try {
         const banner = new bannerdatas ({
            description:req.body.banner,
            Image:req.file.filename
        })
        banner.save()
        res.redirect('/admin/adminhome/bannerpage')
    } catch (error) {
        console.log(error.message);
    }
}
const  loadBannerList = async (req,res)=>{
    try {
        const banner = await bannerdatas.find({})
        res.render('banner-list',{banner})
    } catch (error) {
       console.log(error.message); 
    }
}

// loading editbanner page for admin
const loadEditBannerPage = async (req,res)=>{
    try {
        const id = req.query.id
        const banner = await bannerdatas.findOne({_id:id})   
         res.render('edit-banner',{banner})
    } catch (error) {
        console.log(error.message);
    }
}


// Uodate banner by admin
const updateBanner = async (req,res)=>{
    try {
        const id = req.query.id
        const updatebanner = await bannerdatas.findByIdAndUpdate({_id:id},{
            $set: {
                description:req.body.banner,
                Image  : req.file.filename
            }
        })   
       res.redirect('/admin/adminhome/bannerlist')
     } catch (error) {
        console.log(error.message);
    }
}


 
// deleting banner by admin
const deleteBanner = async (req, res) => {
    try {
      const id = req.query.id;
      const deletebanner = await bannerdatas.findByIdAndDelete(id);
      if (!deletebanner) {
        return res.status(404).send('Banner not found');
      }
      res.redirect('/admin/adminhome/bannerlist'); // Redirect to the banner list page after deletion
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Error deleting the banner');
    }
  };
  

// exporting all controllers
module.exports = {
 loadAddBannerpage,
 addBanner,
 loadBannerList,
 loadEditBannerPage,
 updateBanner,
 deleteBanner
}