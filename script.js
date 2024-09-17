const consonantsAndSyllablesFirst = [
    'b', 'c', 'd', 'f', 'g',  ''
];

const vowels = ['a', 'e', 'i', 'o', 'u', ''];

const consonantsAndSyllablesLast = [
    'b', 'ck', 'd', 'g', 'k', 'll', ''
];

document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById('card-container');

    cardContainer.appendChild(createCard(consonantsAndSyllablesFirst, 0, 'blue'));
    cardContainer.appendChild(createCard(vowels, 0, 'orange'));
    cardContainer.appendChild(createCard(consonantsAndSyllablesLast, 0, 'blue'));
});

function createCard(array, index, colorClass) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-letter', array[index]);
    card.setAttribute('data-index', index);
    card.setAttribute('onclick', 'voiceCard(this)');

    const upButton = document.createElement('button');
    upButton.className = 'arrow up';
    upButton.innerHTML = '&#9650;';
    upButton.setAttribute('onclick', 'changeCardContent(event, this, 1)');
    upButton.setAttribute('aria-label', 'Move to previous letter');

    const downButton = document.createElement('button');
    downButton.className = 'arrow down';
    downButton.innerHTML = '&#9660;';
    downButton.setAttribute('onclick', 'changeCardContent(event, this, -1)');
    downButton.setAttribute('aria-label', 'Move to next letter');

    const innerCard = document.createElement('div');
    innerCard.className = 'inner-card';

    const front = document.createElement('div');
    front.className = 'front ' + colorClass;
    front.innerText = array[index];
    front.tabIndex = 0;

    const back = document.createElement('div');
    back.className = 'back ' + colorClass;
    back.innerText = array[(index + 1) % array.length];

    innerCard.appendChild(front);
    innerCard.appendChild(back);

    card.appendChild(upButton);
    card.appendChild(innerCard);

    const signLanguageImage = document.createElement('img');
    signLanguageImage.className = 'sign-language-image'; 
    signLanguageImage.src = signLanguageImages[array[index]];
    signLanguageImage.alt = 'Sign Language for ' + array[index];

    card.appendChild(signLanguageImage);
    card.appendChild(downButton);

    return card;
}

function changeCardContent(event, button, direction) {
    event.stopPropagation();
    const card = button.closest('.card');
    const array = getArrayFromCardText(card);
    const currentIndex = parseInt(card.getAttribute('data-index'));
    const arrayLength = array.length;
    const newIndex = (currentIndex + direction + arrayLength) % arrayLength;

    updateCardContent(card, array, newIndex);
}

function getArrayFromCardText(card) {
    const cards = card.parentNode.children;
    if (card === cards[0]) {
        return consonantsAndSyllablesFirst;
    } else if (card === cards[cards.length - 1]) {
        return consonantsAndSyllablesLast;
    } else {
        return vowels;
    }
}

function updateCardContent(card, array, index) {
    card.querySelector('.front').innerText = array[index];
    card.querySelector('.back').innerText = array[(index + 1) % array.length];
    card.setAttribute('data-index', index);
    card.setAttribute('data-letter', array[index]);

    const signLanguageImage = card.querySelector('.sign-language-image');
    signLanguageImage.src = signLanguageImages[array[index]];
    signLanguageImage.alt = 'Sign Language for ' + array[index];
}

// function voiceCard(card) {
//     const letter = card.getAttribute('data-letter');
//     const msg = new SpeechSynthesisUtterance(letter);
//     setFemaleVoice(msg);
//     window.speechSynthesis.speak(msg);
// }
function voiceCard(card) {
    const letter = card.getAttribute('data-letter');
    
    // Construct the path to the corresponding MP3 file
    const audioPath = `./phonics/${letter}.mp3`;
    
    // Create a new Audio object and play the MP3 file
    const audio = new Audio(audioPath);
    audio.play();
}


function readWord() {
    const cards = document.querySelectorAll('.card');
    let word = '';

    // Concatenate the letters/syllables from each card to form the word
    cards.forEach(card => {
        const letter = card.getAttribute('data-letter');
        word += letter;
    });

    // Create a single utterance for the full word
    const wordUtterance = new SpeechSynthesisUtterance(word);
    setFemaleVoice(wordUtterance);
    
    // Speak the complete word
    window.speechSynthesis.speak(wordUtterance);

    // Optionally check for the definition of the full word
    checkWordDefinition(word);
}

function checkWordDefinition(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const definitionContainer = document.getElementById('definition-container');
            const definitionElement = document.getElementById('definition');
            const speakButton = document.getElementById('speak-definition');

            if (data.title === "No Definitions Found") {
                definitionElement.innerText = "This is a Nonsense Word";
                speakButton.style.display = 'none';
            } else {
                const definition = data[0].meanings[0].definitions[0].definition;
                const synonyms = data[0].meanings[0].definitions[0].synonyms || [];
                definitionElement.innerText = `Definition: ${definition}\nSynonyms: ${synonyms.join(', ')}`;
                speakButton.style.display = 'inline';
                speakButton.setAttribute('data-definition', definition);
            }
        })
        .catch(error => {
            console.error('Error fetching definition:', error);
        });
}

function speakDefinition() {
    const definition = document.getElementById('speak-definition').getAttribute('data-definition');
    const msg = new SpeechSynthesisUtterance(definition);
    setFemaleVoice(msg);
    window.speechSynthesis.speak(msg);
}

function setFemaleVoice(msg) {
    const voices = window.speechSynthesis.getVoices();
    const femaleVoices = voices.filter(voice => voice.gender === 'female' || voice.name.toLowerCase().includes('female'));
    msg.voice = femaleVoices.length > 0 ? femaleVoices[0] : voices[0];
}

const signLanguageImages = {
    'a': 'images/A.png',
    'b': 'images/B.png',
    'c': 'images/C.png',
    'd': 'images/D.png',
    'e': 'images/E.png',
    'f': 'images/F.png',
    'g': 'images/G.png',
    'h': 'images/H.png',
    'i': 'images/I.png',
    'j': 'images/J.png',
    'k': 'images/K.png',
    'l': 'images/L.png',
    'm': 'images/M.png',
    'n': 'images/N.png',
    'o': 'images/O.png',
    'p': 'images/P.png',
    'q': 'images/Q.png',
    'r': 'images/R.png',
    's': 'images/S.png',
    't': 'images/T.png',
    'u': 'images/U.png',
    'v': 'images/V.png',
    'w': 'images/W.png',
    'x': 'images/X.png',
    'y': 'images/Y.png',
    'z': 'images/Z.png',
    'bl': 'images/BL.png',
    'br': 'images/BR.png',
    'cr': 'images/CR.png',
    'fl': 'images/FL.png',
    'gr': 'images/GR.png',
    'pl': 'images/PL.png',
    'pr': 'images/PR.png',
    'sl': 'images/SL.png',
    'sp': 'images/SP.png',
    'st': 'images/ST.png',
    'tr': 'images/TR.png',
    'ch': 'images/CH.png',
    'sh': 'images/SH.png',
    'th': 'images/TH.png',
    'wh': 'images/WH.png',
    'ck': 'images/CK.png',
    'll': 'images/LL.png',
    'ss': 'images/SS.png',
    'ce': 'images/CE.png',
    'de': 'images/DE.png',
    'ke': 'images/KE.png',
    'me': 'images/ME.png',
    'ne': 'images/NE.png',
    're': 'images/RE.png',
    'te': 'images/TE.png',
    've': 'images/VE.png',
    'mp': 'images/MP.png',
    'nd': 'images/ND.png',
    'nk': 'images/NK.png',
    'ng': 'images/NG.png',
    'ea': 'images/EA.png',
    'ai': 'images/AI.png',
    'ee': 'images/EE.png',
    'oa': 'images/OA.png',
    'oo': 'images/OO.png',
    'ie': 'images/IE.png',
    'oi': 'images/OI.png',
    'oy': 'images/OY.png',
    'ay': 'images/AY.png',
    'ue': 'images/UE.png',
    'aw': 'images/AW.png',
    'ow': 'images/OW.png'
};

