const express = require("express")

const { uploadFilesOnS3 } = require("../services/S3_Services");

const upload = require("../middlewares/multerMiddleware");

const { addCollection, getAllCollections, updateCollection, deleteCollection, getCollectionByName } = require("../controllers/eshop/collections.controller")
const { addCategory, getAllCategories, getStyles, updateCategory, deleteCategory, getCategoryByName } = require("../controllers/eshop/category.controller")
const { addStyle, getAllStyles, updateStyle, deleteStyle } = require("../controllers/eshop/style.controller")
const { addColor, getColors, updateColor, deleteColor } = require("../controllers/eshop/color.controller")
const { addProduct, getProducts, searchProducts, getProductById, getProductForUpdate, updateProduct, deleteProduct, getProductsForDiscount, getProductByName } = require("../controllers/eshop/product.controller")
const { applyDiscount, getAllDiscounts, updateDiscount, deleteDiscount } = require("../controllers/eshop/discount.controller")
const { addGold, getGolds, updateGold, deleteGold } = require("../controllers/eshop/gold.controller")
const { addDiamond, getDiamonds, updateDiamond, deleteDiamond } = require("../controllers/eshop/diamond.controller")
const { addLabor, getLabors, updateLabor, deleteLabor } = require("../controllers/eshop/labor.controller")
const {addMakingCharge,getMakingCharges, updateMakingCharge, deleteMakingCharge} = require("../controllers/eshop/making_charge.controller")
const {addWastageCharge,getWastageCharge, updateWastageCharge, deleteWastageCharge} = require("../controllers/eshop/wastage_charge.controller")
const { addRecommended, getRecommended, updateRecommended, deleteRecommended } = require("../controllers/eshop/recommended.controller");
const { bulkUploadXlsx } = require("../controllers/eshop/bulkupload.controller");
const { getImageUrls } = require("../controllers/eshop/getImage.controller");




const router = express.Router()

router.post("/collections/add-collection",uploadFilesOnS3,addCollection) 
router.get("/collections/get-all-collections",getAllCollections)
router.get("/collections/get-collection-by-name/:name",getCollectionByName)
router.put("/collections/update-collection/:id",uploadFilesOnS3,updateCollection)
router.delete("/collections/delete-collection/:id",deleteCollection)

router.post("/categories/add-category",uploadFilesOnS3,addCategory)
router.get("/categories/get-all-categories",getAllCategories)
router.get("/categories/get-category-by-name/:name",getCategoryByName)
router.get("/categories/:id/styles",getStyles)
router.put("/categories/update-category/:id",uploadFilesOnS3,updateCategory)
router.delete("/categories/delete-category/:id",deleteCategory)

router.post("/styles/add-style",uploadFilesOnS3,addStyle)
router.get("/styles/get-all-styles",getAllStyles)
router.put("/styles/update-style/:id",uploadFilesOnS3,updateStyle)
router.delete("/styles/delete-style/:id",deleteStyle)

router.post("/colors/add-color",addColor)
router.get("/colors/get-colors",getColors)
router.put("/colors/update-color/:id",updateColor)
router.delete("/colors/delete-color/:id",deleteColor)

router.post("/golds/add-gold",addGold)
router.get("/golds/get-golds",getGolds)
router.put("/golds/update-gold/:id",updateGold)
router.delete("/golds/delete-gold/:id",deleteGold)

router.post("/diamonds/add-diamond",addDiamond)
router.get("/diamonds/get-diamonds",getDiamonds)
router.put("/diamonds/update-diamond/:id",updateDiamond)
router.delete("/diamonds/delete-diamond/:id",deleteDiamond)

router.post("/labors/add-labor",addLabor)
router.get("/labors/get-labors",getLabors)
router.put("/labors/update-labor/:id",updateLabor)
router.delete("/labors/delete-labor/:id",deleteLabor)

router.post("/making-charges/add-making-charge",addMakingCharge)
router.get("/making-charges/get-making-charges",getMakingCharges)
router.put("/making-charges/update-making-charge/:id",updateMakingCharge)
router.delete("/making-charges/delete-making-charge/:id",deleteMakingCharge)

router.post("/wastage-charges/add-wastage-charge",addWastageCharge)
router.get("/wastage-charges/get-wastage-charges",getWastageCharge)
router.put("/wastage-charges/update-wastage-charge/:id", updateWastageCharge)
router.delete("/wastage-charges/delete-wastage-charge/:id",deleteWastageCharge)

router.post("/discounts/apply-discount",applyDiscount)
router.get("/discounts/get-all-discounts",getAllDiscounts)
router.put("/discounts/update-discount/:id",updateDiscount)
router.delete("/discounts/delete-discount/:id",deleteDiscount)

router.post("/products/bulk-upload", upload.single("file"), bulkUploadXlsx);

router.post("/products/add-product",uploadFilesOnS3,addProduct)
router.post("/products/get-products",getProducts)
router.post("/products/get-products-for-discount",getProductsForDiscount)
router.get("/products/get-product/:id",getProductById)
router.get("/products/get-product-by-name/:name",getProductByName)
router.get("/products/get-product-for-update/:id",getProductForUpdate)
router.put("/products/update-product/:id",uploadFilesOnS3,updateProduct)
router.delete("/products/delete-product/:id",deleteProduct)
router.post("/products/search-products",searchProducts)

router.post("/recommended/add-recommended",uploadFilesOnS3,addRecommended)
router.get("/recommended/get-all-recommended",getRecommended)
router.put("/recommended/update-recommended/:id",uploadFilesOnS3,updateRecommended)
router.delete("/recommended/delete-recommended/:id",deleteRecommended)

router.post("/get-image-urls",uploadFilesOnS3,getImageUrls)


module.exports = router;