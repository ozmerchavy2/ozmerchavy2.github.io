const box=document.querySelector("body > div.lightBox-overlay > div");box.remove();document.querySelector(".lightBox-overlay").remove();document.querySelector("html").classList.remove('noscroll');
