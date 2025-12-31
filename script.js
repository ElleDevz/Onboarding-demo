let currentScreen = 1;
const totalScreens = 3;

// Initialize the onboarding
document.addEventListener('DOMContentLoaded', function() {
    showScreen(1);
    setupEventListeners();
});

function setupEventListeners() {
    // Add click listeners to navigation dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showScreen(index + 1);
        });
    });

    // Add click listeners to close buttons
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeOnboarding();
        });
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextScreen();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            previousScreen();
        } else if (e.key === 'Escape') {
            closeOnboarding();
        }
    });

    // Add swipe gestures for mobile
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    });

    function handleSwipe() {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - go to previous screen
                previousScreen();
            } else {
                // Swipe left - go to next screen
                nextScreen();
            }
        }
    }
}

function showScreen(screenNumber) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the selected screen
    const targetScreen = document.getElementById(`screen${screenNumber}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenNumber;
        updateNavigationDots();
        addScreenTransition();
    }
}

function nextScreen() {
    if (currentScreen < totalScreens) {
        showScreen(currentScreen + 1);
    } else {
        // On the last screen, close the onboarding
        closeOnboarding();
    }
}

function previousScreen() {
    if (currentScreen > 1) {
        showScreen(currentScreen - 1);
    }
}

function updateNavigationDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentScreen - 1) {
            dot.classList.add('active');
        }
    });
}

function addScreenTransition() {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) {
        activeScreen.style.opacity = '0';
        activeScreen.style.transform = 'translateX(20px)';
        
        requestAnimationFrame(() => {
            activeScreen.style.transition = 'all 0.3s ease';
            activeScreen.style.opacity = '1';
            activeScreen.style.transform = 'translateX(0)';
        });
    }
}

function closeOnboarding() {
    // Add a closing animation
    const container = document.querySelector('.container');
    container.style.transition = 'all 0.5s ease';
    container.style.opacity = '0';
    container.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        // In a real app, you would redirect or close the modal
        alert('Onboarding completed! Welcome to the app!');
        
        // Reset for demo purposes
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
        showScreen(1);
    }, 500);
}

// Add some interactive effects
function addInteractiveEffects() {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click ripple effect
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize interactive effects
document.addEventListener('DOMContentLoaded', addInteractiveEffects);

// Add auto-advance option (optional)
let autoAdvanceTimer = null;

function startAutoAdvance(interval = 5000) {
    autoAdvanceTimer = setInterval(() => {
        if (currentScreen < totalScreens) {
            nextScreen();
        } else {
            clearInterval(autoAdvanceTimer);
        }
    }, interval);
}

function stopAutoAdvance() {
    if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }
}

// Pause auto-advance on user interaction
document.addEventListener('click', stopAutoAdvance);
document.addEventListener('touchstart', stopAutoAdvance);
document.addEventListener('keydown', stopAutoAdvance);

// Uncomment the line below to enable auto-advance
// startAutoAdvance();
