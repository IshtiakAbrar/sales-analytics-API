const express= require('express');
const router = express.Router();


const SalesController =require('../Controllers/SalesController')



router.get("/total-revenue",SalesController.totalRevenue);
router.get("/create",SalesController.CreateSales);
router.get("/quantity-by-product",SalesController.quantityByProduct);
router.get("/top-products",SalesController.topProducts);
router.get("/average-price",SalesController.averagePrice);
router.get("/revenue-by-month",SalesController.revenueByMonth);
router.get("/highest-quantity-sold/:date",SalesController.highestQuantitySold);



module.exports=router;