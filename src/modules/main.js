let rightNumber = Math.floor( Math.random()*3 )+1;

let amountGuesses = 0;
let pointsAwarded = 0;



const formEl = document.querySelector('form');

formEl.addEventListener('submit', getUserGuess);

function getUserGuess(event){
    event.preventDefault();

    const userAnswer = document.querySelector('input').value;
    

    formEl.reset();

    amountGuesses++; 

    const resultEl = document.querySelector('#resultP');

    if(rightNumber == userAnswer){
        pointsAwarded++; // öka poängen med 1 hela tiden
        resultEl.innerText = `Rätt! Det tog dig ${amountGuesses}gissningar`; // respons på rätt svar
        rightNumber = Math.floor( Math.random()*3 )+1; // ser till att den tänker på ny siffra efter rätt svar

        console.log(rightNumber);

        const playerName = prompt('Du vann! Vad är ditt namn?');

        // Skicka namn och poäng till backenden
        fetch('http://localhost:3000/submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: playerName, score: pointsAwarded }),
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Error:', error));
    }

    else if(rightNumber > userAnswer ){
        resultEl.innerText = 'Fel! Din gissning är för låg'; 

    }

    else if (userAnswer < rightNumber){
        resultEl.innerText= 'Fel! Din gissning är för hög';
        console.log(rightNumber);

    }


}

async function fetchHighscores() {
    try {
        const response = await fetch('http://localhost:3000/highscores'); // 
        if (!response.ok) {
            throw new Error('Något gick fel vid hämtning av highscore-listan');
        }
        const highscores = await response.json();
        displayHighscores(highscores); 
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayHighscores(highscores) { 
    const highscoreListEl = document.querySelector('#highscoreList'); 
    highscoreListEl.innerHTML = ''; 

    highscores.forEach(({ name, score }) => { //forEach går igenom arrayen, (nytt för mig)
        const listItem = document.createElement('li');
        listItem.textContent = `${name}: ${score}`; // en lista med namn och poäng
        highscoreListEl.appendChild(listItem);
    });
}

// Förstod inte riktigt varför denna behövdes, förstod det som att funktionen körs efter webbläsaren har laddat
window.onload = fetchHighscores;


