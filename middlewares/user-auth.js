 
 
const islogin = async (req,res,next)=>{
   try {
    if(req.session.user){
        next()
    }else{
        res.redirect('/login')
    }       
   } catch (error) {
    console.log(error.message);
   }
}

const islogout = async (req,res,next)=>{
    try {
        if(req.session.user){
            res.redirect('/login')
        }else{
             next()
        }   
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    islogin,
    islogout  
}