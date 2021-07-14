var socket = io.connect();
var turn = true,
  symbol;
var matches = ["XXX", "OOO"];

function boardPosition() {
  var obj = {};
  $(".box").each(function () {
    obj[$(this).attr("id")] = $(this).text() || "";
  });
  return obj;
}

function checkWinner() {
  var position = boardPosition();
  //Possible combinations to win the game
  var possibilities = [
    position.x0 + position.x1 + position.x2,
    position.y0 + position.y1 + position.y2,
    position.z0 + position.z1 + position.z2,
    position.x0 + position.y1 + position.z2,
    position.x1 + position.y1 + position.z1,
    position.x0 + position.y0 + position.z0,
    position.x2 + position.y1 + position.z0,
    position.x2 + position.y2 + position.z2,
  ];
  var length = possibilities.length;

  for (var i = 0; i < length; i++) {
    if (possibilities[i] === matches[0] || possibilities[i] === matches[1]) {
      return true;
    }
  }
  return false;
}

function turnMessage() {
  if (!turn) {
    $("#message").text("Your opponent's turn");
    $(".box").attr("disabled", true);
  } else {
    $("#message").text("Your turn.");
    $(".box").removeAttr("disabled");
  }
}

function makeMove(e) {
  e.preventDefault();

  if (!turn) {
    return;
  }

  if ($(this).text().length) {
    return;
  }


  socket.emit("make.move", {
    symbol: symbol,
    position: $(this).attr("id"),
  });
}

// Action is called when the players move
socket.on("move.made", function (data) {
  
  $("#" + data.position).text(data.symbol);
  turn = data.symbol !== symbol;

  if (!checkWinner()) {
    return turnMessage();
  }

  if (turn) {
    $("#message").text("Game over. You lost.");

  } else {
    $("#message").text("Game over. You won!");
  }

  // Disable the board
  $(".box").attr("disabled", true);
});

//To set the initial game for players
socket.on("game.begin", function (data) {
  
  $("#symbol").html(data.symbol); 
  symbol = data.symbol;

  turn = data.symbol === "X";
  turnMessage();
});

// Disable the gmae if the opponents quits
socket.on("opponent.left", function () {
  $("#message").text("Your opponent left the game.");
  $(".box").attr("disabled", true);
});

$(function () {
  $(".container button").attr("disabled", true);
  $(".box").on("click", makeMove);
});
