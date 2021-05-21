const express = require('express');
const {
  getPhones,
  getPhone,
  addPhone,
  updatePhone,
  deletePhone,
  // coursePhotoUpload,
} = require('../controllers/phones');

// My - for filters
const Phone = require('../models/Phone');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');


// router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), coursePhotoUpload);

// router
//   .route('/')
//   .get(advancedResults(Phone, { path: 'shop', select: 'name description location' }),getPhones)  
//   .post(protect, authorize('publisher', 'admin'), addCourse);
// router
//   .route('/:id')
//   .get(getCourse)
//   .put(protect, authorize('publisher', 'admin'), updateCourse)
//   .delete(protect, authorize('publisher', 'admin'), deleteCourse);

router
  .route('/')
  .get(advancedResults(Phone, { path: 'shop', select: 'name description location' }),getPhones)  
  .post(protect,authorize('publisher', 'admin'),addPhone);  

router
  .route('/:id')
  .get(getPhone)
  .put(protect,authorize('publisher', 'admin'),updatePhone) 
  .delete(protect,authorize('publisher', 'admin'),deletePhone);



module.exports = router;
