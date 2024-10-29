import mongoose, { Document, Model } from "mongoose";

interface IPost extends Document {
  userId: string;
  desc?: string;
  img?: string;
  likes: string[];
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 200,
    },
    img: {
      type: String,
    },
    likes: {
      type: [String], // likesはユーザーIDの配列として定義
      default: [],
    },
  },
  { timestamps: true } // 作成日時と更新日時を自動で管理
);

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default Post;
