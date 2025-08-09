# Store Rating Web Application

A comprehensive web application that allows users to submit ratings for stores registered on the platform. Built with React (Vite), Express.js, and PostgreSQL with Prisma.

## Features

### User Roles
- **System Administrator**: Manage users, stores, and view analytics
- **Normal User**: Browse stores, submit ratings, and manage profile
- **Store Owner**: View store ratings and customer feedback

### Key Functionalities
- Role-based authentication and authorization
- Store rating system (1-5 stars)
- Advanced search and filtering
- Real-time dashboard analytics
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT tokens
- **Validation**: React Hook Form + Express Validator

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mdmonauwarulislam/store_rating_app.git
   cd store-rating-app
 

2. **Install dependencies**
   ```bash
   npm run setup
  

3. **Database Setup**
   ```bash
   cd backend
   # Update DATABASE_URL in .env file
   npm run db:push
   npm run db:generate

4. **Environment Variables**
   
   Create `backend/.env`:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/store_rating_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=5000

5. **Start the application**
   ```bash
   npm run dev

   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-password` - Update password

### Users (Admin only)
- `GET /api/users` - Get all users with filtering
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user details

### Stores
- `GET /api/stores` - Get all stores with ratings
- `POST /api/stores` - Create new store (Admin only)

### Ratings
- `POST /api/ratings` - Submit/update rating
- `GET /api/ratings/my-store` - Get store owner's ratings

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard statistics

## Form Validations

- **Name**: 20-60 characters
- **Address**: Maximum 400 characters
- **Password**: 8-16 characters, must include uppercase letter and special character
- **Email**: Standard email validation

## Database Schema

### Users Table
- id, name, email, password, address, role, timestamps

### Stores Table
- id, name, email, address, ownerId, timestamps

### Ratings Table
- id, rating (1-5), userId, storeId, timestamps
- Unique constraint on userId + storeId

## Features by Role

### System Administrator
- Dashboard with total users, stores, and ratings
- Add/manage users and stores
- View detailed user and store listings
- Advanced filtering and sorting

### Normal User
- Browse and search stores
- Submit and modify ratings
- View store details and ratings
- Update password

### Store Owner
- View store dashboard
- See customer ratings and feedback
- View average rating and statistics
- Update password

## Development

### Project Structure
```
store-rating-app/
├── backend/
│   ├── prisma/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── main.jsx
│   └── index.html
└── package.json
```

### Available Scripts
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.