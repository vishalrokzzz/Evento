import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import {Event, EventDocument} from "@/Database/event.model";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const formData = await req.formData();

        // Extract and validate required string fields
        const requiredStringFields = [
            'title', 'description', 'overview', 'image', 
            'venue', 'location', 'date', 'time', 
            'audience', 'organizer'
        ];

        const errors: Record<string, string> = {};
        const eventData: Partial<EventDocument> = {};

        // Process required string fields
        for (const field of requiredStringFields) {
            const value = formData.get(field)?.toString().trim();
            if (!value) {
                errors[field] = `${field} is required`;
            } else {
                eventData[field as keyof EventDocument] = value;
            }
        }

        // Process mode field - normalize to match enum values
        const modeValue = formData.get('mode')?.toString().trim().toLowerCase();
        if (!modeValue) {
            errors['mode'] = 'Mode is required';
        } else {
            // Normalize mode value to match enum
            let normalizedMode: 'online' | 'offline' | 'hybrid';
            if (modeValue === 'online' || modeValue.includes('online')) {
                normalizedMode = 'online';
            } else if (modeValue === 'offline' || modeValue.includes('in-person')) {
                normalizedMode = 'offline';
            } else if (modeValue === 'hybrid' || modeValue.includes('hybrid')) {
                normalizedMode = 'hybrid';
            } else {
                errors['mode'] = 'Invalid mode value';
                normalizedMode = 'offline'; // Default value won't be used if validation fails
            }
            eventData.mode = normalizedMode;
        }

        // Process agenda array - convert from string to string[]
        const agendaValue = formData.get('agenda')?.toString().trim();
        if (!agendaValue) {
            errors['agenda'] = 'Agenda is required';
        } else {
            // Convert string to array, handling different possible formats
            // Split by comma or newline to support various input formats
            const agendaArray = agendaValue.includes(',') 
                ? agendaValue.split(',').map(item => item.trim()).filter(Boolean)
                : agendaValue.includes('\n')
                    ? agendaValue.split('\n').map(item => item.trim()).filter(Boolean)
                    : [agendaValue];

            if (agendaArray.length === 0) {
                errors['agenda'] = 'Agenda must have at least one item';
            } else {
                eventData.agenda = agendaArray;
            }
        }

        // Process tags array - convert from string to string[]
        const tagsValue = formData.get('tags')?.toString().trim();
        if (!tagsValue) {
            errors['tags'] = 'Tags are required';
        } else {
            // Convert string to array, handling different possible formats
            // Common format is comma-separated values
            const tagsArray = tagsValue.includes(',') 
                ? tagsValue.split(',').map(item => item.trim()).filter(Boolean)
                : tagsValue.includes(' ')
                    ? tagsValue.split(' ').map(item => item.trim()).filter(Boolean)
                    : [tagsValue];

            if (tagsArray.length === 0) {
                errors['tags'] = 'Tags must have at least one item';
            } else {
                eventData.tags = tagsArray;
            }
        }

        // Validate date format
        if (eventData.date) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}-\d{2}-\d{4}$/;
            if (!dateRegex.test(eventData.date)) {
                errors['date'] = 'Date must be in YYYY-MM-DD or DD-MM-YYYY format';
            }
        }

        // Validate time format
        if (eventData.time) {
            const timeRegex = /^\d{2}:\d{2}$/;
            if (!timeRegex.test(eventData.time)) {
                errors['time'] = 'Time must be in HH:MM format';
            }
        }

        // Check if there are any validation errors
        if (Object.keys(errors).length > 0) {
            return NextResponse.json({
                message: "Validation failed", 
                errors
            }, {status: 400});
        }

        // Create the event with properly formatted data
        const CreatedEvent = await Event.create(eventData);
        return NextResponse.json({
            message: "Event created successfully..!!", 
            event: CreatedEvent
        }, {status: 201});
    }
    catch (e) {
        console.log(e);
        return NextResponse.json({
            message: "Event creation failed..!!", 
            error: e instanceof Error ? e.message : 'Unknown'
        }, {status: 500});
    }
}
