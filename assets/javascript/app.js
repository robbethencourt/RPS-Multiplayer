// Javascript function that wraps everything
$(document).ready(function(){

	function rockPaperScissor() {

		// drop the firebase onto the dataRef variable to use throughout my js
		var dataRef = new Firebase('https://multiplayer-rps.firebaseio.com/');

		//variables
		var name = '';
		var wins = 0;
		var losses = 0;
		var choice = ' ';
		var player_number = 0;
		var turns = 0;

		// determine the player upon player inputting their name and submit to firebase
		function determinePlayer() {

			// set the name variable to the value of the player name input
			name = $('#player-name-input').val().trim();
			
			// create the player object and pass the corresponding variable as the values
			var player = {
				name: name,
				wins: wins,
				losses: losses,
				choice: choice
			}

			// declare the variable we'll use to log as firebase being either empty (false) or has data (true)
			var data_exists = null;

			// we need to determine if there are any entries in firebase
			dataRef.once('value', function(snapshot) {

				// we set a variable to true or false depending on if there's data in firebase 
				data_exists = snapshot.exists();

				// a snapshot of firebase to determine if player 2 exists
				player2_exists = snapshot.child('players/player2').exists();
			
				// if there isn't any data in firebase, or if there is data in firebase and player 2 exists. (this is in the event player 1 drops out of the game and a new player 1 needs to be established)
				if (data_exists !== true || (data_exists === true && player2_exists === true)) {

					// if there is a player 2 already in the game we need to update the turns to 1 so the game know to continue on
					if (data_exists === true && player2_exists === true) {

						// set turns to 1
						turns = 1;

					} // end if

					// set the player number to 1
					player_number = 1;

					// set the players object and the 1 object with what the user entered	
					dataRef.update({ 
						'players/player1': {
								name: name,
								wins: wins,
								losses: losses,
								choice: choice
							}
						, 
							// set the turns object to 0
							turns: turns
					}); // end set

				// if there is data in firebase
				} else {

					// increment the turns by 1 (why isn't this updating the variable for others to use in functions later on?)
					turns = 1;

					// update the turns object in firebase
					dataRef.update({
						turns: turns
					}); //  end firebase update

					// store teh players child as a variable
					var child_to_update = dataRef.child('players');

					// update the players object with the 2 player with what the user entered	
					child_to_update.update({
						player2: {
							name: name,
							wins: wins,
							losses: losses,
							choice: choice
						}
					}); // end update

					// set the player number to 2
					player_number = 2;

				} // end if else

			}); // end dataRef check on whether there's data in firebase

			// add the hide class to the main game overlay screen
			$('#player-name-overlay').addClass('hide');

			// remove the hide class from the footer
			$('footer').removeClass('hide');

			// set the player name spot in the nav to what the player entered
			$('#player-name-nav').html(name);

			// set the player name spot in the score section to what the player entererd
			$('#player-name-score').html(name);

		} // end determinePlayer()


		// updating the screen with firebase data
		dataRef.on('value', function(snapshot) {

			// store each player into it's own variable
			var player1 = snapshot.val().players.player1;
			var player2 = snapshot.val().players.player2;

			// store the value of turns in the current_turn variable
			var current_turn = snapshot.val().turns;

			// if it's the second player's turn
			if (current_turn === 1) {

				// switch statement for the rps game logic
				switch(player1.choice) {

					case 'rock':

						switch(player2.choice) {

							case 'rock':

								$('#outcome-display').html("tie");
								break;

							case 'paper':

								$('#outcome-display').html(player2.name + " wins!");
								break;

							case 'scissor':

								$('#outcome-display').html(player1.name + " wins!");
								break;

							default:

								$('#outcome-display').html("");
								break;

						}

					break;

					case 'paper':

						switch(player2.choice) {

							case 'rock':

								$('#outcome-display').html(player1.name + " wins!");
								break;

							case 'paper':

								$('#outcome-display').html("tie");
								break;

							case 'scissor':

								$('#outcome-display').html(player2.name + " wins!");
								break;

							default:

								$('#outcome-display').html("");
								break;

						}

					break;

					case 'scissor':

						switch(player2.choice) {

							case 'rock':

								$('#outcome-display').html(player2.name + " wins!");
								break;

							case 'paper':

								$('#outcome-display').html(player1.name + " wins!");
								break;

							case 'scissor':

								$('#outcome-display').html("tie");
								break;

							default:

								$('#outcome-display').html("");
								break;

						}

					break;

					default:

						console.log('default');
						break;

				} // end switch for game logic

			} // end if

			// if the palyer number is set to 1
			if (player_number === 1) {

				// update the screen with the below items
				$('#player-wins').html(player1.wins); // player wins
				$('#player-losses').html(player1.losses); // player losses
				$('#opponent-name-score').html(player2.name); // opponents name
				$('#opponent-wins').html(player2.wins); // oponents wins
				$('#opponent-losses').html(player2.losses); // opponents losses

				// if it's player2's turn
				if (current_turn === 1) {

					// remove the not-visible class
					$('.rps-buttons').removeClass('not-visible');
					// update game message
					$('#game-message').html("it's your turn so choose wiesely");

				} // end if

				// if it's player1's turn
				if (current_turn === 2) {

					// add the not-visible class
					$('.rps-buttons').addClass('not-visible');
					// update game message
					$('#game-message').html("You chose " + player1.choice + ", now it's " + player2.name + "'s turn");
				
				} // end if

				// if it's nobody's turn
				if (current_turn === 0) {

					// add the not-vsible class
					$('.rps-buttons').addClass('not-visible');

				} // end if

			} // end if

			// if the player number is not 1
			if (player_number !== 1) {

				// update the screen with the below items
				$('#player-wins').html(player2.wins); // player wins
				$('#player-losses').html(player2.losses); // player losses
				$('#opponent-name-score').html(player1.name); // opponent name
				$('#opponent-wins').html(player1.wins); // opponent wins
				$('#opponent-losses').html(player1.losses); // opponent losses

				// if it's player1's turn
				if (current_turn === 2) {

					// remove the not-visible class
					$('.rps-buttons').removeClass('not-visible');
					// update game message
					$('#game-message').html("it's your turn so choose wiesely");

				} // end if

				// if it's player2's turn
				if (current_turn === 1) {

					// add the not-visible class
					$('.rps-buttons').addClass('not-visible');
					// update game message
					$('#game-message').html("You chose " + player2.choice + ", now it's " + player1.name + "'s turn");
				
				} // end if

				// if it's nobody's turn
				if (current_turn === 0) {

					// add the not-vsible class
					$('.rps-buttons').addClass('not-visible');

				} // end if

			} // end if

		}); // end updating screen

		// grabbed the comments section of firebase to use below in the section where I'll be adding comments to the screen
		var commentsRef = new Firebase('https://multiplayer-rps.firebaseio.com/comments');

		// updating comments to the screen
		commentsRef.on('child_added', function(childSnapshot, prevChildKey) {

			// grab the objects from firebase
			var comment_to_add = childSnapshot.val();

			// add the name of who entered the comment and what their comment is. I'm ussing prepend so that the newst comment is displayed on top
			$('#comment-display').prepend('<p>' + comment_to_add.name + ': ' + comment_to_add.comment + '</p>');

		}); // dataRef for comments

		function rpsGameLogic() {

			// updating the screen with firebase data
			dataRef.once('value', function(snapshot) {

				// store each player into it's own variable
				var player1 = snapshot.val().players.player1;
				var player2 = snapshot.val().players.player2;
			
				// switch statement for the rps game logic
				switch(player1.choice) {

					case 'rock':

						switch(player2.choice) {

							case 'rock':

								break;

							case 'paper':

								wins = player2.wins;
								wins++;
								dataRef.update({'players/player2/wins': wins});
								break;

							case 'scissor':

								wins = player1.wins;
								wins++;
								dataRef.update({'players/player1/wins': wins});
								break;

							default:

								break;

						}

					break;

					case 'paper':

						switch(player2.choice) {

							case 'rock':

								wins = player1.wins;
								wins++;
								dataRef.update({'players/player1/wins': wins});
								break;

							case 'paper':

								break;

							case 'scissor':

								wins = player2.wins;
								wins++;
								dataRef.update({'players/player2/wins': wins});
								break;

							default:

								break;

						}

					break;

					case 'scissor':

						switch(player2.choice) {

							case 'rock':

								wins = player2.wins;
								wins++;
								dataRef.update({'players/player2/wins': wins});
								break;

							case 'paper':

								wins = player1.wins;
								wins++;
								dataRef.update({'players/player1/wins': wins});
								break;

							case 'scissor':

								break;

							default:

								break;

						}

					break;

					default:

						console.log('default');
						break;

				} // end switch for game logic

			}); // end dataRef

		} // end rpsGameLogic()

		function rpsChoice(id_to_pass) {

			// if it's the first player's turn
			if (player_number === 1) {		

				// set turns to 2
				turns = 2;

				// update firebase with the player one's rps choice
				dataRef.update({
				  	'players/player1/choice': id_to_pass,
				  	turns: turns
				}); // end dataRef players update

			}

			// if it's the second player's turn
			if (player_number === 2) {

				// set turns to 1
				turns = 1;

				// update firebase with the player two's rps choice
				dataRef.update({
				  	'players/player2/choice': id_to_pass,
				  	turns: turns
				}); // end dataRef players update

				rpsGameLogic();

			} // end if

		} // end rpsChoice()

		
		// click events

		// click event for when the player first enters their name on the initial game screen
		$('#player-name-submit').on('click', function() {
			
			determinePlayer();

		}) // end player submit event

		// click event for the rps buttons
		$('.rps-button').on('click', function() {

			// store the id of the button clicked in the rps_button_id variable
			var rps_button_id = $(this).attr('id');

			// call the rpsGameLogic() function and pass the id of the button clicked
			rpsChoice(rps_button_id);

		}) // end rps icon click event

		// click event for when comments are addded
		$('#comment-button').on('click', function() {

			// get the comment to send
			var comment_to_send = $('#comment-input').val().trim();

			// reference the child comments in firebase
			var comments_ref = dataRef.child('comments');

			// push the comments to firebase with the local name variable assigned
			comments_ref.push({
				name: name,
				comment: comment_to_send
				
			}); // end data push

			// empty the comment input
			$('#comment-input').val('');

		}); // end comment button click event

		// onuload event to trigger if the player refreshes page or leaves the site
		$(window).unload(function() {

			// we need to determine if there are any entries in firebase
			dataRef.once('value', function(snapshot) {

				// a snapshot of firebase to determine if player 1 exists
				player1_exists = snapshot.child('players/player1').exists();
				// a snapshot of firebase to determine if player 2 exists
				player2_exists = snapshot.child('players/player2').exists();

				// if both players are leaving the game
				if (player1_exists === false || player2_exists === false) {

					// remove all data from firebase
					dataRef.remove();

				// if only one player is leaving the game
				} else {

					// if the player is set to 1
					if (player_number === 1 ) {

						// we remove player 1's data
						dataRef.child('players/player1').remove();
						dataRef.child('comments').remove();

					} // end if

					// if player is set to 2
					if (player_number === 2) {

						// we remove player 2's data
						dataRef.child('players/player2').remove();
						dataRef.child('comments').remove();

					} // end if

				} // end if else

			}); // end dataRef

		}); // end window unload

	} // end rockPaperScissor()

	rockPaperScissor();

}); // end jQuery document ready