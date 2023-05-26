const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name.'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must not have over 40 characters.'],
            minlength: [10, 'A tour name must more than 9 characters.'],
            validate: [
                validator.isAlpha,
                'A tour name must only contain alphabetic characters.'
            ]
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration.']
        },
        maxGroupSize: {
            type: Number,
            requires: [true, 'Tour must have a group size.']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour should have a difficulty.'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty should be only easy, mudium or difficult'
            }
        },
        ratingAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.'],
            max: [5, 'Rating must not be over 5.']
        },
        ratingQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price.']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(value) {
                    // 'this' keyword only works when creating a document, not updating one
                    return value < this.price;
                },
                message: 'Discount cannot be more than the actual price.'
            }
        },
        summary: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description.']
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have an cover image.']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDate: [Date],
        slug: String,
        secretTour: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE - will run before the save command and create command
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre('save', function(next) {
//     console.log('Will save document');
//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    console.log(`This took ${Date.now() - this.start}ms`);
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({
        $match: { secretTour: { $ne: true } }
    });
    next();
});

const Tour = mongoose.model('Tours', tourSchema);

module.exports = Tour;
