// --- Mobile Menu Toggle ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// --- Navbar background on scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 1, 51, 0.6)';
    } else {
        navbar.style.background = 'rgba(10, 1, 51, 0.3)';
    }
});

// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        if (mobileMenu.classList.contains('hidden') === false) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// --- Scroll Animations ---
const scrollElements = document.querySelectorAll('.scroll-animate');
const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
};
const displayScrollElement = (element) => {
    element.classList.add('visible');
};
const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.25)) {
            displayScrollElement(el);
        }
    });
};
window.addEventListener('scroll', handleScrollAnimation);
handleScrollAnimation();

// --- Typing Effect ---
const typingTextElement = document.getElementById('typing-text');
const words = ["AI Engineer", "Innovator", "Deep Learning Specialist", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }

    const typeSpeed = isDeleting ? 100 : 200;
    setTimeout(type, typeSpeed);
}
document.addEventListener('DOMContentLoaded', type);

// --- 3D Tilt Effect ---
VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2
});

// --- Contact Form Submission ---
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    formMessage.textContent = "Thank you for your message! I'll be in touch soon.";
    formMessage.style.color = 'var(--primary-glow)';
    contactForm.reset();
    setTimeout(() => {
        formMessage.textContent = "";
    }, 5000);
});

// --- Enhanced three.js Particle Background ---
let scene, camera, renderer, particles, lines;
let positions, linePositions, lineColors;
const particleCount = 200;
const connectionDistance = 100;

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 500;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particles
    const pMaterial = new THREE.PointsMaterial({
        color: 0x00f6ff,
        size: 3,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true
    });

    const pGeometry = new THREE.BufferGeometry();
    positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 1000;
        velocities[i] = (Math.random() - 0.5) * 0.5;
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    pGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    // Lines
    const lGeometry = new THREE.BufferGeometry();
    linePositions = new Float32Array(particleCount * particleCount * 3);
    lineColors = new Float32Array(particleCount * particleCount * 3);
    lGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));
    
    const lMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    lines = new THREE.LineSegments(lGeometry, lMaterial);
    scene.add(lines);

    animate();
}

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
});

function animate() {
    requestAnimationFrame(animate);

    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particles.geometry.attributes.velocity.array[i * 3];
        positions[i * 3 + 1] += particles.geometry.attributes.velocity.array[i * 3 + 1];
        positions[i * 3 + 2] += particles.geometry.attributes.velocity.array[i * 3 + 2];

        if (positions[i * 3 + 1] < -500 || positions[i * 3 + 1] > 500)
            particles.geometry.attributes.velocity.array[i * 3 + 1] *= -1;
        if (positions[i * 3] < -500 || positions[i * 3] > 500)
            particles.geometry.attributes.velocity.array[i * 3] *= -1;
        if (positions[i * 3 + 2] < -500 || positions[i * 3 + 2] > 500)
            particles.geometry.attributes.velocity.array[i * 3 + 2] *= -1;
        
        for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < connectionDistance) {
                const alpha = 1.0 - dist / connectionDistance;
                linePositions[vertexpos++] = positions[i * 3];
                linePositions[vertexpos++] = positions[i * 3 + 1];
                linePositions[vertexpos++] = positions[i * 3 + 2];
                linePositions[vertexpos++] = positions[j * 3];
                linePositions[vertexpos++] = positions[j * 3 + 1];
                linePositions[vertexpos++] = positions[j * 3 + 2];

                lineColors[colorpos++] = alpha;
                lineColors[colorpos++] = alpha;
                lineColors[colorpos++] = 1;
                lineColors[colorpos++] = alpha;
                lineColors[colorpos++] = alpha;
                lineColors[colorpos++] = 1;

                numConnected++;
            }
        }
    }
    
    lines.geometry.setDrawRange(0, numConnected * 2);
    lines.geometry.attributes.position.needsUpdate = true;
    lines.geometry.attributes.color.needsUpdate = true;
    particles.geometry.attributes.position.needsUpdate = true;

    camera.position.x += (mouseX - camera.position.x) * 0.01;
    camera.position.y += (-mouseY - camera.position.y) * 0.01;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init3D();
