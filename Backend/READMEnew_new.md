# ZenAura

Zenaura is a comprehensive platform for psychological assessments, personality tests, and mental health evaluations. It provides tools for creating, managing, and analyzing psychological tests, as well as generating reports and profiles.

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Testing**: Jest with Supertest
- **Validation**: Express Validator

## Project Structure

```
server/
├── app.js                 # Express app configuration
├── config/               # Configuration files
├── controllers/         # Route controllers
├── middleware/         # Custom middleware
├── models/            # Mongoose models
├── routes/           # Express routes
└── tests/           # Test files
    ├── integration/  # Integration tests
    ├── models/      # Model tests
    └── unit/       # Unit tests
```

## Implementation Steps

1. **Initial Setup**
   - Set up Express.js server with basic middleware
   - Configure MongoDB connection with Mongoose
   - Implement basic error handling and validation middleware

2. **Model Implementation**
   - Create Test model with comprehensive schema
   - Implement PersonalityTrait model
   - Add validation rules and custom methods
   - Configure indexes and relationships

3. **Controller Implementation**
   - Create BaseController for common CRUD operations
   - Implement TestController with specific business logic
   - Add support for pagination and filtering
   - Handle metadata and versioning

4. **Route Implementation**
   - Set up route handlers with proper middleware
   - Implement authentication and authorization checks
   - Add input validation using express-validator
   - Configure proper error responses

5. **Testing**
   - Set up Jest testing environment
   - Create integration tests for API endpoints
   - Implement model tests for validation
   - Add unit tests for utility functions

## API Endpoints

### Tests

```
GET    /api/tests              # Get all tests (paginated)
POST   /api/tests              # Create new test (admin only)
GET    /api/tests/:id          # Get single test
PUT    /api/tests/:id          # Update test (admin only)
DELETE /api/tests/:id          # Archive test (admin only)
```

### Personality Traits

```
GET    /api/personality-traits              # Get all traits
POST   /api/personality-traits              # Create trait (admin only)
GET    /api/personality-traits/:id          # Get single trait
PUT    /api/personality-traits/:id          # Update trait (admin only)
DELETE /api/personality-traits/:id          # Archive trait (admin only)
PUT    /api/personality-traits/:id/relationships  # Update relationships
```

## Test Coverage

The project includes comprehensive test coverage:
- Integration tests for all API endpoints
- Model validation tests
- Authentication and authorization tests
- Error handling tests

Current test coverage: 44 tests across 6 test suites

## Running the Project

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run the server:
```bash
npm start
```

4. Run tests:
```bash
npm test
```

## Authentication

The API uses JWT for authentication. Protected routes require a valid token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Handling

The API implements standardized error responses:
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Data Validation

Input validation is implemented at multiple levels:
1. Route level using express-validator
2. Model level using Mongoose schemas
3. Controller level for business logic validation

## Future Improvements

1. Add rate limiting
2. Implement caching
3. Add API documentation using Swagger
4. Improve error logging
5. Add performance monitoring

## Troubleshooting

### Port Already in Use

If you encounter the error `EADDRINUSE: address already in use :::5000`, it means port 5000 is already being used by another process. Here are the steps to resolve it:

1. Find the process using the port (Windows):
```bash
netstat -ano | findstr :5000
```

2. Kill the process using its PID:
```bash
taskkill /PID <PID> /F
```

Alternatively, you can:
1. Change the port in your `.env` file:
```env
PORT=5000  # or any other available port
```

2. Or use the `cross-env` package to override the port:
```bash
cross-env PORT=5000 npm run dev
```

### Mongoose Deprecation Warnings

If you see Mongoose deprecation warnings about `useNewUrlParser` and `useUnifiedTopology`, these options are no longer needed in recent versions. They can be safely removed from your MongoDB connection options.

### Other Common Issues

1. **MongoDB Connection Failures**
   - Ensure MongoDB is running locally
   - Check your connection string in `.env`
   - Verify network connectivity

2. **JWT Authentication Errors**
   - Verify JWT_SECRET is set in `.env`
   - Check token expiration
   - Ensure proper token format in requests 

## Postman Queries

### Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "your_password"
}

Response:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Tests

1. **Create Test (POST)**
```http
POST /api/tests
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "name": "Big Five Personality Test",
    "description": "Comprehensive personality assessment based on the five-factor model",
    "type": "personality",
    "category": "psychological_assessment",
    "duration": {
        "minimum": 15,
        "maximum": 45,
        "estimated": 30
    },
    "configuration": {
        "maxScore": 100,
        "passingScore": 70,
        "allowRetake": true,
        "showResults": true
    },
    "questions": ["questionId1", "questionId2"],
    "scoringAlgorithm": "algorithmId",
    "metadata": {
        "status": "active",
        "version": 1
    },
    "requirements": {
        "minimumAge": 18,
        "prerequisites": [],
        "restrictions": []
    },
    "localization": {
        "languages": ["en"],
        "defaultLanguage": "en"
    }
}
```

2. **Get All Tests (GET)**
```http
GET /api/tests?page=1&limit=10&category=psychological_assessment
Authorization: Bearer <your_token>

Response:
{
    "tests": [...],
    "pagination": {
        "total": 100,
        "page": 1,
        "pages": 10,
        "limit": 10
    }
}
```

3. **Get Single Test (GET)**
```http
GET /api/tests/:testId
Authorization: Bearer <your_token>

Response:
{
    "test": {
        "id": "testId",
        "name": "Big Five Personality Test",
        ...
    }
}
```

4. **Update Test (PUT)**
```http
PUT /api/tests/:testId
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "name": "Updated Test Name",
    "description": "Updated description",
    "configuration": {
        "maxScore": 120,
        "passingScore": 80
    }
}
```

5. **Archive Test (DELETE)**
```http
DELETE /api/tests/:testId
Authorization: Bearer <your_token>

Response:
{
    "message": "Test archived successfully"
}
```

### Personality Traits

1. **Create Trait (POST)**
```http
POST /api/personality-traits
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "name": "Openness to Experience",
    "description": "Measures curiosity, creativity, and preference for novelty",
    "category": "Big Five",
    "measurementScale": {
        "min": 0,
        "max": 100
    },
    "metadata": {
        "status": "active",
        "version": 1
    }
}
```

2. **Get All Traits (GET)**
```http
GET /api/personality-traits?page=1&limit=10&category=Big Five
Authorization: Bearer <your_token>

Response:
{
    "traits": [...],
    "pagination": {
        "total": 50,
        "page": 1,
        "pages": 5,
        "limit": 10
    }
}
```

3. **Get Single Trait (GET)**
```http
GET /api/personality-traits/:traitId
Authorization: Bearer <your_token>

Response:
{
    "trait": {
        "id": "traitId",
        "name": "Openness to Experience",
        ...
    }
}
```

4. **Update Trait (PUT)**
```http
PUT /api/personality-traits/:traitId
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "name": "Updated Trait Name",
    "description": "Updated description",
    "measurementScale": {
        "min": 0,
        "max": 120
    }
}
```

5. **Archive Trait (DELETE)**
```http
DELETE /api/personality-traits/:traitId
Authorization: Bearer <your_token>

Response:
{
    "message": "Trait archived successfully"
}
```

6. **Update Trait Relationships (PUT)**
```http
PUT /api/personality-traits/:traitId/relationships
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "relatedTraits": [
        {
            "traitId": "relatedTraitId1",
            "relationship": "positive",
            "strength": 0.8
        },
        {
            "traitId": "relatedTraitId2",
            "relationship": "negative",
            "strength": 0.6
        }
    ]
}
```

### Common Query Parameters

- **Pagination**: `page` (default: 1), `limit` (default: 10)
- **Filtering**: `status`, `category`, `type`
- **Sorting**: `sort` (e.g., "name:asc", "createdAt:desc")
- **Search**: `search` (searches in name and description)

### Response Format

All responses follow this standard format:
```json
{
    "success": true,
    "data": {
        // Response data here
    },
    "pagination": {
        // Pagination details (if applicable)
    },
    "error": null // Error details if success is false
}
```

### Error Response Format

```json
{
    "success": false,
    "data": null,
    "error": {
        "code": "ERROR_CODE",
        "message": "Error description",
        "details": {} // Additional error details if available
    }
}
```

## Testing with Postman

### Initial Setup

1. **Environment Setup**
   ```
   1. Open Postman
   2. Click "Environments" in the sidebar
   3. Click "New Environment"
   4. Name it "ZenAura Local"
   5. Add these variables:
      - baseUrl: http://localhost:3001
      - token: [leave empty initially]
   6. Click "Save"
   ```

2. **Import Collection**
   ```
   1. Download the Postman collection from /postman/ZenAura.postman_collection.json
   2. In Postman, click "Import"
   3. Drag the collection file or browse to select it
   4. Click "Import"
   ```

3. **Authentication Setup**
   ```http
   POST {{baseUrl}}/api/auth/login
   Content-Type: application/json

   {
       "email": "admin@example.com",
       "password": "your_password"
   }
   ```
   After successful login:
   ```
   1. In the response, copy the token value
   2. Go to your environment
   3. Paste the token in the "token" variable
   4. Click "Save"
   ```

### Testing CRUD Operations

#### 1. Tests

**Create Test (POST)**
```http
1. Select POST method
2. Enter URL: {{baseUrl}}/api/tests
3. Headers:
   - Authorization: Bearer {{token}}
   - Content-Type: application/json
4. Body (raw JSON):
{
    "name": "Sample Personality Test",
    "description": "A test description",
    "type": "personality",
    "category": "psychological_assessment",
    "duration": {
        "minimum": 15,
        "maximum": 45,
        "estimated": 30
    },
    "configuration": {
        "maxScore": 100,
        "passingScore": 70,
        "allowRetake": true,
        "showResults": true
    },
    "questions": ["questionId1", "questionId2"],
    "scoringAlgorithm": "algorithmId",
    "metadata": {
        "status": "active",
        "version": 1
    }
}
5. Click Send
6. Save the returned test ID for later use
```

**Get All Tests (GET)**
```http
1. Select GET method
2. Enter URL: {{baseUrl}}/api/tests
3. Headers:
   - Authorization: Bearer {{token}}
4. Query Params:
   - page: 1
   - limit: 10
   - category: psychological_assessment
5. Click Send
```

**Get Single Test (GET)**
```http
1. Select GET method
2. Enter URL: {{baseUrl}}/api/tests/:testId
3. Replace :testId with actual ID
4. Headers:
   - Authorization: Bearer {{token}}
5. Click Send
```

**Update Test (PUT)**
```http
1. Select PUT method
2. Enter URL: {{baseUrl}}/api/tests/:testId
3. Replace :testId with actual ID
4. Headers:
   - Authorization: Bearer {{token}}
   - Content-Type: application/json
5. Body (raw JSON):
{
    "name": "Updated Test Name",
    "description": "Updated description"
}
6. Click Send
```

**Delete Test (DELETE)**
```http
1. Select DELETE method
2. Enter URL: {{baseUrl}}/api/tests/:testId
3. Replace :testId with actual ID
4. Headers:
   - Authorization: Bearer {{token}}
5. Click Send
```

#### 2. Personality Traits

**Create Trait (POST)**
```http
1. Select POST method
2. Enter URL: {{baseUrl}}/api/personality-traits
3. Headers:
   - Authorization: Bearer {{token}}
   - Content-Type: application/json
4. Body (raw JSON):
{
    "name": "Openness",
    "description": "Openness to experience",
    "category": "Big Five",
    "measurementScale": {
        "min": 0,
        "max": 100
    }
}
5. Click Send
6. Save the returned trait ID
```

### Testing Tips

1. **Verify Response Status**
   - 200: Successful GET/PUT
   - 201: Successful POST
   - 204: Successful DELETE
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Server Error

2. **Common Issues & Solutions**
   ```
   - "Unauthorized": Check if token is valid and properly set
   - "Not Found": Verify ID in URL
   - "Validation Error": Check request body format
   ```

3. **Testing Workflow**
   ```
   1. Always start with authentication
   2. Test happy path first (valid inputs)
   3. Test edge cases:
      - Invalid IDs
      - Missing required fields
      - Invalid data types
      - Unauthorized access
   4. Test pagination and filters
   ```

4. **Environment Variables**
   ```
   Use environment variables for:
   - baseUrl
   - token
   - testId (after creating a test)
   - traitId (after creating a trait)
   ```

5. **Response Validation**
   ```
   Check for:
   1. Correct status code
   2. Expected response format
   3. All required fields in response
   4. Proper data types
   5. Pagination details (when applicable)
   ```

### Automated Testing with Postman

1. **Write Tests**
   ```javascript
   // Example test script for POST request
   pm.test("Response status code is 201", function () {
       pm.response.to.have.status(201);
   });

   pm.test("Response has required fields", function () {
       const response = pm.response.json();
       pm.expect(response).to.have.property('id');
       pm.expect(response).to.have.property('name');
   });
   ```

2. **Run Collection**
   ```
   1. Click "..." next to collection
   2. Select "Run collection"
   3. Choose environment
   4. Click "Run"
   ```

3. **View Results**
   ```
   - Check test results
   - View response times
   - Check error messages
   ```

### API Connection Issues

If you encounter `ECONNREFUSED` errors when trying to connect to the API, check these common issues:

1. **Wrong Protocol**
   ```
   ❌ https://localhost:3001  (incorrect)
   ✅ http://localhost:5000   (correct)
   ```
   The server runs on HTTP by default, not HTTPS.

2. **Wrong Port**
   ```
   ❌ localhost:3001  (incorrect)
   ✅ localhost:5000  (correct)
   ```
   Check the PORT in your .env file (default is 5000).

3. **Server Not Running**
   ```bash
   # Start the server in development mode
   npm run dev

   # Or in production mode
   npm start
   ```

4. **Environment Setup**
   In Postman:
   ```
   1. Check your environment variables
   2. Ensure baseUrl is set to: http://localhost:3001
   3. Make sure the environment is selected
   ```

5. **Request Format**
   ```http
   POST http://localhost:3001/api/auth/login
   Content-Type: application/json

   {
       "email": "admin@example.com",
       "password": "your_password"
   }
   ```

To fix the connection refused error:

1. *Verify server is running:*
```bash
# Check if something is running on port 5000
netstat -ano | findstr :5000
```

2. *Check server logs:*
```bash
# Look for any startup errors
npm run dev
```
3. *kill the port:*
```bash
# kill the running port and re-run npm start dev
npx kill-port 5000
```

3. *Update Postman environment:*
```
1. Go to Environment settings
2. Set baseUrl to http://localhost:5000
3. Save changes
4. Select the environment
```

4. *Try the request again:*
```http
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "your_password"
}
``` 