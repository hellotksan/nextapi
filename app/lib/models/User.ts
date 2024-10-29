// lib/models/User.ts
import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  coverPicture?: string;
  followers: string[];
  followings: string[];
  isAdmin: boolean;
  desc?: string;
  city?: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, min: 3, max: 25, unique: true },
    email: { type: String, required: true, max: 50, unique: true },
    password: { type: String, required: true, min: 6, max: 200 },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    followers: { type: [String], default: [] }, // followersはユーザーIDの配列として定義
    followings: { type: [String], default: [] }, // followingsもユーザーIDの配列
    isAdmin: { type: Boolean, default: false },
    desc: { type: String, max: 70 },
    city: { type: String, max: 50 },
  },
  { timestamps: true } // 作成日時と更新日時を自動で管理
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
