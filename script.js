document.addEventListener("DOMContentLoaded", () => {
	const themeToggle = document.querySelector(".theme-toggle");
	const body = document.body;

	themeToggle.addEventListener("click", () => {
		body.classList.toggle("dark-theme");
		const icon = themeToggle.querySelector("i");

		if (body.classList.contains("dark-theme")) {
			icon.classList.remove("fa-moon");
			icon.classList.add("fa-sun");
		} else {
			icon.classList.remove("fa-sun");
			icon.classList.add("fa-moon");
		}
	});
});

document.addEventListener("DOMContentLoaded", () => {
	// Previous theme toggle code remains...

	// Add this new code for accordions
	const accordions = document.querySelectorAll(".accordion");

	accordions.forEach((accordion) => {
		accordion
			.querySelector(".accordion-header")
			.addEventListener("click", () => {
				accordion.classList.toggle("active");
			});
	});
});

document.addEventListener("DOMContentLoaded", () => {
	let startTime = null;
	let timerInterval;
	const ROWS = 3;
	const COLS = 5;

	const pieces = [];
	const correctOrder = [];

	
	for (let row = 0; row < ROWS; row++) {
		for (let col = 0; col < COLS; col++) {
			const pieceName = `piece_${row}_${col}.png`;
			pieces.push(pieceName);
			correctOrder.push(pieceName);
		}
	}

	function initializePuzzle() {
		const piecesContainer = document.getElementById("puzzle-pieces");
		const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);

		shuffledPieces.forEach((piece) => {
			const img = document.createElement("img");
			img.src = `puzzle/${piece}`;
			img.className = "puzzle-piece";
			img.draggable = true;
			img.dataset.piece = piece;
			piecesContainer.appendChild(img);
		});

		const board = document.getElementById("puzzle-board");
		for (let i = 0; i < ROWS * COLS; i++) {
			const slot = document.createElement("div");
			slot.className = "puzzle-slot";
			slot.dataset.index = i;
			board.appendChild(slot);
		}

		setupDragAndDrop();
	}

	function setupDragAndDrop() {
		const pieces = document.querySelectorAll(".puzzle-piece");
		const slots = document.querySelectorAll(".puzzle-slot");

		pieces.forEach((piece) => {
			piece.addEventListener("dragstart", dragStart);
			piece.addEventListener("touchstart", () => startTimer());
		});

		slots.forEach((slot) => {
			slot.addEventListener("dragover", dragOver);
			slot.addEventListener("drop", drop);
		});
	}

	function startTimer() {
		if (!startTime) {
			startTime = new Date();
			timerInterval = setInterval(updateTimer, 1000);
		}
	}

	function updateTimer() {
		const currentTime = new Date();
		const timeDiff = Math.floor((currentTime - startTime) / 1000);
		const minutes = Math.floor(timeDiff / 60);
		const seconds = timeDiff % 60;
		document.getElementById("timer").textContent = `Laiks: ${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}

	function checkCompletion() {
		const slots = document.querySelectorAll(".puzzle-slot");
		const currentOrder = Array.from(slots).map((slot) => {
			const piece = slot.querySelector(".puzzle-piece");
			return piece ? piece.dataset.piece : null;
		});

		if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
			clearInterval(timerInterval);
			const finalTime = (new Date() - startTime) / 1000;
			setTimeout(() => {
				const name = prompt(
					"Apsveicam! Ievadi savu lietotājvārdu priekš top 5:"
				);
				if (name) saveScore(name, finalTime);
			}, 300);
		}
	}

	function saveScore(name, time) {
		let scores = JSON.parse(localStorage.getItem("puzzleScores") || "[]");
		scores.push({ name, time });
		scores.sort((a, b) => a.time - b.time);
		scores = scores.slice(0, 5);
		localStorage.setItem("puzzleScores", JSON.stringify(scores));
		updateLeaderboard();
	}

	function updateLeaderboard() {
		const scores = JSON.parse(localStorage.getItem("puzzleScores") || "[]");
		const leaderboard = document.getElementById("top-players");
		leaderboard.innerHTML = "";

		scores.forEach((score, index) => {
			const li = document.createElement("li");
			li.textContent = `${index + 1}. ${score.name} - ${score.time.toFixed(
				1
			)}s`;
			leaderboard.appendChild(li);
		});
	}

	function dragStart(e) {
		startTimer();
		e.dataTransfer.setData("text/plain", e.target.dataset.piece);
	}

	function dragOver(e) {
		e.preventDefault();
	}

	function drop(e) {
		e.preventDefault();
		const pieceId = e.dataTransfer.getData("text/plain");
		const piece = document.querySelector(`[data-piece="${pieceId}"]`);

		if (!e.target.classList.contains("puzzle-piece")) {
			e.target.appendChild(piece);
			checkCompletion();
		}
	}

	initializePuzzle();
	updateLeaderboard();
});
