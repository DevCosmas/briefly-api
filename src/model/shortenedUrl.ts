import mongoose, { Document, Schema, Model, ObjectId } from 'mongoose';
import validator from 'validator';

interface UrlDocument extends Document {
  shortUrl: string;
  originalUrl?: string;
  whoVisited?: Array<string>;
  visitationCount?: number;
  userId?: ObjectId;
  newUrl: string;
  createdAt?: Date;
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
    required: [true, 'valid url required'],
    validate: {
      validator: (value: string) => validator.isURL(value),
      message: 'Invalid URL',
    },
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const UrlModel: Model<UrlDocument> = mongoose.model<UrlDocument>(
  'Url',
  UrlSchema
);

export { UrlModel, UrlDocument };
