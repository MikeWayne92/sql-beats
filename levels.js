// Game levels for SQL Beats
const levels = [
  {
    id: 1,
    title: "The Rookie Manager",
    description: "Welcome to SQL Beats! As a new manager, your first task is to get familiar with the artists signed to the label.",
    task: "List all artists signed to the label.",
    hint: "Use the SELECT statement to retrieve data from the Artists table.",
    solution: "SELECT name FROM Artists;",
    reward: "guitar-riff.mp3",
    tableHints: ["Artists"],
    difficulty: "Easy",
    conceptsIntroduced: ["SELECT statement", "Basic querying"]
  },
  {
    id: 2,
    title: "Genre Explorer",
    description: "Let's dive deeper into our roster. We need to understand what genres our artists represent.",
    task: "List all artists with their respective genres.",
    hint: "Use SELECT with multiple columns.",
    solution: "SELECT name, genre FROM Artists;",
    reward: "bass-line.mp3",
    tableHints: ["Artists"],
    difficulty: "Easy",
    conceptsIntroduced: ["Selecting multiple columns"]
  },
  {
    id: 3,
    title: "Rock Stars Only",
    description: "The marketing team wants to run a special rock music promotion.",
    task: "Find all artists who are in the 'Rock' genre.",
    hint: "Use the WHERE clause to filter results based on the genre column.",
    solution: "SELECT name FROM Artists WHERE genre = 'Rock';",
    reward: "rock-guitar.mp3",
    tableHints: ["Artists"],
    difficulty: "Easy",
    conceptsIntroduced: ["WHERE clause", "Filtering data"]
  },
  {
    id: 4,
    title: "Recent Releases",
    description: "We need to review our recent album releases for the quarterly report.",
    task: "List all albums released after 2020, showing the title and release year.",
    hint: "Use the WHERE clause with a comparison operator on the release_year column.",
    solution: "SELECT title, release_year FROM Albums WHERE release_year > 2020;",
    reward: "drum-roll.mp3",
    tableHints: ["Albums"],
    difficulty: "Easy",
    conceptsIntroduced: ["Comparison operators"]
  },
  {
    id: 5,
    title: "Tour Planner",
    description: "Time to plan the next concert tour! We need to find suitable venues.",
    task: "Find all venues with a capacity greater than 15000, showing the venue name, city, and capacity.",
    hint: "Use the SELECT and WHERE clauses on the Venues table.",
    solution: "SELECT name, city, capacity FROM Venues WHERE capacity > 15000;",
    reward: "crowd-cheer.mp3",
    tableHints: ["Venues"],
    difficulty: "Medium",
    conceptsIntroduced: ["Numeric comparisons"]
  },
  {
    id: 6,
    title: "Album Inspector",
    description: "We need to see which artists created which albums for our catalog update.",
    task: "List all albums with their artist names, showing album title and artist name.",
    hint: "You'll need to JOIN the Artists and Albums tables using the artist_id as the connector.",
    solution: "SELECT Albums.title, Artists.name FROM Albums JOIN Artists ON Albums.artist_id = Artists.id;",
    reward: "synth-melody.mp3",
    tableHints: ["Albums", "Artists"],
    difficulty: "Medium",
    conceptsIntroduced: ["JOIN clause", "Relating tables"]
  },
  {
    id: 7,
    title: "Concert Revenue",
    description: "The finance team needs information about our most profitable concerts.",
    task: "Calculate the total revenue for each concert (ticket_price * tickets_sold), showing concert_date, venue name, and total revenue.",
    hint: "Use a JOIN between Concerts and Venues tables and calculate the revenue with an arithmetic expression.",
    solution: "SELECT Concerts.concert_date, Venues.name, (Concerts.ticket_price * Concerts.tickets_sold) AS total_revenue FROM Concerts JOIN Venues ON Concerts.venue_id = Venues.id;",
    reward: "cash-register.mp3",
    tableHints: ["Concerts", "Venues"],
    difficulty: "Medium",
    conceptsIntroduced: ["Calculated fields", "Arithmetic operations", "Column aliases"]
  },
  {
    id: 8,
    title: "Sales Analyzer",
    description: "Let's analyze album sales to see which albums are performing best in different countries.",
    task: "Find the total units sold for each album, grouped by country, showing album title, country, and total units.",
    hint: "You'll need to JOIN Albums and Sales tables, then use GROUP BY to aggregate the data by country and album.",
    solution: "SELECT Albums.title, Sales.country, SUM(Sales.units_sold) AS total_units FROM Sales JOIN Albums ON Sales.album_id = Albums.id GROUP BY Albums.title, Sales.country;",
    reward: "electronic-beat.mp3",
    tableHints: ["Sales", "Albums"],
    difficulty: "Hard",
    conceptsIntroduced: ["GROUP BY clause", "SUM() function", "Aggregation"]
  },
  {
    id: 9,
    title: "Top Performers",
    description: "The executive team wants a report on our top selling artists.",
    task: "Rank artists by their total album sales, showing artist name and total units sold, with the highest sales first.",
    hint: "You'll need to JOIN Artists, Albums, and Sales tables, then use GROUP BY with SUM() and ORDER BY to sort the results.",
    solution: "SELECT Artists.name, SUM(Sales.units_sold) AS total_sales FROM Artists JOIN Albums ON Artists.id = Albums.artist_id JOIN Sales ON Albums.id = Sales.album_id GROUP BY Artists.name ORDER BY total_sales DESC;",
    reward: "applause.mp3",
    tableHints: ["Artists", "Albums", "Sales"],
    difficulty: "Hard",
    conceptsIntroduced: ["ORDER BY clause", "Multiple joins", "Sorting results"]
  },
  {
    id: 10,
    title: "Chart Topper",
    description: "Final challenge! We need to find which artist had the highest sales in a single week.",
    task: "Find the artist name, album title, week starting date, and units sold for the highest single-week album sales record.",
    hint: "You'll need to JOIN Artists, Albums, and Sales tables, then use ORDER BY and LIMIT to find the top result.",
    solution: "SELECT Artists.name, Albums.title, Sales.week_starting, Sales.units_sold FROM Artists JOIN Albums ON Artists.id = Albums.artist_id JOIN Sales ON Albums.id = Sales.album_id ORDER BY Sales.units_sold DESC LIMIT 1;",
    reward: "victory-fanfare.mp3",
    tableHints: ["Artists", "Albums", "Sales"],
    difficulty: "Hard",
    conceptsIntroduced: ["LIMIT clause", "Complex queries", "Data analysis"]
  }
];

module.exports = levels; 