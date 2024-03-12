const mysql = require('mysql2/promise')
const path = require('path')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'artizo',
  port: process.env.DB_PORT || 3011,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Async function to insert data into the transaction table
async function insertPaymentData(offer_id,amount,gig_id) {
    try {
        // Define the SQL query
        const sql = 'INSERT INTO transaction (offer_id, amount, gig_id) VALUES (?, ?, ?)';

        // Execute the SQL query with the provided data using pool.query
        const [rows] = await pool.query(sql, [offer_id, amount, gig_id])

        // Return the inserted row
        return rows
    } catch (error) {
        console.error('Error inserting data into follow table:', error)
        throw error
    }
}

async function updateNoOfCustomersById(gig_id) {
    try {
      // Define the SQL update query
      const sql = 'UPDATE gigs SET no_customers = no_customers + 1 WHERE id = ?';
  
      // Execute the update query with the provided uniqueId
      const [rows, fields] = await pool.query(sql, [gig_id]);
  
      return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  async function updateRatingById(gig_id,score) {
    try {
      // Define the SQL update query
      const sql = `UPDATE gigs
      SET rating = ((rating * no_customers + ?) / (no_customers + 1)) WHERE id = ?`

       // Execute the update query with the provided gig_id and score
       const [rows, fields] = await pool.query(sql, [score, gig_id]);
  
      return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }



module.exports = {
    insertPaymentData,
    updateNoOfCustomersById,
    updateRatingById,
}