# AI Sprint Planner

A complete full-stack application that converts Product Requirement Documents (PRDs) into structured sprint plans using AI, with Trello export capabilities.

## Features

- **PRD Processing**: Paste your PRD text and get structured sprint plans
- **AI-Powered Analysis**: Converts unstructured requirements into organized epics, user stories, and timelines
- **Clean UI**: Modern React interface with Tailwind CSS
- **Trello Integration**: Export sprint plans to Trello (stub implementation)
- **Real-time Processing**: Instant feedback and loading states

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **API**: OpenAI (with mock fallback)
- **Integration**: Trello API (stub)

## Project Structure

```
ai-sprint-planner/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Tailwind CSS imports
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── index.js           # Server entry point
│   ├── package.json
│   └── .env.example       # Environment variables template
├── package.json           # Root package.json with scripts
└── README.md
```

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start the development servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on http://localhost:3000
   - Backend on http://localhost:5000

## Usage

1. **Open the application** at http://localhost:3000
2. **Paste your PRD** in the textarea (or use the sample PRD)
3. **Click "Generate Sprint Plan"** to process the PRD
4. **View the structured output** with epics, user stories, and timeline
5. **Click "Export to Trello"** to export (check server console for output)

## API Endpoints

- `POST /api/plan` - Generate sprint plan from PRD text
- `POST /api/export` - Export sprint plan to Trello (stub)
- `GET /health` - Health check endpoint

## Environment Variables

Create a `.env` file in the `server/` directory:

```
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```

## Development

- **Frontend only**: `cd client && npm run dev`
- **Backend only**: `cd server && npm run dev`
- **Both**: `npm run dev` (from root)

## Production Deployment

1. Build the frontend: `cd client && npm run build`
2. Serve the built files with your preferred static file server
3. Deploy the backend to your preferred hosting platform

## Future Enhancements

- Real OpenAI API integration
- Complete Trello API integration
- User authentication
- Save/load sprint plans
- Export to other project management tools
- Advanced PRD parsing and validation

## Sample PRD

The application includes a sample PRD for testing. Click "Use sample PRD" to populate the textarea with example content.
# AI-Sprint-Planner
