# MongoDB Integration for Alumni Portal

This document provides an overview of the MongoDB integration for the Alumni Portal application, specifically for the Events and Stories features.

## Setup

1. **Install Dependencies**

   The project already includes Mongoose as a dependency. If you need to add it manually:

   ```bash
   npm install mongoose
   ```

2. **Environment Variables**

   Create a `.env.local` file in the root of your project with your MongoDB connection string:

   ```env
   MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/alumni_portal?retryWrites=true&w=majority
   ```

   You can use MongoDB Atlas for cloud hosting or a local MongoDB server.

3. **Database Connection**

   The database connection is handled in `lib/db/connection.ts` file, which establishes and caches the Mongoose connection.

## Data Models

### Event Model

The Event model (`lib/db/models/Event.ts`) represents alumni events with the following schema:

- `title`: String (required) - The title of the event
- `description`: String (required) - Detailed description of the event
- `date`: Date (required) - When the event will take place
- `location`: String (required) - Where the event will take place
- `image`: String (optional) - URL to an image for the event
- `isActive`: Boolean (defaults to true) - Whether the event is active/visible
- `createdAt` and `updatedAt`: Timestamps for creation and modification

### Story Model

The Story model (`lib/db/models/Story.ts`) represents alumni stories with the following schema:

- `title`: String (required) - The title of the story
- `content`: String (required) - The main content of the story
- `author`: String (required) - Name of the author
- `authorEmail`: String (optional) - Email of the author
- `graduationYear`: String (optional) - Year of graduation
- `branch`: String (optional) - Branch of engineering
- `image`: String (optional) - URL to an image for the story
- `isPublished`: Boolean (defaults to false) - Publication status
- `createdAt` and `updatedAt`: Timestamps for creation and modification

## Server Actions

### Event Actions

Located in `lib/db/actions/event.actions.ts`, these provide CRUD operations for events:

- `getAllEvents(activeOnly?: boolean)`: Retrieve all events, optionally filtering by active status
- `getEventById(eventId: string)`: Get a specific event by ID
- `createEvent(eventData: CreateEventParams)`: Create a new event
- `updateEvent(eventId: string, updateData: UpdateEventParams)`: Update an existing event
- `deleteEvent(eventId: string)`: Delete an event
- `toggleEventStatus(eventId: string)`: Toggle the active status of an event

### Story Actions

Located in `lib/db/actions/story.actions.ts`, these provide CRUD operations for stories:

- `getAllStories(publishedOnly?: boolean)`: Retrieve all stories, optionally filtering by published status
- `getStoryById(storyId: string)`: Get a specific story by ID
- `createStory(storyData: CreateStoryParams)`: Create a new story
- `updateStory(storyId: string, updateData: UpdateStoryParams)`: Update an existing story
- `deleteStory(storyId: string)`: Delete a story
- `toggleStoryPublishStatus(storyId: string)`: Toggle the publication status of a story

## Usage in UI Components

The MongoDB integration is used in the Admin Dashboard for content management:

1. **Event Management**: `components/admin/EventManagement.tsx` provides an interface to create, list, edit, and delete events
2. **Story Management**: `components/admin/StoryManagement.tsx` provides an interface to create, list, edit, and delete alumni stories

These components use the server actions to perform database operations.

## Extending the Integration

To add new features that require MongoDB:

1. Create a new model in `lib/db/models/`
2. Create server actions for the model in `lib/db/actions/`
3. Create UI components that use these actions

---

For questions or issues, please refer to the project documentation or contact the development team. 