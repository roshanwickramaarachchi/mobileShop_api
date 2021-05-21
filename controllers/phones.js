const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Phone = require('../models/Phone');
const Shop = require('../models/Shop');

// @desc      Get phones
// @route     GET /api/v1/phones
// @route     GET /api/v1/shops/:shopId/phones
// @access    Public
exports.getPhones = asyncHandler(async (req, res, next) => {
  if (req.params.shopId) {
    const phones = await Phone.find({ shop: req.params.shopId });

    return res.status(200).json({
      success: true,
      count: phones.length,
      data: phones,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single phone
// @route     GET /api/v1/phones/:id
// @access    Public
exports.getPhone = asyncHandler(async (req, res, next) => {
  const phone = await Phone.findById(req.params.id).populate({
    path: 'shop',
    select: 'name description location',
  });

  if (!phone) {
    return next(
      new ErrorResponse(`No phone with the id of ${req.params.id}`),
      404,
    );
  }

  res.status(200).json({
    success: true,
    data: phone,
  });
});

// @desc      Add phone
// @route     POST /api/v1/shops/:shopId/phones
// @access    Private
exports.addPhone = asyncHandler(async (req, res, next) => {
  req.body.shop = req.params.shopId;
  req.body.user = req.user.id;

  const shop = await Shop.findById(req.params.shopId);

  if (!shop) {
    return next(
      new ErrorResponse(`No shop with the id of ${req.params.shopId}`),
      404,
    );
  }

  // Make sure user is shop owner
  if (shop.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a phone to shop ${shop._id}`,
        401,
      ),
    );
  }

  const phone = await Phone.create(req.body);

  res.status(200).json({
    success: true,
    data: phone,
  });
});

// @desc      Update phone
// @route     PUT /api/v1/phones/:id
// @access    Private
exports.updatePhone = asyncHandler(async (req, res, next) => {
  let phone = await Phone.findById(req.params.id);

  if (!phone) {
    return next(
      new ErrorResponse(`No phone with the id of ${req.params.id}`),
      404,
    );
  }

  // // Make sure user is phone owner
  if (phone.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update phone ${phone._id}`,
        401,
      ),
    );
  }

  phone = await Phone.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: phone,
  });
});

// @desc      Delete phone
// @route     DELETE /api/v1/phones/:id
// @access    Private
exports.deletePhone = asyncHandler(async (req, res, next) => {
  const phone = await Phone.findById(req.params.id);

  if (!phone) {
    return next(
      new ErrorResponse(`No phone with the id of ${req.params.id}`),
      404,
    );
  }

  // Make sure user is phone owner
  if (phone.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete phone ${phone._id}`,
        401,
      ),
    );
  }

  await phone.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// // @desc      Upload photo for course
// // @route     PUT /api/v1/course/:id/photo
// // @access    Private
// exports.coursePhotoUpload = asyncHandler(async (req, res, next) => {
//   const course = await Course.findById(req.params.id);

//   if (!course) {
//     return next(
//       new ErrorResponse(`course not found with id of ${req.params.id}`, 404),
//     );
//   }

//   // Make sure user is course owner
//   if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
//     return next(
//       new ErrorResponse(
//         `User ${req.params.id} is not authorized to update this course`,
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
//   file.name = `photo_${course._id}${path.parse(file.name).ext}`;

//   file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
//     if (err) {
//       console.error(err);
//       return next(new ErrorResponse('Problem with file upload', 500));
//     }

//     await Course.findByIdAndUpdate(req.params.id, { photo: file.name });

//     res.status(200).json({
//       success: true,
//       data: file.name,
//     });
//   });
// });
