// Frequency table for English and Spanish letters
const englishFreq = {
    'A': 8.17, 'B': 1.49, 'C': 2.78, 'D': 4.25, 'E': 12.70, 'F': 2.23, 'G': 2.02,
    'H': 6.09, 'I': 6.97, 'J': 0.15, 'K': 0.77, 'L': 4.03, 'M': 2.41, 'N': 6.75,
    'O': 7.51, 'P': 1.93, 'Q': 0.10, 'R': 5.99, 'S': 6.33, 'T': 9.06, 'U': 2.76,
    'V': 0.98, 'W': 2.36, 'X': 0.15, 'Y': 1.97, 'Z': 0.07
};

const spanishFreq = {
    'A': 11.52, 'B': 2.22, 'C': 4.02, 'D': 5.01, 'E': 12.18, 'F': 0.69, 'G': 1.77,
    'H': 0.70, 'I': 6.25, 'J': 0.44, 'K': 0.01, 'L': 4.97, 'M': 3.15, 'N': 6.71, 'Ñ': 0.17,
    'O': 8.68, 'P': 2.51, 'Q': 0.88, 'R': 6.87, 'S': 7.98, 'T': 4.63, 'U': 3.93,
    'V': 1.14, 'W': 0.01, 'X': 0.21, 'Y': 1.09, 'Z': 0.47
};

// Initialize letter substitution dictionary, including Ñ
let substitutions = {};
for (let i = 65; i <= 90; i++) {
    substitutions[String.fromCharCode(i)] = ''; // A-Z
}
substitutions['Ñ'] = ''; // Add Ñ

// Event listener for input changes
document.getElementById('ciphertext').addEventListener('input', updateMessage);
document.addEventListener('input', updateMessage);

// Create letter input fields dynamically, including Ñ
const replacementInputs = document.getElementById('replacementInputs');
for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const div = document.createElement('div');
    div.innerHTML = `<label>${letter}</label><input type="text" maxlength="1" class="replacement-input" id="input${letter}" data-letter="${letter}">`;
    replacementInputs.appendChild(div);
}

// Add an input field for Ñ
const divÑ = document.createElement('div');
divÑ.innerHTML = `<label>Ñ</label><input type="text" maxlength="1" class="replacement-input" id="inputÑ" data-letter="Ñ">`;
replacementInputs.appendChild(divÑ);

// Frequency analysis of ciphertext, including Ñ
function calculateFrequency(text) {
    const freq = {};
    text = text.toUpperCase().replace(/[^A-ZÑ]/g, ''); // Include Ñ in allowed letters
    const totalLetters = text.length;

    // Initialize frequencies for A-Z and Ñ
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        freq[letter] = 0;
    }
    freq['Ñ'] = 0; // Add Ñ

    // Count frequencies
    for (let char of text) {
        if (freq[char] !== undefined) {
            freq[char]++;
        }
    }

    const result = {};
    for (let letter in freq) {
        result[letter] = ((freq[letter] / totalLetters) * 100).toFixed(2);
    }

    return result;
}

// Update the decoded message based on substitutions, including Ñ
function updateMessage() {
    const ciphertext = document.getElementById('ciphertext').value;
    let decoded = '';

    // Apply substitutions, including Ñ
    for (let char of ciphertext) {
        const upperChar = char.toUpperCase();
        if (substitutions[upperChar] !== '' && char.match(/[A-ZÑ]/i)) {
                decoded += `<span style="color: red;">${char === upperChar ? substitutions[upperChar].toUpperCase() : substitutions[upperChar].toLowerCase()}</span>`;substitutions[upperChar].toLowerCase();
        } else {
            decoded += char;
        }
    }

    // Display decoded message
    document.getElementById('decodedMessage').innerHTML = decoded;

    // Update frequency analysis
    const freq = calculateFrequency(ciphertext);
    let freqAnalysisHtml = '<table><tr><th>Letter</th><th>Frequency (%)</th></tr>';
    for (let letter in freq) {
        freqAnalysisHtml += `<tr><td>${letter}</td><td>${freq[letter]}</td></tr>`;
    }
    freqAnalysisHtml += '</table>';
    document.getElementById('freqAnalysis').innerHTML = freqAnalysisHtml;
}

// Populate frequency comparison table for English and Spanish
const freqComparisonTable = document.getElementById('freqComparison');
for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    freqComparisonTable.innerHTML += `<tr><td>${letter}</td><td>${englishFreq[letter]}</td><td>${spanishFreq[letter]}</td></tr>`;
}
freqComparisonTable.innerHTML += `<tr><td>Ñ</td><td>-</td><td>${spanishFreq['Ñ']}</td></tr>`;

// Add event listeners to all substitution inputs, including Ñ
document.querySelectorAll('.replacement-input').forEach(input => {
    input.addEventListener('input', function() {
        const letter = this.dataset['letter'];
        substitutions[letter] = this.value.toUpperCase();
        updateMessage();
    });
});
