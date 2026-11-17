
/* =========================================
   1. MATCHING GAME DATA
========================================= */

const pairs = [
    {
        sentence: 'The coach praised the team.',
        type: 'Active voice',
        id: 'a'
    },
    {
        sentence: 'The window was opened by Maya.',
        type: 'Passive voice',
        id: 'b'
    },
    {
        sentence: 'Our class planted sunflowers.',
        type: 'Active voice',
        id: 'c'
    },
    {
        sentence: 'The song was written by Luis.',
        type: 'Passive voice',
        id: 'd'
    }
];


/* =========================================
   2. MATCHING GAME ELEMENTS
========================================= */

const left = document.querySelector('#leftCards');
const right = document.querySelector('#rightCards');
const status = document.querySelector('#matchStatus');

let chosen = null;
let matched = new Set();


/* Shuffle Cards */

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}


/* Create Matching Game */

function setupMatch() {

    chosen = null;
    matched.clear();

    left.innerHTML = '';
    right.innerHTML = '';

    status.textContent =
        'Choose a sentence, then choose its voice.';


    // Create Sentence Cards

    shuffle(pairs).forEach(pair => {

        const button = document.createElement('button');

        button.className = 'match-card';
        button.textContent = pair.sentence;
        button.dataset.id = pair.id;

        button.onclick = () => select(button, 'left');

        left.append(button);

    });


    // Create Voice Type Cards

    shuffle(pairs).forEach(pair => {

        const button = document.createElement('button');

        button.className = 'match-card';
        button.textContent = pair.type;
        button.dataset.id = pair.id;

        button.onclick = () => select(button, 'right');

        right.append(button);

    });

}


/* Handle Matching Selections */

function select(button, side) {

    // Ignore already matched cards

    if (matched.has(button.dataset.id)) {
        return;
    }


    // Select the First Card

    if (!chosen) {

        chosen = {
            btn: button,
            side: side
        };

        button.classList.add('selected');

        return;
    }


    // Allow Changing Selection Within Same Column

    if (chosen.side === side) {

        chosen.btn.classList.remove('selected');

        chosen = {
            btn: button,
            side: side
        };

        button.classList.add('selected');

        return;
    }


    // Compare Selected Cards

    const first = chosen;

    first.btn.classList.remove('selected');

    chosen = null;


    // Correct Match

    if (first.btn.dataset.id === button.dataset.id) {

        matched.add(button.dataset.id);

        first.btn.classList.add('matched');
        button.classList.add('matched');

        if (matched.size === pairs.length) {

            status.textContent =
                'Wonderful—every pair matched!';

        } else {

            status.textContent =
                `${matched.size} of ${pairs.length} matched. Keep going!`;

        }

    }


    // Incorrect Match

    else {

        status.textContent =
            'Not quite—try another match.';

        first.btn.classList.add('wrong');
        button.classList.add('wrong');

        setTimeout(() => {

            first.btn.classList.remove('wrong');
            button.classList.remove('wrong');

        }, 300);

    }

}


/* Reset Matching Game */

document.querySelector('#resetMatch').onclick = setupMatch;


/* Start Matching Game */

setupMatch();


/* =========================================
   3. TAB SWITCHING
========================================= */

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');


tabs.forEach(tab => {

    tab.onclick = () => {

        // Update Selected Tab

        tabs.forEach(item => {

            item.setAttribute(
                'aria-selected',
                String(item === tab)
            );

        });


        // Display Selected Panel

        panels.forEach(panel => {

            const isActive =
                panel.id === tab.getAttribute('aria-controls');

            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;

        });

    };

});


/* =========================================
   4. FLASHCARD DATA
========================================= */

const cards = [

    {
        front: 'The rabbit nibbled the carrot.',
        back: 'Active voice — the rabbit (subject) does the nibbling.'
    },

    {
        front: 'The carrot was nibbled by the rabbit.',
        back: 'Passive voice — the carrot (subject) receives the nibbling.'
    },

    {
        front: 'A letter was delivered this morning.',
        back: 'Passive voice — the letter receives the action. The doer is not named.'
    },

    {
        front: 'Nina solved the puzzle.',
        back: 'Active voice — Nina (subject) performs the action.'
    },

    {
        front: 'The mural was painted by our neighbors.',
        back: 'Passive voice — the mural receives the action.'
    }

];


/* =========================================
   5. FLASHCARD ELEMENTS
========================================= */

let index = 0;
let revealed = false;

const cardEl = document.querySelector('#flashcard');
const countEl = document.querySelector('#cardCount');
const progressBar = document.querySelector('#progressBar');
const progressContainer = document.querySelector('.progress');


/* Display Current Flashcard */

function drawCard() {

    const card = cards[index];

    cardEl.classList.toggle('revealed', revealed);


    // Card Content

    cardEl.innerHTML = `
        <span class="small">
            ${revealed ? 'Answer' : 'Which voice?'}
        </span>

        <span class="phrase">
            ${revealed ? card.back : card.front}
        </span>

        <span class="hint">
            ${revealed ? 'Click to see the sentence' : 'Click to reveal'}
        </span>
    `;


    // Card Counter

    countEl.textContent =
        `Card ${index + 1} of ${cards.length}`;


    // Progress Bar

    const progress =
        ((index + 1) / cards.length) * 100;

    progressBar.style.width = `${progress}%`;

    progressContainer.setAttribute(
        'aria-valuenow',
        progress
    );


    // Accessibility Label

    cardEl.setAttribute(
        'aria-label',
        `${revealed ? 'Answer' : 'Flash card'}: ${
            revealed ? card.back : card.front
        }. Click to ${revealed ? 'hide' : 'reveal'}.`
    );

}


/* =========================================
   6. FLASHCARD INTERACTIONS
========================================= */


/* Flip Card */

function flip() {

    revealed = !revealed;

    drawCard();

}


/* Move Between Cards */

function move(direction) {

    index = (index + direction + cards.length) % cards.length;

    revealed = false;

    drawCard();

}


/* Flashcard Click */

cardEl.onclick = flip;


/* Keyboard Support */

cardEl.onkeydown = event => {

    if (event.key === 'Enter' || event.key === ' ') {

        event.preventDefault();

        flip();

    }

};


/* Previous Card */

document.querySelector('#prevCard').onclick = () => {

    move(-1);

};


/* Next Card */

document.querySelector('#nextCard').onclick = () => {

    move(1);

};


/* Display First Card */

drawCard();
