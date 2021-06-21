document.addEventListener("keydown", ()=>{ hits += Math.floor(Math.random()*125 +12); setCookie('hits', hits, 365); addHit(); })
