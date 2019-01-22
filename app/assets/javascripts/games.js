	$(function() {

	// Card definition

		class Card {
			constructor(rank, suit) {
				this.rank = rank;
				this.suit = suit;
				this.heldBy = "deck";
				this.faceUp = true;
			}
		}

	// Utility functions

		function shuffle(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex;

		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }
		  
		  return array;
		}

	// Card functions

		function dealCards() {

			if (deck.length < (numberOfDecks*26)) {
				deck = [];
				deck = createDeck();

				// Flash shuffling message
				var miscElement = $(`
					<div id="misc-banner">
						<h1 id="misc-message">Shuffling Deck</h1>
					</div>
				`);
				miscElement.appendTo('#dealer');			
				setTimeout(function() {
					miscElement.remove();
				}, 1000)
			}

			// Draw starting cards
			playerDrawCard();
			dealerDrawCard('faceDown');
			playerDrawCard();
			dealerDrawCard();

			// Adjust button display
			$('#win-banner').remove();
			$('#lose-banner').remove();
			$('#push-banner').remove();
			$('#deal-button').toggle();
			$('#hit-button').toggle();
			$('#stand-button').toggle();
		}

		function playerDrawCard() {
			card = deck.pop();
			playerCards.push(card);
			displayPlayerHand();
			displayDeckCount();
		}

		function dealerDrawCard(state = "faceUp") {
			var card = deck.pop();

			// Checks if card is face up or face down
			if (state == "faceDown") {
				card.faceUp = false;
			} else {
				card.faceUp = true;
			}

			dealerCards.push(card);
			displayDealerHand();
			displayDeckCount();
		}

		function createDeck() {

			// Create new deck
			var deck = [];
			var suits = ["diamonds", "diamonds", "spades", "clubs"];
			var ranks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
			for (var i = numberOfDecks; i > 0; i--) {
				$.each(suits, function(index, suit) {
					$.each(ranks, function(index, rank) {
						var card = new Card(rank, suit);
						deck.push(card);
					});
				});
			}

			// Shuffle the deck
			deck = shuffle(deck);	

			return(deck);
		}

		function countHand(hand) {

			var count = 0;
			var aceCount = 0;

			// Index the default value of each card
			var countIndex = {
				"2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
				"jack": 10, "queen": 10, "king": 10, "ace": 11
			};

			$.each(hand, function(index, card) {
				if (card.faceUp) {
					count += countIndex[card.rank];
					if (card.rank == "ace") {
						aceCount += 1;
					}
				}
			});

			// Special case for aces
			while (count > 21 && aceCount > 0) {
				count -= 10;
				aceCount -= 1;
			}

			return(count);

		}

		function revealHoleCard() {
			dealerCards[0].faceUp = true;
			displayDealerHand();
		}

	// Display functions

		function displayDealerHand() {

			// Clear contents of dealer's hand
			$('#dealer-cards').empty();
			$.each(dealerCards, function(index, card) {
				if (card.faceUp) {

					// Add face up card	
					var cardElement = $(
						`<img class='card' 
									src="/assets/cards/${card.rank}_of_${card.suit}.png" 
									style='left:${(50*index)+marginLeft}px'>`
					);
				} else {

					// Add face down card
					var cardElement = $(
						`<img class='card' 
									src="/assets/card_back.png" 
									style='left:${(50*index)+marginLeft}px'>`
					);
				}

				cardElement.appendTo('#dealer-cards');	
			});
			displayDealerHandCount();
		}

		function displayPlayerHand() {

			// Clear contents of player's hand
			$('#player-cards').empty();
			$.each(playerCards, function(index, card) {
				var cardElement = $(
					`<img class='card' 
								src="/assets/cards/${card.rank}_of_${card.suit}.png" 
								style='left:${(50*index)+marginLeft}px'>`
				);
				cardElement.appendTo('#player-cards');
			});
			displayPlayerHandCount();
		}

		function displayDeckCount() {
			$('#deck-count').text(deck.length);
		}

		function displayPlayerHandCount() {
			var count = countHand(playerCards);
			$('#player-count').text(count);
		}

		function displayDealerHandCount() {
			var count = countHand(dealerCards);
			$('#dealer-count').text(count);
		}

		// Game functions

		function loseRound() {
			losses += 1;
			playerChipCount -= parseInt(playerBet);
			console.log(playerChipCount);
			newRound();

			// Flash the dealer win message
			var loseElement = $(`
				<div id="lose-banner">
					<h1 id="lose-message">Dealer Wins</h1>
				</div>
			`);
			loseElement.appendTo('#dealer');
			setTimeout(function() {
				playerBet = prompt("How much do you want to bet?");
			}, 50);

		}

		function winRound() {
			wins += 1;
			playerChipCount += parseInt(playerBet);
			console.log(playerChipCount);
			newRound();

			// Flash the player win message
			var winElement = $(`
				<div id="win-banner">
					<h1 id="win-message">You Win!</h1>
				</div>
			`);
			winElement.appendTo('#player');
			setTimeout(function() {
				playerBet = prompt("How much do you want to bet?");
			}, 50);
		}


		function push() {
			pushes += 1;
			newRound();

			// Flash the push message
			var pushElement = $(`
				<div id="push-banner">
					<h1 id="push-message">Push</h1>
				</div>
			`);
			pushElement.appendTo('#dealer');

		}

		function newRound() {

			// Empty dealer and player hands
			dealerCards = [];
			playerCards = [];

			// Toggle button displays
			$('#hit-button').toggle();
			$('#stand-button').toggle();
			$('#deal-button').toggle();

			// Update statistics
			var gamesPlayed = wins + losses + pushes;
			if (wins == 0 && losses == 0) {
				winRate = 0;
			} else {
				winRate = (wins / (wins + losses)).toFixed(2);
			}
			$('#wins').text(wins);
			$('#losses').text(losses);
			$('#pushes').text(pushes);
			$('#win-rate').text(`${winRate * 100}%`);

		}


		function stand() {

			// If player score is lower than dealer score, ignore stand
			if (countHand(playerCards) >= countHand(dealerCards)) {
				revealHoleCard();

				// Continues while dealer's score is lower
				while (countHand(dealerCards) < countHand(playerCards)) {
					dealerDrawCard();
					if (countHand(dealerCards) > 21) {

						// If dealer goes over 21, player wins
						winRound();
						return;
					} 
				}
				if (countHand(dealerCards) == countHand(playerCards)) {

					// If dealer score = player score, it's a push
					push();
					return;
				}

				// All other conditions, dealer wins
				loseRound();
				return;
			} else {
				console.log("Cannot stand if player has lower count than dealer.");
			}
		}


	// Main

		var numberOfDecks = 2;
		var marginLeft = 200;
		var dealerCards = [];
		var playerCards = [];
		var playerChipCount = 1000;

		// Set up statistics
		var wins = 0;
		var losses = 0;
		var pushes = 0;
		var gamesPlayed = wins + losses + pushes;
		if (wins == 0 && losses == 0) {
			winRate = 0;
		} else {
			winRate = (wins / (wins + losses)).toFixed(2);
		}
		$('#wins').text(wins);
		$('#losses').text(losses);
		$('#pushes').text(pushes);
		$('#win-rate').text(`${winRate * 100}%`);

		// Toggle buttons
		$('#hit-button').toggle();
		$('#stand-button').toggle();

		// Create deck
		var deck = createDeck();

		var playerBet = prompt("How much do you want to bet?");

		// Buttons

		// Deal button
		$('#deal-button').click(function() {
			dealCards();
		});

		// Hit button
		$('#hit-button').click(function() {
			playerDrawCard();
			if (countHand(playerCards) > 21) {
				console.log("bust");
				loseRound();
			}
		});

		// Stand button
		$('#stand-button').click(function() {
			stand();
		});
	});