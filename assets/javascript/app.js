// Javascript function that wraps everything
$(document).ready(function(){

	function rockPaperScissor() {

		// drop the firebase onto the dataRef variable to use throughout my js
		var dataRef = new Firebase('https://multiplayer-rps.firebaseio.com/');

		//variables
		var name = '';
		var wins = 0;
		var losses = 0;
		var choice = null;
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
			
				// if there isn't any data in firebase
				if (data_exists !== true) {

					// set the players object and the 1 object with what the user entered	
					dataRef.set({ 
						'players': {
							player1: {
								name: name,
								wins: wins,
								losses: losses,
								choice: choice
							}
						}, 
							// set the turns object to 0
							turns: turns
					}); // end set

					// set the player number to 1
					player_number = 1;

				// if there is data in firebase
				} else {

					// increment the turns by 1
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

			return turns;

		} // end determinePlayer()


		// updating the screen with firebase data
		dataRef.on('value', function(snapshot) {

			// store each player into it's own variable
			var player1 = snapshot.val().players.player1;
			var player2 = snapshot.val().players.player2;

			// store the value of turns in the current_turn variable
			var current_turn = snapshot.val().turns;

			// if the palyer number is set to 1
			if (player_number === 1) {

				// update the screen with the below items
				$('#player-wins').html(player1.wins); // player wins
				$('#player-losses').html(player1.losses); // player losses
				$('#opponent-name-score').html(player2.name); // opponents name
				$('#opponent-wins').html(player2.wins); // oponents wins
				$('#opponent-losses').html(player2.losses); // opponents losses

				// if it's player1's turn
				if (current_turn === 1) {

					// remove the not-visible class
					$('.rps-buttons').removeClass('not-visible');
					// update game message
					$('#game-message').html("it's your turn so choose wiesely");

				} // end if

				// if it's player2's turn
				if (current_turn === 2) {

					// add the not-visible class
					$('.rps-buttons').addClass('not-visible');
				
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

				} // end if

				// if it's player2's turn
				if (current_turn === 1) {

					// add the not-visible class
					$('.rps-buttons').addClass('not-visible');
					// update game message
					$('#game-message').html("it's " + player1.name + "'s turn so wiat 'til they decide");
				
				} // end if

				// if it's nobody's turn
				if (current_turn === 0) {

					// add the not-vsible class
					$('.rps-buttons').addClass('not-visible');

				} // end if

			} // end if

		}); // end updating screen

		function rpsGameLogic(id_to_pass) {

			dataRef.once('value', function(snapshot) {
				
				// store the value of turns in the current_turn variable
				var current_turn = snapshot.val().turns;

				if (current_turn === 1) {
					turns = 2;
					dataRef.update({
						turns: turns
					});
				} // end if 

				if (current_turn === 2) {
					turns = 1;
					dataRef.update({
						turns: turns
					});
				} // end if

			});

		} // end rpsGameLogic()

		
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
			rpsGameLogic(rps_button_id);

		}) // end rps icon click event

	} // end rockPaperScissor()

	rockPaperScissor();

}); // end jQuery document ready