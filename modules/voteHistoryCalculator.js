// Vote History Calculator Module - Tracks voting history by position across tournaments
class VoteHistoryCalculator {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    calculatePositionVoteHistory() {
        const tournaments = this.dataManager.getTournaments();
        
        // Structure: position -> array of {year, emcee, votes}
        const positionHistory = {
            quarters: {
                west: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] },
                east: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] }
            },
            quarterSemis: {
                west: { 1: [], 2: [], 3: [], 4: [] },
                east: { 1: [], 2: [], 3: [], 4: [] }
            },
            semis: {
                west: { 1: [], 2: [] },
                east: { 1: [], 2: [] }
            },
            finals: { 1: [], 2: [] }
        };

        tournaments.forEach(tournament => {
            const year = tournament.year;
            
            // Process quarters (Round 1)
            if (tournament.brackets?.west?.quarters) {
                tournament.brackets.west.quarters.forEach(match => {
                    this.addMatchVoteHistory(match, positionHistory.quarters.west, year, 'west', 'quarters');
                });
            }
            if (tournament.brackets?.east?.quarters) {
                tournament.brackets.east.quarters.forEach(match => {
                    this.addMatchVoteHistory(match, positionHistory.quarters.east, year, 'east', 'quarters');
                });
            }

            // Process quarter-semis (Round 2)
            if (tournament.brackets?.west?.quartersemi) {
                tournament.brackets.west.quartersemi.forEach(match => {
                    this.addMatchVoteHistory(match, positionHistory.quarterSemis.west, year, 'west', 'quartersemi');
                });
            }
            if (tournament.brackets?.east?.quartersemi) {
                tournament.brackets.east.quartersemi.forEach(match => {
                    this.addMatchVoteHistory(match, positionHistory.quarterSemis.east, year, 'east', 'quartersemi');
                });
            }

            // Process semis (Round 3)
            if (tournament.brackets?.west?.semifinal) {
                tournament.brackets.west.semifinal.forEach(match => {
                    this.addMatchVoteHistory(match, positionHistory.semis.west, year, 'west', 'semifinal');
                });
            }
            if (tournament.brackets?.east?.semifinal) {
                tournament.brackets.east.semifinal.forEach(match => {
                    this.addMatchVoteHistory(match, positionHistory.semis.east, year, 'east', 'semifinal');
                });
            }

            // Process finals
            if (tournament.brackets?.finals?.length > 0) {
                tournament.brackets.finals.forEach(match => {
                    this.addFinalsVoteHistory(match, positionHistory.finals, year);
                });
            }
        });

        return positionHistory;
    }

    addMatchVoteHistory(match, positionHistory, year, side, round) {
        if (!match.score) return;

        const [score1, score2] = match.score.split('-').map(Number);
        
        // Get participant keys for this match
        const participantKeys = Object.keys(match)
            .filter(key => !['winner', 'score', 'round'].includes(key))
            .sort();

        if (participantKeys.length !== 2) return;

        // Extract positions and emcees from keys
        const pos1 = this.extractPositionFromV5Key(participantKeys[0]);
        const pos2 = this.extractPositionFromV5Key(participantKeys[1]);
        const emcee1 = match[participantKeys[0]];
        const emcee2 = match[participantKeys[1]];

        if (!pos1 || !pos2 || !emcee1 || !emcee2) return;

        // Assign votes based on winner
        if (match.winner === emcee1) {
            // First participant won
            if (positionHistory[pos1]) {
                positionHistory[pos1].push({ year, emcee: emcee1, votes: score1, won: true });
            }
            if (positionHistory[pos2]) {
                positionHistory[pos2].push({ year, emcee: emcee2, votes: score2, won: false });
            }
        } else {
            // Second participant won
            if (positionHistory[pos1]) {
                positionHistory[pos1].push({ year, emcee: emcee1, votes: score2, won: false });
            }
            if (positionHistory[pos2]) {
                positionHistory[pos2].push({ year, emcee: emcee2, votes: score1, won: true });
            }
        }
    }

    addFinalsVoteHistory(match, positionHistory, year) {
        if (!match.score) return;

        const [score1, score2] = match.score.split('-').map(Number);
        
        // Finals use different key format: west_finalist, east_finalist
        if (match.west_finalist && match.east_finalist) {
            if (match.winner === match.west_finalist) {
                // West finalist won
                positionHistory[1].push({ year, emcee: match.west_finalist, votes: score1, won: true });
                positionHistory[2].push({ year, emcee: match.east_finalist, votes: score2, won: false });
            } else {
                // East finalist won
                positionHistory[1].push({ year, emcee: match.west_finalist, votes: score2, won: false });
                positionHistory[2].push({ year, emcee: match.east_finalist, votes: score1, won: true });
            }
        }
    }

    extractPositionFromV5Key(key) {
        // Extract position from v5 format keys like:
        // 'west_quarters_pos_1', 'east_quarters_pos_2', etc.
        const match = key.match(/pos_(\d+)$/);
        return match ? parseInt(match[1]) : null;
    }

    // Get formatted vote history for a specific position
    getFormattedVoteHistory(elementId) {
        const voteHistory = this.calculatePositionVoteHistory();
        const history = this.getPositionHistory(elementId, voteHistory);
        
        if (!history || history.length === 0) {
            return 'No voting history available';
        }

        // Sort by year
        history.sort((a, b) => parseInt(a.year) - parseInt(b.year));

        // Format as "2013 - Emcee A - 3 votes"
        return history.map(entry => {
            const winIndicator = entry.won ? ' ✓' : '';
            return `${entry.year} - ${entry.emcee} - ${entry.votes} votes${winIndicator}`;
        }).join('\n');
    }

    getPositionHistory(elementId, voteHistory) {
        // Map element IDs to position history
        const positionMap = {
            // West quarters
            'wqp1': voteHistory.quarters.west[1],
            'wqp2': voteHistory.quarters.west[2],
            'wqp3': voteHistory.quarters.west[3],
            'wqp4': voteHistory.quarters.west[4],
            'wqp5': voteHistory.quarters.west[5],
            'wqp6': voteHistory.quarters.west[6],
            'wqp7': voteHistory.quarters.west[7],
            'wqp8': voteHistory.quarters.west[8],
            
            // East quarters
            'eqp1': voteHistory.quarters.east[1],
            'eqp2': voteHistory.quarters.east[2],
            'eqp3': voteHistory.quarters.east[3],
            'eqp4': voteHistory.quarters.east[4],
            'eqp5': voteHistory.quarters.east[5],
            'eqp6': voteHistory.quarters.east[6],
            'eqp7': voteHistory.quarters.east[7],
            'eqp8': voteHistory.quarters.east[8],
            
            // West quarter-semis
            'wqsp1': voteHistory.quarterSemis.west[1],
            'wqsp2': voteHistory.quarterSemis.west[2],
            'wqsp3': voteHistory.quarterSemis.west[3],
            'wqsp4': voteHistory.quarterSemis.west[4],
            
            // East quarter-semis
            'eqsp1': voteHistory.quarterSemis.east[1],
            'eqsp2': voteHistory.quarterSemis.east[2],
            'eqsp3': voteHistory.quarterSemis.east[3],
            'eqsp4': voteHistory.quarterSemis.east[4],
            
            // West semis
            'wsfp1': voteHistory.semis.west[1],
            'wsfp2': voteHistory.semis.west[2],
            
            // East semis
            'esfp1': voteHistory.semis.east[1],
            'esfp2': voteHistory.semis.east[2],
            
            // Finals
            'wfp1': voteHistory.finals[1],
            'efp1': voteHistory.finals[2]
        };

        return positionMap[elementId] || [];
    }
}

export default VoteHistoryCalculator;
