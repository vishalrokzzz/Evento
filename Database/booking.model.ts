import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { Event } from "./event.model";

export interface BookingDocument extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<BookingDocument>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: EMAIL_REGEX
        }
    },
    { timestamps: true }
);

BookingSchema.pre("save", async function () {
    const exists = await Event.findById(this.eventId).lean();
    if (!exists) {
        throw new Error("Referenced event does not exist");
    }
    // next();
});

export const Booking: Model<BookingDocument> =
    mongoose.modelNames().includes("Booking")
        ? mongoose.model<BookingDocument>("Booking")
        : mongoose.model<BookingDocument>("Booking", BookingSchema);
