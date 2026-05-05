class PuzzleEngine {
    constructor() {
        this.board = [];
        this.size = 4;
        this.moves = 0;
        this.time = 0;
        this.timerInterval = null;
        this.magicUses = 1;
        this.currentMode = 'bloom';
        this.isPlaying = false;

        this.boardElement = document.getElementById('puzzle-board');
        this.moveElement = document.getElementById('move-count');
        this.timeElement = document.getElementById('timer');
        this.magicBtn = document.getElementById('magic-btn');

        this.init();
        this.setupEventListeners();
    }

    init() {
        this.board = Array.from({
            length: this.size * this.size
        }, (_, i) => i === 15 ? 0 : i + 1);
        this.moves = 0;
        this.time = 0;
        this.magicUses = 1;
        this.isPlaying = false;

        document.querySelectorAll('.mode-btn').forEach(btn => {
            if (btn.dataset.mode === this.currentMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.updateUI();
        this.renderBoard();
        this.stopTimer();
    }

    setupEventListeners() {
        document.getElementById('shuffle-btn').addEventListener('click', () => this.shuffle(360));
        document.getElementById('reset-btn').addEventListener('click', () => this.init());
        this.magicBtn.addEventListener('click', () => this.useMagicHint());

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentMode = btn.dataset.mode;
                this.init();
            });
        });
        
        document.getElementById('toggle-theme').addEventListener('click', () => {
            const body = document.body;
            const newTheme = body.getAttribute('data-theme') === 'day' ? 'night' : 'day';
            body.setAttribute('data-theme', newTheme);
            // Persistence: Save theme preference locally
            localStorage.setItem('preferred-theme', newTheme);
        });
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        this.board.forEach((val, index) => {
            const tile = document.createElement('div');
            tile.className = val === 0 ? 'tile empty-tile' : 'tile';

            if (val !== 0) {
                // Graduate Logic: Calculate background position for images
                const row = Math.floor((val - 1) / this.size);
                const col = (val - 1) % this.size;

                // 400x400px images
                tile.style.backgroundImage = `url('assets/${this.currentMode}.jpg')`;
                tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

                // Accessibility: Keep number as a hidden hint or small overlay
                tile.innerHTML = `<span class="tile-number">${val}</span>`;
                tile.addEventListener('click', () => this.handleTileClick(index));
            }
            this.boardElement.appendChild(tile);
        });
    }

    handleTileClick(index) {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.startTimer();
        }

        const emptyIndex = this.board.indexOf(0);
        if (this.isValidMove(index, emptyIndex)) {
            this.swap(index, emptyIndex);
            this.moves++;
            this.updateUI();
            this.renderBoard();
            this.checkWinCondition();
        }
    }

    isValidMove(index, emptyIndex) {
        const row = Math.floor(index / this.size);
        const col = index % this.size;
        const emptyRow = Math.floor(emptyIndex / this.size);
        const emptyCol = emptyIndex % this.size;

        return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow);
    }

    swap(i, j) {
        [this.board[i], this.board[j]] = [this.board[j], this.board[i]];
    }

    // Graduate Requirement: Solvability Parity Check
    isSolvable(tempBoard) {
        let inversions = 0;
        let emptyRowFromBottom = 0;

        for (let i = 0; i < tempBoard.length; i++) {
            if (tempBoard[i] === 0) {
                emptyRowFromBottom = this.size - Math.floor(i / this.size);
                continue;
            }
            for (let j = i + 1; j < tempBoard.length; j++) {
                if (tempBoard[j] !== 0 && tempBoard[i] > tempBoard[j]) {
                    inversions++;
                }
            }
        }

        if (this.size % 2 !== 0) {
            return inversions % 2 === 0;
        } else {
            return emptyRowFromBottom % 2 !== 0 ? inversions % 2 === 0 : inversions % 2 !== 0;
        }
    }

    // Graduate Requirement: 360 Shuffle Moves
    shuffle(depth) {
        let lastEmpty = -1;
        for (let i = 0; i < depth; i++) {
            const emptyIndex = this.board.indexOf(0);
            const validNeighbors = [];

            const row = Math.floor(emptyIndex / this.size);
            const col = emptyIndex % this.size;

            if (row > 0) validNeighbors.push(emptyIndex - this.size);
            if (row < this.size - 1) validNeighbors.push(emptyIndex + this.size);
            if (col > 0) validNeighbors.push(emptyIndex - 1);
            if (col < this.size - 1) validNeighbors.push(emptyIndex + 1);

            const possibleMoves = validNeighbors.filter(n => n !== lastEmpty);
            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

            this.swap(move, emptyIndex);
            lastEmpty = emptyIndex;
        }
        this.moves = 0;
        this.time = 0;
        this.isPlaying = true;
        this.startTimer();
        this.updateUI();
        this.renderBoard();
    }

    useMagicHint() {
        if (this.magicUses <= 0 || !this.isPlaying) return;
        this.magicUses--;
        this.updateUI();

        // Greedy Manhattan Distance evaluation for next best move
        const emptyIndex = this.board.indexOf(0);
        const validNeighbors = [];
        const row = Math.floor(emptyIndex / this.size);
        const col = emptyIndex % this.size;

        if (row > 0) validNeighbors.push(emptyIndex - this.size);
        if (row < this.size - 1) validNeighbors.push(emptyIndex + this.size);
        if (col > 0) validNeighbors.push(emptyIndex - 1);
        if (col < this.size - 1) validNeighbors.push(emptyIndex + 1);

        let bestMove = -1;
        let lowestDistance = Infinity;

        validNeighbors.forEach(neighborIndex => {
            this.swap(neighborIndex, emptyIndex);
            const dist = this.calculateTotalManhattan();
            if (dist < lowestDistance) {
                lowestDistance = dist;
                bestMove = neighborIndex;
            }
            this.swap(neighborIndex, emptyIndex); // revert
        });

        if (bestMove !== -1) {
            // Highlight tile logic can go here. For now, it automatically moves it.
            this.handleTileClick(bestMove);
        }
    }

    calculateTotalManhattan() {
        let distance = 0;
        for (let i = 0; i < this.board.length; i++) {
            const val = this.board[i];
            if (val === 0) continue;

            const targetX = (val - 1) % this.size;
            const targetY = Math.floor((val - 1) / this.size);
            const currentX = i % this.size;
            const currentY = Math.floor(i / this.size);

            distance += Math.abs(currentX - targetX) + Math.abs(currentY - targetY);
        }
        return distance;
    }

    checkWinCondition() {
        const isWin = this.board.every((val, index) => val === 0 ? index === 15 : val === index + 1);
        if (isWin) {
            this.stopTimer();
            this.isPlaying = false;
            setTimeout(() => {
                const playerName = prompt('Puzzle solved! Enter your name for the leaderboard:');
                if (playerName) this.saveScore(playerName);
            }, 100);
        }
    }

    async saveScore(playerName) {
        const scoreData = {
            player: playerName,
            mode: this.currentMode,
            moves: this.moves,
            time: this.time
        };

        try {
            const response = await fetch('api/save_score.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scoreData)
            });
            if (!response.ok) throw new Error('Server error');
            this.loadLeaderboard();
        } catch (error) {
            // Local Storage Fallback requirement
            console.warn('Database connection failed, falling back to local storage.');
            const localScores = JSON.parse(localStorage.getItem('puzzleScores')) || [];
            localScores.push(scoreData);
            localStorage.setItem('puzzleScores', JSON.stringify(localScores));
            this.renderLocalLeaderboard(localScores);
        }
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.time++;
            this.updateUI();
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    updateUI() {
        this.moveElement.textContent = this.moves;
        this.timeElement.textContent = this.time;
        this.magicBtn.textContent = `Hint (${this.magicUses} Left)`;
        this.magicBtn.disabled = (this.magicUses <= 0);
    }

    async loadLeaderboard() {
        try {
            const response = await fetch('api/get_leaderboard.php');
            const scores = await response.json();
            this.renderLeaderboard(scores);
            this.loadAnalytics(); // Refresh grad analytics too
        } catch (error) {
            const localScores = JSON.parse(localStorage.getItem('puzzleScores')) || [];
            this.renderLeaderboard(localScores);
        }
    }

    async loadAnalytics() {
        try {
            const response = await fetch('api/get_analytics.php');
            const data = await response.json();

            if (document.getElementById('avg-time')) {
                document.getElementById('total-runs').textContent = data.total_runs;
                document.getElementById('avg-time').textContent = data.avg_time;
                document.getElementById('best-run').textContent = data.best_run;

                const modeString = data.modes.map(m => `${m.mode}: ${m.count}`).join(', ');
                document.getElementById('mode-dist').textContent = modeString || 'No data';
            }
        } catch (e) { console.error('Analytics fetch failed'); }
    }

    renderLeaderboard(scores) {
        const list = document.getElementById('score-list');
        list.innerHTML = scores.map(s =>
            `<li>${s.player_name} - ${s.moves} moves (${s.time_seconds}s) [${s.mode}]</li>`
        ).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('preferred-theme') || 'day';
    document.body.setAttribute('data-theme', savedTheme);

    const game = new PuzzleEngine();
    game.loadLeaderboard();
});