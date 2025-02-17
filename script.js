//JS
document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(btn =>
        btn.addEventListener("click", () => startGame(btn.dataset.category))
    );

    // Sound effects
    const flipSound = new Audio('sounds/card-flip.mp3');
    const matchSound = new Audio('sounds/card-match.mp3');
    const winSound = new Audio('sounds/win-sound.mp3');
    const loseSound = new Audio('sounds/lose-sound.mp3');

    // Global variables
    let selectedCards = [];
    let score = 0;
    let timerInterval;
    let timeRemaining = 50;
    let gameActive = true;
    const gameState = {
        category: '',
        cards: []
    };
    const maxScore = 100; // Maximum score

    const categories = {
        fruits: ["🍎", "🍌", "🍇", "🍓", "🍒", "🍍", "🥭", "🍑"],
        emojis: ["😀", "😎", "😂", "😍", "😡", "🤢", "😱", "🤠"],
        animals: ["🐶", "🐱", "🐰", "🐼", "🐨", "🐯", "🦁", "🐮"],
        flags: ["🇮🇳", "🇺🇸", "🇨🇦", "🇯🇵", "🇨🇳", "🇦🇺", "🇧🇷", "🇬🇧"],
        landmarks: ["🗽", "🗼", "⛩️", "🏰", "🕌", "⛪", "🏯", "🕍"]
    };

    function startGame(category) {
        score = 0;
        timeRemaining = 50;
        selectedCards = [];
        gameActive = true;
        gameState.category = category;
        gameState.cards = [];
        clearInterval(timerInterval);

        document.getElementById("landing-page").classList.add("hidden");
        document.getElementById("game-section").classList.remove("hidden");
        document.getElementById("game-message").classList.add("hidden");

        const items = categories[category];
        let cards = [];
        items.forEach(item => {
            cards.push({ content: item, matched: false });
            cards.push({ content: item, matched: false });
        });
        gameState.cards = shuffleArray(cards);

        renderGameBoard();
        startTimer();
        // Remove blur class at game start
        document.getElementById("game-container").classList.remove("game-over-blur");
    }

    function renderGameBoard() {
        const gameContainer = document.getElementById("game-container");
        gameContainer.innerHTML = "";
        gameState.cards.forEach((card, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.dataset.index = index;
            cardElement.innerHTML = `
                            <div class="card-inner">
                                <div class="card-front">?</div>
                                <div class="card-back">${card.content}</div>
                            </div>
                            `;
            cardElement.addEventListener("click", handleCardClick);
            gameContainer.appendChild(cardElement);
        });
        updateScoreDisplay();
    }

    function handleCardClick(e) {
        if (!gameActive) return;
        const cardElement = e.currentTarget;
        const index = cardElement.dataset.index;
        if (cardElement.classList.contains("flipped") || selectedCards.length === 2) return;

        flipCard(cardElement);
        selectedCards.push(cardElement);
        flipSound.play();

        if (selectedCards.length === 2) {
            setTimeout(checkForMatch, 1000);
        }
    }

    function flipCard(cardElement) {
        cardElement.classList.add("flipped");
    }

    function unflipCard(cardElement) {
        cardElement.classList.remove("flipped");
    }

    function checkForMatch() {
        const [firstCard, secondCard] = selectedCards;
        const indexOne = firstCard.dataset.index;
        const indexTwo = secondCard.dataset.index;

        if (gameState.cards[indexOne].content === gameState.cards[indexTwo].content) {
            score += 12.5;
            gameState.cards[indexOne].matched = true;
            gameState.cards[indexTwo].matched = true;
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            matchSound.play();
            updateScoreDisplay();
        } else {
            unflipCard(firstCard);
            unflipCard(secondCard);
        }
        selectedCards = [];
        updateScoreDisplay();
        checkGameOver();
    }

    function updateScoreDisplay() {
        const percentageScore = (score / maxScore) * 100;
        document.getElementById("score").textContent = "Score: " + percentageScore.toFixed(0) + "%";
    }

    function startTimer() {
        document.getElementById("timer").textContent = "Time: " + timeRemaining;
        timerInterval = setInterval(() => {
            timeRemaining--;
            document.getElementById("timer").textContent = "Time: " + timeRemaining;
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                endGame("lose");
            }
        }, 1000);
    }

    function checkGameOver() {
        const allMatched = gameState.cards.every(card => card.matched);
        if (allMatched) {
            endGame("win");
        }
    }

    function endGame(result) {
        clearInterval(timerInterval);
        gameActive = false;
        const messageEl = document.getElementById("game-message");
        let percentageScore = (score / maxScore) * 100;
        if (result === "win") {
            messageEl.innerHTML = `Congratulations! You win!<br>Final Score: ${percentageScore.toFixed(0)}%<br/><button id="play-again-btn">Play Again</button>`;
            winSound.play();
        } else {
            messageEl.innerHTML = `Game Over!<br> Final Score: ${percentageScore.toFixed(0)}%<br/><button id="play-again-btn">Play Again</button>`;
            loseSound.play();
        }
        messageEl.classList.remove("hidden");
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            card.replaceWith(card.cloneNode(true));
        });
        document.getElementById("play-again-btn").addEventListener("click", resetGame);
        document.getElementById("game-container").classList.add("game-over-blur");
    }

    function resetGame() {
        location.reload();
    }

    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }
});