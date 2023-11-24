const orderdatas = require('../models/orderMongo')



// order listpage shows for admin
const loadOrderpage =  async (req,res)=>{
    try {
     const orderData = await orderdatas.find()
      res.render('page-orders-1',{orderData})  
    } catch (error) {
        console.log(error.message);
    }
}

// order detail page for a specific order for admin
const loaddetailpage  =  async  (req,res)=> {
    try {
        const id =  req.query.id
        const order = await orderdatas.findOne({_id:id})

        res.render('page-orders-detail',{order})  
    } catch (error) {
        console.log(error.message);    
    }
}


// order stautus changed by admin
const adminchanginStatus = async (req,res)=>{
    try {
        
        const status = req.body.status
        const order_id = req.body.orderID  
         const order = await orderdatas.updateOne(
            {
                _id:order_id
            },
            {$set:{delevery_status : status}}
        ) 
        res.json({status : true})   
        
     } catch (error) {
        console.log(error.message);
    }
}

const salesriport =  async (req,res)=>{
    try {
        const order = await orderdatas.find({
            $or : [
                { delevery_status:"Delivered"},
                {payment_type :"Razorpay"}
            ]
        })
        res.render('salesreport',{order})
    } catch (error) {
        console.log(error.message);
    }
}



const salesReport = async (req, res) => {
    try {
        const date = req.query.date;
        console.log(date,"222222222222");
        let orders;

        const currentDate = new Date();

        // Helper function to get the first day of the current month
        function getFirstDayOfMonth(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        }

        // Helper function to get the first day of the current year
        function getFirstDayOfYear(date) {
            return new Date(date.getFullYear(), 0, 1);
        }

        switch (date) {
            case 'today':
                orders = await orderdatas.find({
                    delevery_status: 'Delivered',
                    order_date : {
                        $gte: new Date().setHours(0, 0, 0, 0), // Start of today
                        $lt: new Date().setHours(23, 59, 59, 999), // End of today
                    },
                });
                console.log(orders[0],"1111111111");
                break;
                case 'week':
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the first day of the week (Sunday)
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the week (Saturday)
                endOfWeek.setHours(23, 59, 59, 999);

                orders = await orderdatas.find({
                    delevery_status: 'Delivered',
                    order_date: {
                        $gte: startOfWeek,
                        $lt: endOfWeek,
                    },
                });
                break;
            case 'month':
                const startOfMonth = getFirstDayOfMonth(currentDate);
                console.log(startOfMonth,"33333");
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
                console.log(endOfMonth,"44444444")

                orders = await orderdatas.find({
                    delevery_status: 'Delivered',
                    order_date : {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                    },
                });
                console.log(orders[0],"1111111111");

                break;
            case 'year':
                const startOfYear = getFirstDayOfYear(currentDate);
                const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);

                orders = await orderdatas.find({
                    delevery_status: 'Delivered',
                    order_date: {
                        $gte: startOfYear,
                        $lt: endOfYear,
                    },
                });
               
                break;
            default:
                // Fetch all orders
                orders = await orderdatas.find({ delivery_status : 'Delivered' });
        }

        const itemsperpage = 10;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(orders.length / 3);
        const currentproduct = orders.slice(startindex,endindex);    

   res.render('salesreport',{order : orders})
      
    } catch (error) {
        console.log('Error occurred in salesReport route:', error);
        // Handle errors and send an appropriate response
        res.status(500).json({ error: 'An error occurred' });
    }
};










// exporting all controllers
module.exports=({
    loadOrderpage,
    loaddetailpage,
    adminchanginStatus,
    salesriport,
    salesReport
 })