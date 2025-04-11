# SQL Beats - Master Solution List

This document contains the solutions and explanations for all levels in SQL Beats.

## Level 1: The Rookie Manager
**Task:** List all artists signed to the label.
```sql
SELECT name FROM Artists;
```
**Concepts:** Basic SELECT statement, retrieving data from a single table.

## Level 2: Genre Explorer
**Task:** List all artists with their respective genres.
```sql
SELECT name, genre FROM Artists;
```
**Concepts:** Selecting multiple columns from a single table.

## Level 3: Rock Stars Only
**Task:** Find all artists who are in the 'Rock' genre.
```sql
SELECT name FROM Artists WHERE genre = 'Rock';
```
**Concepts:** WHERE clause, filtering data based on a condition.

## Level 4: Recent Releases
**Task:** List all albums released after 2020, showing the title and release year.
```sql
SELECT title, release_year FROM Albums WHERE release_year > 2020;
```
**Concepts:** Comparison operators in WHERE clause.

## Level 5: Tour Planner
**Task:** Find all venues with a capacity greater than 15000, showing the venue name, city, and capacity.
```sql
SELECT name, city, capacity FROM Venues WHERE capacity > 15000;
```
**Concepts:** Numeric comparisons in WHERE clause.

## Level 6: Album Inspector
**Task:** List all albums with their artist names, showing album title and artist name.
```sql
SELECT Albums.title, Artists.name FROM Albums JOIN Artists ON Albums.artist_id = Artists.id;
```
**Concepts:** JOIN clause, relating tables using foreign keys.

## Level 7: Concert Revenue
**Task:** Calculate the total revenue for each concert (ticket_price * tickets_sold), showing concert_date, venue name, and total revenue.
```sql
SELECT Concerts.concert_date, Venues.name, (Concerts.ticket_price * Concerts.tickets_sold) AS total_revenue 
FROM Concerts JOIN Venues ON Concerts.venue_id = Venues.id;
```
**Concepts:** Calculated fields, arithmetic operations, column aliases.

## Level 8: Sales Analyzer
**Task:** Find the total units sold for each album, grouped by country, showing album title, country, and total units.
```sql
SELECT Albums.title, Sales.country, SUM(Sales.units_sold) AS total_units 
FROM Sales JOIN Albums ON Sales.album_id = Albums.id 
GROUP BY Albums.title, Sales.country;
```
**Concepts:** GROUP BY clause, SUM() function, aggregation.

## Level 9: Top Performers
**Task:** Rank artists by their total album sales, showing artist name and total units sold, with the highest sales first.
```sql
SELECT Artists.name, SUM(Sales.units_sold) AS total_sales 
FROM Artists JOIN Albums ON Artists.id = Albums.artist_id 
JOIN Sales ON Albums.id = Sales.album_id 
GROUP BY Artists.name 
ORDER BY total_sales DESC;
```
**Concepts:** Multiple joins, ORDER BY clause, sorting results.

## Level 10: Chart Topper
**Task:** Find the artist name, album title, week starting date, and units sold for the highest single-week album sales record.
```sql
SELECT Artists.name, Albums.title, Sales.week_starting, Sales.units_sold 
FROM Artists JOIN Albums ON Artists.id = Albums.artist_id 
JOIN Sales ON Albums.id = Sales.album_id 
ORDER BY Sales.units_sold DESC LIMIT 1;
```
**Concepts:** LIMIT clause, complex queries, data analysis.

## Level 11: Genre Popularity
**Task:** Find the total sales for each genre in each country, showing genre, country, and total units sold, ordered by total sales descending.
```sql
SELECT Artists.genre, Sales.country, SUM(Sales.units_sold) AS total_sales 
FROM Artists JOIN Albums ON Artists.id = Albums.artist_id 
JOIN Sales ON Albums.id = Sales.album_id 
GROUP BY Artists.genre, Sales.country 
ORDER BY total_sales DESC;
```
**Concepts:** Multi-column GROUP BY, complex aggregations.

## Level 12: Concert Season
**Task:** Find the average ticket price and total revenue for concerts in each season (Spring, Summer, Fall, Winter), based on the concert date.
```sql
SELECT 
    CASE 
        WHEN strftime('%m', concert_date) IN ('03', '04', '05') THEN 'Spring'
        WHEN strftime('%m', concert_date) IN ('06', '07', '08') THEN 'Summer'
        WHEN strftime('%m', concert_date) IN ('09', '10', '11') THEN 'Fall'
        ELSE 'Winter'
    END AS season,
    AVG(ticket_price) AS avg_ticket_price,
    SUM(ticket_price * tickets_sold) AS total_revenue 
FROM Concerts 
GROUP BY season 
ORDER BY total_revenue DESC;
```
**Concepts:** CASE statements, date functions, advanced aggregations.

## Level 13: Album Evolution
**Task:** For each artist, find their first and most recent album release years, and the total sales difference between their first and most recent albums.
```sql
SELECT 
    a.name,
    MIN(al.release_year) AS first_album_year,
    MAX(al.release_year) AS recent_album_year,
    (SELECT SUM(s.units_sold) 
     FROM Sales s 
     JOIN Albums al2 ON s.album_id = al2.id 
     WHERE al2.artist_id = a.id AND al2.release_year = MAX(al.release_year)) -
    (SELECT SUM(s.units_sold) 
     FROM Sales s 
     JOIN Albums al2 ON s.album_id = al2.id 
     WHERE al2.artist_id = a.id AND al2.release_year = MIN(al.release_year)) 
    AS sales_difference 
FROM Artists a 
JOIN Albums al ON a.id = al.artist_id 
GROUP BY a.id, a.name;
```
**Concepts:** Subqueries, complex calculations, temporal analysis.

## Level 14: Venue Performance
**Task:** Find venues that have hosted more than 5 concerts with an average attendance rate (tickets_sold/capacity) above 80%.
```sql
SELECT 
    v.name,
    COUNT(*) AS total_concerts,
    AVG(c.tickets_sold * 100.0 / v.capacity) AS avg_attendance_rate 
FROM Venues v 
JOIN Concerts c ON v.id = c.venue_id 
GROUP BY v.id, v.name 
HAVING COUNT(*) > 5 AND AVG(c.tickets_sold * 100.0 / v.capacity) > 80 
ORDER BY avg_attendance_rate DESC;
```
**Concepts:** HAVING clause, percentage calculations, advanced filtering.

## Level 15: Artist Growth
**Task:** Find artists whose album sales have increased every year, showing their name and the number of consecutive years of growth.
```sql
WITH yearly_sales AS (
    SELECT 
        a.name,
        al.release_year,
        SUM(s.units_sold) AS total_sales 
    FROM Artists a 
    JOIN Albums al ON a.id = al.artist_id 
    JOIN Sales s ON al.id = s.album_id 
    GROUP BY a.id, a.name, al.release_year
),
growth_check AS (
    SELECT 
        name,
        release_year,
        total_sales,
        LAG(total_sales) OVER (PARTITION BY name ORDER BY release_year) AS prev_year_sales 
    FROM yearly_sales
)
SELECT 
    name,
    COUNT(*) AS years_of_growth 
FROM growth_check 
WHERE total_sales > prev_year_sales OR prev_year_sales IS NULL 
GROUP BY name 
HAVING COUNT(*) = (
    SELECT COUNT(DISTINCT release_year) 
    FROM yearly_sales y2 
    WHERE y2.name = growth_check.name
);
```
**Concepts:** Window functions, Common Table Expressions (CTEs), advanced analytics. 