
function all() {
    sade = document.querySelector('input[name="stopitchrome"]');
countries = []
for (const answer in (_page.data.recommendedTypeins)){
    countries.push(answer)}
let i = 0
function guess(){
    
    if (i < countries.length) {
        sade.value = countries[i];
        sade.dispatchEvent(new KeyboardEvent("input"));
        i++;
        setTimeout(guess(), 200);
    } 
}
guess()
}
all()
