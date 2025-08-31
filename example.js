// Function to calculate total votes by bracket position
function calculateBracketPositionTotals(tournamentData) {
    const positionTotals = {
        west: {
            quarters: {
                pos_1: 0, pos_2: 0, pos_3: 0, pos_4: 0,
                pos_5: 0, pos_6: 0, pos_7: 0, pos_8: 0
            },
            quartersemi: { pos_1: 0, pos_2: 0, pos_3: 0, pos_4: 0 },
            semifinal: { pos_1: 0, pos_2: 0 }
        },
        east: {
            quarters: {
                pos_1: 0, pos_2: 0, pos_3: 0, pos_4: 0,
                pos_5: 0, pos_6: 0, pos_7: 0, pos_8: 0
            },
            quartersemi: { pos_1: 0, pos_2: 0, pos_3: 0, pos_4: 0 },
            semifinal: { pos_1: 0, pos_2: 0 }
        },
        finals: { west: 0, east: 0 }
    };

    tournamentData.tournaments.forEach(tournament => {
        // Process West bracket
        if (tournament.brackets.west) {
            // Quarters
            if (tournament.brackets.west.quarters) {
                tournament.brackets.west.quarters.forEach((match, index) => {
                    if (match.score) {
                        const [score1, score2] = match.score.split('-').map(Number);
                        const pos1Key = `pos_${(index * 2) + 1}`;
                        const pos2Key = `pos_${(index * 2) + 2}`;
                        
                        if (match.winner === match[`west_quarters_${pos1Key}`]) {
                            positionTotals.west.quarters[pos1Key] += score1;
                            positionTotals.west.quarters[pos2Key] += score2;
                        } else {
                            positionTotals.west.quarters[pos1Key] += score2;
                            positionTotals.west.quarters[pos2Key] += score1;
                        }
                    }
                });
            }
            
            // Quarter-Semis
            if (tournament.brackets.west.quartersemi) {
                tournament.brackets.west.quartersemi.forEach((match, index) => {
                    if (match.score) {
                        const [score1, score2] = match.score.split('-').map(Number);
                        const pos1Key = `pos_${(index * 2) + 1}`;
                        const pos2Key = `pos_${(index * 2) + 2}`;
                        
                        if (match.winner === match[`west_quartersemi_${pos1Key}`]) {
                            positionTotals.west.quartersemi[pos1Key] += score1;
                            positionTotals.west.quartersemi[pos2Key] += score2;
                        } else {
                            positionTotals.west.quartersemi[pos1Key] += score2;
                            positionTotals.west.quartersemi[pos2Key] += score1;
                        }
                    }
                });
            }
            
            // Semifinals
            if (tournament.brackets.west.semifinal) {
                tournament.brackets.west.semifinal.forEach((match, index) => {
                    if (match.score) {
                        const [score1, score2] = match.score.split('-').map(Number);
                        const pos1Key = `pos_${(index * 2) + 1}`;
                        const pos2Key = `pos_${(index * 2) + 2}`;
                        
                        if (match.winner === match[`west_semifinal_${pos1Key}`]) {
                            positionTotals.west.semifinal[pos1Key] += score1;
                            positionTotals.west.semifinal[pos2Key] += score2;
                        } else {
                            positionTotals.west.semifinal[pos1Key] += score2;
                            positionTotals.west.semifinal[pos2Key] += score1;
                        }
                    }
                });
            }
        }

        // Process East bracket (same logic)
        if (tournament.brackets.east) {
            // Quarters
            if (tournament.brackets.east.quarters) {
                tournament.brackets.east.quarters.forEach((match, index) => {
                    if (match.score) {
                        const [score1, score2] = match.score.split('-').map(Number);
                        const pos1Key = `pos_${(index * 2) + 1}`;
                        const pos2Key = `pos_${(index * 2) + 2}`;
                        
                        if (match.winner === match[`east_quarters_${pos1Key}`]) {
                            positionTotals.east.quarters[pos1Key] += score1;
                            positionTotals.east.quarters[pos2Key] += score2;
                        } else {
                            positionTotals.east.quarters[pos1Key] += score2;
                            positionTotals.east.quarters[pos2Key] += score1;
                        }
                    }
                });
            }
            
            // Quarter-Semis
            if (tournament.brackets.east.quartersemi) {
                tournament.brackets.east.quartersemi.forEach((match, index) => {
                    if (match.score) {
                        const [score1, score2] = match.score.split('-').map(Number);
                        const pos1Key = `pos_${(index * 2) + 1}`;
                        const pos2Key = `pos_${(index * 2) + 2}`;
                        
                        if (match.winner === match[`east_quartersemi_${pos1Key}`]) {
                            positionTotals.east.quartersemi[pos1Key] += score1;
                            positionTotals.east.quartersemi[pos2Key] += score2;
                        } else {
                            positionTotals.east.quartersemi[pos1Key] += score2;
                            positionTotals.east.quartersemi[pos2Key] += score1;
                        }
                    }
                });
            }
            
            // Semifinals
            if (tournament.brackets.east.semifinal) {
                tournament.brackets.east.semifinal.forEach((match, index) => {
                    if (match.score) {
                        const [score1, score2] = match.score.split('-').map(Number);
                        const pos1Key = `pos_${(index * 2) + 1}`;
                        const pos2Key = `pos_${(index * 2) + 2}`;
                        
                        if (match.winner === match[`east_semifinal_${pos1Key}`]) {
                            positionTotals.east.semifinal[pos1Key] += score1;
                            positionTotals.east.semifinal[pos2Key] += score2;
                        } else {
                            positionTotals.east.semifinal[pos1Key] += score2;
                            positionTotals.east.semifinal[pos2Key] += score1;
                        }
                    }
                });
            }
        }

        // Process Finals
        if (tournament.brackets.finals && tournament.brackets.finals[0]) {
            const finalMatch = tournament.brackets.finals[0];
            if (finalMatch.score) {
                const [score1, score2] = finalMatch.score.split('-').map(Number);
                
                if (finalMatch.winner === finalMatch.west_finalist) {
                    positionTotals.finals.west += score1;
                    positionTotals.finals.east += score2;
                } else {
                    positionTotals.finals.west += score2;
                    positionTotals.finals.east += score1;
                }
            }
        }
    });

    return positionTotals;
}

// Usage example:
// const tournamentData = // your JSON data
// const results = calculateBracketPositionTotals(tournamentData);
// console.log(results);

// Function to display results in a readable format
function displayResults(positionTotals) {
    console.log("=== WEST BRACKET TOTALS ===");
    console.log("Quarters:");
    for (let i = 1; i <= 8; i++) {
        console.log(`  Position ${i}: ${positionTotals.west.quarters[`pos_${i}`]} votes`);
    }
    
    console.log("Quarter-Semis:");
    for (let i = 1; i <= 4; i++) {
        console.log(`  Position ${i}: ${positionTotals.west.quartersemi[`pos_${i}`]} votes`);
    }
    
    console.log("Semifinals:");
    for (let i = 1; i <= 2; i++) {
        console.log(`  Position ${i}: ${positionTotals.west.semifinal[`pos_${i}`]} votes`);
    }
    
    console.log("\n=== EAST BRACKET TOTALS ===");
    console.log("Quarters:");
    for (let i = 1; i <= 8; i++) {
        console.log(`  Position ${i}: ${positionTotals.east.quarters[`pos_${i}`]} votes`);
    }
    
    console.log("Quarter-Semis:");
    for (let i = 1; i <= 4; i++) {
        console.log(`  Position ${i}: ${positionTotals.east.quartersemi[`pos_${i}`]} votes`);
    }
    
    console.log("Semifinals:");
    for (let i = 1; i <= 2; i++) {
        console.log(`  Position ${i}: ${positionTotals.east.semifinal[`pos_${i}`]} votes`);
    }
    
    console.log("\n=== FINALS TOTALS ===");
    console.log(`West Finalists: ${positionTotals.finals.west} votes`);
    console.log(`East Finalists: ${positionTotals.finals.east} votes`);
}