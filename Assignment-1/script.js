document.getElementById('alienRegistrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let isValid = validateForm();
    
    const submissionMessage = document.getElementById('submissionMessage');
    if (isValid) {
        submissionMessage.innerHTML = '<p style="color: green;">✅ Registration successful! Prepare for landing. Earth welcomes you.</p>';
    } else {
        submissionMessage.innerHTML = '<p style="color: red;">❌ Registration failed! Please correct the errors above before attempting landing.</p>';
    }
});

function validateForm() {
    let isValid = true;
    //Step 1 
    const vowelRegex = /[aeiou]/i;
    const digitRegex = /\d/;
    const planetName = document.getElementById('planetName').value;
    const planetNameError = document.getElementById('planetNameError');
    if (!vowelRegex.test(planetName) || !digitRegex.test(planetName)) {
        planetNameError.textContent = 'Planet Name must contain at least one vowel (a, e, i, o, u) AND one digit (0-9).';
        isValid = false;
    } else {
        planetNameError.textContent = '';
    }

    //Step 2
    const antennaCount = parseInt(document.getElementById('antennaCount').value);
    const antennaCountError = document.getElementById('antennaCountError');
    if (isNaN(antennaCount) || antennaCount < 0 || antennaCount % 2 !== 0) {
        antennaCountError.textContent = 'Antenna Count must be a non-negative, even number.';
        isValid = false;
    } else {
        antennaCountError.textContent = '';
    }

    // 3. Alien ID: Pattern ZOR-XY_9999@UFO (Complex mixed chars + anchors)
    // ^      Start of string
    // ZOR-   Literal 'ZOR-'
    // [A-Z]{2} Two uppercase letters (XY)
    // _      Literal underscore
    // \d{4}  Exactly four digits (9999)
    // @UFO   Literal '@UFO'
    // $      End of string
    const alienIDRegex = /^ZOR-[A-Z]{2}_\d{4}@UFO$/;
    const alienID = document.getElementById('alienID').value;
    const alienIDError = document.getElementById('alienIDError');
    if (!alienIDRegex.test(alienID)) {
        alienIDError.textContent = 'ID must match pattern ZOR-XY_9999@UFO (e.g., ZOR-AB_1234@UFO).';
        isValid = false;
    } else {
        alienIDError.textContent = '';
    }

    // 4. Favorite Human Phrase: Must contain at least one emoji or punctuation (Unicode regex)
    // Punctuation: P (includes standard punctuation like . , ! ? etc.)
    // Emoji/Symbol: S (includes common symbols and emojis)
    // \p{P}: Matches any kind of punctuation character.
    // \p{S}: Matches any kind of symbol.
    const phraseRegex = /[\p{P}\p{S}]/u; 
    const favoritePhrase = document.getElementById('favoritePhrase').value;
    const phraseError = document.getElementById('phraseError');
    if (!phraseRegex.test(favoritePhrase)) {
        phraseError.textContent = 'Your phrase must contain at least one punctuation mark or an emoji! 😅';
        isValid = false;
    } else {
        phraseError.textContent = '';
    }

    // 5. Landing Date:
    const landingDateInput = document.getElementById('landingDate').value;
    const landingDate = new Date(landingDateInput);
    const today = new Date();

    today.setHours(0, 0, 0, 0); 
    const dateError = document.getElementById('dateError');

    if (!landingDateInput || landingDate < today) {
        dateError.textContent = 'Landing Date cannot be in the past. Please choose today or a future date.';
        isValid = false;
    } else {
        dateError.textContent = '';
    }

    
    // 6. Motive
    const motive = document.getElementById('motive').value;
    const motiveError = document.getElementById('motiveError');
    if (motive === "") {
        motiveError.textContent = 'Please select a valid motive for your visit.';
        isValid = false;
    } else {
        motiveError.textContent = '';
    }

    // 7. Vessel Name:
    const vesselNameRegex = /UFO|Flying Saucer/i; 
    const vesselName = document.getElementById('vesselName').value;
    const vesselNameError = document.getElementById('vesselNameError');
    if (vesselNameRegex.test(vesselName)) {
        vesselNameError.textContent = 'Vessel name is too standard! Please choose a more creative, non-standard designation.';
        isValid = false;
    } else {
        vesselNameError.textContent = '';
    }

    return isValid;
}