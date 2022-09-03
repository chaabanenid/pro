const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 25,
    },
    idSocial: {
      type: String,
      immutable: true,
    },
    email: {
      type: String,

      trim: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
    phoneNumber: {
      type: String,

      //  unique: true,
    },

    profilePic: {
      type: [{}],
      default: {
        path: "https://i.postimg.cc/8cQHCF55/933-9332131-profile-picture-default-png.jpg",
      },
    },
    role: {
      type: String,
      default: "user",
    },
    gender: {
      type: String,
      default: "",
    },

    address: {
      type: Object,
      default: "",
    },
    city: {
      type: String,
      require: false,
    },
    online: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    localisation: {
      type: String,
      default: false,
    },
    companyName: {
      type: String,
      default: false,
    },

    birthDate: {
      type: String,
      require: false,
    },
    age: {
      type: Number,
      require: false,
    },
    targetGender: {
      type: String,
      require: false,
    },
    targetRelationship: {
      type: String,
      require: false,
    },
    passions: {
      type: Object,
      require: false,
    },
    latitude: {
      type: Number,
      require: false,
    },
    longitude: {
      type: Number,
      require: false,
    },
    privacyPermissions: {
      type: Object,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);
//filter what password and email from the returned object
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.idSocial;
  delete userObject.profilePic;
  delete userObject.gender;
  delete userObject.online;
  delete userObject.passion;
  delete userObject.latitude;
  
  return userObject;
};
module.exports = mongoose.model("user", userSchema);
