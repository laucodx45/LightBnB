# LightBnb
- LightBnb is a simple multi-page Airbnb clone that uses server-side Javascript to display the information from queries to web pages via SQL queries

- This project focuses on designing a robust database, the LightBnb database has been meticulously designed with normalization in mind, ensuring efficient storage and retrieval of data. The database is responsible for storing property details, user information, reservations, and reviews.

##

## Getting Started
1. Clone the repository: git clone https://github.com/laucodx45/LightBnB.git
2. Navigate to the project directory: `cd LighthouseBnB/LightBnB_WebApp-master`
3. Install dependencies `npm install`
4. Create a `.env` file in the root directory and add your database connection details:

   ```env
   USER=your_database_user
   PASSWORD=your_database_password
   HOST=your_database_host
   DATABASE=your_database_name
5. Open database.js in and change the following line to point to your .env file
```const PATH = path.resolve(__dirname, '../.env');```
6. Run SQL queries from migration schema files and seeds files to create tables and seed data into your local database
7. `npm run local` to start the server
8. Visit the site `http://localhost:3000/`on your browser
