 function sqInP$(e) {
    const l = Number(e.querySelectorAll("div")[2].outerText.substr(1)),
        s = e.querySelectorAll("div")[3].outerText;
    Number(s.split("")[0]);
    let t = "noidea";
    if (s.includes("Medium")) t = 59.2141335;
    else if (s.includes("Small")) t = 5 * 3.1415 * 3.1415;
    else if (s.includes("Large")) t = 69.08315575;
    else {
        if (!s.includes("X-Large")) return;
        t = 78.952178
    }
    return t / (1.15 * l)
}
let selecteddeal = "",
    bestdeal = 1,
    alldis = [...document.querySelectorAll(".local-coupon")];
alldis.forEach(e => {
    sqInP$(e) > bestdeal && (bestdeal = sqInP$(e), selecteddeal = e)
}), selecteddeal.style.border = "4px solid green", alert("The best deal is " + Math.round(bestdeal) + " Sq Inch per a Dollar!"), alldis.splice(alldis.indexOf(selecteddeal), 1);
let almostbest = 1,
    almoselected = "";
alldis.forEach(e => {
    sqInP$(e) > almoselected && (almostbest = sqInP$(e), almoselected = e)
}), almoselected.style.border = "4px solid yellow", alert("The second best deal is " + Math.round(almostbest) + " Sq Inch per a Dollar!");
