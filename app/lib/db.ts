import mongoose from "mongoose";

let isConnected: boolean;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
  } catch (error) {
    console.error(error);
  }
};
