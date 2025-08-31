// Predictor Calculator Module - Aggregates votes by bracket position across all tournaments
class PredictorCalculator {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    calculatePositionVoteTotals() {
        const tournaments = this.dataManager.getTournaments();
        
        const positionTotals = {
            quarters: {
                west: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
                east: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
            },
            quarterSemis: {
                west: { 1: 0, 2: 0, 3: 0, 4: 0 },
                east: { 1: 0, 2: 0, 3: 0, 4: 0 }
            },
            semis: {
                west: { 1: 0, 2: 0 },
                east: { 1: 0, 2: 0 }
            },
            finals: { 1: 0, 2: 0 }
        };
        
        // Initialize west and east quarter-semis (1-4 each)
        for (let i = 1; i <= 4; i++) {
            positionTotals.quarterSemis.west[i] = 0;
            positionTotals.quarterSemis.east[i] = 0;
        }
        
        // Initialize west and east semis (1-2 each)
        for (let i = 1; i <= 2; i++) {
            positionTotals.semis.west[i] = 0;
            positionTotals.semis.east[i] = 0;
        }
        
        // Initialize finals (1-2)
        for (let i = 1; i <= 2; i++) {
            positionTotals.finals[i] = 0;
        }

        tournaments.forEach(tournament => {
            console.log(`DEBUG: Processing tournament ${tournament.year}`);
            
            // Process quarters (Round 1) - separate west and east
            if (tournament.brackets && tournament.brackets.west && tournament.brackets.west.quarters) {
                tournament.brackets.west.quarters.forEach(match => {
                    this.addMatchVotesToPosition(match, positionTotals.quarters.west, 'west', 'quarters');
                });
            }
            if (tournament.brackets && tournament.brackets.east && tournament.brackets.east.quarters) {
                tournament.brackets.east.quarters.forEach(match => {
                    this.addMatchVotesToPosition(match, positionTotals.quarters.east, 'east', 'quarters');
                });
            }

            // Process quarter-semis (Round 2) - separate west and east
            if (tournament.brackets && tournament.brackets.west && tournament.brackets.west.quartersemi) {
                tournament.brackets.west.quartersemi.forEach(match => {
                    this.addMatchVotesToPosition(match, positionTotals.quarterSemis.west, 'west', 'quartersemi');
                });
            }
            if (tournament.brackets && tournament.brackets.east && tournament.brackets.east.quartersemi) {
                tournament.brackets.east.quartersemi.forEach(match => {
                    this.addMatchVotesToPosition(match, positionTotals.quarterSemis.east, 'east', 'quartersemi');
                });
            }

            // Process semis (Round 3) - separate west and east
            if (tournament.brackets && tournament.brackets.west && tournament.brackets.west.semifinal) {
                tournament.brackets.west.semifinal.forEach(match => {
                    this.addMatchVotesToPosition(match, positionTotals.semis.west, 'west', 'semifinal');
                });
            }
            if (tournament.brackets && tournament.brackets.east && tournament.brackets.east.semifinal) {
                tournament.brackets.east.semifinal.forEach(match => {
                    this.addMatchVotesToPosition(match, positionTotals.semis.east, 'east', 'semifinal');
                });
            }

            // Process finals - v5 format uses 'brackets.finals'
            if (tournament.brackets && tournament.brackets.finals && tournament.brackets.finals.length > 0) {
                tournament.brackets.finals.forEach(match => {
                    this.addFinalsVotesToPosition(match, positionTotals.finals);
                });
            }
        });

        console.log('Predictor Vote Totals:', positionTotals);
        return positionTotals;
    }

    addMatchVotesToPosition(match, positionTotals, side, round) {
        if (!match.score) return;

        const [score1, score2] = match.score.split('-').map(Number);
        
        // Get participant keys for this match
        const participantKeys = Object.keys(match)
            .filter(key => !['winner', 'score', 'round'].includes(key))
            .sort();

        if (participantKeys.length !== 2) return;

        // Extract positions from keys
        const pos1 = this.extractPositionFromV5Key(participantKeys[0]);
        const pos2 = this.extractPositionFromV5Key(participantKeys[1]);

        if (!pos1 || !pos2) return;

        // Assign votes based on winner
        if (match.winner === match[participantKeys[0]]) {
            // First participant won
            if (positionTotals[pos1] !== undefined) positionTotals[pos1] += score1;
            if (positionTotals[pos2] !== undefined) positionTotals[pos2] += score2;
            console.log(`DEBUG: ${side} ${round} - Position ${pos1}: +${score1} votes (winner), Position ${pos2}: +${score2} votes`);
        } else {
            // Second participant won
            if (positionTotals[pos1] !== undefined) positionTotals[pos1] += score2;
            if (positionTotals[pos2] !== undefined) positionTotals[pos2] += score1;
            console.log(`DEBUG: ${side} ${round} - Position ${pos1}: +${score2} votes, Position ${pos2}: +${score1} votes (winner)`);
        }
    }

    addFinalsVotesToPosition(match, positionTotals) {
        if (!match.score) return;

        const [score1, score2] = match.score.split('-').map(Number);
        
        // Finals use different key format: west_finalist, east_finalist
        if (match.west_finalist && match.east_finalist) {
            if (match.winner === match.west_finalist) {
                // West finalist won
                positionTotals[1] += score1; // West finalist gets position 1
                positionTotals[2] += score2; // East finalist gets position 2
                console.log(`DEBUG: Finals - West finalist: +${score1} votes (winner), East finalist: +${score2} votes`);
            } else {
                // East finalist won
                positionTotals[1] += score2; // West finalist gets position 1
                positionTotals[2] += score1; // East finalist gets position 2
                console.log(`DEBUG: Finals - West finalist: +${score2} votes, East finalist: +${score1} votes (winner)`);
            }
        }
    }

    extractPositionFromV5Key(key) {
        // Extract position from v5 format keys like:
        // 'west_quarters_pos_1', 'east_quarters_pos_2', etc.
        const match = key.match(/pos_(\d+)$/);
        return match ? parseInt(match[1]) : null;
    }
}

export default PredictorCalculator;
