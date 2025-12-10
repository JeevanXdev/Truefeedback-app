import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  ownerUsername: string;
  text: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  ownerUsername: { type: String, required: true, index: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);
