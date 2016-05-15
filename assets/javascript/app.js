// Javascript function that wraps everything
$(document).ready(function(){

	function rockPaperScissor() {

		// drop the firebase onto the datRef variable to use throughout my js
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
			
			// push the player object to firebase	
			dataRef.push(player);

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