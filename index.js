// Frequency table for English and Spanish letters
const englishFreq = {
    'E': 12.51, 'T': 9.25, 'A': 8.04, 'O': 7.60, 'I': 7.26, 'N': 7.09,
    'S': 6.54, 'R': 6.12, 'H': 5.49, 'L': 4.14, 'D': 3.99, 'C': 3.06,
    'M': 2.53, 'F': 2.30, 'P': 2.00, 'G': 1.96, 'W': 1.92, 'Y': 1.73,
    'B': 1.54, 'V': 0.99, 'K': 0.67, 'X': 0.19, 'J': 0.16, 'Q': 0.11,
    'Z': 0.09, 'U': 2.71
};

const spanishFreq = {
    'E': 14.08, 'A': 12.16, 'O': 9.20, 'S': 7.20, 'N': 6.83, 'R': 6.41,
    'I': 5.98, 'L': 5.24, 'U': 4.69, 'D': 4.67, 'T': 4.60, 'C': 3.87,
    'M': 3.08, 'P': 2.89, 'B': 1.49, 'H': 1.18, 'Q': 1.11, 'V': 1.05,
    'G': 1.00, 'Y': 1.09, 'F': 0.69, 'J': 0.52, 'Z': 0.47, 'Ñ': 0.17,
    'X': 0.14, 'K': 0.11, 'W': 0.04
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
