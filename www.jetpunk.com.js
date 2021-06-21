
function all() {
    sade = document.querySelector('input[name="stopitchrome"]');
countries = _page.data.quiz.answers.map(x=> x.display)
answers = countries.map(x => {
    if (!x.includes(`{`)) {
        return x
    } else {
        return x.split("{")[1].split("}")[0]
    }
})
let i = 0
function guess(){
    
    if (i < answers.length) {
        sade.value = answers[i];
        sade.dispatchEvent(new KeyboardEvent("input"));
        i++;
        setTimeout(guess, 1);
    } 
}
guess()
}
all()
