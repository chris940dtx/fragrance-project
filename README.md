# Fragrance Search App

A web application that searches and displays fragrance information by scraping data from Aura Fragrance website.

## Features

- Search for fragrances by name
- Display product information (name, price, image)
- Clean React frontend with TypeScript
- Node.js backend with web scraping capabilities

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Web Scraping**: Cheerio, Axios

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fragranceProject
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Run the application**
   
   **Terminal 1 - Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:3001

   **Terminal 2 - Start the frontend:**
   ```bash
   cd client
   npm start
   ```
   Frontend will run on http://localhost:3000

4. **Use the app**
   - Open http://localhost:3000 in your browser
   - Enter a fragrance name in the search box
   - Click "Search" to see results

