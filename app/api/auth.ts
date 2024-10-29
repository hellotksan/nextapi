import { connectDB } from "@/app/lib/db";
import User from "@/app/lib/models/User";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "POST") {
    const { action } = req.query;

    if (action === "register") {
      // ユーザ登録
      try {
        const { username, email, password } = req.body;

        // パスワードをハッシュ化
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 新しいユーザーを作成
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });

        const user = await newUser.save();
        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json(error);
      }
    } else if (action === "login") {
      // ログイン
      try {
        const { email, password } = req.body;

        // ユーザーを検索
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json("ユーザーが見つかりません");
        }

        // パスワードの検証
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json("パスワードが違います");
        }
        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
  }

  // 他のHTTPメソッドの処理も追加
  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
