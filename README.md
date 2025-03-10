# SQL Beats - Music Industry Query Master

SQL Beats is an educational web-based game where players become music industry managers using SQL to solve real-world problems. From organizing concert tours to analyzing album sales, players write SQL queries to progress through levels, unlocking music tracks and artist-themed rewards.

![SQL Beats Game](https://raw.githubusercontent.com/yourusername/sql-beats/main/screenshot.png)

## Features

- **Interactive SQL Editor**: Write SQL queries with syntax highlighting and immediate feedback
- **Progressive Learning Path**: Start with simple SELECT statements and advance to complex joins and aggregations
- **Music Industry Theme**: Explore a database of artists, albums, sales, and concerts
- **Audio Rewards**: Unlock music snippets as you complete challenges
- **Visual Feedback**: Immediate results and helpful hints when stuck
- **10 Challenging Levels**: From basic queries to complex multi-table operations

## Game Levels

1. **The Rookie Manager**: List all artists signed to the label
2. **Genre Explorer**: List artists with their respective genres
3. **Rock Stars Only**: Find all artists in the Rock genre
4. **Recent Releases**: List albums released after 2020
5. **Tour Planner**: Find venues with capacity over 15,000
6. **Album Inspector**: Join artists with their albums
7. **Concert Revenue**: Calculate revenue for each concert
8. **Sales Analyzer**: Find total units sold for each album by country
9. **Top Performers**: Rank artists by total album sales
10. **Chart Topper**: Find the highest single-week album sale

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/sql-beats.git
cd sql-beats
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
node server.js
```

4. Open your browser and navigate to `http://localhost:3000`

## How to Play

1. Read the task for each level
2. Write an SQL query in the editor to solve the problem
3. Click "Run Query" to submit your answer
4. If correct, you'll unlock a reward and move to the next level
5. Use the "Database" button to view table schemas and sample data
6. If stuck, use the "Hint" or "Show Solution" buttons

## Database Schema

SQL Beats features a music industry database with the following tables:

- **Artists**: Information about music artists (id, name, genre, formed_year, bio)
- **Albums**: Albums released by artists (id, title, artist_id, release_year, label)
- **Songs**: Individual songs on albums (id, title, album_id, track_number, duration)
- **Venues**: Concert venues (id, name, city, country, capacity)
- **Concerts**: Performance events (id, artist_id, venue_id, concert_date, ticket_price, tickets_sold)
- **Sales**: Album sales data (id, album_id, week_starting, units_sold, revenue, country)

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Libraries**: 
  - CodeMirror (SQL editor with syntax highlighting)
  - Web Audio API (for sound effects)
  - Font Awesome (for icons)
  - Google Fonts (for typography)

## Development

To run the application in development mode with automatic server restarts:

```bash
npm run dev
```

## Future Enhancements

- Additional levels with more advanced SQL concepts (subqueries, window functions)
- Multiplayer mode for competing with friends
- Custom tracks upload as rewards
- Mobile optimization
- Achievement system with more badges and rewards
- User accounts to save progress

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue to discuss new features or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by SQL learning games like SQL Island
- Music-themed elements to make database learning more engaging
- Retro visual style with modern functionality
- All the SQL enthusiasts and music lovers out there! 