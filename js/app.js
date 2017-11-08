
jQuery(document).ready(function(){
// Create and randomise list
// map list to grid (hidden)
// when user touch one tile, take note of which one it is and reveal it (color and animation 1)
// When the user touches another one, take note of which one it is, 
//  - if it is a match, reveal with color 2, play animation 2 and score. If it is a win, end game.
//  - if it is not a match, reveal wit color 3, play animation 3 and hide cards again (animation 4)


/*
 * Create a list that holds all of your cards
 */

 let primary_icon_list = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
 let unshuffled_icons_list = primary_icon_list.concat(primary_icon_list);
 let moveCounter = 0;
 let timer = 0;
 let timer_seconds_1 = 0;
 let timer_seconds_2 = 0;
 let timer_minutes = 0;
 let timer_display = "0:00";
 let timer_started = false;
 let myInterval = "";


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let icons_list = shuffle(unshuffled_icons_list);

function populateGrid (list_of_icons) {

    let class_index = 0;
    $('.deck i').each(function(){
        let added_class = list_of_icons[class_index];
        $(this).addClass(added_class);
        class_index++;
    });
}

function incrementTimer(){
    timer++;
    
    timer_seconds_1++;

    if (timer_seconds_1 === 10) {
        timer_seconds_1 = 0;
        timer_seconds_2++;
    }

    if (timer_seconds_2 === 6) {
        timer_seconds_2 = 0;
        timer_minutes++;
    }

    if (timer_minutes === 10) {
        timer_seconds_1 = 0;
        timer_seconds_2 = 0;
    }

    let timer_display =  String(timer_minutes + ":" + timer_seconds_2 + timer_seconds_1)
    $('.timer_display').text(timer_display);

}




// function hideCard() {
function hideCard(card) {
        $(card).removeClass('open show');
}

function showCard(card) {
        $(card).addClass('open show')
}


function restartGame() {
    moveCounter = 0;
    timer = 0;
    timer_seconds_1 = 0;
    timer_seconds_2 = 0;
    timer_minutes = 0;

    clearInterval(myInterval);
    timer_started = false;

    $('.timer_display').text(String(timer_minutes + ":" + timer_seconds_2 + timer_seconds_1));


    
    $('.moves').text(moveCounter);
    
    $('.deck i').each(function(){
        for (let list_index = 0; list_index <= primary_icon_list.length; list_index++) {
            $(this).removeClass(String(primary_icon_list[list_index]));
        }
    });
    icons_list = shuffle(icons_list);
    populateGrid(icons_list);


    $('.deck li').each(function(){
        hideCard(this);
    });

}

populateGrid(icons_list);



$('.deck').on('click', '.card', function(){

        if (timer_started == false) {
            timer_started = true;
            // window.setInterval(incrementTimer, 1000)
            myInterval = window.setInterval(incrementTimer, 1000)
        }
        moveCounter++;
        $('.moves').text(moveCounter);
        if ($(this).hasClass('show')) {
            hideCard(this);
        } else {
            showCard(this);
        }
        console.log(myTimer);
});

$('.restart').click(restartGame);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */



});
