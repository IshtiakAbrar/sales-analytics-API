const SalesModel=require('../Models/SalesModel');


exports.CreateSales=async (req,res)=>{
    let reqBody= req.body;
    try {
        const result = await SalesModel.create(reqBody);
        res.status(200).json({status: "Success", data: result});
    }
    catch(e){
        res.status(200).json({status: "Fail", data: e.toString()});
    }

}


exports.totalRevenue=async (req,res)=>{
    try {
        const result = await SalesModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } }
                }
            }
        ]);
        res.status(200).json({status: "Success", data: result});
    }
    catch(e){
        res.status(200).json({status: "Fail", data: e.toString()});
    }

}

exports.quantityByProduct=async (req,res)=>{
    try {
        const result = await SalesModel.aggregate([
            {
                $group: {
                    _id: '$product',
                    QuantityByProduct: { $sum: '$quantity' }
                }
            }
        ]);
        res.status(200).json({status: "Success", data: result});
    }
    catch(e){
        res.status(200).json({status: "Fail", data: e.toString()});
    }

}

exports.topProducts=async (req,res)=>{
    try {
        const result = await SalesModel.aggregate([
            {
                $group: {
                    _id: '$product',
                    totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },

                },
            },
            {$sort:{'totalRevenue':-1}},
            {$limit:5}
        ]);
        res.status(200).json({status: "Success", data: result});
    }
    catch(e){
        res.status(200).json({status: "Fail", data: e.toString()});
    }

}

exports.averagePrice=async (req,res)=>{
    try {
        const totalRevenue = await SalesModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } }

                },
            }
        ]);

        const totalQuantity = await SalesModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: '$quantity' }

                },
            }
        ]);

        const result={"AveragePrice": totalRevenue[0].totalRevenue/totalQuantity[0].totalQuantity}
        res.status(200).json({status: "Success", data: result});
    }
    catch(e){
        res.status(200).json({status: "Fail", data: e.toString()});
    }

}



exports.revenueByMonth=async (req, res) => {
    try {
        const revenueByMonth = await SalesModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.json(revenueByMonth);
    } catch(e){
        res.status(200).json({status: "Fail", data: e.toString()});
    }
}

exports.highestQuantitySold=async (req, res) => {
    try {
        let date=new Date(req.params.date);
        const result = await SalesModel.aggregate([
            {
                $match: {date:{$gte:date, $lt: new Date(date.getTime()+ 24*60*60*1000)}}
            },
            {
                $group: {
                    _id: '$product',
                    totalQuantity:{$sum:'$quantity'}

                },
            },
            {$sort: {totalQuantity:-1}},
            {$limit:1}

        ]);

        res.json(result);
    } catch(e){
        res.status(200).json({status: "Fail", data: e.toString()});
    }
}