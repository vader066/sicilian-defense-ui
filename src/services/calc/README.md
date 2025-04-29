iterate through the games of a tournament
for every game, record the winner's name and rating and the losers's name and rating
put the ratings into the calculation function and calculate the upgrade and downgrade
record the new ratings for both players alongside their names and add them to an array,
In the final array you must have a list of player names along side their new ratings
update all players in this array on the database - steps in between

Rating change:
expected_score = 1/(1 + 10^((opp_rating - player_rating)/400))
K_factor = if(player_rating > 2400){
return(10)
} else if (player_rating >= 1600){
return(20)
} else {
return(40)
}
Rating_change = K_factor \* (win(1)/loss(0) - expected_score)
