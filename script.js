const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');
const copyBtn = document.getElementById('copy-btn');
const copyNotification = document.getElementById('copy-notification');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const lengthInput = document.getElementById('length');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');

const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

function generatePassword() {
    let charSet = '';
    let password = '';
    
    if (uppercaseCheck.checked) charSet += characters.uppercase;
    if (lowercaseCheck.checked) charSet += characters.lowercase;
    if (numbersCheck.checked) charSet += characters.numbers;
    if (symbolsCheck.checked) charSet += characters.symbols;

    if (charSet === '') {
        alert('Please select at least one character type');
        passwordInput.value = '';
        updateStrengthMeter('');
        return;
    }

    const length = parseInt(lengthInput.value);
    
    // Ensure at least one character from each selected type
    if (uppercaseCheck.checked) password += characters.uppercase[Math.floor(Math.random() * characters.uppercase.length)];
    if (lowercaseCheck.checked) password += characters.lowercase[Math.floor(Math.random() * characters.lowercase.length)];
    if (numbersCheck.checked) password += characters.numbers[Math.floor(Math.random() * characters.numbers.length)];
    if (symbolsCheck.checked) password += characters.symbols[Math.floor(Math.random() * characters.symbols.length)];

    // Fill the rest of the password length
    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        password += charSet[randomIndex];
    }

    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    passwordInput.value = password;
    updateStrengthMeter(password);
}

function updateStrengthMeter(password) {
    let strength = 0;
    
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;

    strengthBar.style.width = `${Math.min(strength, 100)}%`;
    strengthText.textContent = 'Weak';
    strengthBar.parentElement.className = 'strength-meter strength-weak';

    if (strength >= 70) {
        strengthText.textContent = 'Strong';
        strengthBar.parentElement.className = 'strength-meter strength-strong';
    } else if (strength >= 40) {
        strengthText.textContent = 'Medium';
        strengthBar.parentElement.className = 'strength-meter strength-medium';
    }
}

togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePasswordBtn.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
});

copyBtn.addEventListener('click', async () => {
    if (!passwordInput.value) {
        console.log('No password to copy');
        return;
    }

    try {
        // Try modern Clipboard API
        await navigator.clipboard.writeText(passwordInput.value);
        console.log('Password copied using Clipboard API');
        showCopyNotification();
    } catch (err) {
        console.error('Clipboard API failed:', err);
        // Fallback to document.execCommand
        passwordInput.select();
        if (document.copy()) {
            console.log('Password copied using execCommand');
            showCopyNotification();
        } else {
            console.error('Copy failed with execCommand');
            alert('Failed to copy password');
        }
    }
});

function showCopyNotification() {
    copyNotification.classList.add('show');
    setTimeout(() => {
        copyNotification.classList.remove('show');
    }, 2000);
}

lengthInput.addEventListener('change', generatePassword);

[uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
    checkbox.addEventListener('change', generatePassword);
});

generateBtn.addEventListener('click', () => {
    generatePassword();
    generateBtn.classList.add('spin');
    setTimeout(() => generateBtn.classList.remove('spin'), 300);
});

// Generate initial password
generatePassword();