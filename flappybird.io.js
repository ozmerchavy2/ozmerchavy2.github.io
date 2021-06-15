
function die() {}
function endGame() {
    $("canvas").trigger("gameEnd"); dead = true; bird.gotoAndPlay("dive"); ga('send', 'event', "Flappy Bird", "Score", counter.text, counter.text); if (counter.text > highScore.text) { highScore.text = counter.text; highScoreOutline.text = counterOutline.text; if (supports_html5_storage()) { localStorage.setItem("highScore", counter.text); } else { document.cookie = "highScore=" + counter.text; } }
    createjs.Tween.removeTweens(bird); createjs.Tween.get(bird).wait(0).to({ y: bird.y + 200, rotation: 90 }, (380) / 1.5, createjs.Ease.linear).call(diveBird).to({ y: ground.y - 30 }, (h - (bird.y + 200)) / 1.5, createjs.Ease.linear); createjs.Tween.get(stage).to({ alpha: 0 }, 100).to({ alpha: 1 }, 100); score = addImageAtCenter('score', 0, -150); start = addImageAtCenter('start', -120, 50); share = addImageAtCenter('share', 120, 50); leaderboard = addImageAtCenter('leaderboard', 0, 150); stage.removeChild(counter, counterOutline); stage.addChild(score); stage.addChild(start); stage.addChild(share); stage.addChild(leaderboard); counter.y = counter.y + 160; counter.font = "60px 'Flappy Bird'"; counterOutline.y = counter.y; counterOutline.font = "60px 'Flappy Bird'"; counter.alpha = 0; counterOutline.alpha = 0; highScore.y = counter.y + 80; highScoreOutline.y = highScore.y; stage.addChild(counter, counterOutline, highScore, highScoreOutline); dropIn(score); dropIn(start); dropIn(leaderboard); dropIn(counter); dropIn(counterOutline); dropIn(highScore); dropIn(highScoreOutline); createjs.Tween.get(share).to({ alpha: 1, y: share.y + 50 }, 400, createjs.Ease.sineIn).call(addClickToStart);
}
function setScoreandEnd() {
    let score = Number(prompt("What should your score be?"))
    counterOutline.text = score
    counter.text = score
    
    setTimeout(endGame(),1000)
    
}

let btn = document.createElement("button")
btn.innerHTML =  `End Game`;
btn.onclick = setScoreandEnd
document.body.appendChild(btn)
