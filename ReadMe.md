# REST API Learning Project

## Overview
This project demonstrates building a RESTful API using Node.js and Express.js. It implements CRUD operations (Create, Read, Update, Delete) for user management with data persistence using JSON files.

## What I Learned

### 1. **Express.js Fundamentals**
- Setting up an Express server
- Creating routes and handling different HTTP methods
- Using middleware for parsing request data
- Serving both HTML and JSON responses

### 2. **REST API Principles**
- **GET**: Retrieve data (users list, specific user)
- **POST**: Create new resources (add new user)
- **PATCH**: Update existing resources (modify user data)
- **DELETE**: Remove resources (delete user)

### 3. **Route Structure**
```javascript
// Different route patterns learned:
app.get('/users')           // Get all users as HTML
app.get('/api/users')       // Get all users as JSON
app.get('/user/:id')        // Get specific user as HTML
app.route('/api/user/:id')  // Handle multiple HTTP methods on same endpoint
```
### 4. **Middleware Usage**
```javascript
app.use(express.urlencoded({ extended: false })); // Parse form data
app.use(express.json());                          // Parse JSON data
```

### 5. **Request Handling**
- Accessing URL parameters: `req.params.id`
- Accessing request body: `req.body`
- Parsing string IDs to integers: `parseInt(req.params.id)`

### 6. **Data Persistence**
- Reading JSON files: `require('./MOCK_DATA.json')`
- Writing to JSON files: `fs.writeFile()`
- Maintaining data consistency between memory and file storage

### 7. **Error Handling**
- Checking if users exist before operations
- Handling file write errors
- Providing meaningful error messages

### 8. **Array Operations for CRUD**
- **Create**: `users.push(newUser)`
- **Read**: `users.find(user => user.id === id)`
- **Update**: Direct property assignment or `Object.assign()`
- **Delete**: `users.filter()` or `users.splice()`

## API Endpoints

### User Routes
- `GET /users` - Returns HTML list of all users
- `GET /api/users` - Returns JSON array of all users
- `GET /user/:id` - Returns HTML for specific user

### CRUD Operations
- `GET /api/user/:id` - Get user by ID (JSON)
- `POST /api/user/:id` - Create new user with specific ID
- `PATCH /api/user/:id` - Update existing user
- `DELETE /api/user/:id` - Delete user

## Key Code Patterns Learned

### 1. Route Chaining
```javascript
app.route('/api/user/:id')
    .get((req, res) => { /* GET logic */ })
    .post((req, res) => { /* POST logic */ })
    .patch((req, res) => { /* PATCH logic */ })
    .delete((req, res) => { /* DELETE logic */ });
```

### 2. Error Handling Pattern
```javascript
if (!userFound) {
    return res.status(404).json({
        message: "User not found",
        status: "error"
    });
}
```

### 3. File Operations
```javascript
fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
        return res.status(500).json({ message: "Error saving data" });
    }
    res.json({ message: "Success" });
});
```

## Common Issues Encountered & Solved

1. **Using `res.body` instead of `req.body`** - Fixed by understanding request vs response objects
2. **String vs Number comparison** - Fixed by parsing IDs to integers
3. **Data not persisting** - Fixed by properly saving to JSON file after operations
4. **Incorrect object structure** - Fixed by using proper spread syntax and object creation

## Tools Used
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Postman** - API testing (since browsers can't test POST/PATCH/DELETE)
- **File System (fs)** - Data persistence
