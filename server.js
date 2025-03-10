const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const levels = require('./levels');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables and seed data
function initializeDatabase() {
  console.log('Initializing database...');
  
  // Create tables
  db.serialize(() => {
    // Artists table
    db.run(`
      CREATE TABLE IF NOT EXISTS Artists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        genre TEXT,
        formed_year INTEGER,
        bio TEXT
      )
    `);
    
    // Albums table
    db.run(`
      CREATE TABLE IF NOT EXISTS Albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist_id INTEGER,
        release_year INTEGER,
        label TEXT,
        FOREIGN KEY (artist_id) REFERENCES Artists(id)
      )
    `);
    
    // Songs table
    db.run(`
      CREATE TABLE IF NOT EXISTS Songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        album_id INTEGER,
        track_number INTEGER,
        duration INTEGER,
        FOREIGN KEY (album_id) REFERENCES Albums(id)
      )
    `);
    
    // Venues table
    db.run(`
      CREATE TABLE IF NOT EXISTS Venues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT,
        country TEXT,
        capacity INTEGER
      )
    `);
    
    // Concerts table
    db.run(`
      CREATE TABLE IF NOT EXISTS Concerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        artist_id INTEGER,
        venue_id INTEGER,
        concert_date TEXT,
        ticket_price REAL,
        tickets_sold INTEGER,
        FOREIGN KEY (artist_id) REFERENCES Artists(id),
        FOREIGN KEY (venue_id) REFERENCES Venues(id)
      )
    `);
    
    // Sales table
    db.run(`
      CREATE TABLE IF NOT EXISTS Sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        album_id INTEGER,
        week_starting TEXT,
        units_sold INTEGER,
        revenue REAL,
        country TEXT,
        FOREIGN KEY (album_id) REFERENCES Albums(id)
      )
    `);
    
    // Check if data already exists
    db.get("SELECT COUNT(*) as count FROM Artists", (err, row) => {
      if (err) {
        console.error("Error checking data:", err);
        return;
      }
      
      // If no data exists, seed the database
      if (row.count === 0) {
        seedDatabase();
      }
    });
  });
}

// Seed the database with initial data
function seedDatabase() {
  console.log('Seeding database with initial data...');
  
  // Artists
  const artists = [
    { name: 'DJ Query', genre: 'Electronic', formed_year: 2010, bio: 'Known for blending SQL commands with electronic beats.' },
    { name: 'The Aggregators', genre: 'Rock', formed_year: 2005, bio: 'A band famous for bringing together different musical elements.' },
    { name: 'Selectors', genre: 'Pop', formed_year: 2015, bio: 'Rising stars known for their ability to pick the perfect hooks.' },
    { name: 'Join Junction', genre: 'Hip Hop', formed_year: 2008, bio: 'Masters of combining different musical traditions.' },
    { name: 'Order Ascending', genre: 'Jazz', formed_year: 2000, bio: 'Arranging notes in a precise order for maximum impact.' }
  ];
  
  artists.forEach(artist => {
    db.run(`
      INSERT INTO Artists (name, genre, formed_year, bio) VALUES (?, ?, ?, ?)
    `, [artist.name, artist.genre, artist.formed_year, artist.bio]);
  });
  
  // Albums (we'll need to get artist IDs)
  db.all("SELECT id, name FROM Artists", (err, artists) => {
    if (err) {
      console.error("Error getting artists:", err);
      return;
    }
    
    const artistMap = {};
    artists.forEach(artist => {
      artistMap[artist.name] = artist.id;
    });
    
    const albums = [
      { title: 'Beats & Bytes', artist: 'DJ Query', release_year: 2020, label: 'Database Records' },
      { title: 'Group By Elements', artist: 'The Aggregators', release_year: 2018, label: 'Rock Solid Productions' },
      { title: 'All Star Selection', artist: 'Selectors', release_year: 2022, label: 'Pop Data' },
      { title: 'Connected Vibes', artist: 'Join Junction', release_year: 2019, label: 'Hip Hop Data' },
      { title: 'Sorted Soul', artist: 'Order Ascending', release_year: 2021, label: 'Jazz Schema' },
      { title: 'Query Returns', artist: 'DJ Query', release_year: 2023, label: 'Database Records' }
    ];
    
    albums.forEach(album => {
      db.run(`
        INSERT INTO Albums (title, artist_id, release_year, label) VALUES (?, ?, ?, ?)
      `, [album.title, artistMap[album.artist], album.release_year, album.label]);
    });
    
    // After albums, seed the rest with album IDs
    seedRemainingData();
  });
}

function seedRemainingData() {
  // Get album IDs
  db.all("SELECT id, title FROM Albums", (err, albums) => {
    if (err) {
      console.error("Error getting albums:", err);
      return;
    }
    
    const albumMap = {};
    albums.forEach(album => {
      albumMap[album.title] = album.id;
    });
    
    // Songs
    const songs = [
      { title: 'SELECT Your Heart', album: 'Beats & Bytes', track_number: 1, duration: 210 },
      { title: 'DROP the Beat', album: 'Beats & Bytes', track_number: 2, duration: 195 },
      { title: 'JOIN With Me', album: 'Connected Vibes', track_number: 1, duration: 240 },
      { title: 'GROUP BY Love', album: 'Group By Elements', track_number: 1, duration: 180 },
      { title: 'ORDER BY Emotion', album: 'Sorted Soul', track_number: 1, duration: 300 },
      { title: 'WHERE You Are', album: 'All Star Selection', track_number: 1, duration: 220 }
    ];
    
    songs.forEach(song => {
      db.run(`
        INSERT INTO Songs (title, album_id, track_number, duration) VALUES (?, ?, ?, ?)
      `, [song.title, albumMap[song.album], song.track_number, song.duration]);
    });
    
    // Venues
    const venues = [
      { name: 'Database Arena', city: 'New York', country: 'USA', capacity: 20000 },
      { name: 'Query Stadium', city: 'Los Angeles', country: 'USA', capacity: 25000 },
      { name: 'Schema Theater', city: 'London', country: 'UK', capacity: 15000 },
      { name: 'Index Hall', city: 'Tokyo', country: 'Japan', capacity: 18000 },
      { name: 'Table Club', city: 'Berlin', country: 'Germany', capacity: 5000 }
    ];
    
    venues.forEach(venue => {
      db.run(`
        INSERT INTO Venues (name, city, country, capacity) VALUES (?, ?, ?, ?)
      `, [venue.name, venue.city, venue.country, venue.capacity]);
    });
    
    // Now set up concerts after getting venue IDs and artist IDs
    db.all("SELECT id, name FROM Venues", (err, venues) => {
      if (err) {
        console.error("Error getting venues:", err);
        return;
      }
      
      const venueMap = {};
      venues.forEach(venue => {
        venueMap[venue.name] = venue.id;
      });
      
      db.all("SELECT id, name FROM Artists", (err, artists) => {
        if (err) {
          console.error("Error getting artists:", err);
          return;
        }
        
        const artistMap = {};
        artists.forEach(artist => {
          artistMap[artist.name] = artist.id;
        });
        
        // Concerts
        const concerts = [
          { artist: 'DJ Query', venue: 'Database Arena', concert_date: '2023-05-15', ticket_price: 75.99, tickets_sold: 18500 },
          { artist: 'The Aggregators', venue: 'Query Stadium', concert_date: '2023-06-20', ticket_price: 65.50, tickets_sold: 22000 },
          { artist: 'Selectors', venue: 'Schema Theater', concert_date: '2023-07-10', ticket_price: 55.00, tickets_sold: 14000 },
          { artist: 'Join Junction', venue: 'Index Hall', concert_date: '2023-08-05', ticket_price: 70.00, tickets_sold: 17500 },
          { artist: 'Order Ascending', venue: 'Table Club', concert_date: '2023-09-15', ticket_price: 45.00, tickets_sold: 4800 }
        ];
        
        concerts.forEach(concert => {
          db.run(`
            INSERT INTO Concerts (artist_id, venue_id, concert_date, ticket_price, tickets_sold) VALUES (?, ?, ?, ?, ?)
          `, [artistMap[concert.artist], venueMap[concert.venue], concert.concert_date, concert.ticket_price, concert.tickets_sold]);
        });
        
        // Sales
        albums.forEach(album => {
          // Generate multiple sales records for each album across different weeks and countries
          const countries = ['USA', 'UK', 'Japan', 'Germany', 'Canada', 'Australia'];
          for (let week = 1; week <= 4; week++) {
            const weekDate = `2023-0${week}-01`;
            countries.forEach((country, index) => {
              // Randomize sales data a bit
              const unitsSold = Math.floor(Math.random() * 15000) + 1000;
              const revenue = unitsSold * (Math.random() * 10 + 5); // Between $5-15 per unit
              
              db.run(`
                INSERT INTO Sales (album_id, week_starting, units_sold, revenue, country) VALUES (?, ?, ?, ?, ?)
              `, [album.id, weekDate, unitsSold, revenue.toFixed(2), country]);
            });
          }
        });
      });
    });
  });
}

// Initialize the database
initializeDatabase();

// API Endpoints
app.post('/api/execute-query', (req, res) => {
  const { query, levelId } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }
  
  // Execute the query against the database
  db.all(query, (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    res.json({ results: rows });
  });
});

// Game levels endpoint
app.get('/api/levels', (req, res) => {
  res.json({ levels });
});

// Show database schema endpoint
app.get('/api/schema', (req, res) => {
  const schema = {
    Artists: ['id', 'name', 'genre', 'formed_year', 'bio'],
    Albums: ['id', 'title', 'artist_id', 'release_year', 'label'],
    Songs: ['id', 'title', 'album_id', 'track_number', 'duration'],
    Venues: ['id', 'name', 'city', 'country', 'capacity'],
    Concerts: ['id', 'artist_id', 'venue_id', 'concert_date', 'ticket_price', 'tickets_sold'],
    Sales: ['id', 'album_id', 'week_starting', 'units_sold', 'revenue', 'country']
  };
  
  res.json({ schema });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 