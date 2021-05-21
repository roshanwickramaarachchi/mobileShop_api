const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Shop = require('../models/Shop');

// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/shops/:shopId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.shopId) {
    const reviews = await Review.find({ shop: req.params.shopId }).populate({
      path: 'user',
      select: 'name ',
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  }
  res.status(200).json(res.advancedResults);
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'user',
    select: 'name ',
  }).populate({
    path: 'shop',
    select: 'name ',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    success: true,
    data: review,  
  });
});

// @desc      Add review
// @route     POST /api/v1/shops/:shopId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.shop = req.params.shopId;
  req.body.user = req.user.id;

  const shop = await Shop.findById(req.params.shopId); 

  if (!shop) {
    return next(
      new ErrorResponse(
        `No shop with the id of ${req.params.shopId}`,
        404,
      ),
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404),
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update review', 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  const shopId = await Shop.findById(review.shop);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404),
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin' && shopId.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete review', 401));
  }
  // review.user.toString() this path  is actualy in database is is same in model

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
