// Import modules
import TournamentDataManager from './modules/dataManager.js';
import UIManager from './modules/uiManager.js';
import BracketPopulator from './modules/bracketPopulator.js';
import PredictorCalculator from './modules/predictorCalculator.js';
import PredictorPopulator from './modules/predictorPopulator.js';
import ChampionsCalculator from './modules/championsCalculator.js';
import ChampionsPopulator from './modules/championsPopulator.js';
import FinalistsCalculator from './modules/finalistsCalculator.js';
import FinalistsPopulator from './modules/finalistsPopulator.js';
import VoteHistoryCalculator from './modules/voteHistoryCalculator.js';
import TooltipManager from './modules/tooltipManager.js';
import PositionUtility from './modules/positionUtility.js';

// FlipTop Isabuhay Tournament Bracket Manager
class TournamentBracket {
    constructor() {
        // Initialize utilities first
        this.positionUtility = new PositionUtility();
        
        // Initialize core data manager
        this.dataManager = new TournamentDataManager();
        
        // Initialize UI components
        this.uiManager = new UIManager(this.dataManager);
        this.bracketPopulator = new BracketPopulator(this.dataManager, this.positionUtility);
        this.tooltipManager = new TooltipManager(this.dataManager, this.positionUtility);
        
        // Initialize calculators and populators
        this.predictorCalculator = new PredictorCalculator(this.dataManager);
        this.predictorPopulator = new PredictorPopulator(this.dataManager, this.positionUtility);
        this.championsCalculator = new ChampionsCalculator(this.dataManager);
        this.championsPopulator = new ChampionsPopulator(this.dataManager, this.positionUtility);
        this.finalistsCalculator = new FinalistsCalculator(this.dataManager);
        this.finalistsPopulator = new FinalistsPopulator(this.dataManager, this.positionUtility);
        this.voteHistoryCalculator = new VoteHistoryCalculator(this.dataManager, this.positionUtility);
        
        // Set up UI event handlers
        this.uiManager.onTournamentSelect = (year) => this.displayTournament(year);
        this.uiManager.onPredictorMode = () => this.displayPredictorMode();
        this.uiManager.onChampionsMode = () => this.displayChampionsMode();
        this.uiManager.onFinalistsMode = () => this.displayFinalistsMode();
        
        this.init();
    } 

    async init() {
        await this.dataManager.loadTournamentData();
        this.uiManager.setupYearSelector();
        this.displayLatestTournament();
    }

    displayLatestTournament() {
        const latestTournament = this.dataManager.getLatestTournament();
        if (latestTournament) {
            this.displayTournament(latestTournament.year);
        }
    }

    displayTournament(year) {
        const tournament = this.dataManager.setCurrentTournament(year);
        if (!tournament) return;

        console.log('Displaying tournament:', tournament);

        // Disable predictor mode when switching to tournament view
        this.predictorPopulator.disablePredictorMode();

        // Remove tooltips from other modes
        this.tooltipManager.removeTooltips();

        // Update year selector
        this.uiManager.updateYearSelector(year);

        // Update champion display
        this.uiManager.updateChampionDisplay();

        // Update bracket with participants
        this.populateBracket();

        // Update round details with tournament-specific info
        this.uiManager.updateRoundDetails();

        // Add tooltips for position win rates (only for years after 2013)
        this.tooltipManager.addTooltips(year);
    }

    populateBracket() {
        const currentTournament = this.dataManager.getCurrentTournament();
        if (!currentTournament || currentTournament.total_participants === 0) {
            this.uiManager.showNoDataMessage();
            return;
        }

        // Clear existing bracket content first
        this.uiManager.clearBracket();

        // Populate match results if available
        this.bracketPopulator.populateBracket();
    }

    displayPredictorMode() {
        // Remove tooltips when in predictor mode
        this.tooltipManager.removeTooltips();
        
        // Show bracket
        this.uiManager.showBracket();
        
        // Calculate vote totals across all tournaments
        const voteTotals = this.predictorCalculator.calculatePositionVoteTotals();
        console.log('Predictor Vote Totals:', voteTotals);
        
        // Clear bracket
        this.uiManager.clearBracket();
        
        // Update round details for predictor mode
        this.uiManager.updatePredictorRoundDetails();
        
        // Populate bracket with vote totals
        this.predictorPopulator.populateVoteTotals(voteTotals);
    }

    displayChampionsMode() {
        // Remove tooltips when in champions mode
        this.tooltipManager.removeTooltips();
        
        // Disable predictor mode when switching to champions view
        this.predictorPopulator.disablePredictorMode();
        
        // Show bracket
        this.uiManager.showBracket();
        
        // Calculate champion positions across all tournaments
        const championPositions = this.championsCalculator.calculateChampionPositions();
        console.log('Champion Positions:', championPositions);
        
        // Clear bracket
        this.uiManager.clearBracket();
        
        // Update round details for champions mode
        this.uiManager.updateChampionsRoundDetails();
        
        // Populate bracket with champion position highlights
        this.championsPopulator.populateChampionPositions(championPositions);
    }

    displayFinalistsMode() {
        // Remove tooltips when in finalists mode
        this.tooltipManager.removeTooltips();
        
        // Disable predictor mode when switching to finalists view
        this.predictorPopulator.disablePredictorMode();
        
        // Show bracket
        this.uiManager.showBracket();
        
        // Calculate finalist positions across all tournaments
        const finalistPositions = this.finalistsCalculator.calculateFinalistPositions();
        console.log('Finalist Positions:', finalistPositions);
        
        // Clear bracket
        this.uiManager.clearBracket();
        
        // Update round details for finalists mode
        this.uiManager.updateFinalistsRoundDetails();
        
        // Populate bracket with finalist position highlights
        this.finalistsPopulator.populateFinalistPositions(finalistPositions);
    }

    // Utility method to get position statistics (for debugging)
    getPositionStats(position, year) {
        return this.tooltipManager.getPositionStats(position, year);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const bracket = new TournamentBracket();
    
    // Make bracket instance globally available
    window.tournamentBracket = bracket;
    
    // For debugging - expose tooltip stats function
    window.getPositionStats = (position, year) => bracket.getPositionStats(position, year);
});