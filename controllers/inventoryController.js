const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');

exports.createInventory = async (req, res) => {
  try {
    const supplierId = req.body.supplier_id;
    if (!supplierId) {
        return res.status(400).json({ error: 'supplier_id is required.' });
    }
    
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(400).json({ error: 'Invalid supplier_id. Supplier does not exist.' });
    }
    
    const inventory = new Inventory(req.body);
    await inventory.save();
    res.status(201).json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getInventory = async (req, res) => {
  try {
    if (req.query.groupedBySupplier === 'true') {
      const result = await Inventory.aggregate([
        {
          $group: {
            _id: "$supplier_id",
            totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
            inventoryItems: { $push: "$$ROOT" }
          }
        },
        {
          $lookup: {
            from: "suppliers",
            localField: "_id",
            foreignField: "_id",
            as: "supplierDetails"
          }
        },
        {
          $unwind: "$supplierDetails"
        },
        {
          $sort: { totalValue: -1 }
        },
        {
            $project: {
                _id: 0,
                supplier: "$supplierDetails",
                totalValue: 1,
                inventoryItems: 1
            }
        }
      ]);
      return res.json(result);
    } else {
      const allInventory = await Inventory.find().populate('supplier_id');
      return res.json(allInventory);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
