from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
from datetime import datetime
from typing import Optional, List, Dict
import os

app = FastAPI(title="Ticket Analysis API", version="1.0.0")


# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the CSV file
CSV_FILE_PATH = "Ticket.csv"


def categorize_ticket(subject: str) -> str:
    """
    Categorize a ticket based on its subject line.
    This function replicates the Excel Power Query formula logic.
    """
    if not subject or pd.isna(subject):
        return "Manual Review / Unclassified"
    
    sub = subject.lower().strip()
    
    # 1. LICENSING
    if any(keyword in sub for keyword in ["license", "licence", "renewal", "sbom"]):
        return "Licensing"
    
    # SIGNATURE ISSUES
    if "signature" in sub:
        return "Signature Issues"
    
    # ENHANCEMENTS / CHANGE REQUESTS
    if any(keyword in sub for keyword in [
        "enhancement", "enhance", "improvement", "change request",
        "new feature", "feature request", "requirement", "modification",
        "customization", "add new", "update requirement"
    ]):
        return "Enhancements / Change Requests"
    
    # UAT / TESTING (part of Application Bugs & System Errors)
    if any(keyword in sub for keyword in ["uat", "user acceptance", "testing", "test environment"]):
        return "Application Bugs & System Errors"
    
    # 2. USER ACCESS & CLIENT CONTACT MANAGEMENT
    if any(keyword in sub for keyword in [
        "reistate", "reinstance", "reinstate", "restore", "reset",
        "password", "login", "username", "invalid user", "existing id",
        "profile", "disable", "otp", "access", "contact", "crm",
        "portal", "account", "country code", "vapt", "vulnerability", "vulnerability:"
    ]):
        return "User Access & Client Contact Management"
    
    # 3. RECURRING PUBLICATION CONTENT SUPPORT
    if any(keyword in sub for keyword in [
        "daily", "weekly", "newsletter", "ipo", "brief", "digest",
        "market watch", "economy report", "strategy report", "saudi", "morning"
    ]):
        return "Recurring Publication Content Support"
    
    # 4. CONTROL PANEL & COVER FORM ISSUES
    if any(keyword in sub for keyword in [
        "control panel", "cp", "cover form", "coverform", "make public", "dashboard"
    ]):
        return "Control Panel & Cover Form Issues"
    
    # 5A. PUBLISHING WORKFLOW
    if any(keyword in sub for keyword in [
        "generate", "publish", "workflow", "merge", "submit",
        "distribution", "released report", "refresh", "report", "featured"
    ]):
        return "Publishing Workflow"
    
    # 5B. EMAIL & DISTRIBUTION ISSUES
    if any(keyword in sub for keyword in [
        "mail", "email", "mailer", "attachment", "not receiving",
        "not delivered", "delivery", "bounce", "spam"
    ]):
        return "Email & Distribution Issues"
    
    # 6. CHARTS / EXHIBITS / VISUAL ISSUES
    if any(keyword in sub for keyword in [
        "chart", "exhibit", "placeholder", "trend", "graph", "table",
        "design", "images", "banner", "date style"
    ]):
        return "Charts, Exhibits & Visual Issues"
    
    # 7. FINANCIAL DATA & FORMULA ACCURACY
    if any(keyword in sub for keyword in [
        "price", "tp", "target price", "valuation", "yield", "advt",
        "cmp", "mcap", "ev number", "fcf", "ratio", "value",
        "incorrect", "mismatch", "market data", "code", "identifier",
        "mapping", "rename", "ev/ebitda", "financials"
    ]):
        return "Financial Data & Formula Accuracy"
    
    # 8. WEBSITE / UI ISSUES
    if any(keyword in sub for keyword in [
        "website", "page", "blank", "scroll", "ui", "not playing",
        "template", "auto update"
    ]):
        return "Website & UI Issues"
    
    # 9. COMPLIANCE & REGULATORY REQUIREMENTS
    if any(keyword in sub for keyword in [
        "sebi", "compliance", "policy", "charter", "grievance",
        "disclosure", "terms & conditions"
    ]):
        return "Compliance & Regulatory Requirements"
    
    # 10. EXCEL PLUGIN & FINANCIAL MODEL SYNC
    if any(keyword in sub for keyword in [
        "excel", "bloomberg", "factset", "upload", "model",
        "query builder", "equiexcel", "equiword", "add-in",
        "plugin", "sync", "fetch", "word to html"
    ]):
        return "Excel Plugin & Financial Model Sync"
    
    # DISCLAIMER CHANGES
    if "disclaimer" in sub:
        return "Disclaimer Changes"
    
    # 11. APPLICATION BUGS & SYSTEM ERRORS
    if any(keyword in sub for keyword in [
        "error", "exception", "failed", "crash", "lag", "freeze",
        "not working", "unable", "delay", "stuck", "problem",
        "issue", "bug", "bugs raised"
    ]):
        return "Application Bugs & System Errors"
    
    # Catch-all for manual review
    return "Manual Review / Unclassified"


    # Catch-all for manual review
    return "Manual Review / Unclassified"


def filter_dataframe(
    df: pd.DataFrame,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    client_name: Optional[str] = None
) -> pd.DataFrame:
    """
    Filter the dataframe based on provided criteria using a boolean mask
    to preserve original data types for serialization.
    """
    # Create distinct copies for type conversion to allow filtering
    # but apply the mask to the original dataframe
    temp_df = df.copy()
    
    # Initialize mask as all True
    mask = pd.Series(True, index=df.index)

    # Convert date columns to datetime objects in temp_df
    raised_date_col = 'Raised Date' if 'Raised Date' in temp_df.columns else 'Raised date'
    resolved_date_col = 'Resolved date' if 'Resolved date' in temp_df.columns else 'Resolved Date'

    if raised_date_col in temp_df.columns:
        temp_df[raised_date_col] = pd.to_datetime(temp_df[raised_date_col], errors='coerce')
    
    # Filter by Client Name
    if client_name and 'Client' in temp_df.columns:
        mask &= temp_df['Client'].str.contains(client_name, case=False, na=False)

    # Filter by Date Range (using Raised Date)
    if start_date and raised_date_col in temp_df.columns:
        try:
            start_dt = pd.to_datetime(start_date)
            mask &= (temp_df[raised_date_col] >= start_dt)
        except:
            pass

    if end_date and raised_date_col in temp_df.columns:
        try:
            end_dt = pd.to_datetime(end_date)
            # Add time to end_dt to include the whole day (23:59:59)
            end_dt = end_dt + pd.Timedelta(hours=23, minutes=59, seconds=59)
            mask &= (temp_df[raised_date_col] <= end_dt)
        except:
            pass

    return df[mask]


@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Ticket Analysis API",
        "endpoints": {
            "category_analysis": "/api/category-analysis",
            "client_analysis": "/api/client-analysis",
            "full_analysis": "/api/full-analysis"
        }
    }


@app.get("/api/category-analysis")
def get_category_analysis(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    client_name: Optional[str] = None
):
    """
    Get ticket count by category with optional filtering
    """
    try:
        if not os.path.exists(CSV_FILE_PATH):
            raise HTTPException(status_code=404, detail=f"CSV file not found: {CSV_FILE_PATH}")
        
        df = pd.read_csv(CSV_FILE_PATH)
        
        # Apply filters
        df = filter_dataframe(df, start_date, end_date, client_name)
        
        if 'Subject' not in df.columns:
            raise HTTPException(status_code=400, detail="'Subject' column not found in CSV")
        
        df['Category'] = df['Subject'].apply(categorize_ticket)
        
        # Count tickets by category
        category_counts = df['Category'].value_counts().reset_index()
        category_counts.columns = ['Issue Category', 'Count']
        
        # Sort by count descending
        category_counts = category_counts.sort_values('Count', ascending=False)
        
        # Convert to list of dictionaries
        result = category_counts.to_dict('records')
        
        return JSONResponse(content={
            "success": True,
            "total_tickets": len(df),
            "data": result
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/client-analysis")
def get_client_analysis(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    client_name: Optional[str] = None
):
    """
    Get ticket count by client with optional filtering
    """
    try:
        if not os.path.exists(CSV_FILE_PATH):
            raise HTTPException(status_code=404, detail=f"CSV file not found: {CSV_FILE_PATH}")
        
        df = pd.read_csv(CSV_FILE_PATH)
        
        # Apply filters
        df = filter_dataframe(df, start_date, end_date, client_name)
        
        if 'Client' not in df.columns:
            raise HTTPException(status_code=400, detail="'Client' column not found in CSV")
        
        # Count tickets by client
        client_counts = df['Client'].value_counts().reset_index()
        client_counts.columns = ['Client', 'Tickets Raised']
        
        # Sort by count descending
        client_counts = client_counts.sort_values('Tickets Raised', ascending=False)
        
        # Convert to list of dictionaries
        result = client_counts.to_dict('records')
        
        return JSONResponse(content={
            "success": True,
            "total_tickets": len(df),
            "total_clients": len(result),
            "data": result
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/full-analysis")
def get_full_analysis(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    client_name: Optional[str] = None
):
    """
    Get both category and client analysis in one call with optional filtering
    """
    try:
        if not os.path.exists(CSV_FILE_PATH):
            raise HTTPException(status_code=404, detail=f"CSV file not found: {CSV_FILE_PATH}")
        
        df = pd.read_csv(CSV_FILE_PATH)
        
        # Apply filters
        df = filter_dataframe(df, start_date, end_date, client_name)
        
        if 'Subject' not in df.columns:
            raise HTTPException(status_code=400, detail="'Subject' column not found in CSV")
        if 'Client' not in df.columns:
            raise HTTPException(status_code=400, detail="'Client' column not found in CSV")
        
        # Apply categorization
        df['Category'] = df['Subject'].apply(categorize_ticket)
        
        # Category analysis
        category_counts = df['Category'].value_counts().reset_index()
        category_counts.columns = ['Issue Category', 'Count']
        category_counts = category_counts.sort_values('Count', ascending=False)
        
        # Client analysis
        client_counts = df['Client'].value_counts().reset_index()
        client_counts.columns = ['Client', 'Tickets Raised']
        client_counts = client_counts.sort_values('Tickets Raised', ascending=False)
        
        return JSONResponse(content={
            "success": True,
            "total_tickets": len(df),
            "category_analysis": {
                "total_categories": len(category_counts),
                "data": category_counts.to_dict('records')
            },
            "client_analysis": {
                "total_clients": len(client_counts),
                "data": client_counts.to_dict('records')
            }
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tickets-by-category/{category:path}")
def get_tickets_by_category(
    category: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    client_name: Optional[str] = None
):
    """
    Get all tickets for a specific category with filtering
    """
    try:
        if not os.path.exists(CSV_FILE_PATH):
            raise HTTPException(status_code=404, detail=f"CSV file not found: {CSV_FILE_PATH}")
        
        df = pd.read_csv(CSV_FILE_PATH)
        
        # Apply filters
        df = filter_dataframe(df, start_date, end_date, client_name)
        
        if 'Subject' not in df.columns:
            raise HTTPException(status_code=400, detail="'Subject' column not found in CSV")
        
        # Apply categorization
        df['Category'] = df['Subject'].apply(categorize_ticket)
        
        # Filter by category (case-insensitive match)
        filtered_df = df[df['Category'].str.lower() == category.lower()]
        
        if len(filtered_df) == 0:
            return JSONResponse(content={
                "success": True,
                "category": category,
                "total_tickets": 0,
                "message": f"No tickets found for category: {category}",
                "data": []
            })
        
        # Replace NaN with empty string for JSON serialization
        filtered_df = filtered_df.fillna("")
        
        # Convert to list of dictionaries
        result = filtered_df.to_dict('records')
        
        return JSONResponse(content={
            "success": True,
            "category": filtered_df['Category'].iloc[0],  # Get actual category name
            "total_tickets": len(filtered_df),
            "data": result
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tickets-by-client/{client}")
def get_tickets_by_client(
    client: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Get all tickets for a specific client with filtering
    """
    try:
        if not os.path.exists(CSV_FILE_PATH):
            raise HTTPException(status_code=404, detail=f"CSV file not found: {CSV_FILE_PATH}")
        
        df = pd.read_csv(CSV_FILE_PATH)
        
        # Apply filters
        df = filter_dataframe(df, start_date, end_date)
        
        if 'Client' not in df.columns:
            raise HTTPException(status_code=400, detail="'Client' column not found in CSV")
        
        # Filter by client (case-insensitive match)
        filtered_df = df[df['Client'].str.lower() == client.lower()]
        
        if len(filtered_df) == 0:
            return JSONResponse(content={
                "success": True,
                "client": client,
                "total_tickets": 0,
                "message": f"No tickets found for client: {client}",
                "data": []
            })
        
        # Apply categorization to show category for each ticket
        filtered_df['Category'] = filtered_df['Subject'].apply(categorize_ticket)
        
        # Replace NaN with empty string for JSON serialization
        filtered_df = filtered_df.fillna("")
        
        # Convert to list of dictionaries
        result = filtered_df.to_dict('records')
        
        return JSONResponse(content={
            "success": True,
            "client": filtered_df['Client'].iloc[0],  # Get actual client name
            "total_tickets": len(filtered_df),
            "data": result
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/clients")
def get_clients():
    """
    Get list of unique unique clients
    """
    try:
        if not os.path.exists(CSV_FILE_PATH):
            raise HTTPException(status_code=404, detail=f"CSV file not found: {CSV_FILE_PATH}")
        
        df = pd.read_csv(CSV_FILE_PATH)
        
        if 'Client' not in df.columns:
            raise HTTPException(status_code=400, detail="'Client' column not found in CSV")
        
        clients = sorted(df['Client'].dropna().unique().tolist())
        
        return JSONResponse(content={
            "success": True,
            "data": clients
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
