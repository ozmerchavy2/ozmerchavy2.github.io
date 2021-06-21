document.addEventListener("keyup", (e)=>{ 
  var keyCode = e.keyCode || e.charCode;
if (keyCode != 32) return;
 hits += Math.floor(Math.random()*125 +12); setCookie('hits', hits, 365); addHit(); })
