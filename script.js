document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles-container');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    // 1. Optimized Particle System
    // Reduce initial particle count on mobile to preserve CPU/battery
    const particleCount = isMobile ? 12 : 25;
    
    // Create initial floating particles
    for (let i = 0; i < particleCount; i++) {
        createParticle(false, Math.random() * 100);
    }

    function createParticle(isInteractive = false, x = null, y = null) {
        if (!particlesContainer) return;
        
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Optimize sizes and timings
        const size = isInteractive 
            ? Math.random() * 5 + 3  // Interactive particles size
            : Math.random() * 3.5 + 1.5; // Natural drifting particles size
            
        const duration = isInteractive 
            ? Math.random() * 1.2 + 0.8
            : Math.random() * 6 + 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        if (isInteractive && y !== null) {
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.transform = `translate(-50%, -50%)`;
            particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
            particle.style.animation = `fadeSpawn ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
        } else {
            particle.style.left = `${x !== null ? x : Math.random() * 100}%`;
            particle.style.bottom = `-20px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.setProperty('--sway', `${Math.random() * 30 - 15}px`);
            particle.style.animationName = 'moveParticle';
        }
        
        particlesContainer.appendChild(particle);
        
        // Remove from DOM to keep the node count small
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // Spawn natural drifting particles at regular intervals
    setInterval(() => {
        // Only spawn if tab is active to save resources
        if (!document.hidden) {
            createParticle(false);
        }
    }, isMobile ? 1800 : 1000);

    // Throttled interactive particle generator
    let lastSpawnTime = 0;
    const spawnThrottle = isMobile ? 80 : 45; // ms between particle spawns

    const handleInteraction = (clientX, clientY) => {
        const now = performance.now();
        if (now - lastSpawnTime > spawnThrottle) {
            createParticle(true, clientX, clientY);
            lastSpawnTime = now;
        }
    };

    // Desktop mousemove
    if (!isMobile) {
        window.addEventListener('mousemove', (e) => {
            handleInteraction(e.clientX, e.clientY);
        }, { passive: true });
    } else {
        // Mobile touchmove (spawns particles on swipe)
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
    }

    // 2. Performance-minded 3D Tilt Effect (Desktop Only)
    if (!isMobile) {
        const cards = document.querySelectorAll('.link-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = ((x / rect.width) - 0.5) * 2; // -1 to 1
                const yc = ((y / rect.height) - 0.5) * 2; // -1 to 1
                
                card.style.transform = `rotateY(${xc * 6}deg) rotateX(${-yc * 6}deg) translateY(-4px) scale(1.02)`;
                
                const content = card.querySelector('.card-content');
                if (content) {
                    content.style.background = `rgba(32, 14, 52, 0.75)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0) scale(1)';
                const content = card.querySelector('.card-content');
                if (content) {
                    content.style.background = `rgba(20, 9, 36, 0.8)`;
                }
            });
        });
    }

    // 4. Periodic Lead Engagement Trigger (Auto-Shimmer a random link-card)
    const allCards = document.querySelectorAll('.link-card');
    if (allCards.length > 0) {
        setInterval(() => {
            if (!document.hidden) {
                const randomIndex = Math.floor(Math.random() * allCards.length);
                const selectedCard = allCards[randomIndex];
                
                // Add temporary class to trigger shimmer animation
                selectedCard.classList.add('auto-shimmer');
                setTimeout(() => {
                    selectedCard.classList.remove('auto-shimmer');
                }, 1500);
            }
        }, 6000);
    }
});

// Inject keyframe animation dynamically for interactive fade/spawn
const style = document.createElement('style');
style.textContent = `
@keyframes fadeSpawn {
    0% {
        transform: translate(-50%, -50%) scale(0.3);
        opacity: 0;
    }
    15% {
        opacity: 0.85;
    }
    100% {
        transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% - 60px)) scale(1.2);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);
