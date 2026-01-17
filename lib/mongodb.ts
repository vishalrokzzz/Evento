
import mongoose from 'mongoose';

// Define interface for connection cache
interface GlobalMongo {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Declare global connection cache
declare global {
    var mongo: GlobalMongo | undefined;
}

// Initialize global connection cache
const globalMongo = global as unknown as { mongo: GlobalMongo };
globalMongo.mongo = globalMongo.mongo || { conn: null, promise: null };

// Get MongoDB URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global promise-based connection handler to MongoDB using Mongoose
 * Implements connection pooling to reuse connections and prevent multiple
 * connections during development
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
    // If we have an existing connection, return it
    if (globalMongo.mongo.conn) {
        return globalMongo.mongo.conn;
    }

    // If a connection is being established, return the promise
    if (!globalMongo.mongo.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        mongoose.set('strict', true);
        mongoose.set('strictQuery', true);

        // Create new connection promise
        globalMongo.mongo.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                return mongoose;
            })
            .catch((error) => {
                console.error('MongoDB connection error:',
                    error instanceof Error ? error.message : String(error));
                throw error;
            });
    }

    try {
        // Await the connection
        const mongoose = await globalMongo.mongo.promise;

        // Cache the connection
        globalMongo.mongo.conn = mongoose;

        // Log successful connection in development
        if (process.env.NODE_ENV === 'development') {
            console.log('MongoDB connected successfully');
        }

        return mongoose;
    } catch (error) {
        // Clear the promise on error to allow retry
        globalMongo.mongo.promise = null;
        console.error('MongoDB connection error:',
            error instanceof Error ? error.message : String(error));
        throw new Error('Failed to connect to MongoDB');
    }
}

/**
 * Gracefully disconnect from MongoDB
 * Useful for testing and graceful shutdowns
 */
export async function disconnectFromDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
        return; // Skip disconnection in development
    }

    if (globalMongo.mongo.conn) {
        try {
            await mongoose.disconnect();
            globalMongo.mongo.conn = null;
            globalMongo.mongo.promise = null;
        } catch (error) {
            console.error('Error disconnecting from MongoDB:',
                error instanceof Error ? error.message : String(error));
        }
    }
}

// Add event listeners for connection status
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err: Error) => {
    console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Handle process termination
const cleanup = async () => {
    try {
        await disconnectFromDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:',
            error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);