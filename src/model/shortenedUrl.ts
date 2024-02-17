import mongoose, { Document, Schema, Model, ObjectId } from 'mongoose';

interface UrlDocument extends Document {
  shortUrl: string;
  originalUrl?: string;
  whoVisited?: Array<string>;
  visitationCount?: number;
  userId?: ObjectId;
  newUrl: string;
}

const UrlSchema = new Schema<UrlDocument>({
  shortUrl: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
  },
  originalUrl: {
    type: String,
    trim: true,
  },
  whoVisited: {
    type: [String],
    default: [],
  },
  visitationCount: {
    type: Number,
    default: 0,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  newUrl: String,
});

const UrlModel: Model<UrlDocument> = mongoose.model<UrlDocument>(
  'Url',
  UrlSchema
);

export { UrlModel, UrlDocument };
