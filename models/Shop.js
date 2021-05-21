const mongoose = require('mongoose');
const slugify = require('slugify');

const ShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    latitude: {
      type: {Number},
    },
    longitude: {
      type: {Number},
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [10, 'Phone number can not be longer than 10 characters'],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    town: {
      type: String,
      required: [true, 'Please add an town'],
    },
    address: {
      type: String,
     required: [true, 'Please add an address'],
    },
    image: {
      type: String,
      // required: [true, 'Please add an image'],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
    // averageCost: Number,    
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // housing: {
    //     type: Boolean,
    //     default: false
    // },
    // jobAssistance: {
    //     type: Boolean,
    //     default: false
    // },
    // jobGuarantee: {
    //     type: Boolean,
    //     default: false
    // },
    // acceptGi: {
    //     type: Boolean,
    //     default: false
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Create shop slug from the name
ShopSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete phones when a Shop is deleted
ShopSchema.pre('remove', async function (next) {
  console.log(`Phones being removed from shop ${this._id}`);
  await this.model('Phone').deleteMany({ shop: this._id });
  next();
});

// Reverse populate with virtuals
ShopSchema.virtual('phones', {
  ref: 'Phone',
  localField: '_id',
  foreignField: 'shop', // My- shop is equal to phone model data "shop"
  justOne: false,
});

module.exports = mongoose.model('Shop', ShopSchema);
