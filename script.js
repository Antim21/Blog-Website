//API Integration ---

const ideasLoader = document.getElementById('ideas-loader');
const ideasOutput = document.getElementById('ideas-output');
const generateIdeasBtn = document.getElementById('generate-ideas-btn');
const blogTopicInput = document.getElementById('blog-topic-input');

async function callGemini(prompt) {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.text) {
            return result.text;
        } else if (result.error) {
            throw new Error(result.error);
        } else {
            return "Sorry, I couldn't generate a response. Please try again.";
        }

    } catch (error) {
        console.error("API call error:", error);
        return `Error: ${error.message}`;
    }
}

// Format markdown-style text to HTML
function formatText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // **bold** to <strong>
        .replace(/\*(.*?)\*/g, '<em>$1</em>')             // *italic* to <em>
        .replace(/\n/g, '<br>');                          // newlines to <br>
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
    ideasOutput.innerHTML = formatText(result);
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
