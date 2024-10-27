import { connectDB } from "@/app/lib/db";
import User from "@/app/lib/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  const { method } = req;

  if (method === "PUT") {
    const { id } = req.query;
    // ユーザー更新
    if (req.body.userId === id || req.body.isAdmin) {
      try {
        await User.findByIdAndUpdate(id, { $set: req.body });
        return res.status(200).json("Account has been updated");
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  }

  if (method === "DELETE") {
    const { id } = req.query;
    // ユーザー削除
    if (req.body.userId === id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(id);
        return res.status(200).json("Account has been deleted!");
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  }

  if (method === "GET") {
    const { id } = req.query;

    if (id) {
      // ユーザー取得
      try {
        const user = await User.findById(id);
        const { password, updatedAt, ...other } = user._doc;
        return res.status(200).json(other);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    // 全ユーザー情報を取得する
    if (req.query.all) {
      try {
        const users = await User.find();
        const sanitizedUsers = users.map((user) => {
          const { password, updatedAt, ...other } = user._doc;
          return other;
        });
        return res.status(200).json(sanitizedUsers);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    // クエリでユーザー情報を取得
    const { userId, username } = req.query;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      return res.status(200).json(other);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  if (method === "PUT" && req.query.id) {
    const { id } = req.query;

    // ユーザのフォロー
    if (req.body.action === "follow") {
      if (req.body.userId !== id) {
        try {
          const user = await User.findById(id);
          const currentUser = await User.findById(req.body.userId);
          if (!user.followers.includes(req.body.userId)) {
            await user.updateOne({
              $push: { followers: req.body.userId },
            });
            await currentUser.updateOne({
              $push: { followings: id },
            });
            return res.status(200).json("User has been followed");
          } else {
            return res.status(403).json("You already follow this user");
          }
        } catch (error) {
          return res.status(500).json(error);
        }
      } else {
        return res.status(403).json("You can't follow yourself");
      }
    }

    // ユーザのフォローを外す
    if (req.body.action === "unfollow") {
      if (req.body.userId !== id) {
        try {
          const user = await User.findById(id);
          const currentUser = await User.findById(req.body.userId);
          if (user.followers.includes(req.body.userId)) {
            await user.updateOne({
              $pull: { followers: req.body.userId },
            });
            await currentUser.updateOne({
              $pull: { followings: id },
            });
            return res.status(200).json("User has been unfollowed!");
          } else {
            return res.status(403).json("You already unfollow this user");
          }
        } catch (error) {
          return res.status(500).json(error);
        }
      } else {
        return res.status(403).json("You can't unfollow yourself");
      }
    }
  }

  // 他のHTTPメソッドの処理
  res.setHeader("Allow", ["PUT", "DELETE", "GET"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
