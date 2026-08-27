-- Run this in pgAdmin 4 while connected to the "postgres" database
-- (Query Tool → make sure Autocommit is on).
-- CREATE DATABASE cannot run inside a transaction.

CREATE DATABASE pakhuis_tiles
    WITH OWNER = postgres
         ENCODING = 'UTF8';
