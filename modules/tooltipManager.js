// Tooltip Manager for FlipTop Tournament Position Win Rates
class TooltipManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.tooltip = null;
        this.createTooltipElement();
    }

    createTooltipElement() {
        // Remove existing tooltip if it exists
        const existingTooltip = document.getElementById('position-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        // Create tooltip element
        this.tooltip = document.createElement('div');
        this.tooltip.id = 'position-tooltip';
        this.tooltip.className = 'position-tooltip';
        this.tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            white-space: nowrap;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(this.tooltip);
    }

    // Calculate win rate for a specific position based on historical vote/score data
    calculatePositionWinRate(position, currentYear) {
        const currentYearNum = parseInt(currentYear);
        
        // No tooltips for base year (2013)
        if (currentYearNum === 2013) {
            return null;
        }

        // Get all tournaments from 2013 up to the year before current
        const historicalTournaments = this.dataManager.tournaments.filter(tournament => {
            const tournamentYear = parseInt(tournament.year);
            return tournamentYear >= 2013 && tournamentYear < currentYearNum;
        });

        if (historicalTournaments.length === 0) {
            return null;
        }

        let totalVotes = 0;
        let positionVotes = 0;
        let matchCount = 0;

        // Check each historical tournament
        historicalTournaments.forEach(tournament => {
            const matchData = this.getMatchDataForPosition(tournament, position);
            if (matchData) {
                matchCount++;
                const { participantScore, opponentScore } = matchData;
                positionVotes += participantScore;
                totalVotes += (participantScore + opponentScore);
            }
        });

        if (totalVotes === 0 || matchCount === 0) {
            return null;
        }

        const winRate = Math.round((positionVotes / totalVotes) * 100);
        const startYear = historicalTournaments[0].year;
        const endYear = historicalTournaments[historicalTournaments.length - 1].year;
        
        return {
            winRate: winRate,
            positionVotes: positionVotes,
            totalVotes: totalVotes,
            matchCount: matchCount,
            dataRange: startYear === endYear ? startYear : `${startYear}-${endYear}`
        };
    }

    // Get match data and scores for a specific position
    getMatchDataForPosition(tournament, position) {
        const brackets = tournament.brackets;
        
        // Find the match data for this position
        const matchFinders = {
            // West Quarter-finals (Round 1)
            'wqp1': () => this.findMatchByParticipant(brackets.west?.quarters, 'west_quarters_pos_1'),
            'wqp2': () => this.findMatchByParticipant(brackets.west?.quarters, 'west_quarters_pos_2'),
            'wqp3': () => this.findMatchByParticipant(brackets.west?.quarters, 'west_quarters_pos_3'),
            'wqp4': () => this.findMatchByParticipant(brackets.west?.quarters, 'west_quarters_pos_4'),
            'wqp5': () => this.findMatchByParticipant(brackets.west?.quarters, 'west_quarters_pos_5'),
            'wqp6': () => this.findMatchByParticipant(brackets.west?.quarters, 'west_quarters_pos_6'),
            'wqp7': () => this.findMatchByParticipant(brackets.west?.quarters, 'west_quarters_pos_7'),
            'wqp8': () => this.findMatchByParticipant(brackets.west?.quarters, 'west_quarters_pos_8'),
            
            // East Quarter-finals (Round 1)
            'eqp1': () => this.findMatchByParticipant(brackets.east?.quarters, 'east_quarters_pos_1'),
            'eqp2': () => this.findMatchByParticipant(brackets.east?.quarters, 'east_quarters_pos_2'),
            'eqp3': () => this.findMatchByParticipant(brackets.east?.quarters, 'east_quarters_pos_3'),
            'eqp4': () => this.findMatchByParticipant(brackets.east?.quarters, 'east_quarters_pos_4'),
            'eqp5': () => this.findMatchByParticipant(brackets.east?.quarters, 'east_quarters_pos_5'),
            'eqp6': () => this.findMatchByParticipant(brackets.east?.quarters, 'east_quarters_pos_6'),
            'eqp7': () => this.findMatchByParticipant(brackets.east?.quarters, 'east_quarters_pos_7'),
            'eqp8': () => this.findMatchByParticipant(brackets.east?.quarters, 'east_quarters_pos_8'),
            
            // West Quarter-Semi (Round 2)
            'wqsp1': () => this.findMatchByParticipant(brackets.west?.quartersemi, 'west_quartersemi_pos_1'),
            'wqsp2': () => this.findMatchByParticipant(brackets.west?.quartersemi, 'west_quartersemi_pos_2'),
            'wqsp3': () => this.findMatchByParticipant(brackets.west?.quartersemi, 'west_quartersemi_pos_3'),
            'wqsp4': () => this.findMatchByParticipant(brackets.west?.quartersemi, 'west_quartersemi_pos_4'),
            
            // East Quarter-Semi (Round 2)
            'eqsp1': () => this.findMatchByParticipant(brackets.east?.quartersemi, 'east_quartersemi_pos_1'),
            'eqsp2': () => this.findMatchByParticipant(brackets.east?.quartersemi, 'east_quartersemi_pos_2'),
            'eqsp3': () => this.findMatchByParticipant(brackets.east?.quartersemi, 'east_quartersemi_pos_3'),
            'eqsp4': () => this.findMatchByParticipant(brackets.east?.quartersemi, 'east_quartersemi_pos_4'),
            
            // West Semi-final (Round 3)
            'wsfp1': () => this.findMatchByParticipant(brackets.west?.semifinal, 'west_semifinal_pos_1'),
            'wsfp2': () => this.findMatchByParticipant(brackets.west?.semifinal, 'west_semifinal_pos_2'),
            
            // East Semi-final (Round 3)
            'esfp1': () => this.findMatchByParticipant(brackets.east?.semifinal, 'east_semifinal_pos_1'),
            'esfp2': () => this.findMatchByParticipant(brackets.east?.semifinal, 'east_semifinal_pos_2'),
            
            // Finals
            'wfp1': () => this.findMatchByParticipant(brackets.finals, 'west_finalist'),
            'efp1': () => this.findMatchByParticipant(brackets.finals, 'east_finalist')
        };

        const finder = matchFinders[position];
        return finder ? finder() : null;
    }

    // Helper method to find match data by participant position
    findMatchByParticipant(matches, positionKey) {
        if (!matches || !Array.isArray(matches)) {
            return null;
        }

        for (const match of matches) {
            if (match[positionKey]) {
                const participant = match[positionKey];
                const score = match.score;
                
                if (score && score.includes('-')) {
                    const [score1, score2] = score.split('-').map(s => parseInt(s.trim()));
                    
                    // Determine which score belongs to our participant
                    const isWinner = match.winner === participant;
                    const participantScore = isWinner ? Math.max(score1, score2) : Math.min(score1, score2);
                    const opponentScore = isWinner ? Math.min(score1, score2) : Math.max(score1, score2);
                    
                    return {
                        participant,
                        participantScore,
                        opponentScore,
                        isWinner,
                        fullScore: score
                    };
                }
            }
        }
        
        return null;
    }

    // Add tooltips to bracket positions for current tournament year
    addTooltips(currentYear) {
        // Remove existing tooltips first
        this.removeTooltips();

        const currentYearNum = parseInt(currentYear);
        
        // No tooltips for base year 2013
        if (currentYearNum === 2013) {
            return;
        }

        // Get all position elements
        const positions = [
            'wqp1', 'wqp2', 'wqp3', 'wqp4', 'wqp5', 'wqp6', 'wqp7', 'wqp8',
            'eqp1', 'eqp2', 'eqp3', 'eqp4', 'eqp5', 'eqp6', 'eqp7', 'eqp8',
            'wqsp1', 'wqsp2', 'wqsp3', 'wqsp4',
            'eqsp1', 'eqsp2', 'eqsp3', 'eqsp4',
            'wsfp1', 'wsfp2', 'esfp1', 'esfp2',
            'wfp1', 'efp1'
        ];

        positions.forEach(positionId => {
            const element = document.getElementById(positionId);
            if (element) {
                const winRateData = this.calculatePositionWinRate(positionId, currentYear);
                if (winRateData) {
                    this.attachTooltipToElement(element, winRateData);
                }
            }
        });
    }

    // Attach tooltip event handlers to an element
    attachTooltipToElement(element, winRateData) {
        const showTooltip = (e) => {
            const primaryText = `${winRateData.winRate}% win rate from this position`;
            const secondaryText = winRateData.dataRange.includes('-') 
                ? `Based on ${winRateData.dataRange} data`
                : `Based on ${winRateData.dataRange} data`;

            this.tooltip.innerHTML = `
                <div style="font-weight: 600;">${primaryText}</div>
                <div style="font-size: 10px; opacity: 0.8; margin-top: 2px;">${secondaryText}</div>
            `;

            // Position tooltip near cursor
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            let left = rect.left + scrollLeft + (rect.width / 2);
            let top = rect.top + scrollTop - 10; // Position above the element

            // Adjust if tooltip would go off screen
            const tooltipRect = this.tooltip.getBoundingClientRect();
            if (left + tooltipRect.width > window.innerWidth) {
                left = window.innerWidth - tooltipRect.width - 10;
            }
            if (left < 10) {
                left = 10;
            }
            if (top < scrollTop + 10) {
                top = rect.bottom + scrollTop + 10; // Position below if no room above
            }

            this.tooltip.style.left = left + 'px';
            this.tooltip.style.top = top + 'px';
            this.tooltip.style.opacity = '1';
        };

        const hideTooltip = () => {
            this.tooltip.style.opacity = '0';
        };

        // Store references for cleanup
        element._tooltipShowHandler = showTooltip;
        element._tooltipHideHandler = hideTooltip;

        // Add event listeners
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        
        // Add visual indicator that tooltip is available
        element.style.cursor = 'help';
        element.setAttribute('data-has-tooltip', 'true');
    }

    // Remove all tooltips and event handlers
    removeTooltips() {
        const elementsWithTooltips = document.querySelectorAll('[data-has-tooltip]');
        elementsWithTooltips.forEach(element => {
            if (element._tooltipShowHandler) {
                element.removeEventListener('mouseenter', element._tooltipShowHandler);
                element.removeEventListener('mouseleave', element._tooltipHideHandler);
                delete element._tooltipShowHandler;
                delete element._tooltipHideHandler;
            }
            element.style.cursor = '';
            element.removeAttribute('data-has-tooltip');
        });

        if (this.tooltip) {
            this.tooltip.style.opacity = '0';
        }
    }

    // Get position statistics for debugging
    getPositionStats(position, currentYear) {
        const currentYearNum = parseInt(currentYear);
        
        if (currentYearNum === 2013) {
            return null;
        }

        const historicalTournaments = this.dataManager.tournaments.filter(tournament => {
            const tournamentYear = parseInt(tournament.year);
            return tournamentYear >= 2013 && tournamentYear < currentYearNum;
        });

        const details = [];
        let totalVotes = 0;
        let positionVotes = 0;
        let matchCount = 0;

        historicalTournaments.forEach(tournament => {
            const matchData = this.getMatchDataForPosition(tournament, position);
            if (matchData) {
                matchCount++;
                const { participant, participantScore, opponentScore, fullScore, isWinner } = matchData;
                positionVotes += participantScore;
                totalVotes += (participantScore + opponentScore);
                
                details.push({
                    year: tournament.year,
                    participant: participant,
                    participantScore: participantScore,
                    opponentScore: opponentScore,
                    fullScore: fullScore,
                    isWinner: isWinner
                });
            }
        });

        return {
            position,
            currentYear,
            totalVotes,
            positionVotes,
            matchCount,
            winRate: totalVotes > 0 ? Math.round((positionVotes / totalVotes) * 100) : 0,
            details
        };
    }

    // Clean up tooltip element
    destroy() {
        this.removeTooltips();
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
    }
}

export default TooltipManager;