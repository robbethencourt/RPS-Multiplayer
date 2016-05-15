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
			dataRef.once('value', function (snapshot) {

				// we set a variable to true or false depending on if there's data in firebase 
				data_exists = snapshot.exists();
			
				// if there isn't any data in firebase
				if (data_exists !== true) {

					// set the players object and the 1 object with what the user entered	
					dataRef.set({ 
						'players': {
							'1': {
								name: name,
								wins: wins,
								losses: losses,
								choice: choice
							}
						}
					}); // end set

				// if there is data in firebase
				} else {

					// store teh players child as a variable
					var child_to_update = dataRef.child('players');

					// update the players object with the 2 player with what the user entered	
					child_to_update.update({
						'2': {
							name: name,
							wins: wins,
							losses: losses,
							choice: choice
						}
					}); // end update

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

		// click event for when the player first enters their name on the initial game screen
		$('#player-name-submit').on('click', function () {
			
			determinePlayer();

		}) // end player submit event

	} // end rockPaperScissor()

	rockPaperScissor();

}); // end jQuery document ready