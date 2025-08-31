// Finalists Calculator Module - Finds quarter positions of all tournament finalists (2nd place)
class FinalistsCalculator {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    calculateFinalistPositions() {
        const tournaments = this.dataManager.getTournaments();
        const finalistPositions = {
            quarters: {
                west: {},
                east: {}
            }
        };

        tournaments.forEach(tournament => {
            if (!tournament.brackets || !tournament.brackets.finals) return;

            // Find the finalist (loser of finals)
            const final = tournament.brackets.finals[0];
            if (!final || !final.winner) return;

            let finalistName = null;
            if (final.west_finalist === final.winner) {
                finalistName = final.east_finalist; // East finalist lost
            } else if (final.east_finalist === final.winner) {
                finalistName = final.west_finalist; // West finalist lost
            }

            if (!finalistName) return;

            const year = tournament.year;
            console.log(`Looking for finalist ${finalistName} in ${year}`);

            // Search in west quarters
            if (tournament.brackets.west && tournament.brackets.west.quarters) {
                tournament.brackets.west.quarters.forEach(match => {
                    const positionKeys = Object.keys(match).filter(key => 
                        !['winner', 'score', 'round'].includes(key)
                    );

                    positionKeys.forEach(posKey => {
                        if (match[posKey] === finalistName) {
                            const position = this.extractPositionFromKey(posKey);
                            if (position) {
                                if (!finalistPositions.quarters.west[position]) {
                                    finalistPositions.quarters.west[position] = { count: 0, years: [] };
                                }
                                finalistPositions.quarters.west[position].count++;
                                finalistPositions.quarters.west[position].years.push(year);
                                console.log(`Finalist ${finalistName} found at west quarters position ${position} in ${year}`);
                            }
                        }
                    });
                });
            }

            // Search in east quarters
            if (tournament.brackets.east && tournament.brackets.east.quarters) {
                tournament.brackets.east.quarters.forEach(match => {
                    const positionKeys = Object.keys(match).filter(key => 
                        !['winner', 'score', 'round'].includes(key)
                    );

                    positionKeys.forEach(posKey => {
                        if (match[posKey] === finalistName) {
                            const position = this.extractPositionFromKey(posKey);
                            if (position) {
                                if (!finalistPositions.quarters.east[position]) {
                                    finalistPositions.quarters.east[position] = { count: 0, years: [] };
                                }
                                finalistPositions.quarters.east[position].count++;
                                finalistPositions.quarters.east[position].years.push(year);
                                console.log(`Finalist ${finalistName} found at east quarters position ${position} in ${year}`);
                            }
                        }
                    });
                });
            }
        });

        console.log('Finalist positions found:', finalistPositions);
        return finalistPositions;
    }

    extractPositionFromKey(posKey) {
        // Extract position from keys like "west_quarters_pos_1" or "east_quarters_pos_2"
        const match = posKey.match(/pos_(\d+)$/);
        return match ? parseInt(match[1]) : null;
    }
}

export default FinalistsCalculator;
