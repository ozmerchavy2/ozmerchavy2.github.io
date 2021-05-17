(function() {
    var videoElement = document.querySelector("video");
    var audioCtx = new AudioContext();
    var source = audioCtx.createMediaElementSource(videoElement);
    var gainNode = audioCtx.createGain();
    gainNode.gain.value = Number(prompt("How much times louder?"))
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
})();
