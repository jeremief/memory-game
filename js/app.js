
jQuery(document).ready(function(){

    // Setting up all variables used in the game
    let primary_icon_list = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
    let unshuffled_icons_list = primary_icon_list.concat(primary_icon_list);
    let moveCounter = 0;
    let matchCounter = 0;
    let two_star_moves = 30;
    let one_star_moves = 40;
    let timer = 0;
    let timer_seconds_1 = 0;
    let timer_seconds_2 = 0;
    let timer_minutes = 0;
    let timer_display = "0:00";
    let timer_started = false;
    let myTimerVariable = "";
    let openList = [];
    let cardViewingTime = 2000;
    let click_suspended = false;

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


    function hideCard(card){
            $(card).removeClass('open show match');
    }


    function showCard(card){
            $(card).addClass('open show');
    }


    function amendStars(){
        if (moveCounter >= two_star_moves){
            $('.stars i').last().removeClass('fa-star');
            $('.stars i').last().addClass('fa-star-o');
        }; 

        if (moveCounter >= one_star_moves) {
            $('.stars i').eq(-2).removeClass('fa-star');
            $('.stars i').eq(-2).addClass('fa-star-o');     
        };
    }

    function manageOpenList(current_card){
        for (let list_index = 0; list_index <= primary_icon_list.length; list_index++) {
                if ($(current_card).children('i').hasClass(String(primary_icon_list[list_index]))){
                    openList.push(current_card);
            }}

        if (openList.length === 2) {
            if ($(openList[0]).children('i').attr('class') == $(openList[1]).children('i').attr('class')) {
                $(openList[0]).addClass('match');
                $(openList[1]).addClass('match');
                matchCounter = matchCounter + 2;
                openList = [];
            } else {
                click_suspended = true;
                setTimeout(function(){
                    $(openList).each(function(){
                        hideCard(this);
                    });
                click_suspended = false;

                    openList = [];
                }, cardViewingTime);
            }
        }
    }


    function checkWin(){
        if (matchCounter === unshuffled_icons_list.length) {
            clearInterval(myTimerVariable);
            let timeModal = "It took you " + String($('.timer_display').text()) + " minutes";
            let ratingModal = $('.stars');
            $('#time').text(String(timeModal));
            $('#rating').append(ratingModal);
            $('.modal').show();
        }
    }


    function resetStars() {
        $('.stars i').removeClass('fa-star-o');
        $('.stars i').addClass('fa-star');
    }

    function restartGame() {
        moveCounter = 0;
        timer = 0;
        timer_seconds_1 = 0;
        timer_seconds_2 = 0;
        timer_minutes = 0;

        clearInterval(myTimerVariable);
        resetStars();
        timer_started = false;
        openList = [];

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

        matchCounter = 0;
    }


    // Shuffle icons
    let icons_list = shuffle(unshuffled_icons_list);

    // Add icons to the grid
    populateGrid(icons_list);

    // Set event listner to handle the game logic as the player goes through the game
    $('.deck').on('click', '.card', function(){
        if (click_suspended == false) {

            if (timer_started == false) {
                timer_started = true;
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

    // Set event listner to restart the game
    $('.restart').click(restartGame);

    // Set event listner to close the victory modal
    $('.modal-content').on('click', '.close', function() {
        $('.modal').hide();
    });
});
