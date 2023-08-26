import mongoose, { Model, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: any;
  role: string;
  image: string;
  status: string;
  phone: string;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Fist Name is required"],
      trim: true,
      minlength: [3, "Name can't be less than 3 character"],
      maxLength: [31, "Name can't be less than 3 character"],
      lowercase: true,
    },

    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
      minlength: [3, "Name can't be less than 3 character"],
      maxLength: [31, "Name can't be less than 3 character"],
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique:true,
      lowercase: true,
      validator: [validator.isEmail, "Please provide a valid email address"],
    },

    phone: {
      type: String,
      trim: true,
      validator: [
        validator.isMobilePhone,
        "Please provide a valid phone number",
      ],
    },

    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      validator: (value: any) =>
        validator.isStrongPassword(value, {
          minLength: 6,
        }),
    },

    confirmPassword: {
      type: String,
      required: [true, "Confirm Password is required"],
      trim: true,
      validator: {
        function(value: any) {
          return (value = this.password);
        },
        message: "Password doesn't match please try again with valid password",
      },
    },

    image: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "blocked", "de-active", "ban"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", function (next) {
  const password = this.password;
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  this.password = hashedPassword;
  this.confirmPassword = undefined;
  next();
});

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
