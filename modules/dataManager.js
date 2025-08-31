// Tournament Data Management Module
class TournamentDataManager {
    constructor() {
        this.tournaments = [];
        this.currentTournament = null;
    }

    async loadTournamentData() {
        try {
            const response = await fetch('fliptop_tournaments_v5_all.json');
            const data = await response.json();
            this.tournaments = data.tournaments;
            console.log('Loaded v5 tournaments:', this.tournaments);
            
            // Pass tournament data to tooltip immediately after loading
            if (window.voteTooltip && this.tournaments) {
                console.log('DEBUG: Passing tournament data to tooltip from loadTournamentData');
                window.voteTooltip.setTournaments(this.tournaments);
            }
            
            return this.tournaments;
        } catch (error) {
            console.error('Error loading tournament data:', error);
            throw error;
        }
    }

    getTournaments() {
        return this.tournaments;
    }

    setCurrentTournament(year) {
        this.currentTournament = this.tournaments.find(t => t.year === year);
        return this.currentTournament;
    }

    getCurrentTournament() {
        return this.currentTournament;
    }

    getLatestTournament() {
        if (this.tournaments.length === 0) return null;
        
        // Find the latest tournament with participants
        const latestTournament = this.tournaments
            .filter(t => t.total_participants > 0)
            .sort((a, b) => parseInt(b.year) - parseInt(a.year))[0];
        
        if (latestTournament) {
            return latestTournament;
        } else {
            // If no tournaments have participants, show the latest one anyway
            return this.tournaments.sort((a, b) => parseInt(b.year) - parseInt(a.year))[0];
        }
    }

    // Get all matches from current tournament
    getAllMatches() {
        if (!this.currentTournament?.brackets) return [];
        
        const brackets = this.currentTournament.brackets;
        return [
            ...(brackets.west.quarters || []),
            ...(brackets.west.quartersemi || []),
            ...(brackets.west.semifinal || []),
            ...(brackets.east.quarters || []),
            ...(brackets.east.quartersemi || []),
            ...(brackets.east.semifinal || []),
            ...(brackets.finals || [])
        ];
    }
    
    // Find match by participants
    findMatch(emcee1, emcee2) {
        const allRounds = this.getAllMatches();
        
        for (const match of allRounds) {
            const players = Object.values(match).filter(val => 
                typeof val === 'string' && val !== match.winner && val !== match.score
            );
            if (players.includes(emcee1) && players.includes(emcee2)) {
                return match;
            }
        }
        return null;
    }
    
    // Find match winner (uses findMatch)
    findMatchWinner(emcee1, emcee2) {
        const match = this.findMatch(emcee1, emcee2);
        return match ? match.winner : emcee1; // Fallback to first emcee if no match found
    }
    
    // Find actual match (for backward compatibility)
    findActualMatch(emcee1, emcee2) {
        return this.findMatch(emcee1, emcee2);
    }
    
    // Calculate number of previous tournament appearances for an emcee (excluding current)
    getEmceeParticipationCount(emceeName) {
        if (!emceeName) return 0;
        
        // Normalize emcee name for case-insensitive comparison
        const normalizedName = emceeName.toLowerCase().trim();
        
        // Get current tournament year
        const currentYear = this.currentTournament?.year;
        if (!currentYear) return 0;
        
        // Track years to avoid double counting within the same tournament
        const participationYears = new Set();
        
        // Debug logging for 3RDY
        const isDebugTarget = normalizedName === '3rdy';
        if (isDebugTarget) {
            console.log('DEBUG: Calculating participation for', emceeName, 'normalized:', normalizedName);
            console.log('DEBUG: Current year:', currentYear);
        }
        
        // Check all tournaments EXCEPT the current one
        this.tournaments.forEach(tournament => {
            // Skip current tournament and any we've already counted
            if (tournament.year === currentYear || participationYears.has(tournament.year)) {
                if (isDebugTarget) {
                    console.log('DEBUG: Skipping tournament', tournament.year, 'current:', currentYear);
                }
                return;
            }
            
            let foundInTournament = false;
            
            // Check if emcee appears in any bracket position
            if (tournament.brackets) {
                const brackets = tournament.brackets;
                
                // Check west bracket
                if (brackets.west && brackets.west.quarters) {
                    for (const match of brackets.west.quarters) {
                        for (const [key, value] of Object.entries(match)) {
                            if (key !== 'winner' && key !== 'score' && key !== 'round' &&
                                typeof value === 'string') {
                                const valueNormalized = value.toLowerCase().trim();
                                if (isDebugTarget) {
                                    console.log('DEBUG: Checking', tournament.year, key, 'value:', value, 'normalized:', valueNormalized);
                                }
                                if (valueNormalized === normalizedName) {
                                    foundInTournament = true;
                                    if (isDebugTarget) {
                                        console.log('DEBUG: FOUND MATCH in', tournament.year);
                                    }
                                    break;
                                }
                            }
                        }
                        if (foundInTournament) break;
                    }
                }
                
                // Check east bracket if not found in west
                if (!foundInTournament && brackets.east && brackets.east.quarters) {
                    for (const match of brackets.east.quarters) {
                        for (const [key, value] of Object.entries(match)) {
                            if (key !== 'winner' && key !== 'score' && key !== 'round' &&
                                typeof value === 'string') {
                                const valueNormalized = value.toLowerCase().trim();
                                if (isDebugTarget) {
                                    console.log('DEBUG: Checking EAST', tournament.year, key, 'value:', value, 'normalized:', valueNormalized);
                                }
                                if (valueNormalized === normalizedName) {
                                    foundInTournament = true;
                                    if (isDebugTarget) {
                                        console.log('DEBUG: FOUND MATCH in EAST', tournament.year);
                                    }
                                    break;
                                }
                            }
                        }
                        if (foundInTournament) break;
                    }
                }
            }
            
            // If found in this tournament, add the year to our set
            if (foundInTournament) {
                participationYears.add(tournament.year);
                if (isDebugTarget) {
                    console.log('DEBUG: Added year', tournament.year, 'to participation list');
                }
            }
        });
        
        if (isDebugTarget) {
            console.log('DEBUG: Final participation years:', Array.from(participationYears));
            console.log('DEBUG: Final count:', participationYears.size);
        }
        
        // Return count of previous tournament appearances
        return participationYears.size;
    }
}

export default TournamentDataManager;
