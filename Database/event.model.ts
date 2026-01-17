import mongoose, { Schema, Document, Model } from "mongoose";

export interface EventDocument extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: "online" | "offline" | "hybrid";
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const generateSlug = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

const EventSchema = new Schema<EventDocument>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true },
        description: { type: String, required: true },
        overview: { type: String, required: true },
        image: { type: String, required: true },
        venue: { type: String, required: true },
        location: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        mode: {
            type: String,
            enum: ["online", "offline", "hybrid"],
            required: true
        },
        audience: { type: String, required: true },
        agenda: {
            type: [String],
            required: true,
            validate: (v: string[]) => v.length > 0
        },
        organizer: { type: String, required: true },
        tags: {
            type: [String],
            required: true,
            validate: (v: string[]) => v.length > 0
        }
    },
    { timestamps: true }
);

EventSchema.pre("save",async function () {
    if (this.isModified("title")) {
        this.slug = generateSlug(this.title);
    }

    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date");
    }
    this.date = parsedDate.toISOString().split("T")[0];

    if (!/^\d{2}:\d{2}$/.test(this.time)) {
        throw new Error("Time must be HH:mm");
    }

    // next();
});

EventSchema.index({ slug: 1 }, { unique: true });

export const Event: Model<EventDocument> =
    mongoose.modelNames().includes("Event")
        ? mongoose.model<EventDocument>("Event")
        : mongoose.model<EventDocument>("Event", EventSchema);
