# Event Result Manager

A comprehensive MERN stack application for managing event results with PDF generation capabilities.

## Features

- **Dynamic Result Management**: Create, view, and manage event results
- **Flexible Categories**: Use existing categories or create new ones on-the-fly
- **Individual & Group Results**: Support for both individual participants and group/team results
- **Professional PDF Generation**: Download beautifully formatted PDF reports
- **Modern UI**: Responsive design with smooth animations and professional styling
- **Real-time Updates**: Instant feedback with toast notifications

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- react-select for advanced select components
- Lucide React for icons
- React Hot Toast for notifications
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- PDFKit for PDF generation
- CORS enabled for cross-origin requests

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Setup

1. **Clone the repository and install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   npm run install-server
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `server` directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/event-results
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Start the development servers:**
   
   Backend (in one terminal):
   ```bash
   npm run server
   ```
   
   Frontend (in another terminal):
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Usage

1. **Create Categories**: Use the creatable select to add new event categories
2. **Add Results**: Fill in event details, individual winners, and group winners
3. **View Results**: Browse all created results in a beautiful card layout
4. **Download PDFs**: Generate professional PDF reports for any result
5. **Manage Data**: Delete results when no longer needed

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Results
- `GET /api/results` - Get all results
- `POST /api/results` - Create new result
- `GET /api/results/:id` - Get result by ID
- `PUT /api/results/:id` - Update result
- `DELETE /api/results/:id` - Delete result
- `GET /api/results/:id/pdf` - Download result as PDF

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ResultManager.tsx    # Main container component
│   │   ├── ResultForm.tsx       # Form for creating results
│   │   └── ResultList.tsx       # List and display results
│   ├── services/
│   │   └── api.ts              # API service configuration
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── App.tsx                 # Main application component
├── server/
│   ├── models/
│   │   ├── Category.js         # Category schema
│   │   └── Result.js           # Result schema
│   ├── routes/
│   │   ├── categories.js       # Category API routes
│   │   └── results.js          # Result API routes
│   └── server.js               # Express server setup
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.