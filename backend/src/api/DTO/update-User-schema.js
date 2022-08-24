const { body } = require("express-validator");
const userSchema = [
  body("name").optional().isLength({ min: 2 }).withMessage("name is invalid"),
  body("gender")
    .optional()
    .isString()
    .isLength({ min: 2 })
    .withMessage("gender is invalid"),
  body("address")
    .optional()
    .isLength({ min: 1 })
    .withMessage("address is invalid"),
  body("city").optional().isLength({ min: 1 }).withMessage("city is invalid"),
  body("birthDate")
    .optional()
    .isLength({ min: 1 })
    .withMessage("birthDate is invalid"),
  body("age").optional().isLength({ min: 1 }).withMessage("age is invalid"),
  body("targetGender")
    .optional()
    .isString()
    .isLength({ min: 2 })
    .withMessage("targetGender is invalid"),
  body("targetRelationship")
    .optional()
    .isString()
    .withMessage("targetRelationship is invalid"),
  body("passions").optional().isObject().withMessage("passions is invalid"),
  body("latitude")
    .optional()
    .isString()
    .isLength({ min: 2 })
    .withMessage("latitude is invalid"),
  body("longitude")
    .optional()
    .isString()
    .isLength({ min: 2 })
    .withMessage("longitude is invalid"),
  body("privacyPermissions")
    .optional()
    .isObject()
    .withMessage("privacyPermissions is invalid"),
];
const allowedUpdates = [
  "name",
  "email",
  "phoneNumber",
  "gender",
  "address",
  "city",
  "birthDate",
  "age",
  "targetGender",
  "targetRelationship",
  "passions",
  "latitude",
  "longitude",
  "privacyPermissions",
];
module.exports = { userSchema, allowedUpdates };
