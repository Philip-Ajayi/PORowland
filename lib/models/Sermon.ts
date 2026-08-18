import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  title: string;
  thumbnail?: string;
  category?: string;
  price?: number;
  description?: string;
  createdAt: Date;
}

const ItemSchema = new Schema<IItem>({
  title: { type: String, required: true },
  thumbnail: { type: String },
  category: { type: String },
  price: { type: Number },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model recompilation in Next.js development
export const Item =
  mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
