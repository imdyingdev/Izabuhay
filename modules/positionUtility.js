// Position Utility Module - Centralizes position mapping and conversion logic
class PositionUtility {
    constructor() {
        // Map element IDs to v5 format position keys
        this.elementToPositionKey = {
            // West quarters
            'wqp1': 'west_quarters_pos_1',
            'wqp2': 'west_quarters_pos_2',
            'wqp3': 'west_quarters_pos_3',
            'wqp4': 'west_quarters_pos_4',
            'wqp5': 'west_quarters_pos_5',
            'wqp6': 'west_quarters_pos_6',
            'wqp7': 'west_quarters_pos_7',
            'wqp8': 'west_quarters_pos_8',
            
            // East quarters
            'eqp1': 'east_quarters_pos_1',
            'eqp2': 'east_quarters_pos_2',
            'eqp3': 'east_quarters_pos_3',
            'eqp4': 'east_quarters_pos_4',
            'eqp5': 'east_quarters_pos_5',
            'eqp6': 'east_quarters_pos_6',
            'eqp7': 'east_quarters_pos_7',
            'eqp8': 'east_quarters_pos_8',
            
            // West quarter-semis
            'wqsp1': 'west_quartersemi_pos_1',
            'wqsp2': 'west_quartersemi_pos_2',
            'wqsp3': 'west_quartersemi_pos_3',
            'wqsp4': 'west_quartersemi_pos_4',
            
            // East quarter-semis
            'eqsp1': 'east_quartersemi_pos_1',
            'eqsp2': 'east_quartersemi_pos_2',
            'eqsp3': 'east_quartersemi_pos_3',
            'eqsp4': 'east_quartersemi_pos_4',
            
            // West semis
            'wsfp1': 'west_semifinal_pos_1',
            'wsfp2': 'west_semifinal_pos_2',
            
            // East semis
            'esfp1': 'east_semifinal_pos_1',
            'esfp2': 'east_semifinal_pos_2',
            
            // Finals
            'wfp1': 'west_finalist',
            'efp1': 'east_finalist'
        };
        
        // Reverse mapping for position key to element ID
        this.positionKeyToElement = {};
        for (const [elementId, posKey] of Object.entries(this.elementToPositionKey)) {
            this.positionKeyToElement[posKey] = elementId;
        }
    }

    // Convert v5 position key to element ID
    convertToElementId(posKey) {
        return this.positionKeyToElement[posKey] || posKey;
    }

    // Convert element ID to v5 position key
    convertToPositionKey(elementId) {
        return this.elementToPositionKey[elementId] || elementId;
    }

    // Get all position element IDs
    getAllPositionIds() {
        return Object.keys(this.elementToPositionKey);
    }

    // Get position structure information
    getPositionInfo(elementId) {
        const posKey = this.elementToPositionKey[elementId];
        if (!posKey) return null;
        
        const parts = posKey.split('_');
        if (parts.length < 2) return null;
        
        const region = parts[0]; // west/east
        const round = parts[1]; // quarters/quartersemi/semifinal
        
        // For finals, handle special case
        if (posKey === 'west_finalist' || posKey === 'east_finalist') {
            return {
                region,
                round: 'finals',
                position: region === 'west' ? 1 : 2
            };
        }
        
        // For regular positions
        const position = parts.length >= 4 ? parseInt(parts[3]) : null;
        
        return {
            region,
            round,
            position
        };
    }

    // Extract position number from v5 key
    extractPositionFromV5Key(key) {
        const match = key.match(/pos_(\d+)$/);
        return match ? parseInt(match[1]) : null;
    }
}

export default PositionUtility;
