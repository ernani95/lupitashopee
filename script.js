document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle System Setup
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 20;
    
    // Spawn initial floating particles
    for (let i = 0; i < particleCount; i++) {
        createParticle(false);
    }

    // Spawn a particle at a random position or specific coordinate
    function createParticle(isInteractive = false, x = null, y = null) {
        if (!particlesContainer) return;
        
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = isInteractive 
            ? Math.random() * 6 + 3 // Larger interactive particles
            : Math.random() * 4 + 2; // Normal particles
            
        const duration = isInteractive 
            ? Math.random() * 2 + 1.5 
            : Math.random() * 6 + 4;
            
        const posX = x !== null ? x : Math.random() * 100; // percent or absolute px
        const posY = y !== null ? y : null; // if absolute coordinate
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        if (posY !== null) {
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            // For interactive spawned particles, we animate them floating outwards/upwards
            particle.style.transform = `translate(-50%, -50%)`;
            particle.style.animation = `fadeSpawn ${duration}s ease-out forwards`;
        } else {
            particle.style.left = `${posX}%`;
            particle.style.bottom = `-20px`;
            particle.style.animationDuration = `${duration}s`;
            // Random horizontal sway
            particle.style.setProperty('--sway', `${Math.random() * 40 - 20}px`);
            particle.style.animationName = 'moveParticle';
        }
        
        particlesContainer.appendChild(particle);
        
        // Clean up particle
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // Spawn random particles over time
    setInterval(() => {
        createParticle(false);
    }, 1200);

    // Interactive particles on mouse movement (desktop) and touch (mobile)
    const handleMove = (e) => {
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (x && y && Math.random() < 0.25) { // Throttle particle creation
            createParticle(true, x, y);
        }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    // 2. 3D Tilt Effect on Link Cards
    const cards = document.querySelectorAll('.link-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside element
            const y = e.clientY - rect.top;  // y position inside element
            
            // Calculate relative offset from center (-0.5 to 0.5)
            const xc = ((x / rect.width) - 0.5) * 2; // -1 to 1
            const yc = ((y / rect.height) - 0.5) * 2; // -1 to 1
            
            // Maximum tilt angle (degrees)
            const maxTilt = 8;
            
            // Tilt CSS transition
            card.style.transform = `rotateY(${xc * maxTilt}deg) rotateX(${-yc * maxTilt}deg) translateY(-4px) scale(1.02)`;
            
            // Subtle shift of card content overlay light source
            const content = card.querySelector('.card-content');
            if (content) {
                content.style.background = `rgba(30, 13, 50, 0.7)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset to original style smoothly
            card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0) scale(1)';
            const content = card.querySelector('.card-content');
            if (content) {
                content.style.background = `rgba(20, 9, 36, 0.8)`;
            }
        });
    });
});

// Extra animation keyframes added programmatically for interactive particles
const style = document.createElement('style');
style.textContent = `
@keyframes fadeSpawn {
    0% {
        transform: translate(-50%, -50%) scale(0.2);
        opacity: 0;
    }
    20% {
        opacity: 1;
    }
    100% {
        transform: translate(calc(-50% + (math-random * 60px - 30px)), calc(-50% - 60px)) scale(1.5);
        opacity: 0;
    }
}
`;
// Let's create a dynamic keyframe that drifts particles randomly
style.innerHTML = `
@keyframes fadeSpawn {
    0% {
        transform: translate(-50%, -50%) scale(0.2);
        opacity: 0;
    }
    10% {
        opacity: 0.8;
    }
    100% {
        transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% - 80px)) scale(1.3);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// Modify createParticle to pass custom CSS variables for displacement direction
const originalCreateParticle = window.createParticle;
// We modify createParticle's internal variable setup to handle custom drift:
// Overwriting the CSS style variable for drift.
document.addEventListener('mousemove', (e) => {
    // Inject drift offsets dynamically to particles
    const container = document.getElementById('particles-container');
    if (container && Math.random() < 0.2) {
        const x = e.clientX;
        const y = e.clientY;
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.width = '6px';
        p.style.height = '6px';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.transform = `translate(-50%, -50%)`;
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
        p.style.animation = `fadeSpawn 1.5s ease-out forwards`;
        container.appendChild(p);
        setTimeout(() => p.remove(), 1500);
    }
});

document.addEventListener('touchmove', (e) => {
    const container = document.getElementById('particles-container');
    if (container && e.touches.length > 0 && Math.random() < 0.2) {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.width = '6px';
        p.style.height = '6px';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.transform = `translate(-50%, -50%)`;
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
        p.style.animation = `fadeSpawn 1.5s ease-out forwards`;
        container.appendChild(p);
        setTimeout(() => p.remove(), 1500);
    }
});
