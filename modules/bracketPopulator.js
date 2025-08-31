// Bracket Population Module
class BracketPopulator {
    constructor(dataManager, positionUtility) {
        this.dataManager = dataManager;
        this.positionUtility = positionUtility;
        
        // DOM cache for frequently accessed elements
        this.domCache = {};
    }

    populateBracket() {
        const currentTournament = this.dataManager.getCurrentTournament();
        
        if (!currentTournament || currentTournament.total_participants === 0) {
            return false; // Indicate no data to populate
        }

        // Populate match results from v5 format
        this.populateV5MatchResults();
        return true;
    }

    populateV5MatchResults() {
        const currentTournament = this.dataManager.getCurrentTournament();
        if (!currentTournament?.brackets) return;

        const brackets = currentTournament.brackets;
        
        // Populate West quarters
        this.populateRound(brackets.west.quarters);
        
        // Populate West quartersemi
        this.populateRound(brackets.west.quartersemi);
        
        // Populate West semifinal
        this.populateRound(brackets.west.semifinal);
        
        // Populate East quarters
        this.populateRound(brackets.east.quarters);
        
        // Populate East quartersemi
        this.populateRound(brackets.east.quartersemi);
        
        // Populate East semifinal
        this.populateRound(brackets.east.semifinal);
        
        // Populate Finals
        this.populateRound(brackets.finals);
    }

    // Get element from cache or DOM
    getElement(id) {
        if (!this.domCache[id]) {
            this.domCache[id] = document.getElementById(id);
        }
        return this.domCache[id];
    }

    // Unified method to populate any bracket position
    populateElement(element, participant, score, isWinner) {
        if (!element || !participant) return;
        
        // Convert participant name to uppercase
        const displayName = participant.toUpperCase();
                    
                    // Store existing spans before clearing
        const scoreSpan = element.querySelector('.score') || element.querySelector('.vote-count');
                    const debugSpan = element.querySelector('.pos-debug');
                    
                    if (scoreSpan) {
            // Ensure score is displayed even if it's 0
            scoreSpan.textContent = score !== undefined && score !== null ? score : '';
                        
                        // Clear element and rebuild with name and spans
                        element.innerHTML = '';
            element.appendChild(document.createTextNode(displayName + ' '));
                        element.appendChild(scoreSpan);
                        
                        // Add debug span back if it existed
                        if (debugSpan) {
                            element.appendChild(debugSpan);
                        }
                    } else {
            element.textContent = displayName;
                        
                        // Add debug span back if it existed
                        if (debugSpan) {
                            element.appendChild(debugSpan);
                        }
                    }
                    
        // Apply styling based on winner status
        if (isWinner) {
                        element.style.backgroundColor = '#e6f3ff'; // Soft blue background
                        element.style.color = '#333'; // Default text color
                    } else {
                        element.style.backgroundColor = ''; // Default background
                        element.style.color = '#333'; // Default text color
                    }
    }

    populateRound(matches) {
        if (!matches || matches.length === 0) return;

        matches.forEach(match => {
            // Get all position keys from the match (excluding winner, score, round)
            const positionKeys = Object.keys(match).filter(key => 
                !['winner', 'score', 'round'].includes(key)
            );

            positionKeys.forEach(posKey => {
                const participant = match[posKey];
                if (!participant) return;
                
                // Convert position key to element ID (using position utility if available)
                const elementId = this.positionUtility ? 
                    this.positionUtility.convertToElementId(posKey) : 
                    this.convertToElementId(posKey);
                
                const element = this.getElement(elementId);
                if (!element) return;
                
                // Get participant score
                const participantScore = this.getParticipantScore(match, participant);
                const isWinner = participant === match.winner;
                
                // Check if this is a quarters round and add participation count if needed
                let displayName = participant;
                if (this.isQuartersPosition(posKey)) {
                    const participationCount = this.dataManager.getEmceeParticipationCount(participant);
                    // Only show count if emcee has participated 2+ times previously
                    if (participationCount >= 1) {
                        displayName = `${participant} (${participationCount + 1})`;
                    }
                }
                
                // Populate the element
                this.populateElement(element, displayName, participantScore, isWinner);
                
                // Log finals data for debugging
                if (posKey === 'west_finalist' || posKey === 'east_finalist') {
                    console.log(`${posKey}:`, participant, 'Score:', participantScore);
                }
            });
        });
    }
    
    // Check if a position key is from quarters round
    isQuartersPosition(posKey) {
        return posKey.includes('quarters_pos_');
    }

    // Legacy method - use PositionUtility instead when possible
    convertToElementId(posKey) {
        // Handle finals special case
        if (posKey === 'west_finalist') return 'wfp1';
        if (posKey === 'east_finalist') return 'efp1';
        
        const parts = posKey.split('_');
        if (parts.length < 4) return posKey;
        
        const region = parts[0].charAt(0); // 'w' for west, 'e' for east
        const round = parts[1];
        const position = parts[3]; // position number
        
        let roundCode = '';
        if (round === 'quarters') {
            roundCode = 'qp';
        } else if (round === 'quartersemi') {
            roundCode = 'qsp';
        } else if (round === 'semifinal') {
            roundCode = 'sfp';
        }
        
        return `${region}${roundCode}${position}`;
    }

    getParticipantScore(match, participantName) {
        if (!match.score || !match.winner) return '';
        
        // Parse score like "5-0", "4-1", etc.
        const scoreParts = match.score.split('-');
        if (scoreParts.length !== 2) return '';
        
        const score1 = parseInt(scoreParts[0]);
        const score2 = parseInt(scoreParts[1]);
        
        // Get all participants in this match
        // Handle both regular matches and finals (which use west_finalist/east_finalist)
        const participants = Object.keys(match)
            .filter(key => !['winner', 'score', 'round'].includes(key))
            .map(key => match[key])
            .filter(participant => participant && participant.trim() !== ''); // Filter out empty participants
        
        if (participants.length !== 2) {
            console.log('Expected 2 participants, found:', participants.length, participants);
            return '';
        }
        
        // Determine which participant this is and assign appropriate score
        const participantIndex = participants.indexOf(participantName);
        if (participantIndex === -1) {
            console.log('Participant not found:', participantName, 'in', participants);
            return '';
        }
        
        // Winner gets the higher score, loser gets the lower score
        const winnerScore = Math.max(score1, score2);
        const loserScore = Math.min(score1, score2);
        
        const finalScore = participantName === match.winner ? winnerScore : loserScore;
        console.log('Calculated score for', participantName, ':', finalScore, '(winner:', match.winner, ')');
        return finalScore;
    }
}

export default BracketPopulator;
