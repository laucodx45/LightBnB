# LightBnb
- LightBnb is a simple multi-page Airbnb clone that uses server-side Javascript to display the information from queries to web pages via SQL queries

- This project focuses on designing a robust relational database, the LightBnb database has been meticulously designed with normalization in mind, ensuring efficient storage and retrieval of data. The database is responsible for storing property details, user information, reservations, and reviews.

## Features

### 1. Create Listings
- Easily create and showcase your property listings to potential guests.


### 2. View Reservations
- Access a overview of your reservations, allowing you to keep track of upcoming stays and past reservations with ease.

### 3. Property Ratings
- Users can explore and view ratings for each property on LighthouseBnB.

### 4. Advanced Search
- Refine your property search with precision using our advanced search filters. Set minimum and maximum cost limits, filter by minimum ratings, and specify the city to discover the perfect accommodations.

### 5. User Authentication
- Create a secure account, log in, and enjoy personalized experiences on LighthouseBnB. Log out when you're done to ensure the security of your account.

## Final Product
![screenshot of the search bar](https://github.com/laucodx45/LightBnB/raw/master/img/searchbar.png)
![screenshot of the search result](https://github.com/laucodx45/LightBnB/raw/master/img/searchResult.png)
<img src="https://github.com/laucodx45/LightBnB/raw/master/img/createListing.png" alt="create listing screenshot" width="400" />
![screenshot of the new listing that user just created](https://github.com/laucodx45/LightBnB/raw/master/img/myListing.png)

## Getting Started
1. Clone the repository: git clone https://github.com/laucodx45/LightBnB.git
2. Navigate to the project directory: `cd LighthouseBnB/LightBnB_WebApp-master`
3. Install dependencies `npm install`
4. Open `.env.example` and add your database connection details:

   ```env
   USER=your_database_user
   PASSWORD=your_database_password
   HOST=your_database_host
   DATABASE=your_database_name
5. Open database.js in and change the following line to point to your .env.example file
```const PATH = path.resolve(__dirname, '../.env.example');```
6. Run SQL queries from migration schema files and seeds files to create tables and seed data into your local database
7. `npm run local` to start the server
8. Visit the site `http://localhost:3000/`on your browser