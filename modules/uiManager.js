// UI Management Module
class UIManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        
        // DOM cache for frequently accessed elements
        this.domCache = {};
        
        // Initialize cache with commonly used elements
        this.initDomCache();
    }
    
    // Initialize DOM cache with commonly used elements
    initDomCache() {
        // Year selector
        this.domCache.yearSpan = document.getElementById('tournament-year');
        this.domCache.yearSelector = null; // Will be created later
        
        // Round details elements
        this.domCache.round1Details = document.querySelectorAll('.round-one .round-details');
        this.domCache.round2Details = document.querySelectorAll('.round-two .round-details');
        this.domCache.round3Details = document.querySelectorAll('.round-three .round-details');
        this.domCache.finalDetails = document.querySelector('.final .round-details');
        
        // Champion section
        this.domCache.championSection = document.querySelector('.final .matchup.championship');
        
        // Bracket container
        this.domCache.bracket = document.getElementById('bracket');
        this.domCache.container = document.querySelector('.container');
    }
    
    // Get element from cache or DOM
    getElement(id) {
        if (!this.domCache[id]) {
            this.domCache[id] = document.getElementById(id);
        }
        return this.domCache[id];
    }
    
    // Get elements by selector from DOM
    getElements(selector) {
        const cacheKey = `selector_${selector}`;
        if (!this.domCache[cacheKey]) {
            this.domCache[cacheKey] = document.querySelectorAll(selector);
        }
        return this.domCache[cacheKey];
    }

    setupYearSelector() {
        // Create year selector dropdown
        const yearSpan = this.domCache.yearSpan;
        const tournaments = this.dataManager.getTournaments();
        
        if (yearSpan && tournaments.length > 0) {
            const select = document.createElement('select');
            select.id = 'year-selector';
            select.style.cssText = 'background: transparent; border: none; color: white; font-size: inherit; font-family: inherit;';
            
            // Add Predictor option
            const predictorOption = document.createElement('option');
            predictorOption.value = 'predictor';
            predictorOption.textContent = 'Vote Percentages (All Years)';
            predictorOption.style.color = 'black';
            select.appendChild(predictorOption);
            
            // Add Champions option
            const championsOption = document.createElement('option');
            championsOption.value = 'champions';
            championsOption.textContent = 'Champions';
            championsOption.style.color = 'black';
            select.appendChild(championsOption);
            
            // Add Finalists option
            const finalistsOption = document.createElement('option');
            finalistsOption.value = 'finalists';
            finalistsOption.textContent = 'Finalists (2nd Place)';
            finalistsOption.style.color = 'black';
            select.appendChild(finalistsOption);
            
            tournaments.forEach(tournament => {
                const option = document.createElement('option');
                option.value = tournament.year;
                option.textContent = tournament.year;
                option.style.color = 'black';
                select.appendChild(option);
            });

            select.addEventListener('change', (e) => {
                if (e.target.value === 'predictor') {
                    this.onPredictorMode();
                } else if (e.target.value === 'champions') {
                    this.onChampionsMode();
                } else if (e.target.value === 'finalists') {
                    this.onFinalistsMode();
                } else {
                    this.onTournamentSelect(e.target.value);
                }
            });

            yearSpan.innerHTML = '';
            yearSpan.appendChild(select);
            
            // Store in cache
            this.domCache.yearSelector = select;
        }
    }

    updateYearSelector(year) {
        const yearSelector = this.domCache.yearSelector || document.getElementById('year-selector');
        if (yearSelector) {
            yearSelector.value = year;
            // Update cache
            this.domCache.yearSelector = yearSelector;
        }
    }

    updateChampionDisplay() {
        const currentTournament = this.dataManager.getCurrentTournament();
        const championSection = this.domCache.championSection;
        
        if (championSection && currentTournament?.champion) {
            const championLi = championSection.querySelector('.team-top');
            if (championLi) {
                championLi.innerHTML = `${currentTournament.champion} <span class="vote-count">🏆</span>`;
                championLi.style.backgroundColor = '#FFD700';
                championLi.style.fontWeight = 'bold';
            }
        }
    }

    updateRoundDetails() {
        const currentTournament = this.dataManager.getCurrentTournament();
        
        // Update Round 1 (Quarters)
        if (this.domCache.round1Details) {
            this.domCache.round1Details.forEach(detail => {
                const dateSpan = detail.querySelector('.date');
                if (dateSpan) {
                    dateSpan.textContent = 'QUARTERS';
                }
            });
        }
        
        // Update Round 2 (Quarter Semis)
        if (this.domCache.round2Details) {
            this.domCache.round2Details.forEach(detail => {
                const dateSpan = detail.querySelector('.date');
                if (dateSpan) {
                    dateSpan.textContent = 'QUARTER SEMIS';
                }
            });
        }
        
        // Update Round 3 (Semifinals)
        if (this.domCache.round3Details) {
            this.domCache.round3Details.forEach(detail => {
                const dateSpan = detail.querySelector('.date');
                if (dateSpan) {
                    dateSpan.textContent = 'SEMIFINALS';
                }
            });
        }

        // Update championship
        const final = this.domCache.finalDetails;
        if (final && currentTournament) {
            const dateSpan = final.querySelector('.date');
            if (dateSpan) {
                dateSpan.textContent = `Isabuhay ${currentTournament.year}`;
            }
        }
    }

    updateStatsRoundDetails() {
        // Update Round 1
        const round1Details = document.querySelectorAll('.round-one .round-details');
        round1Details.forEach(detail => {
            const dateSpan = detail.querySelector('.date');
            if (dateSpan) {
                dateSpan.textContent = 'QUARTERS WIN %';
            }
        });
        
        // Update Round 2
        const round2Details = document.querySelectorAll('.round-two .round-details');
        round2Details.forEach(detail => {
            const dateSpan = detail.querySelector('.date');
            if (dateSpan) {
                dateSpan.textContent = 'QTR-SEMIS WIN %';
            }
        });
        
        // Update Round 3
        const round3Details = document.querySelectorAll('.round-three .round-details');
        round3Details.forEach(detail => {
            const dateSpan = detail.querySelector('.date');
            if (dateSpan) {
                dateSpan.textContent = 'SEMIS WIN %';
            }
        });
        
        // Update championship
        const final = document.querySelector('.final .round-details');
        if (final) {
            const dateSpan = final.querySelector('.date');
            if (dateSpan) {
                dateSpan.textContent = 'FINALS WIN % (2013-2025)';
            }
        }
    }

    updatePredictorRoundDetails() {
        // Update Round 1
        const round1Details = document.querySelectorAll('.round-one .round-details');
        round1Details.forEach(detail => {
            detail.innerHTML = 'Round 1 (Quarters)<br/><span class="date">Total Votes</span>';
        });
        
        // Update Round 2
        const round2Details = document.querySelectorAll('.round-two .round-details');
        round2Details.forEach(detail => {
            detail.innerHTML = 'Round 2 (Quarter-Semis)<br/><span class="date">Total Votes</span>';
        });
        
        // Update Round 3
        const round3Details = document.querySelectorAll('.round-three .round-details');
        round3Details.forEach(detail => {
            detail.innerHTML = 'Round 3 (Semis)<br/><span class="date">Total Votes</span>';
        });
        
        // Update Finals
        const finalDetails = document.querySelector('.final .round-details');
        if (finalDetails) {
            finalDetails.innerHTML = 'Finals<br/><span class="date">Total Votes</span>';
        }
    }

    updateChampionsRoundDetails() {
        // Update Round 1 - only quarters show champion positions
        const round1Details = document.querySelectorAll('.round-one .round-details');
        round1Details.forEach(detail => {
            detail.innerHTML = 'Round 1 (Quarters)<br/><span class="date">Champion Positions</span>';
        });
        
        // Update Round 2 - clear
        const round2Details = document.querySelectorAll('.round-two .round-details');
        round2Details.forEach(detail => {
            detail.innerHTML = 'Round 2 (Quarter-Semis)<br/><span class="date">-</span>';
        });
        
        // Update Round 3 - clear
        const round3Details = document.querySelectorAll('.round-three .round-details');
        round3Details.forEach(detail => {
            detail.innerHTML = 'Round 3 (Semis)<br/><span class="date">-</span>';
        });
        
        // Update Finals - clear
        const finalDetails = document.querySelector('.final .round-details');
        if (finalDetails) {
            finalDetails.innerHTML = 'Finals<br/><span class="date">-</span>';
        }
    }

    updateFinalistsRoundDetails() {
        // Update Round 1 - only quarters show finalist positions
        const round1Details = document.querySelectorAll('.round-one .round-details');
        round1Details.forEach(detail => {
            detail.innerHTML = 'Round 1 (Quarters)<br/><span class="date">Finalist Positions</span>';
        });
        
        // Update Round 2 - clear
        const round2Details = document.querySelectorAll('.round-two .round-details');
        round2Details.forEach(detail => {
            detail.innerHTML = 'Round 2 (Quarter-Semis)<br/><span class="date">-</span>';
        });
        
        // Update Round 3 - clear
        const round3Details = document.querySelectorAll('.round-three .round-details');
        round3Details.forEach(detail => {
            detail.innerHTML = 'Round 3 (Semis)<br/><span class="date">-</span>';
        });
        
        // Update Finals - clear
        const finalDetails = document.querySelector('.final .round-details');
        if (finalDetails) {
            finalDetails.innerHTML = 'Finals<br/><span class="date">-</span>';
        }
    }

    clearBracket() {
        // Clear all matchups but preserve debug labels
        const allMatchups = this.getElements('.matchup .team');
        allMatchups.forEach(team => {
            // Preserve existing debug labels
            const existingDebugLabel = team.querySelector('.pos-debug');
            
            team.innerHTML = '&nbsp;<span class="score">&nbsp;</span>';
            
            // Use CSS class approach instead of individual style resets
            team.className = team.className.replace(/\bwinner\b|\bhighlight\b/g, '').trim();
            team.style = ''; // Reset all inline styles
            
            // Re-add debug label if it existed
            if (existingDebugLabel) {
                team.appendChild(existingDebugLabel);
            }
        });
    }

    showNoDataMessage() {
        const currentTournament = this.dataManager.getCurrentTournament();
        const container = this.domCache.container;
        
        if (container) {
            const message = document.createElement('div');
            message.className = 'no-data-message';
            message.style.cssText = 'text-align: center; padding: 50px; font-size: 18px; color: #666;';
            message.innerHTML = `
                <h3>Tournament Data Not Available</h3>
                <p>Participant data for Isabuhay ${currentTournament?.year || 'this year'} is not yet available.</p>
                ${currentTournament?.champion ? `<p><strong>Champion:</strong> ${currentTournament.champion} 🏆</p>` : ''}
            `;
            
            // Hide the bracket and show message
            const bracket = this.domCache.bracket;
            if (bracket) {
                bracket.style.display = 'none';
            }
            
            // Insert message after hero section
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.insertAdjacentElement('afterend', message);
            }
        }
    }

    showBracket() {
        const bracket = this.domCache.bracket;
        if (bracket) {
            bracket.style.display = 'block';
        }
        
        // Remove any existing message
        const existingMessage = document.querySelector('.no-data-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    // Event handlers (to be set by main class)
    onTournamentSelect(year) {
        // Override this method
    }

    onPredictorMode() {
        // Override this method
    }

    onChampionsMode() {
        // Override this method
    }

    onFinalistsMode() {
        // Override this method
    }

}

export default UIManager;
