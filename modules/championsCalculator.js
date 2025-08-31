// Champions Calculator Module - Finds quarter positions of all tournament champions
class ChampionsCalculator {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    calculateChampionPositions() {
        const tournaments = this.dataManager.getTournaments();
        const championPositions = {
            quarters: {
                west: {},
                east: {}
            }
        };

        tournaments.forEach(tournament => {
            if (!tournament.champion || !tournament.brackets) return;

            const championName = tournament.champion;
            const year = tournament.year;
            console.log(`Looking for champion ${championName} in ${year}`);

            // Search in west quarters
            if (tournament.brackets.west && tournament.brackets.west.quarters) {
                tournament.brackets.west.quarters.forEach(match => {
                    const positionKeys = Object.keys(match).filter(key => 
                        !['winner', 'score', 'round'].includes(key)
                    );

                    positionKeys.forEach(posKey => {
                        if (match[posKey] === championName) {
                            const position = this.extractPositionFromKey(posKey);
                            if (position) {
                                if (!championPositions.quarters.west[position]) {
                                    championPositions.quarters.west[position] = { count: 0, years: [] };
                                }
                                championPositions.quarters.west[position].count++;
                                championPositions.quarters.west[position].years.push(year);
                                console.log(`Champion ${championName} found at west quarters position ${position} in ${year}`);
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
                        if (match[posKey] === championName) {
                            const position = this.extractPositionFromKey(posKey);
                            if (position) {
                                if (!championPositions.quarters.east[position]) {
                                    championPositions.quarters.east[position] = { count: 0, years: [] };
                                }
                                championPositions.quarters.east[position].count++;
                                championPositions.quarters.east[position].years.push(year);
                                console.log(`Champion ${championName} found at east quarters position ${position} in ${year}`);
                            }
                        }
                    });
                });
            }
        });

        console.log('Champion positions found:', championPositions);
        return championPositions;
    }

    extractPositionFromKey(posKey) {
        // Extract position from keys like "west_quarters_pos_1" or "east_quarters_pos_2"
        const match = posKey.match(/pos_(\d+)$/);
        return match ? parseInt(match[1]) : null;
    }
}

export default ChampionsCalculator;
