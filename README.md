# FlipTop Isabuhay Tournament Bracket System

A dynamic web application for displaying and analyzing FlipTop Isabuhay Rap Battle League tournament brackets with interactive features and statistical analysis.

## 🏆 Features

- **Interactive Tournament Brackets**: Visual display of tournament matchups and results
- **Multi-Year Support**: Browse tournaments from different years
- **Statistical Analysis**: 
  - Vote prediction system based on historical data
  - Champion position analysis across tournaments
  - Finalist position tracking
  - Position-based win rate tooltips
- **Responsive Design**: Modern glassmorphism UI that works on all devices
- **Real-time Data**: Dynamic loading of tournament data from JSON files

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6 module support
- Local web server (for development)

### Installation

1. Clone or download this repository
2. Serve the files using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open your browser and navigate to `http://localhost:8000`

## 📁 Project Structure

```
Bracket/
├── index.html                          # Main HTML file
├── index.css                          # Styling and animations
├── tournament.js                      # Main application controller
├── example.js                         # Vote calculation utilities
├── fliptop_tournaments_v2.json        # Tournament data (v2 format)
├── fliptop_tournaments_v5_all.json    # Tournament data (v5 format)
├── modules/                           # Modular components
│   ├── dataManager.js                 # Tournament data management
│   ├── uiManager.js                   # UI controls and updates
│   ├── bracketPopulator.js            # Bracket display logic
│   ├── predictorCalculator.js         # Vote prediction algorithms
│   ├── predictorPopulator.js          # Predictor mode display
│   ├── championsCalculator.js         # Champion analysis
│   ├── championsPopulator.js          # Champion highlights
│   ├── finalistsCalculator.js         # Finalist analysis
│   ├── finalistsPopulator.js          # Finalist highlights
│   ├── tooltipManager.js              # Interactive tooltips
│   ├── positionUtility.js             # Position mapping utilities
│   └── voteHistoryCalculator.js       # Vote history analysis
└── README.md                          # This file
```

## 🎮 Usage

### Viewing Tournaments
- Use the year selector to browse different tournament years
- Click on matches to see detailed results
- Hover over positions to see win rate statistics (for years after 2013)

### Analysis Modes
- **Predictor Mode**: Shows vote predictions based on historical bracket positions
- **Champions Mode**: Highlights positions that have produced champions
- **Finalists Mode**: Shows positions that commonly reach finals

### Navigation
- Year dropdown: Switch between tournament years
- Mode buttons: Toggle between different analysis views
- Responsive design adapts to mobile and desktop screens

## 🔧 Technical Details

### Architecture
- **Modular ES6 Design**: Clean separation of concerns with dedicated modules
- **Data-Driven**: Tournament results loaded from JSON files
- **Event-Driven UI**: Responsive interface with smooth transitions
- **Statistical Engine**: Advanced algorithms for position analysis

### Key Classes
- `TournamentBracket`: Main application controller
- `TournamentDataManager`: Handles data loading and management
- `UIManager`: Controls interface updates and interactions
- `BracketPopulator`: Manages bracket display and population
- Various Calculator/Populator pairs for different analysis modes

### Data Format
The application supports multiple JSON data formats (v2 and v5) with tournament information including:
- Participant details
- Match results and scores
- Bracket progression
- Historical voting data

## 🎨 Styling

The application features a modern design with:
- **Glassmorphism effects**: Translucent elements with backdrop blur
- **Responsive grid layout**: Adapts to different screen sizes
- **Smooth animations**: CSS transitions for better UX
- **FlipTop branding**: Custom fonts and color scheme

## 📊 Data Analysis

### Vote Prediction System
- Analyzes historical voting patterns by bracket position
- Calculates win rates for each position across tournaments
- Provides statistical insights for tournament predictions

### Champion Analysis
- Tracks which bracket positions have produced champions
- Highlights successful paths through the tournament
- Shows position-based success rates

### Statistical Tooltips
- Interactive hover information for bracket positions
- Win rate percentages based on historical data
- Available for tournaments from 2014 onwards

## 🛠️ Development

### Adding New Features
1. Create new modules in the `modules/` directory
2. Import and initialize in `tournament.js`
3. Add UI controls in `uiManager.js`
4. Update styling in `index.css`

### Data Updates
- Add new tournament data to the JSON files
- Follow the existing data structure format
- Update year ranges in the UI manager

### Customization
- Modify `index.css` for styling changes
- Update `uiManager.js` for interface modifications
- Extend calculator modules for new analysis features

## 📱 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

Requires ES6 module support and modern CSS features.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and entertainment purposes related to FlipTop Isabuhay Rap Battle League tournaments.

## 🔗 Links

- [FlipTop Official](https://www.instagram.com/johnrbg_/) - Follow for updates
- Tournament data and results from official FlipTop events

---

**Built with ❤️ for the FlipTop community**
