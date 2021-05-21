const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// const geocoder = require('../utils/geocoder');
const Shop = require('../models/Shop');
// const { param } = require('../routes/phones');

// @desc      Get all shops
// @route     GET /api/v1/shops
// @access    Public
exports.getShops = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
  // My - res.advancedResults is in advancedResults file
});

// @desc      Get single shops 
// @route     GET /api/v1/shops/:id
// @access    Public
exports.getShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);
  //const shop = await Shop.findById(req.params.id).populate('phones');

  if (!shop) {
    return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404));
  }
  // My - res.status(200).json({}) this indicate data through postman
  res.status(200).json({ success: true, data: shop });
});

// @desc      create new shops
// @route     POST /api/v1/shops
// @access    Private
exports.createShop = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published shop
  const publishedShop = await Shop.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one Shop
  if (publishedShop && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a shop`,
        400,
      ),
    );
  }

  const shop = await Shop.create(req.body);

  res.status(201).json({ success: true, data: shop });
});

// @desc      Update shops
// @route     PUT /api/v1/shops/:id
// @access    Private
exports.updateShop = asyncHandler(async (req, res, next) => {
  let shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(
      new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404),
    );
  }

  // Make sure user is shop owner
  if (shop.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this shop`,
        401,
      ),
    );
  }

  shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: shop });
});

// @desc      Delete  shops
// @route     DELETE /api/v1/shops/:id
// @access    Private
exports.deleteShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is shop owner
  if (shop.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this shop`,
        401,
      ),
    );
  }
  
  shop.remove();//My-when shop delete ,relevent phones also delete

  res.status(200).json({ success: true, data: {} });
});

// @desc      Get shops within a radius
// @route     GET /api/v1/shops/radius/:zipcode/:distance
// @access    Private
// exports.getShopsInRadius = asyncHandler(async (req, res, next) => {
//   const { zipcode, distance } = req.params;

//   // Get lat/lng from geocoder
//   const loc = await geocoder.geocode(zipcode);
//   const lat = loc[0].latitude;
//   const lng = loc[0].longitude;

//   // Calc radius using radians
//   // Divide dist by radius of Earth
//   // Earth Radius = 3,963 mi / 6,378 km
//   const radius = distance / 3963;

//   const shops = await Shop.find({
//     location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
//   });

//   res.status(200).json({
//     success: true,
//     count: shops.length,
//     data: shops,
//   });
// });

// @desc      Upload photo for shop
// @route     PUT /api/v1/shops/:id/photo
// @access    Private
// exports.shopPhotoUpload = asyncHandler(async (req, res, next) => {
//   const shop = await Shop.findById(req.params.id);

//   if (!shop) {
//     return next(
//       new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404),
//     );
//   }

//   // Make sure user is shop owner
//   if (shop.user.toString() !== req.user.id && req.user.role !== 'admin') {
//     return next(
//       new ErrorResponse(
//         `User ${req.params.id} is not authorized to update this shop`,
//         401,
//       ),
//     );
//   }

//   if (!req.files) {
//     return next(new ErrorResponse('Please upload a file', 400));
//   }

//   console.log(req.files);
//   const { file } = req.files;

//   // Make sure the image is a photo
//   if (!file.mimetype.startsWith('image')) {
//     return next(new ErrorResponse('Please upload an image file', 400));
//   }

//   // Check filesize
//   if (file.size > process.env.MAX_FILE_UPLOAD) {
//     return next(
//       new ErrorResponse(
//         `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
//         400,
//       ),
//     );
//   }

//   // Create custom filename
//   file.name = `photo_${shop._id}${path.parse(file.name).ext}`;

//   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
//     if (err) {
//       console.error(err);
//       return next(new ErrorResponse('Problem with file upload', 500));
//     }

//     await Shop.findByIdAndUpdate(req.params.id, { photo: file.name } ); //file

//     res.status(200).json({
//       success: true,
//       data: file.name,      
//     });
//   });
// });
