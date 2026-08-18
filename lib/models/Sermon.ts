import mongoose, { Schema, Document } from 'mongoose';

export interface ISermon extends Document {
  name: string;
  thumbnail?: string;
  date: Date;
  speaker: string;
  audioFile?: string;
  series?: string;
}

const SermonSchema = new Schema<ISermon>({
  name: { type: String },
  thumbnail: { type: String },
  date: { type: Date },
  speaker: { type: String },
  audioFile: { type: String },
  series: { type: String },
});

// Prevent model recompilation in development, while forcing the collection to 'items'
export const Sermon =
  mongoose.models.Sermon || mongoose.model<ISermon>('Sermon', SermonSchema, 'items');
