// Predictor Populator Module - Displays aggregated vote totals in bracket positions
import VoteHistoryCalculator from './voteHistoryCalculator.js';

class PredictorPopulator {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.voteHistoryCalculator = new VoteHistoryCalculator(dataManager);
        this.tooltip = null;
        this.isPredictorMode = false;
        this.createTooltip();
    }

    populateVoteTotals(voteTotals) {
        // Set predictor mode flag
        this.isPredictorMode = true;
        
        // Round 1: Quarters vote totals - separate west and east
        // Populate quarters
        this.populatePositionTotal('wqp1', 1, voteTotals.quarters.west);
        this.populatePositionTotal('wqp2', 2, voteTotals.quarters.west);
        this.populatePositionTotal('wqp3', 3, voteTotals.quarters.west);
        this.populatePositionTotal('wqp4', 4, voteTotals.quarters.west);
        this.populatePositionTotal('wqp5', 5, voteTotals.quarters.west);
        this.populatePositionTotal('wqp6', 6, voteTotals.quarters.west);
        this.populatePositionTotal('wqp7', 7, voteTotals.quarters.west);
        this.populatePositionTotal('wqp8', 8, voteTotals.quarters.west);
        
        this.populatePositionTotal('eqp1', 1, voteTotals.quarters.east);
        this.populatePositionTotal('eqp2', 2, voteTotals.quarters.east);
        this.populatePositionTotal('eqp3', 3, voteTotals.quarters.east);
        this.populatePositionTotal('eqp4', 4, voteTotals.quarters.east);
        this.populatePositionTotal('eqp5', 5, voteTotals.quarters.east);
        this.populatePositionTotal('eqp6', 6, voteTotals.quarters.east);
        this.populatePositionTotal('eqp7', 7, voteTotals.quarters.east);
        this.populatePositionTotal('eqp8', 8, voteTotals.quarters.east);

        // Populate quarter-semis
        this.populatePositionTotal('wqsp1', 1, voteTotals.quarterSemis.west);
        this.populatePositionTotal('wqsp2', 2, voteTotals.quarterSemis.west);
        this.populatePositionTotal('wqsp3', 3, voteTotals.quarterSemis.west);
        this.populatePositionTotal('wqsp4', 4, voteTotals.quarterSemis.west);
        
        this.populatePositionTotal('eqsp1', 1, voteTotals.quarterSemis.east);
        this.populatePositionTotal('eqsp2', 2, voteTotals.quarterSemis.east);
        this.populatePositionTotal('eqsp3', 3, voteTotals.quarterSemis.east);
        this.populatePositionTotal('eqsp4', 4, voteTotals.quarterSemis.east);

        // Populate semis
        this.populatePositionTotal('wsfp1', 1, voteTotals.semis.west);
        this.populatePositionTotal('wsfp2', 2, voteTotals.semis.west);
        
        this.populatePositionTotal('esfp1', 1, voteTotals.semis.east);
        this.populatePositionTotal('esfp2', 2, voteTotals.semis.east);

        // Populate finals
        this.populatePositionTotal('wfp1', 1, voteTotals.finals);
        this.populatePositionTotal('efp1', 2, voteTotals.finals);

        // Add hover functionality after populating
        this.addHoverListeners();
    }
    
    populatePositionTotal(elementId, position, roundTotals) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const voteTotal = roundTotals[position] || 0;
        
        // Calculate win percentage based on matchup
        const { percentage, opponentVotes } = this.calculateWinPercentage(elementId, position, roundTotals);
        
        // Determine text color based on percentage - always color code
        const percentageNum = parseFloat(percentage);
        let textColor;
        if (percentageNum >= 50) {
            textColor = '#22c55e'; // Green for higher percentage (≥50%)
        } else {
            textColor = '#ef4444'; // Red for lower percentage (<50%)
        }
        
        // Determine side color based on element ID
        let backgroundColor = 'white';
        if (elementId.startsWith('w')) {
            backgroundColor = '#fff4e6'; // Soft orange for west
        } else if (elementId.startsWith('e')) {
            backgroundColor = '#f3e8ff'; // Soft violet for east
        }

        // Display percentage and vote count
        element.innerHTML = `${percentage}% <span class="score">${voteTotal}v</span>`;
        element.style.backgroundColor = backgroundColor;
        element.style.color = textColor;
        element.style.fontWeight = 'bold';
        
        console.log(`Predictor: ${elementId} - ${percentage}% (${voteTotal}v vs ${opponentVotes}v)`);
    }

    calculateWinPercentage(elementId, position, roundTotals) {
        const voteTotal = roundTotals[position] || 0;
        let opponentPosition;
        let opponentVotes = 0;

        // Determine opponent based on bracket matchups
        if (elementId.includes('qp')) { // Quarters
            // Quarters matchups: 1vs2, 3vs4, 5vs6, 7vs8
            if (position % 2 === 1) {
                opponentPosition = position + 1; // 1->2, 3->4, 5->6, 7->8
            } else {
                opponentPosition = position - 1; // 2->1, 4->3, 6->5, 8->7
            }
        } else if (elementId.includes('qsp')) { // Quarter-semis
            // Quarter-semis matchups: 1vs2, 3vs4
            if (position % 2 === 1) {
                opponentPosition = position + 1; // 1->2, 3->4
            } else {
                opponentPosition = position - 1; // 2->1, 4->3
            }
        } else if (elementId.includes('sfp')) { // Semis
            // Semis matchups: 1vs2
            opponentPosition = position === 1 ? 2 : 1;
        } else if (elementId.includes('fp')) { // Finals
            // Finals: west vs east (positions 1 vs 2)
            opponentPosition = position === 1 ? 2 : 1;
        }

        if (opponentPosition && roundTotals[opponentPosition] !== undefined) {
            opponentVotes = roundTotals[opponentPosition];
        }

        const totalVotes = voteTotal + opponentVotes;
        const percentage = totalVotes > 0 ? ((voteTotal / totalVotes) * 100).toFixed(2) : '0.00';

        return { percentage, opponentVotes };
    }

    createTooltip() {
        // Create tooltip element
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'vote-tooltip';
        document.body.appendChild(this.tooltip);
    }

    addHoverListeners() {
        // Get all bracket position elements
        const positionElements = [
            'wqp1', 'wqp2', 'wqp3', 'wqp4', 'wqp5', 'wqp6', 'wqp7', 'wqp8',
            'eqp1', 'eqp2', 'eqp3', 'eqp4', 'eqp5', 'eqp6', 'eqp7', 'eqp8',
            'wqsp1', 'wqsp2', 'wqsp3', 'wqsp4',
            'eqsp1', 'eqsp2', 'eqsp3', 'eqsp4',
            'wsfp1', 'wsfp2', 'esfp1', 'esfp2',
            'wfp1', 'efp1'
        ];

        positionElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener('mouseenter', (e) => this.showTooltip(e, elementId));
                element.addEventListener('mouseleave', () => this.hideTooltip());
            }
        });
    }

    showTooltip(event, elementId) {
        // Only show tooltip in predictor mode
        if (!this.isPredictorMode) {
            return;
        }
        
        const voteHistory = this.voteHistoryCalculator.getFormattedVoteHistory(elementId);
        
        if (!voteHistory || voteHistory === 'No voting history available') {
            return;
        }

        this.tooltip.textContent = voteHistory;
        this.tooltip.classList.add('show');
        this.positionTooltip(event.target);
    }

    hideTooltip() {
        this.tooltip.classList.remove('show');
    }

    positionTooltip(targetElement) {
        const elementRect = targetElement.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Position tooltip above the element, centered horizontally
        let left = elementRect.left + scrollLeft + (elementRect.width / 2) - (tooltipRect.width / 2);
        let top = elementRect.top + scrollTop - tooltipRect.height - 12;

        // Adjust if tooltip goes off screen horizontally
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }

        // If tooltip would go above viewport, show it below the element instead
        if (elementRect.top - tooltipRect.height - 12 < 0) {
            top = elementRect.bottom + scrollTop + 12;
            this.tooltip.setAttribute('data-arrow', 'up');
        } else {
            this.tooltip.setAttribute('data-arrow', 'down');
        }

        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
    }

    updateTooltipPosition(event) {
        // Remove the mousemove positioning since we want static positioning
        return;
    }

    // Method to disable predictor mode (called when switching to other modes)
    disablePredictorMode() {
        this.isPredictorMode = false;
        this.hideTooltip();
    }
}

export default PredictorPopulator;
