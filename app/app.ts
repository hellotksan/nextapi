import { NextApiRequest, NextApiResponse } from "next";
import usersHandler from "@/app/api/users"; // あなたのユーザーAPIハンドラのパス

export default function app(req: NextApiRequest, res: NextApiResponse) {
  return usersHandler(req, res);
}
