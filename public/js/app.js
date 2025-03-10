// Global variables
let sqlEditor;
let currentLevel = 1;
let totalLevels = 10;
let currentLevelData = null;
let levels = [];
let audioContext = null;
let audioBuffers = {};
let isPlaying = false;
let currentAudio = null;

// DOM Elements
const elements = {
    currentLevelEl: document.getElementById('currentLevel'),
    levelTitleEl: document.getElementById('levelTitle'),
    levelDescriptionEl: document.getElementById('levelDescription'),
    levelTaskEl: document.getElementById('levelTask'),
    levelHintEl: document.getElementById('levelHint'),
    tableHintsEl: document.getElementById('tableHints'),
    queryResultsEl: document.getElementById('queryResults'),
    runBtnEl: document.getElementById('runBtn'),
    resetBtnEl: document.getElementById('resetBtn'),
    solutionBtnEl: document.getElementById('solutionBtn'),
    playRewardBtnEl: document.getElementById('playRewardBtn'),
    trackInfoEl: document.getElementById('trackInfo'),
    progressBarEl: document.getElementById('progressBar').querySelector('.progress-fill'),
    progressTextEl: document.querySelector('.progress-text'),
    badgesListEl: document.getElementById('badgesList'),
    successModalEl: document.getElementById('successModal'),
    schemaModalEl: document.getElementById('schemaModal'),
    howToPlayModalEl: document.getElementById('howToPlayModal'),
    successMessageEl: document.getElementById('successMessage'),
    rewardNameEl: document.getElementById('rewardName'),
    nextLevelTitleEl: document.getElementById('nextLevelTitle'),
    playRewardModalBtnEl: document.getElementById('playRewardModalBtn'),
    nextLevelBtnEl: document.getElementById('nextLevelBtn'),
    howToPlayBtnEl: document.getElementById('howToPlayBtn'),
    schemaBtnEl: document.getElementById('schemaBtn'),
    schemaContentEl: document.getElementById('schemaContent'),
    sampleDataEl: document.getElementById('sampleData')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEditor();
    fetchLevels();
    initializeEventListeners();
    initializeAudio();
    showHowToPlayOnFirstVisit();
});

// Initialize CodeMirror editor
function initializeEditor() {
    sqlEditor = CodeMirror.fromTextArea(document.getElementById('sqlEditor'), {
        mode: 'text/x-sql',
        theme: 'dracula',
        lineNumbers: true,
        indentWithTabs: true,
        smartIndent: true,
        lineWrapping: true,
        matchBrackets: true,
        autofocus: true
    });
    
    // Set initial height
    sqlEditor.setSize(null, 150);
}

// Fetch levels data from the server
async function fetchLevels() {
    try {
        const response = await fetch('/api/levels');
        const data = await response.json();
        levels = data.levels;
        loadLevel(currentLevel);
    } catch (error) {
        console.error('Error fetching levels:', error);
        showError('Failed to load game levels. Please try refreshing the page.');
    }
}

// Fetch database schema from the server
async function fetchSchema() {
    try {
        const response = await fetch('/api/schema');
        const data = await response.json();
        return data.schema;
    } catch (error) {
        console.error('Error fetching schema:', error);
        return null;
    }
}

// Load a specific level
function loadLevel(levelIndex) {
    if (levelIndex < 1 || levelIndex > levels.length) {
        console.error('Invalid level index:', levelIndex);
        return;
    }
    
    currentLevel = levelIndex;
    currentLevelData = levels[levelIndex - 1];
    
    // Update UI elements
    elements.currentLevelEl.textContent = currentLevel;
    elements.levelTitleEl.textContent = currentLevelData.title;
    elements.levelDescriptionEl.textContent = currentLevelData.description;
    elements.levelTaskEl.textContent = currentLevelData.task;
    elements.levelHintEl.textContent = currentLevelData.hint;
    
    // Update table hints
    elements.tableHintsEl.innerHTML = '';
    currentLevelData.tableHints.forEach(table => {
        const chip = document.createElement('span');
        chip.className = 'table-chip';
        chip.textContent = table;
        elements.tableHintsEl.appendChild(chip);
    });
    
    // Reset editor
    sqlEditor.setValue('');
    
    // Reset query results
    elements.queryResultsEl.innerHTML = '<p class="results-placeholder">Run a query to see results here...</p>';
    
    // Update progress bar
    const progressPercentage = ((currentLevel - 1) / totalLevels) * 100;
    elements.progressBarEl.style.width = `${progressPercentage}%`;
    elements.progressTextEl.textContent = `${currentLevel}/${totalLevels} Levels`;
    
    // Update track info
    elements.trackInfoEl.textContent = 'Complete the challenge to unlock a track!';
    elements.playRewardBtnEl.disabled = true;
    
    // If this is the last level, update next level preview
    if (currentLevel === levels.length) {
        elements.nextLevelTitleEl.textContent = 'Game Complete!';
    } else {
        elements.nextLevelTitleEl.textContent = levels[currentLevel].title;
    }
}

// Execute the SQL query
async function runQuery() {
    const query = sqlEditor.getValue().trim();
    
    if (!query) {
        showError('Please enter an SQL query.');
        return;
    }
    
    try {
        const response = await fetch('/api/execute-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                levelId: currentLevel
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showError(data.error);
            return;
        }
        
        displayResults(data.results);
        checkAnswer(query, data.results);
    } catch (error) {
        console.error('Error executing query:', error);
        showError('Failed to execute query. Please try again.');
    }
}

// Display query results
function displayResults(results) {
    if (!results || results.length === 0) {
        elements.queryResultsEl.innerHTML = '<p class="results-placeholder">No results found.</p>';
        return;
    }
    
    // Create table for results
    const table = document.createElement('table');
    table.className = 'results-table';
    
    // Create header row
    const headerRow = document.createElement('tr');
    const columns = Object.keys(results[0]);
    
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    
    table.appendChild(headerRow);
    
    // Create data rows
    results.forEach(row => {
        const tr = document.createElement('tr');
        
        columns.forEach(column => {
            const td = document.createElement('td');
            td.textContent = row[column] !== null ? row[column] : 'null';
            tr.appendChild(td);
        });
        
        table.appendChild(tr);
    });
    
    // Clear previous results and add table
    elements.queryResultsEl.innerHTML = '';
    elements.queryResultsEl.appendChild(table);
}

// Check if the answer is correct
function checkAnswer(query, results) {
    // For simplicity, we'll just check if the query contains the solution
    // In a real implementation, you'd want to compare the actual results
    
    const normalizedQuery = query.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedSolution = currentLevelData.solution.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Simple check: Does the query match the solution or get the same results?
    // This is a simplified approach - a robust solution would compare actual result sets
    if (normalizedQuery.includes(normalizedSolution) || isSameResults(results)) {
        showSuccess();
    }
}

// Simple function to determine if results match expected output
// In a real implementation, this would be more sophisticated
function isSameResults(results) {
    // For now, just assume it's correct if there are results
    // In a real implementation, you'd compare with expected results
    return results && results.length > 0;
}

// Show error message
function showError(message) {
    elements.queryResultsEl.innerHTML = `<div class="query-error">${message}</div>`;
}

// Show success message and modal
function showSuccess() {
    // Update track info
    elements.trackInfoEl.textContent = `Track: ${currentLevelData.reward.replace('.mp3', '')}`;
    elements.playRewardBtnEl.disabled = false;
    
    // Update reward name in modal
    elements.rewardNameEl.textContent = currentLevelData.reward.replace('.mp3', '');
    
    // Show success modal
    elements.successModalEl.style.display = 'block';
    
    // Load the audio reward
    loadAudio(currentLevelData.reward);
    
    // Update badges if needed (in a real implementation)
    updateBadges();
}

// Initialize audio context
function initializeAudio() {
    // Create AudioContext only on user interaction to comply with browser policies
    document.addEventListener('click', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, { once: true });
}

// Load audio file
async function loadAudio(filename) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioBuffers[filename]) {
        return; // Already loaded
    }
    
    try {
        // In a real implementation, you'd load actual audio files
        // For this demo, we'll simulate it with an oscillator
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        
        // Store the oscillator for later use
        audioBuffers[filename] = oscillator;
    } catch (error) {
        console.error('Error loading audio:', error);
    }
}

// Play audio reward
function playAudio(filename) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (isPlaying) {
        stopAudio();
    }
    
    try {
        // In a real implementation, you'd play the actual audio file
        // For this demo, we'll simulate it with an oscillator
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        
        // Record the current audio for stopping later
        currentAudio = { oscillator, gainNode };
        isPlaying = true;
        
        // Add playing class to record image
        document.querySelector('.record-img').classList.add('playing');
        
        // Stop after 2 seconds
        setTimeout(() => {
            stopAudio();
        }, 2000);
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}

// Stop currently playing audio
function stopAudio() {
    if (currentAudio) {
        currentAudio.oscillator.stop();
        currentAudio = null;
        isPlaying = false;
        
        // Remove playing class from record image
        document.querySelector('.record-img').classList.remove('playing');
    }
}

// Update badges (simplified)
function updateBadges() {
    // In a real implementation, this would check which badges have been earned
    // For now, just unlock badges based on level progress
    const badges = elements.badgesListEl.querySelectorAll('.badge');
    
    if (currentLevel >= 3 && badges[0].classList.contains('locked')) {
        badges[0].innerHTML = '<i class="fas fa-star"></i>';
        badges[0].classList.remove('locked');
    }
    
    if (currentLevel >= 6 && badges[1].classList.contains('locked')) {
        badges[1].innerHTML = '<i class="fas fa-award"></i>';
        badges[1].classList.remove('locked');
    }
    
    if (currentLevel >= 9 && badges[2].classList.contains('locked')) {
        badges[2].innerHTML = '<i class="fas fa-trophy"></i>';
        badges[2].classList.remove('locked');
    }
}

// Show solution
function showSolution() {
    sqlEditor.setValue(currentLevelData.solution);
}

// Reset editor
function resetEditor() {
    sqlEditor.setValue('');
}

// Advance to next level
function nextLevel() {
    if (currentLevel < levels.length) {
        loadLevel(currentLevel + 1);
    } else {
        // Game complete!
        alert('Congratulations! You have completed all levels!');
    }
    
    // Hide the success modal
    elements.successModalEl.style.display = 'none';
}

// Show the database schema modal
async function showSchemaModal() {
    const schema = await fetchSchema();
    
    if (!schema) {
        alert('Failed to load database schema. Please try again.');
        return;
    }
    
    // Default to showing the first table
    showSchemaTable('Artists', schema);
    
    // Show the modal
    elements.schemaModalEl.style.display = 'block';
    
    // Add event listeners to schema tabs
    document.querySelectorAll('.schema-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.schema-tab').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show the selected table schema
            const table = tab.getAttribute('data-table');
            showSchemaTable(table, schema);
        });
    });
}

// Show schema for a specific table
function showSchemaTable(tableName, schema) {
    if (!schema || !schema[tableName]) {
        return;
    }
    
    const columns = schema[tableName];
    
    const table = document.createElement('table');
    table.className = 'schema-table';
    
    // Create header row
    const headerRow = document.createElement('tr');
    ['Column', 'Type'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    table.appendChild(headerRow);
    
    // Create rows for each column
    columns.forEach(column => {
        const tr = document.createElement('tr');
        
        const tdName = document.createElement('td');
        tdName.textContent = column;
        tr.appendChild(tdName);
        
        const tdType = document.createElement('td');
        
        // Simple type inference based on column name
        if (column.includes('id')) {
            tdType.textContent = 'INTEGER';
        } else if (column.includes('price') || column.includes('revenue')) {
            tdType.textContent = 'REAL';
        } else if (column.includes('date') || column.includes('year')) {
            tdType.textContent = 'DATE';
        } else if (column.includes('capacity') || column.includes('sold')) {
            tdType.textContent = 'INTEGER';
        } else {
            tdType.textContent = 'TEXT';
        }
        
        tr.appendChild(tdType);
        
        table.appendChild(tr);
    });
    
    // Update the schema content
    elements.schemaContentEl.innerHTML = '';
    elements.schemaContentEl.appendChild(table);
    
    // Show sample data (placeholder for now)
    showSampleData(tableName);
}

// Show sample data for a table
function showSampleData(tableName) {
    // In a real implementation, this would fetch sample data from the server
    elements.sampleDataEl.innerHTML = '<p>Sample data would be shown here. In a real implementation, this would fetch a few example rows from the database.</p>';
}

// Show how to play modal on first visit
function showHowToPlayOnFirstVisit() {
    if (!localStorage.getItem('sqlBeats_visited')) {
        elements.howToPlayModalEl.style.display = 'block';
        localStorage.setItem('sqlBeats_visited', 'true');
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Run query button
    elements.runBtnEl.addEventListener('click', runQuery);
    
    // Reset button
    elements.resetBtnEl.addEventListener('click', resetEditor);
    
    // Solution button
    elements.solutionBtnEl.addEventListener('click', showSolution);
    
    // Play reward button
    elements.playRewardBtnEl.addEventListener('click', () => {
        playAudio(currentLevelData.reward);
    });
    
    // Play reward from modal button
    elements.playRewardModalBtnEl.addEventListener('click', () => {
        playAudio(currentLevelData.reward);
    });
    
    // Next level button
    elements.nextLevelBtnEl.addEventListener('click', nextLevel);
    
    // How to play button
    elements.howToPlayBtnEl.addEventListener('click', () => {
        elements.howToPlayModalEl.style.display = 'block';
    });
    
    // Schema button
    elements.schemaBtnEl.addEventListener('click', showSchemaModal);
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            elements.successModalEl.style.display = 'none';
            elements.schemaModalEl.style.display = 'none';
            elements.howToPlayModalEl.style.display = 'none';
        });
    });
    
    // Close how to play modal button
    document.querySelector('.close-how-to').addEventListener('click', () => {
        elements.howToPlayModalEl.style.display = 'none';
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', event => {
        if (event.target === elements.successModalEl) {
            elements.successModalEl.style.display = 'none';
        }
        if (event.target === elements.schemaModalEl) {
            elements.schemaModalEl.style.display = 'none';
        }
        if (event.target === elements.howToPlayModalEl) {
            elements.howToPlayModalEl.style.display = 'none';
        }
    });
    
    // Allow executing query with Ctrl+Enter
    sqlEditor.setOption('extraKeys', {
        'Ctrl-Enter': runQuery
    });
} 