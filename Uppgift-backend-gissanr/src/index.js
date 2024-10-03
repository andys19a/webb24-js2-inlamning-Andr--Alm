
import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";
const port = 3000;

const app = express();
app.use(cors({
    origin: 'http://localhost:1234' 
}));
app.use(express.json());

const __dirname = path.dirname(new URL(import.meta.url).pathname); // förstod inte varför path skulle med, inget jag kände igen
const highscorePath = path.join(__dirname, 'highscoreDb.json');


let highscore = []; // Initiera highscore


async function getHighscoreList() {
    const data = await fs.readFile(highscorePath, 'utf8'); // Data från JSON filen
    return JSON.parse(data);
}

async function saveHighscoreList(highscoreList) {
    await fs.writeFile(highscorePath, JSON.stringify(highscoreList, null, 2)); // Spara highscore-listan till JSON-filen

}

// Namn och poäng 
app.post('/submit-score', async (req, res) => {
    console.log(req.body);
    const { name, score } = req.body;

    if (!highscore || !Array.isArray(highscore)) {
        highscore = await getHighscoreList(); 
    }

    // 
    if (highscore.length < 5 || score > highscore[highscore.length - 1].score) {
        if (highscore.length < 5) {
            highscore.push({ name, score }); // Om det finns färre än 5 lägger den till
        } else {
            highscore[highscore.length - 1] = { name, score }; // Ersätter den lägsta poängen
        }

        // Sortera listan i fallande ordning, jämför inputen från användaren vilken som är mest
        highscore.sort((a, b) => b.score - a.score);

        // Spara den uppdaterade highscore-listan
        await saveHighscoreList(highscore);

        res.json({ message: 'Poäng tillagd till boarden' });
    } else {
        res.json({ message: 'Poängen är för låg för att hamna på listan' });
    }
});

app.get('/highscores', async (req, res) => {
    const highscoreList = await getHighscoreList();
    res.json(highscoreList);
});

app.listen(port, () => {
    console.log(`Servern körs på http://localhost:${port}`);
});