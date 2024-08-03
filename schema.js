const joi=require("joi")
module.exports.listingschema=joi.object({
    list:joi.object({
        title:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.object({
            url:joi.string().required(),
            filename:joi.string().required(),
        }),
        description:joi.string().required(),
        country:joi.string().required(),
        location:joi.string().required(),
    }).required()
})

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required(),
        comment:joi.string().required()
    }).required(),

});

