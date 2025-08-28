// --- Gemini API Integration ---

const ideasLoader = document.getElementById('ideas-loader');
const ideasOutput = document.getElementById('ideas-output');
const generateIdeasBtn = document.getElementById('generate-ideas-btn');
const blogTopicInput = document.getElementById('blog-topic-input');

const apiKey = ""; // Leave empty, handled by the environment

async function callGemini(prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const payload = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "Sorry, I couldn't generate a response. Please try again.";
        }

    } catch (error) {
        console.error("Gemini API call error:", error);
        return "An error occurred. Please check the console for details.";
    }
}

// Blog Idea Generator Logic
generateIdeasBtn.addEventListener('click', async () => {
    const topic = blogTopicInput.value.trim();
    if (!topic) {
        ideasOutput.textContent = "Please enter a topic.";
        return;
    }

    ideasLoader.style.display = 'flex';
    ideasOutput.textContent = '';

    const prompt = `Generate 5 creative and engaging blog post titles about "${topic}". Format them as a numbered list.`;
    const result = await callGemini(prompt);
    
    ideasLoader.style.display = 'none';
    ideasOutput.innerHTML = result.replace(/\n/g, '<br>');
});

// --- Existing Page Logic ---

const filterButtons = document.querySelectorAll('.filter-btn');
const projectGrid = document.getElementById('project-grid');
const projectCards = document.querySelectorAll('.project-card');

// Initially add scroll class for 'All'
projectGrid.classList.add('project-grid-scrollable');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active-filter'));
        button.classList.add('active-filter');
        
        const filter = button.getAttribute('data-filter');

        if (filter === 'all') {
            projectGrid.classList.add('project-grid-scrollable');
        } else {
            projectGrid.classList.remove('project-grid-scrollable');
        }
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || filter === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

const menuToggleBtn = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
const navbar = document.getElementById('navbar-sticky');
menuToggleBtn.addEventListener('click', () => {
    const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
    navbar.classList.toggle('hidden');
});
