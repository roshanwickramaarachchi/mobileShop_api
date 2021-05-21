const express = require('express');

const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  // getShopsInRadius,
  // shopPhotoUpload,

} = require('../controllers/shops');

// My - for filters
const Shop = require('../models/Shop');

// Include other resource routers
const phoneRouter = require('./phones');
const reviewRouter = require('./reviews');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');


// Re-route into other resource routers
router.use('/:shopId/phones', phoneRouter);
router.use('/:shopId/reviews', reviewRouter);

// router.route('/radius/:zipcode/:distance').get(getShopsInRadius);

// router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), shopPhotoUpload);

// router
//   .route('/')
//   .get(advancedResults(Shop, 'phones'), getShops)
//   .post(protect, authorize('publisher', 'admin'), createShop);  

// router
//   .route('/:id')
//   .get(getShop)
//   .put(protect, authorize('publisher', 'admin'), updateShop)
//   .delete(protect, authorize('publisher', 'admin'), deleteShop);

router
  .route('/')
  .get(advancedResults(Shop, 'phones'), getShops)
  .post(protect,authorize('publisher', 'admin'),createShop);  

router
  .route('/:id')
  .get(protect,getShop)
  .put(protect,authorize('publisher', 'admin'),updateShop)
  .delete(protect,authorize('publisher', 'admin'),deleteShop);

module.exports = router;
