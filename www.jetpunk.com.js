
function guess() {
    sade = document.querySelector('input[name="stopitchrome"]');
countries = []
for (const answer in (_page.data.recommendedTypeins)){
    countries.push(answer)}
let i = 0;

    if (i < countries.length) {
        sade.value = countries[i];
        sade.dispatchEvent(new KeyboardEvent("input"));
        i++;
        setTimeout(guess(), 200);
    } else {
        i = 0
    }
}
guess()
