import request from "supertest";
import { createServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import handler from "@/app/api/users"; // あなたのAPIハンドラをインポート

// サーバーを起動するためのヘルパー関数
const server = createServer((req: NextApiRequest, res: NextApiResponse) => {
  return handler(req, res); // Next.jsのAPIハンドラを使用
});

describe("User API", () => {
  afterAll(async () => {
    await server.close(); // テスト後にサーバーを閉じる
  });

  it("should create a new user", async () => {
    const response = await request(server).post("/api/users").send({
      username: "testUser",
      email: "test@example.com",
      password: "password123",
    });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe("testUser");
  });

  it("should retrieve a user by ID", async () => {
    const userId = "660bba29eec462de8873f0b5";
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.username).toBeDefined(); // 期待されるユーザー名を確認
  });

  it("should fail if user ID does not exist", async () => {
    const response = await request(server).get(`/api/users/invalidUserId`);
    expect(response.status).toBe(500); // 404または500エラーを期待する場合があります
  });
});
