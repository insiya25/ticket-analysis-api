# EquiTicket - Ticket Analysis System

A comprehensive ticket analysis system with a FastAPI backend and React frontend dashboard for analyzing and visualizing support ticket data.

## 📋 Project Structure

```
TICKETS/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── Ticket.csv          # Ticket data
├── frontend/
│   ├── src/                # React source code
│   ├── package.json        # Node dependencies
│   └── ...
└── README.md               # This file
```

## 🚀 Features

### Backend (FastAPI)
- **Ticket Categorization**: Automatically categorizes 916 tickets into 16 categories
- **5 API Endpoints**:
  - `/api/category-analysis` - Get ticket counts by category
  - `/api/client-analysis` - Get ticket counts by client
  - `/api/full-analysis` - Get combined analysis
  - `/api/tickets-by-category/{category}` - Get tickets for specific category
  - `/api/tickets-by-client/{client}` - Get tickets for specific client
- **CORS Enabled**: Allows frontend requests
- **Interactive API Docs**: Swagger UI at `/docs`

### Frontend (React + Vite + TypeScript)
- **4 Main Views**:
  - **Overview**: Metric cards + beautiful bar charts
  - **Category Analysis**: Searchable table with progress bars
  - **Client Distribution**: Pie chart + ranking table
  - **Raw Tickets**: Full data table with pagination
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Fully Responsive**: Mobile, tablet, and desktop support
- **Export Functionality**: Download data as CSV or Excel
- **Real-time Search**: Filter data across all pages

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to project root**:
   ```bash
   cd c:\Users\Faiz Khan\Documents\INSIYA\TICKETS
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure `Ticket.csv` is present** in the same directory as `main.py`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

## ▶️ Running the Application

You need to run **both** the backend and frontend servers simultaneously.

### Option 1: Using Two Terminal Windows

**Terminal 1 - Backend**:
```bash
# From project root
python main.py
```
Backend will run on: `http://localhost:8000`

**Terminal 2 - Frontend**:
```bash
# From frontend directory
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Option 2: Using uvicorn (Backend Alternative)

**Terminal 1 - Backend**:
```bash
# From project root
uvicorn main:app --reload
```

**Terminal 2 - Frontend**:
```bash
# From frontend directory
npm run dev
```

### Accessing the Application

1. **Frontend Dashboard**: Open browser to `http://localhost:5173`
2. **Backend API Docs**: Open browser to `http://localhost:8000/docs`

## 📊 Ticket Categories

The system categorizes tickets into 16 categories:

1. Licensing
2. Signature Issues
3. Enhancements / Change Requests
4. User Access & Client Contact Management
5. Recurring Publication Content Support
6. Control Panel & Cover Form Issues
7. Publishing Workflow
8. Email & Distribution Issues
9. Charts, Exhibits & Visual Issues
10. Financial Data & Formula Accuracy
11. Website & UI Issues
12. Compliance & Regulatory Requirements
13. Excel Plugin & Financial Model Sync
14. Disclaimer Changes
15. Application Bugs & System Errors
16. Manual Review / Unclassified

## 🎨 Dashboard Features

### Overview Page
- Total Support Tickets: 916
- Active Clients: 34
- Issue Categories: 16
- Top 10 Issue Categories (Horizontal Bar Chart)
- Top 10 High-Activity Clients (Vertical Bar Chart)

### Category Analysis
- Searchable table with all 16 categories
- Rank, Issue Category, Count, Distribution %
- Beautiful progress bars for visual distribution
- Export to CSV/Excel

### Client Distribution
- Pie chart showing top 10 client share
- Complete client ranking table
- Metric cards for key statistics
- Export functionality

### Raw Tickets
- Full data table with all 916 tickets
- Search across all columns
- Pagination (20 tickets per page)
- Category badges
- Export filtered or all data

## 🔧 Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pandas** - Data processing and analysis
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **XLSX** - Excel export

## 📝 API Endpoints

### GET `/api/category-analysis`
Returns ticket counts grouped by category.

**Response**:
```json
{
  "success": true,
  "total_tickets": 916,
  "data": [
    {
      "Issue Category": "Publishing Workflow",
      "Count": 162
    }
  ]
}
```

### GET `/api/client-analysis`
Returns ticket counts grouped by client.

### GET `/api/full-analysis`
Returns combined category and client analysis.

### GET `/api/tickets-by-category/{category}`
Returns all tickets for a specific category.

### GET `/api/tickets-by-client/{client}`
Returns all tickets for a specific client.

## 🎯 Development

### Backend Development
```bash
# Run with auto-reload
uvicorn main:app --reload

# Run tests (if available)
pytest
```

### Frontend Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📦 Building for Production

### Backend
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with gunicorn (production server)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```bash
# Build optimized production bundle
npm run build

# Output will be in frontend/dist/
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend CORS middleware is configured
- Check that frontend is running on allowed origin (localhost:5173)

### Backend Not Starting
- Verify `Ticket.csv` exists in the same directory as `main.py`
- Check Python version (3.8+)
- Ensure all dependencies are installed

### Frontend Not Loading Data
- Verify backend is running on `http://localhost:8000`
- Check browser console for errors
- Ensure CORS is properly configured

### Port Already in Use
- Backend: Change port in `main.py` (line 378: `uvicorn.run(app, host="0.0.0.0", port=8000)`)
- Frontend: Vite will automatically try the next available port

## 👥 Authors

- **Backend**: FastAPI ticket categorization system
- **Frontend**: React dashboard with modern UI/UX

## 📄 License

This project is for internal use.

## 🙏 Acknowledgments

- Ticket categorization logic based on Excel Power Query formula
- UI design inspired by modern dashboard best practices
