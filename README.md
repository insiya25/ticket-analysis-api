# Ticket Analysis API

A FastAPI application that categorizes support tickets from CSV data and provides analysis by category and client.

## Features

- **Category Analysis**: Automatically categorizes tickets based on subject line keywords
- **Client Analysis**: Shows ticket distribution across clients
- **Full Analysis**: Combined view of both category and client analysis

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### 1. Root Endpoint
- **URL**: `/`
- **Method**: GET
- **Description**: Shows available endpoints

### 2. Category Analysis
- **URL**: `/api/category-analysis`
- **Method**: GET
- **Description**: Returns ticket counts grouped by issue category
- **Response Example**:
```json
{
  "success": true,
  "total_tickets": 916,
  "data": [
    {
      "Issue Category": "Publishing Workflow",
      "Count": 162
    },
    {
      "Issue Category": "User Access & Client Contact Management",
      "Count": 143
    }
  ]
}
```

### 3. Client Analysis
- **URL**: `/api/client-analysis`
- **Method**: GET
- **Description**: Returns ticket counts grouped by client
- **Response Example**:
```json
{
  "success": true,
  "total_tickets": 916,
  "total_clients": 34,
  "data": [
    {
      "Client": "SICO Bank",
      "Tickets Raised": 112
    },
    {
      "Client": "Axis Capital",
      "Tickets Raised": 87
    }
  ]
}
```

### 4. Full Analysis
- **URL**: `/api/full-analysis`
- **Method**: GET
- **Description**: Returns both category and client analysis in one call
- **Response Example**:
```json
{
  "success": true,
  "total_tickets": 916,
  "category_analysis": {
    "total_categories": 16,
    "data": [...]
  },
  "client_analysis": {
    "total_clients": 34,
    "data": [...]
  }
}
```

## Interactive API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Ticket Categories

The application categorizes tickets into the following categories:

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

## File Structure

```
TICKETS/
├── Ticket.csv          # Your ticket data
├── main.py             # FastAPI application
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Notes

- Make sure `Ticket.csv` is in the same directory as `main.py`
- The categorization logic matches the Excel Power Query formula provided
- All categories are sorted by count in descending order
