// const properties = require("./json/properties.json");
// const users = require("./json/users.json");
const { Pool } = require('pg');
const { query } = require("express");

const path = require('path');
const PATH = path.resolve(__dirname, '../.env.development');
require("dotenv").config({path: PATH});

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  const queryString = `SELECT * FROM users WHERE users.email = $1`;
  const value1 = email.toLowerCase();
  const values = [value1];

  return pool.query(queryString, values)
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `SELECT * FROM users WHERE users.id = $1`;
  const value1 = id;
  const values = [value1];

  return pool.query(queryString, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const queryString = `
  INSERT INTO users (
  name, email, password) 
  VALUES (
  $1, $2, $3)
  RETURNING *;
  `;

  const values = [user.name, user.email, user.password];

  return pool.query(queryString, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `SELECT properties.*, reservations.*, AVG(rating) as average_rating
  FROM properties
  JOIN reservations ON properties.id = reservations.property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `;
  const value1 = guest_id;
  const value2 = limit;
  const values = [value1, value2];

  return pool.query(queryString, values)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  /*
  options {
    city,
    owner_id,
    minimum_price_per_night,
    maximum_price_per_night,
    minimum_rating;
  }
  */
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    // $placeholder does not start at 0, it starts at $1
    queryString += `WHERE properties.city LIKE $${queryParams.length}`;
  }

  // if owner_id is passed in, only return properties belonging to the owner
  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    queryString += `
    WHERE owner_id = $${queryParams.length}
    `;
  }

  // if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    // cost_per_nights is stored in cents, cents to dollar *100
    queryParams.push(Number(options.minimum_price_per_night * 100));
    queryParams.push(Number(options.maximum_price_per_night * 100));

    if (!queryString.includes('WHERE')) {
      queryString += ` WHERE properties.cost_per_night >= $${queryParams.length - 1} AND properties.cost_per_night <= $${queryParams.length}`;
    } else {
      queryString += `AND properties.cost_per_night >= $${queryParams.length - 1} AND properties.cost_per_night <= $${queryParams.length}`;
    }
  }

  // if a minimum_rating is passed in, only return properties with an average rating equal to or higher than that
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `
    GROUP BY properties.id
    HAVING avg(property_reviews.rating) >= $${queryParams.length}
    `;

    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

  }

  if (!options.minimum_rating) {
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

  }

  return pool.query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  /*
  property{
    owner_id: int,
    title: string,
    description: string,
    thumbnail_photo_url: string,
    cover_photo_url: string,
    cost_per_night: string,
    street: string,
    city: string,
    province: string,
    post_code: string,
    country: string,
    parking_spaces: int,
    number_of_bathrooms: int,
    number_of_bedrooms: int
  }
  */
  const queryString = `
  INSERT INTO properties (
    title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *;
  `;
  // cost_per_night * 100, since we store cost in cents in database
  const queryParams = [property.title, property.description, property.owner_id, property.cover_photo_url, property.thumbnail_photo_url, property.cost_per_night * 100, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, 'TRUE', property.province, property.city, property.country, property.street, property.post_code]
  
  return pool.query(queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });

};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
