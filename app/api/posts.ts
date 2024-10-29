import { connectDB } from "@/app/lib/db";
import Post from "@/app/lib/models/Post";
import User from "@/app//lib/models/User";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  const { method } = req;

  if (method === "POST") {
    // 投稿を作成
    try {
      const newPost = new Post(req.body);
      const savedPost = await newPost.save();
      return res.status(200).json(savedPost);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  if (method === "PUT") {
    const { id } = req.query;

    // 投稿を更新する
    try {
      const post = await Post.findById(id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        return res.status(200).json("User has updated post!");
      } else {
        return res.status(403).json("User doesn't have access to update post!");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  if (method === "DELETE") {
    const { id } = req.query;

    // 投稿を削除する
    try {
      const post = await Post.findById(id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        return res.status(200).json("User has deleted post!");
      } else {
        return res.status(403).json("User doesn't have access to delete post!");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  if (method === "GET") {
    const { id } = req.query;

    if (id) {
      // 投稿を取得する
      try {
        const post = await Post.findById(id);
        return res.status(200).json(post);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    // プロフィール専用のタイムラインの取得
    const { username } = req.query;
    if (username) {
      try {
        const user = await User.findOne({ username });
        const posts = await Post.find({ userId: user._id });
        return res.status(200).json(posts);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    // タイムラインの投稿を取得
    const { userId } = req.query;
    if (userId) {
      try {
        const currentUser = await User.findById(userId);
        const userPosts = await Post.find({ userId: currentUser._id });

        // 自分がフォローしている友達の投稿内容をすべて取得する
        const friendPosts = await Promise.all(
          currentUser.followings.map((friendId: string) => {
            return Post.find({ userId: friendId });
          })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
      } catch (error) {
        return res.status(500).json(error);
      }
    }
  }

  // 他のHTTPメソッドの処理も追加
  res.setHeader("Allow", ["POST", "PUT", "DELETE", "GET"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
