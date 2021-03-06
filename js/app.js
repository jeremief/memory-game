
jQuery(document).ready(function(){

    // Setting up all variables used in the game
    let primaryIconList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
    let unshuffledIconList = primaryIconList.concat(primaryIconList);
    let moveCounter = 0;
    let matchCounter = 0;
    let twoStarMoves = 30;
    let oneStarMoves = 40;
    let timer = 0;
    let timerSeconds1 = 0;
    let timerSeconds2 = 0;
    let timerMinutes = 0;
    let timerStarted = false;
    let myTimerVariable = "";
    let openList = [];
    let cardViewingTime = 2000;
    let clickSuspended = false;

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

    // Takes in the list of icons and uses it to populate the game's grid
    function populateGrid (listOfIcons) {
        let classIndex = 0;
        $('.deck i').each(function(){
            let addedClass = listOfIcons[classIndex];
            $(this).addClass(addedClass);
            classIndex++;
        });
    }

    // Increments the timer by one second and populates the page with the new value
    function incrementTimer(){
        timer++;
        
        timerSeconds1++;

        if (timerSeconds1 === 10) {
            timerSeconds1 = 0;
            timerSeconds2++;
        }

        if (timerSeconds2 === 6) {
            timerSeconds2 = 0;
            timerMinutes++;
        }

        if (timerMinutes === 10) {
            timerSeconds1 = 0;
            timerSeconds2 = 0;
        }

        let timer_display_content =  String(timerMinutes + ":" + timerSeconds2 + timerSeconds1)
        $('.timer_display').text(timer_display_content);
    }


    function hideCard(card){
            $(card).removeClass('open show match');
    }


    function showCard(card){
            $(card).addClass('open show');
    }


    // Uses the moveCounter to reduce the number of stars
    function amendStars(){
        if (moveCounter >= twoStarMoves){
            $('.stars i').last().removeClass('fa-star');
            $('.stars i').last().addClass('fa-star-o');
        }; 

        if (moveCounter >= oneStarMoves) {
            $('.stars i').eq(-2).removeClass('fa-star');
            $('.stars i').eq(-2).addClass('fa-star-o');     
        };
    }

    // Takes in the card clicked by the player and adds it to the openList. Then, it adds a 'match' class
    // to the cards if they do match or hides them after some time if they don't
    function manageOpenList(currentCard){
        console.log(currentCard);
        for (let listIndex = 0; listIndex <= primaryIconList.length; listIndex++) {
                if ($(currentCard).children('i').hasClass(String(primaryIconList[listIndex]))){
                    openList.push(currentCard);
            }}

        if (openList.length === 2) {
            if ($(openList[0]).children('i').attr('class') == $(openList[1]).children('i').attr('class')) {
                $(openList[0]).addClass('match');
                $(openList[1]).addClass('match');
                matchCounter = matchCounter + 2;
                openList = [];
            } else {
                clickSuspended = true;
                setTimeout(function(){
                    $(openList).each(function(){
                        hideCard(this);
                    });
                clickSuspended = false;

                    openList = [];
                }, cardViewingTime);
            }
        }
    }

    // Checks if the game is won after each move and creates the victory modal if it is
    function checkWin(){
        if (matchCounter === unshuffledIconList.length) {
            clearInterval(myTimerVariable);
            let timeModal = "It took you " + String($('.timer_display').text()) + " minutes";
            let ratingModal = $('.stars').clone();
            $('#time').text(String(timeModal));
            $('#rating').append(ratingModal);
            $('.modal').show();
        }
    }


    // Resets the rating to three stars
    function resetStars() {
        $('.stars i').removeClass('fa-star-o');
        $('.stars i').addClass('fa-star');
    }

    // Restarts the game by resetting all game variables
    function restartGame() {
        moveCounter = 0;
        timer = 0;
        timerSeconds1 = 0;
        timerSeconds2 = 0;
        timerMinutes = 0;

        $('.modal').hide();

        clearInterval(myTimerVariable);
        resetStars();
        timerStarted = false;
        openList = [];

        $('.timer_display').text(String(timerMinutes + ":" + timerSeconds2 + timerSeconds1));
        
        $('.moves').text(moveCounter);
        
        $('.deck i').each(function(){
            for (let listIndex = 0; listIndex <= primaryIconList.length; listIndex++) {
                $(this).removeClass(String(primaryIconList[listIndex]));
            }
        });
        iconsList = shuffle(iconsList);
        populateGrid(iconsList);

        $('#rating').empty();

        $('.deck li').each(function(){
            hideCard(this);
        });

        matchCounter = 0;
    }


    // Shuffle icons
    let iconsList = shuffle(unshuffledIconList);

    // Add icons to the grid
    populateGrid(iconsList);

    // Set event listner to handle the game logic as the player goes through the game
    $('.deck').on('click', '.card', function(){
        if (clickSuspended == false && $(this).hasClass('show') == false) {

            if (timerStarted == false) {
                timerStarted = true;
                myTimerVariable = window.setInterval(incrementTimer, 1000)
            }
            moveCounter++;
            amendStars();
            $('.moves').text(moveCounter);
            if ($(this).hasClass('show')) {
                hideCard(this);
            } else {
                showCard(this);
            }
            manageOpenList(this);
            checkWin();
        }
    });

    // Set event listner to restart the game from main screen
    $('.restart').click(restartGame);

    // Set event listner to restart the game from modal
    $('#retry-button').click(restartGame);

    // Set event listner to close the victory modal
    $('.modal-content').on('click', '.close', function() {
        $('.modal').hide();
    });
});
