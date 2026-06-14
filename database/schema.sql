CREATE DATABASE IF NOT EXISTS crm;
USE crm;

CREATE TABLE IF NOT EXISTS leads(
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100),
 email VARCHAR(100),
 source VARCHAR(100),
 status ENUM('new','contacted','converted') DEFAULT 'new',
 notes TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO leads(name,email,source,notes)
VALUES('Demo Client','demo@gmail.com','Website','First follow up pending');