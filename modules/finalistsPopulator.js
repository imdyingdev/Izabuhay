// Finalists Populator Module - Displays finalist positions with violet backgrounds
class FinalistsPopulator {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    populateFinalistPositions(finalistPositions) {
        // Clear all positions first
        this.clearAllPositions();

        // Populate west quarters finalist positions
        Object.keys(finalistPositions.quarters.west).forEach(position => {
            const elementId = `wqp${position}`;
            const data = finalistPositions.quarters.west[position];
            this.highlightFinalistPosition(elementId, data.count, data.years);
        });

        // Populate east quarters finalist positions  
        Object.keys(finalistPositions.quarters.east).forEach(position => {
            const elementId = `eqp${position}`;
            const data = finalistPositions.quarters.east[position];
            this.highlightFinalistPosition(elementId, data.count, data.years);
        });
    }

    highlightFinalistPosition(elementId, count, years) {
        const element = document.getElementById(elementId);
        if (element) {
            // Sort years and format as comma-separated list
            const sortedYears = years.sort((a, b) => parseInt(a) - parseInt(b));
            const yearsText = sortedYears.join(', ');
            
            // Display count with years in parentheses
            element.innerHTML = `${count} (${yearsText})<span class="score">&nbsp;</span>`;
            element.style.backgroundColor = '#9966cc'; // Violet background
            element.style.color = '#fff'; // White text for contrast
            element.style.fontWeight = 'bold';
            element.style.textAlign = 'center';
            element.style.fontSize = '12px'; // Smaller font to fit years
            element.style.lineHeight = '1.2';
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
            
            console.log(`Finalists: Highlighted position ${elementId} with ${count} finalist(s) in years: ${yearsText}`);
        }
    }

    clearAllPositions() {
        // Clear all quarter positions
        for (let i = 1; i <= 8; i++) {
            const westElement = document.getElementById(`wqp${i}`);
            const eastElement = document.getElementById(`eqp${i}`);
            
            if (westElement) {
                westElement.innerHTML = '&nbsp;<span class="score">&nbsp;</span>';
                westElement.style.backgroundColor = '';
                westElement.style.color = '';
                westElement.style.fontWeight = '';
                westElement.style.textAlign = '';
                westElement.style.fontSize = '';
                westElement.style.display = '';
                westElement.style.alignItems = '';
                westElement.style.justifyContent = '';
                westElement.style.lineHeight = '';
            }
            
            if (eastElement) {
                eastElement.innerHTML = '&nbsp;<span class="score">&nbsp;</span>';
                eastElement.style.backgroundColor = '';
                eastElement.style.color = '';
                eastElement.style.fontWeight = '';
                eastElement.style.textAlign = '';
                eastElement.style.fontSize = '';
                eastElement.style.display = '';
                eastElement.style.alignItems = '';
                eastElement.style.justifyContent = '';
                eastElement.style.lineHeight = '';
            }
        }

        // Clear other rounds
        const otherRounds = [
            'wqsp1', 'wqsp2', 'wqsp3', 'wqsp4',
            'eqsp1', 'eqsp2', 'eqsp3', 'eqsp4',
            'wsfp1', 'wsfp2', 'esfp1', 'esfp2',
            'wfp1', 'efp1'
        ];

        otherRounds.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = '&nbsp;<span class="score">&nbsp;</span>';
                element.style.backgroundColor = '';
                element.style.color = '';
                element.style.fontWeight = '';
                element.style.textAlign = '';
                element.style.fontSize = '';
                element.style.display = '';
                element.style.alignItems = '';
                element.style.justifyContent = '';
                element.style.lineHeight = '';
            }
        });
    }
}

export default FinalistsPopulator;
