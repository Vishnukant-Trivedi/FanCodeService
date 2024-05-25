const mysql = require('../../src/lib/mysql'); // Path to your MySQL setup


const setupTestDatabase = async () => {
     // Setup test database or mock database connection
     await mysql.query('USE mydb');
     await mysql.query(`
         CREATE TABLE IF NOT EXISTS sports (
             id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
             name VARCHAR(50) NOT NULL,
             status BOOLEAN NOT NULL DEFAULT TRUE,
             recUpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
             createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
         )
     `);
     await mysql.query(`
         CREATE TABLE IF NOT EXISTS tours (
             id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
             name VARCHAR(50) NOT NULL,
             sportId INT NOT NULL,
             status BOOLEAN NOT NULL DEFAULT TRUE,
             startTime TIMESTAMP NOT NULL,
             endTime TIMESTAMP NOT NULL,
             recUpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
             createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (sportId) REFERENCES sports(id)
         )
     `);
     await mysql.query(`
         CREATE TABLE IF NOT EXISTS matches (
             id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
             name VARCHAR(50) NOT NULL,
             tourId INT NOT NULL,
             status BOOLEAN NOT NULL DEFAULT TRUE,
             format VARCHAR(50) NOT NULL,
             startTime TIMESTAMP NOT NULL,
             endTime TIMESTAMP NOT NULL,
             recUpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
             createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (tourId) REFERENCES tours(id)
         )
     `);
     await mysql.query(`
         CREATE TABLE IF NOT EXISTS news (
             id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
             title VARCHAR(255) NOT NULL,
             description TEXT NOT NULL,
             matchId INT DEFAULT NULL,
             tourId INT DEFAULT NULL,
             sportId INT DEFAULT NULL,
             recUpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
             createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (matchId) REFERENCES matches(id),
             FOREIGN KEY (tourId) REFERENCES tours(id),
             FOREIGN KEY (sportId) REFERENCES sports(id)
         )
     `);

     // Seed test data
     await mysql.query('INSERT IGNORE INTO sports (id, name) VALUES (1, "BaseBall"), (2, "HandBall")');
     await mysql.query(`
         INSERT IGNORE INTO tours (id, name, sportId, startTime, endTime)
         VALUES
         (1, 'Indian Dhaba League, 2023', 1, '2023-04-09 00:00:00', '2023-05-30 00:00:00'),
         (2, 'India Supera League, 2023', 2, '2023-04-21 00:00:00', '2023-06-20 00:00:00')
     `);
     await mysql.query(`
         INSERT IGNORE INTO matches (name, tourId, format, startTime, endTime)
         VALUES
         ('AA vs BB', 1, 'T20', '2023-04-09 18:00:00', '2023-04-09 23:00:00'),
         ('CC vs DD', 1, 'T20', '2023-04-10 18:00:00', '2023-04-10 23:00:00')
     `);
}

const teardownTestDatabase = async () => {

     // Cleanup test database
     await mysql.query('DELETE FROM mydb.matches WHERE name IN (\'AA vs BB\', \'CC vs DD\')');
     await mysql.query('DELETE FROM mydb.tours WHERE name IN (\'Indian Dhaba League, 2023\', \'India Supera League, 2023\')');
     await mysql.query('DELETE FROM mydb.sports WHERE name IN (\'BaseBall\', \'HandBall\')');
}




module.exports = { setupTestDatabase, teardownTestDatabase };