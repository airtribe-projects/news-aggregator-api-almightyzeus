
# News Aggregator API

## Overview
This project is a RESTful API for a personalized news aggregator. Users can register, set their news preferences, fetch news articles from [NewsAPI.org](https://newsapi.org/), mark articles as read or favorite, and search for news. The API uses JWT authentication and supports caching for efficient news retrieval.

## Features
- User registration and login with JWT authentication
- Set and update news preferences (categories, keywords, etc.)
- Fetch news articles based on user preferences (from NewsAPI.org)
- Mark articles as read or favorite
- Retrieve read and favorite articles
- Search news by keyword
- In-memory caching for news articles (with periodic background updates)

## Project Structure

```
├── app.js                  # Main application entry point
├── db.js                   # Database connection
├── package.json            # Project dependencies and scripts
├── .env                    # Environment variables (see below)
├── controllers/            # Route handler logic (users, preferences, news)
├── middleware/             # Authentication middleware
├── models/                 # Mongoose models (users)
├── routes/                 # Express route definitions
├── test/                   # Test cases
```

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Create a `.env` file in the root directory**
   - Fill in the following values:
     ```env
     # MONGO_URI can be any valid MongoDB connection string (local or cloud, e.g. MongoDB Atlas)
     MONGO_URI=mongodb://127.0.0.1:27017/news-api
     # or e.g. MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/news-api
     JWT_SECRET=your_jwt_secret
     NEWS_API_KEY=your_newsapi_key   # Get this from https://newsapi.org/
     ```
4. **Start the server**
   ```sh
   npm run dev
   ```
5. **Run tests**
   ```sh
   npm run test
   ```

## API Endpoints

### Auth & User
- `POST /users/register` — Register a new user
- `POST /users/login` — Login and receive JWT

### Preferences
- `GET /preferences` — Get current user's preferences
- `PUT /preferences` — Update preferences (array of strings)

### News
- `GET /news` — Fetch news articles based on preferences (uses NewsAPI.org)
- `POST /news/:id/read` — Mark a news article as read
- `POST /news/:id/favorite` — Mark a news article as favorite
- `GET /news/read` — Get all read articles
- `GET /news/favorites` — Get all favorite articles
- `GET /news/search/:keyword` — Search news by keyword

**All /news and /preferences endpoints require JWT authentication.**

#### Example Request (with JWT):
```
GET /news
Authorization: Bearer <your_jwt_token>
```

## NewsAPI Integration
- News articles are fetched from [NewsAPI.org](https://newsapi.org/).
- You must provide a valid `NEWS_API_KEY` in your `.env` file.
- See [NewsAPI docs](https://newsapi.org/docs) for more info.

## Caching & Architecture
- News articles are cached in-memory per user for 10 minutes to reduce API calls.
- The cache is updated in the background every 10 minutes.
- User model stores preferences, readArticles, and favoriteArticles.
- Controllers handle business logic; routes handle HTTP endpoints.

## Testing
- Run all tests with:
  ```sh
  npm run test
  ```
- Ensure MongoDB is running locally for tests to pass.

---
**Author:** Chinmay Pendse
