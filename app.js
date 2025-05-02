document.addEventListener('DOMContentLoaded', () => {
    // Elements for login/home page
    const homePage = document.getElementById('home-page');
    const chatInterface = document.getElementById('chat-interface');
    const loginBtn = document.getElementById('login-btn');
    const guestLoginBtn = document.getElementById('guest-login-btn');
    
    // Elements for chat interface
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-btn');
    
    // API configuration
    const API_KEY = 'AIzaSyBUfDHAfHusFv34kZpBoEUA5Hq2irn-6TQiI';
    const API_BASE_URL = 'https://api.appfinder.example.com/v1/recommendations';
    
    // Sign up elements
    const signupLink = document.getElementById('signup-link');
    const signupModal = document.getElementById('signup-modal');
    const closeSignupModal = document.getElementById('close-signup-modal');
    const signupBtn = document.getElementById('signup-btn');
    const signupErrors = document.getElementById('signup-errors');
    
    // Sign up functionality
    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.classList.remove('hidden');
    });
    
    closeSignupModal.addEventListener('click', function() {
        signupModal.classList.add('hidden');
    });
    
    // Close modal when clicking outside the content
    signupModal.addEventListener('click', function(e) {
        if (e.target === signupModal) {
            signupModal.classList.add('hidden');
        }
    });
    
    signupBtn.addEventListener('click', handleSignup);
    
    function handleSignup() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const termsCheckbox = document.getElementById('terms-checkbox');
        
        // Reset any previous errors
        signupErrors.textContent = '';
        signupErrors.classList.remove('visible');
        
        // Validate inputs
        let hasErrors = false;
        let errorMessages = [];
        
        if (!name) {
            errorMessages.push('Please enter your name');
            hasErrors = true;
        }
        
        if (!email) {
            errorMessages.push('Please enter your email');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            errorMessages.push('Please enter a valid email address');
            hasErrors = true;
        }
        
        if (!password) {
            errorMessages.push('Please enter a password');
            hasErrors = true;
        } else if (password.length < 6) {
            errorMessages.push('Password must be at least 6 characters');
            hasErrors = true;
        }
        
        if (password !== confirmPassword) {
            errorMessages.push('Passwords do not match');
            hasErrors = true;
        }
        
        if (!termsCheckbox.checked) {
            errorMessages.push('You must agree to the Terms of Service and Privacy Policy');
            hasErrors = true;
        }
        
        if (hasErrors) {
            signupErrors.innerHTML = errorMessages.map(msg => `<div>${msg}</div>`).join('');
            signupErrors.classList.add('visible');
            return;
        }
        
        // If validation passes, proceed with signup
        displayLoadingEffect({ currentTarget: signupBtn });
        
        // Simulate signup process
        setTimeout(() => {
            signupModal.classList.add('hidden');
            showChatInterface();
            
            // Add welcome message after signup
            setTimeout(() => {
                addMessage(`Welcome ${name}! I can help you find the perfect apps. What are you looking for today?`, 'bot');
            }, 500);
        }, 1500);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Login functionality
    loginBtn.addEventListener('click', handleLogin);
    guestLoginBtn.addEventListener('click', handleGuestLogin);
    
    function handleLogin(event) {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (username === '' || password === '') {
            alert('Please enter both username and password');
            return;
        }
        
        displayLoadingEffect(event);
        setTimeout(() => {
            showChatInterface();
            // Add welcome message after login
            setTimeout(() => {
                addMessage("Hello! I can help you find the perfect apps. What are you looking for today? (e.g., productivity, fitness, entertainment, etc.)", 'bot');
            }, 500);
        }, 1500);
    }
    
    function handleGuestLogin(event) {
        displayLoadingEffect(event);
        setTimeout(() => {
            showChatInterface();
            // Add welcome message for guest
            setTimeout(() => {
                addMessage("Welcome guest! I can recommend apps in different categories. What are you interested in?", 'bot');
            }, 500);
        }, 1500);
    }
    
    // Add loading effect to the button when clicked
    function displayLoadingEffect(event) {
        // Add loading effect to the button that was clicked
        const clickedBtn = event.currentTarget;
        const buttonText = clickedBtn.querySelector('span');
        const loadingSpinner = clickedBtn.querySelector('.loading-spinner');
        
        // If the button has text and spinner elements
        if (buttonText && loadingSpinner) {
            buttonText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            // Fallback for buttons without those elements
            clickedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
        
        clickedBtn.disabled = true;
    }
    
    // Function to switch from home page to chat interface
    function showChatInterface() {
        homePage.classList.remove('active');
        homePage.classList.add('hidden');
        chatInterface.classList.remove('hidden');
        chatInterface.classList.add('active');
        
        // Focus on the input field
        userMessageInput.focus();
    }
    
    // Context of the current conversation
    let conversationContext = {
        lastQuestion: null,
        needsFollowUp: false,
        identifiedCategory: null,
        userPreference: null
    };
    
    // Add event listeners for chat functionality
    sendButton.addEventListener('click', handleUserMessage);
    userMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });
    
    // Add character counter functionality
    const charCount = document.getElementById('char-count');
    if (charCount) {
        userMessageInput.addEventListener('input', () => {
            const currentLength = userMessageInput.value.length;
            charCount.textContent = currentLength;
            
            // Optional: add visual feedback when approaching the limit
            if (currentLength > 200) {
                charCount.classList.add('near-limit');
            } else {
                charCount.classList.remove('near-limit');
            }
        });
    }
    
    // Improved conversation flow keywords
    const keywordMap = {
        "focus": ["focus", "concentrate", "distraction", "attention", "productivity", "study", "work"],
        "productivity": ["productivity", "task", "organize", "planning", "efficiency", "work", "time management", "todo", "schedule"],
        "fitness": ["fitness", "workout", "exercise", "health", "running", "gym", "training", "weight loss", "yoga"],
        "sports": ["sports", "football", "basketball", "soccer", "baseball", "tennis", "golf", "hockey", "scores", "stats", "teams", "players"],
        "meditation": ["meditation", "mindfulness", "stress", "anxiety", "relax", "calm", "sleep", "mental health", "peace"],
        "language": ["language", "learning", "speak", "vocabulary", "foreign", "study", "education", "english", "spanish"],
        "finance": ["finance", "money", "budget", "investing", "savings", "expense", "financial", "track spending", "bank"],
        "reading": ["reading", "books", "articles", "read later", "library", "ebooks", "audiobooks", "novel"],
        "music": ["music", "songs", "playlist", "artists", "discover", "listen", "audio", "streaming", "spotify"],
        "photography": ["photography", "photo", "camera", "editing", "filters", "pictures", "images", "instagram"],
        "social": ["social", "connect", "friends", "chat", "messaging", "social media", "social network", "facebook", "twitter"],
        "news": ["news", "articles", "updates", "latest", "breaking", "headlines", "current events", "newspaper"],
        "weather": ["weather", "forecast", "temperature", "rain", "sun", "clouds", "wind", "storm"],
        "shopping": ["shopping", "buy", "purchase", "products", "store", "retail", "e-commerce", "amazon"],
        "travel": ["travel", "trip", "vacation", "destination", "flights", "hotels", "booking", "airbnb"],
        "health": ["health", "fitness", "exercise", "nutrition", "sleep", "mental health", "wellness", "doctor"], 
        "education": ["education", "learn", "study", "school", "university", "courses", "online courses", "class"],
        "games": ["games", "play", "gaming", "fun", "mobile games", "puzzles", "fortnite", "minecraft"],
        "entertainment": ["entertainment", "movies", "tv", "shows", "streaming", "videos", "films", "cinema", "theater", "watch", "netflix"],
        "calculator": ["calculator", "math", "calculate", "computation", "convert", "unit conversion", "scientific", "numerical"],
        "dating": ["dating", "date", "relationship", "romance", "match", "dating app", "tinder", "bumble", "meet people"],
        "browser": ["browser", "internet", "web", "browse", "search", "google", "chrome", "firefox", "safari", "edge", "opera"],
        "ai": ["ai", "artificial intelligence", "chatbot", "chat", "chatgpt", "openai", "gpt", "gpt-3", "gpt-4", "machine learning", "ml"],
        "calendar": ["calendar", "schedule", "appointments", "events", "reminders", "time management", "organize", "plan", "scheduling", "planner"],
        "developer tools": ["developer tools", "code", "programming", "coding", "debug", "debugging", "development", "software", "git", "IDE"],
        "food": ["food", "cooking", "recipes", "ingredients", "nutrition", "healthy", "diet", "meal planning", "restaurants", "delivery"],
        "payment": ["payment", "money transfer", "banking", "finance", "wallet", "transactions", "send money", "mobile payment", "digital wallet"],
        "study": ["study techniques", "focus", "concentration", "memorization", "flashcards", "pomodoro", "spaced repetition", "mind maps", "note-taking", "revision"]
    };
    
    // Improved follow-up questions
    const followUpQuestions = {
        focus: "Would you prefer an app that blocks distractions or one that uses techniques like timers or music to help you focus?",
        productivity: "Are you looking for a simple to-do list or a more comprehensive project management tool?",
        fitness: "Are you interested in tracking specific activities like running or cycling, or more general workouts?",
        sports: "Which type of sports are you most interested in following? Team sports, scores, statistics, or fantasy leagues?",
        meditation: "Are you a beginner to meditation or looking for something more advanced?",
        language: "Which language are you interested in learning? Do you prefer game-like learning or conversation practice?",
        finance: "Are you looking to track expenses, budget better, or start investing?",
        reading: "Do you prefer e-books, audiobooks, or saving articles to read later?",
        music: "Are you looking to discover new music or create your own playlists?",
        photography: "Are you looking for basic editing tools or more professional features?",
        social: "Are you looking to connect with friends or discover new communities?",
        news: "Do you prefer breaking news alerts or more in-depth articles and analysis?",
        weather: "Do you need detailed forecasts with radar or a simple weather overview?",
        shopping: "Are you looking for general shopping or something more specialized?",
        travel: "Are you planning flights and hotels or looking for local experiences?",
        health: "Are you looking for fitness tracking, nutrition help, or overall wellness?",   
        education: "Are you interested in structured courses or more flexible learning?",  
        games: "Do you prefer casual games, puzzles, or more immersive experiences?",
        entertainment: "Are you looking for movies, TV shows, or other entertainment?",
        calculator: "Are you looking for a basic calculator, scientific calculator, or a specialized calculator for specific calculations?",
        dating: "Are you looking for casual dating, serious relationships, or apps with specific focus areas?",
        browser: "Do you prefer using a specific browser for browsing the web?",
        ai: "Do you prefer using a specific AI tool or platform?",
        calendar: "Do you prefer using a specific calendar tool or method for organizing your schedule?",
        developerTools: "Do you prefer using specific developer tools for coding or project management?",
        food: "Do you prefer using a specific food delivery service or cooking method?",
        payment: "Do you prefer using a specific payment method or platform for transactions?",
        study: "Do you prefer using specific study techniques or methods for learning?"
    };
    
    // Improved message processing
    function processUserMessage(message) {
        // If we're in a follow-up question context
        if (conversationContext.needsFollowUp) {
            conversationContext.userPreference = message;
            fetchRecommendations(conversationContext.identifiedCategory, message);
            conversationContext.needsFollowUp = false;
            return;
        }
        
        // Check for greetings first
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('hey') || lowerMessage.includes('hi') || 
            lowerMessage.includes('hello') || lowerMessage === 'hey') {
            removeTypingIndicator();
            addMessage("Hello! How can I help you today? I can recommend apps for productivity, fitness, entertainment, and more.", 'bot');
            return;
        }
        
        // Check for help request
        if (lowerMessage.includes('help') || lowerMessage === '?') {
            removeTypingIndicator();
            addMessage("I can recommend apps in these categories: " + 
                      Object.keys(keywordMap).join(', ') + 
                      ". Just tell me what you're looking for!", 'bot');
            return;
        }
        
        // Try to identify the category from the message
        const category = identifyCategoryFromMessage(message);
        
        if (category) {
            conversationContext.identifiedCategory = category;
            removeTypingIndicator();
            addMessage(followUpQuestions[category], 'bot');
            conversationContext.needsFollowUp = true;
        } else {
            // If no clear category is identified
            removeTypingIndicator();
            
            if (message.length > 30) {
                addMessage("I'm not quite sure what you're looking for. Could you tell me more specifically about the type of app you need? For example, you could say 'I want an app for fitness tracking' or 'I need help with productivity'.", 'bot');
            } else {
                addMessage("I can recommend apps in different categories like productivity, fitness, entertainment, and more. What would you like help with?", 'bot');
            }
        }
    }
    
    // Improved category identification
    function identifyCategoryFromMessage(message) {
        const messageLower = message.toLowerCase();
        
        // First check for exact matches
        for (const [category, keywords] of Object.entries(keywordMap)) {
            for (const keyword of keywords) {
                // Check for whole word matches
                if (new RegExp(`\\b${keyword}\\b`).test(messageLower)) {
                    return category;
                }
            }
        }
        
        // If no exact match, try partial matches for longer messages
        if (message.length > 15) {
            for (const [category, keywords] of Object.entries(keywordMap)) {
                for (const keyword of keywords) {
                    // Check if any keyword is a substring of words in the message
                    const words = messageLower.split(/\s+/);
                    for (const word of words) {
                        if (word.includes(keyword) || keyword.includes(word)) {
                            return category;
                        }
                    }
                }
            }
        }
        
        return null;
    }
    
    // Handle user messages
    function handleUserMessage() {
        const userMessage = userMessageInput.value.trim();
        if (userMessage === '') return;
        
        // Add user message to chat
        addMessage(userMessage, 'user');
        userMessageInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process the message and respond
        setTimeout(() => processUserMessage(userMessage), 800);
    }
    
    // Show a typing indicator to simulate API response time
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot', 'typing-indicator');
        
        const typingContent = document.createElement('div');
        typingContent.classList.add('message-content');
        typingContent.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
        
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Add a message to the chat interface
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Fetch recommendations from the API
    async function fetchRecommendations(category, userPreference) {
        try {
            // Simulate API response delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock API response based on category
            const mockApiResponse = getMockApiResponse(category, userPreference);
            
            // Process the response
            displayRecommendations(category, mockApiResponse);
            
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            removeTypingIndicator();
            addMessage("I'm sorry, I encountered an error while fetching recommendations. Please try again later.", 'bot');
        }
    }
    
    // Display recommendations in the chat
    function displayRecommendations(category, apps) {
        if (!apps || apps.length === 0) {
            removeTypingIndicator();
            addMessage("I'm sorry, I don't have recommendations for that category yet. Please try another category like productivity, entertainment, social, games, or education.", 'bot');
            return;
        }
        
        let responseBotMessage = `Here are some great ${category} apps I recommend:`;
        
        // Limit to 5 recommendations
        const recommendations = apps.slice(0, 5);
        
        // Add the recommendations HTML
        let recommendationsHTML = '';
        recommendations.forEach(app => {
            // Create platform-specific download buttons
            let downloadButtonsHTML = '<div class="download-buttons">';
            
            // Map platform names to their icons and download links
            app.platforms.forEach(platform => {
                let icon = '';
                let label = '';
                let buttonClass = '';
                
                // Set appropriate icon and label based on platform
                switch(platform) {
                    case 'iOS':
                        icon = 'fab fa-apple';
                        label = 'Download for iOS';
                        buttonClass = 'ios';
                        break;
                    case 'Android':
                        icon = 'fab fa-android';
                        label = 'Download for Android';
                        buttonClass = 'android';
                        break;
                    case 'Web':
                        icon = 'fas fa-globe';
                        label = 'Open Web App';
                        buttonClass = 'web';
                        break;
                    case 'Windows':
                        icon = 'fab fa-windows';
                        label = 'Download for Windows';
                        buttonClass = 'windows';
                        break;
                    default:
                        icon = 'fas fa-download';
                        label = `Download for ${platform}`;
                        buttonClass = 'default';
                }
                
                // Add download button for this platform
                downloadButtonsHTML += `
                    <a href="${app.link}" class="download-button ${buttonClass}" target="_blank">
                        <i class="${icon}"></i>${label}
                    </a>
                `;
            });
            
            downloadButtonsHTML += '</div>';
            
            recommendationsHTML += `
                <div class="app-recommendation">
                    <h3>${app.name}</h3>
                    <p><strong>Description:</strong> ${app.description}</p>
                    <p><strong>Why it's useful:</strong> ${app.why}</p>
                    <div class="platforms">
                        Available on: ${app.platforms.map(platform => `<span class="platform-tag">${platform}</span>`).join(' ')}
                    </div>
                    ${downloadButtonsHTML}
                    <p><a href="${app.link}" target="_blank">Learn more about ${app.name}</a></p>
                </div>
            `;
        });
        
        // Add a message asking if they want more suggestions
        responseBotMessage += recommendationsHTML;
        responseBotMessage += `<p>I hope these suggestions help! Do you want recommendations for any other categories?</p>`;
        
        removeTypingIndicator();
        addMessage(responseBotMessage, 'bot');
    }
    
    // Get mock API response for demonstration purposes
    function getMockApiResponse(category, userPreference) {
        // This simulates different responses based on user preferences
        // In a real application, this would come from the actual API
        
        const mockData = {
            focus: [
                {
                    name: "Freedom",
                    description: "Block distracting websites and apps across all your devices.",
                    why: "Creates distraction-free environments to help you focus deeply on important work.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://freedom.to/"
                },
                {
                    name: "Focus@Will",
                    description: "Scientifically optimized music to help you focus.",
                    why: "Uses neuroscience-based music tracks to improve concentration and focus.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.focusatwill.com/"
                },
                {
                    name: "Forest",
                    description: "Stay focused by planting virtual trees that grow while you work and die if you leave the app.",
                    why: "Combines focus techniques with a rewarding visual system to build better habits.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.forestapp.cc/"
                },
                {
                    name: "Flipd",
                    description: "Lock away distracting apps for a predetermined period of time.",
                    why: "Popular in Indian colleges for forcing focus during study sessions by temporarily blocking apps.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.flipdapp.co/"
                },
                {
                    name: "YourHour",
                    description: "Indian-made app that tracks phone usage and helps reduce screen time.",
                    why: "Detailed analytics and gentle notifications to help users in India be more mindful about device use.",
                    platforms: ["Android"],
                    link: "https://yourhour.app/"
                }
            ],
            productivity: [
                {
                    name: "Todoist",
                    description: "Powerful task manager with natural language input, projects, labels, and priority levels.",
                    why: "Helps you organize tasks efficiently with smart scheduling and categorization.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://todoist.com/"
                },
                {
                    name: "Notion",
                    description: "All-in-one workspace that combines notes, tasks, wikis, and databases.",
                    why: "Extremely flexible platform that can be customized for almost any workflow.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.notion.so/"
                },
                {
                    name: "Trello",
                    description: "Visual project management with boards, lists, and cards to organize anything.",
                    why: "Simple yet powerful visual organization system based on Kanban methodology.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://trello.com/"
                },
                {
                    name: "Microsoft To Do",
                    description: "Simple, intelligent to-do list app with task prioritization and reminders.",
                    why: "Popular in Indian work environments with Microsoft integration and easy task sharing.",
                    platforms: ["iOS", "Android", "Web", "Windows"],
                    link: "https://todo.microsoft.com/"
                },
                {
                    name: "Any.do",
                    description: "Task management app with calendar integration and smart reminders.",
                    why: "Widely used in India for its simplicity and effective location-based reminders.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.any.do/"
                }
            ],
            fitness: [
                {
                    name: "Strava",
                    description: "Activity tracker focused on running and cycling with social features.",
                    why: "Combines detailed activity tracking with community challenges and motivation.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.strava.com/"
                },
                {
                    name: "Nike Training Club",
                    description: "Free workouts and personalized training programs.",
                    why: "High-quality guided workouts for all levels with expert coaching.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.nike.com/ntc-app"
                },
                {
                    name: "MyFitnessPal",
                    description: "Nutrition tracking combined with workout logging.",
                    why: "Comprehensive health tracking with the largest food database available.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.myfitnesspal.com/"
                },
                {
                    name: "Cure.fit",
                    description: "Indian fitness app offering live workouts, meditation, and healthy meals.",
                    why: "Comprehensive wellness platform created in India with workouts tailored for Indian users.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.cure.fit/"
                },
                {
                    name: "HealthifyMe",
                    description: "Indian health and fitness app with nutrition tracking and AI coach.",
                    why: "Designed specifically for Indian diets with extensive database of Indian foods and recipes.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.healthifyme.com/"
                }
            ],
            meditation: [
                {
                    name: "Headspace",
                    description: "Guided meditation and mindfulness practices.",
                    why: "Makes meditation accessible with structured courses and short exercises.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.headspace.com/"
                },
                {
                    name: "Calm",
                    description: "Meditation, sleep stories, and relaxation exercises.",
                    why: "Variety of content to reduce anxiety, improve sleep, and build mindfulness.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.calm.com/"
                },
                {
                    name: "Insight Timer",
                    description: "Free library of guided meditations and music.",
                    why: "Largest free meditation library with content from thousands of teachers.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://insighttimer.com/"
                },
                {
                    name: "Black Lotus",
                    description: "Meditation app created by Om Swami, an Indian monk and meditation teacher.",
                    why: "Meditation content specifically designed for Indian users with traditional techniques.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.blacklotus.app/"
                },
                {
                    name: "ThinkRight.me",
                    description: "Indian meditation app with guided sessions in multiple Indian languages.",
                    why: "Practices based on ancient Indian wisdom with focus on mindfulness and stress reduction.",
                    platforms: ["iOS", "Android"],
                    link: "https://thinkright.me/"
                }
            ],
            language: [
                {
                    name: "Duolingo",
                    description: "Language learning app using gamification to teach over 40 languages.",
                    why: "Makes learning fun with bite-sized lessons and a motivating streak system.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.duolingo.com/"
                },
                {
                    name: "Babbel",
                    description: "Language learning app focused on practical conversation skills.",
                    why: "Designed by linguists with a focus on helping you speak confidently.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.babbel.com/"
                },
                {
                    name: "Tandem",
                    description: "Language exchange app connecting you with native speakers.",
                    why: "Practice with real people through text, voice, and video calls.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.tandem.net/"
                },
                {
                    name: "Multibhashi",
                    description: "Indian language learning app focusing on regional languages like Hindi, Tamil, and Bengali.",
                    why: "Learn Indian languages with content specifically designed for Indian users.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://multibhashi.com/"
                },
                {
                    name: "Hello English",
                    description: "App for Indians to learn English through translations in 22 Indian languages.",
                    why: "Specifically designed for Indian users with contextual learning adapted to Indian culture.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://helloenglish.com/"
                }
            ],
            finance: [
                {
                    name: "Mint",
                    description: "Personal finance app that tracks spending, creates budgets, and monitors bills.",
                    why: "Comprehensive financial overview with automatic categorization of expenses.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://mint.intuit.com/"
                },
                {
                    name: "YNAB (You Need A Budget)",
                    description: "Budgeting app based on zero-based budgeting philosophy.",
                    why: "Helps you give every dollar a job and break the paycheck-to-paycheck cycle.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.youneedabudget.com/"
                },
                {
                    name: "Robinhood",
                    description: "Commission-free investing app for stocks, ETFs, and cryptocurrencies.",
                    why: "Makes investing accessible with a simple interface and no minimum account balance.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://robinhood.com/"
                },
                {
                    name: "Groww",
                    description: "Indian investment platform for stocks, mutual funds, and gold.",
                    why: "Zero-commission investing platform designed for first-time Indian investors.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://groww.in/"
                },
                {
                    name: "Walnut",
                    description: "Indian expense manager that automatically tracks spending from SMS alerts.",
                    why: "Designed specifically for the Indian market with bill reminders and spending insights.",
                    platforms: ["Android"],
                    link: "https://www.getwalnut.com/"
                }
            ],
            reading: [
                {
                    name: "Kindle",
                    description: "E-book reader with access to millions of titles and synchronized reading.",
                    why: "Huge selection of books with features like instant dictionary lookup and note-taking.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.amazon.com/kindle-dbs/fd/kcp"
                },
                {
                    name: "Audible",
                    description: "Audiobook service with the world's largest selection of titles.",
                    why: "Listen to books narrated by professional actors while commuting or exercising.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.audible.com/"
                },
                {
                    name: "Pocket",
                    description: "Save articles, videos, and stories from any publication, page, or app.",
                    why: "Collects content to read later, even offline, with a clean, distraction-free view.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://getpocket.com/"
                },
                {
                    name: "Pratilipi",
                    description: "India's largest digital reading platform with content in multiple Indian languages.",
                    why: "Huge collection of stories, books, and articles written by Indian authors in regional languages.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://pratilipi.com/"
                },
                {
                    name: "Storytel",
                    description: "Audiobook and e-book streaming service with extensive Indian content.",
                    why: "Large library of audiobooks in Hindi, Tamil, Marathi and other Indian languages.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.storytel.com/in/en/"
                }
            ],
            music: [
                {
                    name: "Spotify",
                    description: "Music streaming service with millions of songs and podcasts.",
                    why: "Excellent personalized recommendations and playlists for music discovery.",
                    platforms: ["iOS", "Android", "Web", "Smart Speakers"],
                    link: "https://www.spotify.com/"
                },
                {
                    name: "Apple Music",
                    description: "Music streaming service with over 75 million songs.",
                    why: "Deep integration with Apple devices and curated playlists by music experts.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.apple.com/apple-music/"
                },
                {
                    name: "SoundCloud",
                    description: "Music streaming platform with a focus on independent artists.",
                    why: "Discover emerging artists and genres you won't find on mainstream platforms.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://soundcloud.com/"
                },
                {
                    name: "JioSaavn",
                    description: "Indian music streaming service with extensive Bollywood and regional music catalog.",
                    why: "Comprehensive collection of Indian music across multiple languages and genres.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.jiosaavn.com/"
                },
                {
                    name: "Gaana",
                    description: "Indian music streaming app with millions of songs in over 30 languages.",
                    why: "Popular platform for Bollywood, regional, and international music with lyrics.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://gaana.com/"
                }
            ],
            photography: [
                {
                    name: "Adobe Lightroom",
                    description: "Photo editing and organization tool with professional features.",
                    why: "Powerful editing capabilities with cloud storage and cross-device syncing.",
                    platforms: ["iOS", "Android", "Web", "Desktop"],
                    link: "https://www.adobe.com/products/photoshop-lightroom.html"
                },
                {
                    name: "VSCO",
                    description: "Photo editing app with high-quality presets and creative tools.",
                    why: "Beautiful, film-inspired filters and a supportive creative community.",
                    platforms: ["iOS", "Android"],
                    link: "https://vsco.co/"
                },
                {
                    name: "Snapseed",
                    description: "Professional photo editor developed by Google.",
                    why: "Powerful editing tools with an intuitive interface, completely free.",
                    platforms: ["iOS", "Android"],
                    link: "https://snapseed.online/"
                },
                {
                    name: "PicsArt",
                    description: "All-in-one photo and video editing app with creative tools.",
                    why: "Very popular in India for creating stylized social media content with Indian-themed stickers.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://picsart.com/"
                },
                {
                    name: "Pixlr",
                    description: "Feature-rich photo editor with AI-powered tools.",
                    why: "Widely used in India for quick yet professional photo edits without requiring a subscription.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://pixlr.com/"
                }
            ],
            social: [
                {
                    name: "Discord",
                    description: "Communication platform designed for creating communities.",
                    why: "Great for interest-based groups with text, voice, and video chat features.",
                    platforms: ["iOS", "Android", "Web", "Desktop"],
                    link: "https://discord.com/"
                },
                {
                    name: "Meetup",
                    description: "Platform for finding and building local communities.",
                    why: "Connects you with people who share your interests for in-person or online events.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.meetup.com/"
                },
                {
                    name: "Clubhouse",
                    description: "Social audio app for casual, drop-in audio conversations.",
                    why: "Listen in or participate in discussions on various topics with diverse voices.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.clubhouse.com/"
                }
            ],
            news: [
                {
                    name: "Flipboard",
                    description: "Personalized news aggregator that collects content from social media, news sources, and other websites.",
                    why: "Creates a personalized magazine-like experience based on your interests.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://flipboard.com/"
                },
                {
                    name: "Apple News",
                    description: "News aggregator app that features top stories selected by editors and personalized recommendations.",
                    why: "Clean interface with human-curated content and a focus on privacy.",
                    platforms: ["iOS"],
                    link: "https://www.apple.com/apple-news/"
                },
                {
                    name: "Google News",
                    description: "News aggregator that organizes news from sources worldwide.",
                    why: "Offers a comprehensive view of headlines with multiple perspectives on the same story.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://news.google.com/"
                },
                {
                    name: "Inshorts",
                    description: "Indian news app that delivers news in 60-word summaries.",
                    why: "Extremely popular in India for quick news consumption in a compact format.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.inshorts.com/"
                },
                {
                    name: "Dailyhunt",
                    description: "Indian news aggregator that supports content in 14+ regional languages.",
                    why: "Most popular news app in India for regional language content with personalized recommendations.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://m.dailyhunt.in/"
                }
            ],
            weather: [
                {
                    name: "Dark Sky",
                    description: "Hyperlocal weather app with minute-by-minute forecasts.",
                    why: "Incredibly accurate precipitation predictions for your exact location.",
                    platforms: ["iOS", "Android"],
                    link: "https://darksky.net/"
                },
                {
                    name: "AccuWeather",
                    description: "Weather forecasting service with MinuteCast precipitation forecasts.",
                    why: "Detailed forecasts with lifestyle indices like air quality and UV index.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.accuweather.com/"
                },
                {
                    name: "Weather Underground",
                    description: "Weather service with personal weather stations for hyperlocal data.",
                    why: "Access to a network of over 250,000 personal weather stations for precise data.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.wunderground.com/"
                },
                {
                    name: "Mausam",
                    description: "Official weather app by the Indian Meteorological Department.",
                    why: "Authentic weather data directly from India's official meteorological agency with alerts.",
                    platforms: ["Android"],
                    link: "https://play.google.com/store/apps/details?id=com.imd.masuam"
                },
                {
                    name: "Weather & Radar",
                    description: "Weather forecasting app with radar visualization and alerts.",
                    why: "Popular in India for providing accurate monsoon predictions and severe weather warnings.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.weatherandradar.in/"
                }
            ],
            health: [
                {
                    name: "MyFitnessPal",
                    description: "Nutrition tracking app with a vast food database.",
                    why: "Helps maintain dietary goals with calorie tracking and nutritional insights.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.myfitnesspal.com/"
                },
                {
                    name: "Sleep Cycle",
                    description: "Sleep tracker that analyzes sleep patterns and wakes you in light sleep.",
                    why: "Wake up feeling more refreshed by timing alarms to your sleep cycles.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.sleepcycle.com/"
                },
                {
                    name: "Calm",
                    description: "Meditation and sleep app with guided sessions and relaxing sounds.",
                    why: "Reduces stress and improves sleep with guided meditations and sleep stories.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.calm.com/"
                },
                {
                    name: "1mg",
                    description: "Indian healthcare platform for medicine delivery and health information.",
                    why: "Most popular medicine delivery app in India with health records and doctor consultations.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.1mg.com/"
                },
                {
                    name: "Practo",
                    description: "Indian healthcare app for booking doctor appointments and consultations.",
                    why: "Leading platform in India for finding doctors, booking appointments, and online consultations.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.practo.com/"
                }
            ],
            education: [
                {
                    name: "Coursera",
                    description: "Online learning platform offering courses, specializations, and degrees from top universities and companies.",
                    why: "Access to high-quality education from prestigious institutions with flexible scheduling.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.coursera.org/"
                },
                {
                    name: "Duolingo",
                    description: "Language learning app using gamification to teach over 40 languages.",
                    why: "Makes learning new languages fun with bite-sized lessons and a motivating streak system.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.duolingo.com/"
                },
                {
                    name: "Khan Academy",
                    description: "Free educational platform with courses in math, science, computing, arts, and more.",
                    why: "Comprehensive, self-paced learning with practice exercises and instructional videos.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.khanacademy.org/"
                },
                {
                    name: "BYJU'S",
                    description: "India's largest educational technology company with interactive video lessons.",
                    why: "Most popular Indian learning app with content tailored to Indian curriculum and exams.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://byjus.com/"
                },
                {
                    name: "Unacademy",
                    description: "Indian online learning platform focusing on competitive exam preparation.",
                    why: "Comprehensive preparation for Indian competitive exams like UPSC, JEE, NEET, and more.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://unacademy.com/"
                }
            ],
            games: [
                {
                    name: "Wordscapes",
                    description: "Word puzzle game combining crosswords and word search.",
                    why: "Challenging brain exercise with beautiful landscape backgrounds.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.peoplefun.com/games/wordscapes/"
                },
                {
                    name: "Among Us",
                    description: "Online multiplayer social deduction game set in space.",
                    why: "Fun team-based gameplay that tests your deception and detective skills.",
                    platforms: ["iOS", "Android", "PC", "Console"],
                    link: "https://innersloth.com/games/among-us/"
                },
                {
                    name: "Monument Valley",
                    description: "Puzzle game with beautiful, impossible architecture and optical illusions.",
                    why: "Stunning visuals with clever puzzles and a peaceful, meditative experience.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.monumentvalleygame.com/"
                },
                {
                    name: "Ludo King",
                    description: "Digital version of the traditional Indian board game Ludo.",
                    why: "Most downloaded game in India, based on the classic Indian board game.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.ludoking.com/"
                },
                {
                    name: "BGMI (Battlegrounds Mobile India)",
                    description: "Indian version of PUBG Mobile battle royale game.",
                    why: "Custom-tailored for the Indian market with massive player base across the country.",
                    platforms: ["Android", "iOS"],
                    link: "https://www.battlegroundsmobileindia.com/"
                }
            ],
            entertainment: [
                {
                    name: "Netflix",
                    description: "Subscription service for streaming movies, TV shows, and original content.",
                    why: "Huge library of content with personalized recommendations and no ads.",
                    platforms: ["iOS", "Android", "Web", "Smart TVs"],
                    link: "https://www.netflix.com/"
                },
                {
                    name: "Disney+",
                    description: "Streaming service featuring Disney, Pixar, Marvel, Star Wars, and National Geographic content.",
                    why: "Family-friendly content with iconic franchises and exclusive originals.",
                    platforms: ["iOS", "Android", "Web", "Smart TVs"],
                    link: "https://www.disneyplus.com/"
                },
                {
                    name: "Spotify",
                    description: "Music and podcast streaming service with millions of tracks.",
                    why: "Personalized playlists, podcasts, and discovery features for all your audio needs.",
                    platforms: ["iOS", "Android", "Web", "Smart Speakers"],
                    link: "https://www.spotify.com/"
                }
            ],
            calculator: [
                {
                    name: "PCalc",
                    description: "Powerful scientific calculator with extensive customization options.",
                    why: "Offers RPN mode, unit conversions, constants, and tape history with incredible precision.",
                    platforms: ["iOS", "macOS"],
                    link: "https://pcalc.com/"
                },
                {
                    name: "Desmos",
                    description: "Graphing calculator with advanced plotting capabilities.",
                    why: "Visualize functions and data with beautiful interactive graphs for free.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.desmos.com/"
                },
                {
                    name: "Currency Converter Plus",
                    description: "Currency and unit converter with over 160 currencies and 70 units.",
                    why: "Real-time exchange rates with offline mode and customizable dashboard.",
                    platforms: ["iOS", "Android"],
                    link: "https://currencyconverterplus.com/"
                },
                {
                    name: "EMI Calculator India",
                    description: "Loan calculator specifically designed for Indian financial institutions.",
                    why: "Popular in India for calculating EMIs on home loans, car loans, and personal loans.",
                    platforms: ["Android"],
                    link: "https://play.google.com/store/apps/details?id=com.geniusvision.emicalculator"
                },
                {
                    name: "GST Calculator India",
                    description: "GST tax calculator tailored for Indian tax rates and regulations.",
                    why: "Essential tool for Indian businesses and consumers for calculating taxes accurately.",
                    platforms: ["Android"],
                    link: "https://play.google.com/store/apps/details?id=com.onlinetools.gstcalculator"
                }
            ],
            dating: [
                {
                    name: "Hinge",
                    description: "Relationship-focused dating app designed to be deleted once you find a match.",
                    why: "Thoughtful prompts and detailed profiles to help find meaningful connections.",
                    platforms: ["iOS", "Android"],
                    link: "https://hinge.co/"
                },
                {
                    name: "Bumble",
                    description: "Dating app where women make the first move in heterosexual matches.",
                    why: "Empowers users to create meaningful connections with time-limited matches.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://bumble.com/"
                },
                {
                    name: "OkCupid",
                    description: "Dating app that uses in-depth questionnaires to find compatible matches.",
                    why: "Detailed matching system that goes beyond swiping to find compatible personalities.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.okcupid.com/"
                },
                {
                    name: "Aisle",
                    description: "Indian dating app designed for serious relationships and marriages.",
                    why: "Specifically designed for the Indian audience focusing on long-term relationships.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.aisle.co/"
                },
                {
                    name: "Truly Madly",
                    description: "Indian dating app with extensive verification and trust score system.",
                    why: "Created for Indian users with cultural sensitivity and verification to ensure safety.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.trulymadly.com/"
                }
            ],
            sports: [
                {
                    name: "ESPN",
                    description: "Comprehensive sports news, scores, and highlights for all major sports.",
                    why: "Real-time scores, breaking news, and expert analysis across all major leagues and events.",
                    platforms: ["iOS", "Android", "Web", "Smart TVs"],
                    link: "https://www.espn.com/"
                },
                {
                    name: "theScore",
                    description: "Sports news and scores app with personalized feeds for your favorite teams.",
                    why: "Highly customizable experience with lightning-fast score updates and betting information.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.thescore.com/"
                },
                {
                    name: "Yahoo Fantasy Sports",
                    description: "Fantasy sports platform covering football, basketball, baseball, and more.",
                    why: "Robust fantasy league management with live scoring, detailed stats, and expert advice.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://sports.yahoo.com/fantasy/"
                },
                {
                    name: "Dream11",
                    description: "India's largest fantasy sports platform focusing on cricket, football, and kabaddi.",
                    why: "Most popular fantasy sports app in India with official IPL partnership.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.dream11.com/"
                },
                {
                    name: "Cricbuzz",
                    description: "Cricket news, scores, and statistics app focused on Indian cricket.",
                    why: "India's most popular cricket app with ball-by-ball commentary and video highlights.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.cricbuzz.com/"
                }
            ],
            browser: [
                {
                    name: "Google Chrome",
                    description: "Fast, secure web browser with extensive extension support.",
                    why: "Most popular browser in India with data-saver mode and seamless integration with Google services.",
                    platforms: ["iOS", "Android", "Windows", "macOS", "Linux"],
                    link: "https://www.google.com/chrome/"
                },
                {
                    name: "UC Browser",
                    description: "Fast browser with data compression technology popular in India.",
                    why: "Built-in ad blocker, data saving features, and fast download speeds for Indian internet conditions.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.ucweb.com/"
                },
                {
                    name: "Jio Browser",
                    description: "Lightweight browser optimized for Indian users with regional language support.",
                    why: "Support for multiple Indian languages and optimized for Jio network users.",
                    platforms: ["Android"],
                    link: "https://play.google.com/store/apps/details?id=com.jio.web"
                },
                {
                    name: "Mozilla Firefox",
                    description: "Privacy-focused web browser with strong customization options.",
                    why: "Strong privacy protections and good performance on older devices common in India.",
                    platforms: ["iOS", "Android", "Windows", "macOS", "Linux"],
                    link: "https://www.mozilla.org/firefox/"
                },
                {
                    name: "Opera Mini",
                    description: "Ultra-lightweight browser with extreme data saving capabilities.",
                    why: "Extremely popular in rural India with data savings up to 90% and offline feature for unreliable connections.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.opera.com/mini"
                }
            ],
            ai: [
                {
                    name: "Krutrim AI",
                    description: "India's first AI chatbot with support for Indian languages.",
                    why: "Built specifically for the Indian market with support for Hindi and other regional languages.",
                    platforms: ["Web", "Android coming soon"],
                    link: "https://krutrim.ai/"
                },
                {
                    name: "ChatGPT",
                    description: "AI chat assistant that can answer questions and help with various tasks.",
                    why: "Versatile AI capable of writing, coding, answering questions, and creative tasks.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://chat.openai.com/"
                },
                {
                    name: "Bing AI",
                    description: "Microsoft's AI assistant with web search capabilities.",
                    why: "Free access to advanced AI with real-time information and search integration.",
                    platforms: ["Web", "Edge browser"],
                    link: "https://www.bing.com/new"
                },
                {
                    name: "NITI Aayog DigiBoxx AI",
                    description: "AI platform backed by Indian government for document analysis and insights.",
                    why: "Developed in India with focus on Indian business and governance use cases.",
                    platforms: ["Web"],
                    link: "https://www.digiboxx.com/"
                },
                {
                    name: "Haptik",
                    description: "Indian conversational AI platform for business solutions.",
                    why: "Built in India with expertise in Indian languages and customer service automation.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.haptik.ai/"
                }
            ],
            calendar: [
                {
                    name: "Google Calendar",
                    description: "Full-featured calendar app with excellent sharing and integration capabilities.",
                    why: "Seamless integration with Gmail and Google Workspace with intuitive scheduling.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://calendar.google.com/"
                },
                {
                    name: "Microsoft Outlook Calendar",
                    description: "Calendar app integrated with Outlook email and Microsoft 365.",
                    why: "Strong integration with Microsoft services and business-oriented features.",
                    platforms: ["iOS", "Android", "Web", "Windows", "macOS"],
                    link: "https://outlook.office.com/"
                },
                {
                    name: "Any.do",
                    description: "Combined calendar and task manager with smart reminders.",
                    why: "Unified view of tasks and calendar events with location-based reminders.",
                    platforms: ["iOS", "Android", "Web", "macOS", "Windows"],
                    link: "https://www.any.do/"
                }
            ],
            "developer tools": [
                {
                    name: "Visual Studio Code",
                    description: "Lightweight but powerful code editor with extensive extension support.",
                    why: "Massive extension ecosystem with excellent debugging and Git integration.",
                    platforms: ["Windows", "macOS", "Linux", "Web"],
                    link: "https://code.visualstudio.com/"
                },
                {
                    name: "GitHub",
                    description: "Code hosting and collaboration platform with version control.",
                    why: "Industry standard for repositories with project management and CI/CD features.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://github.com/"
                },
                {
                    name: "Postman",
                    description: "API development and testing platform with collaboration features.",
                    why: "Makes API testing and documentation seamless with powerful automation.",
                    platforms: ["Windows", "macOS", "Linux", "Web"],
                    link: "https://www.postman.com/"
                },
                {
                    name: "Figma",
                    description: "Collaborative design and prototyping tool popular with Indian developers and designers.",
                    why: "Cloud-based design platform widely used in Indian tech companies for UI/UX design.",
                    platforms: ["Web", "Windows", "macOS"],
                    link: "https://www.figma.com/"
                },
                {
                    name: "PyCharm Community",
                    description: "Free Python IDE with code analysis and debugging tools.",
                    why: "Popular among Indian developers and students for Python development and data science projects.",
                    platforms: ["Windows", "macOS", "Linux"],
                    link: "https://www.jetbrains.com/pycharm/"
                }
            ],
            food: [
                {
                    name: "Zomato",
                    description: "Food delivery and restaurant discovery platform.",
                    why: "India's leading food delivery app with extensive restaurant coverage and Zomato Pro benefits.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.zomato.com/"
                },
                {
                    name: "Swiggy",
                    description: "Online food ordering and delivery platform.",
                    why: "Quick food delivery with live tracking and Swiggy Instamart for groceries.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.swiggy.com/"
                },
                {
                    name: "EazyDiner",
                    description: "Restaurant reservation and dining offers platform.",
                    why: "India's leading table booking app with exclusive deals and discounts.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.eazydiner.com/"
                },
                {
                    name: "BigBasket",
                    description: "Online grocery delivery service with wide coverage in India.",
                    why: "India's largest online supermarket with fresh produce and everyday essentials.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.bigbasket.com/"
                },
                {
                    name: "Behrouz Biryani",
                    description: "Specialized food delivery app for premium biryani.",
                    why: "Popular cloud kitchen brand in India focused exclusively on authentic royal biryani.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.behrouzbiryani.com/"
                }
            ],
            payment: [
                {
                    name: "Google Pay (GPay)",
                    description: "UPI-based payment app for instant money transfers and bill payments.",
                    why: "Widely used in India for fast UPI transactions with cashback rewards and utility payments.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://pay.google.com/"
                },
                {
                    name: "PhonePe",
                    description: "Digital payment platform for UPI transfers, recharges, and financial services.",
                    why: "India's most popular UPI app with comprehensive bill payments and money transfer options.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.phonepe.com/"
                },
                {
                    name: "Paytm",
                    description: "Digital wallet and payment service with extensive merchant coverage.",
                    why: "All-in-one payment solution for mobile recharges, travel bookings, and shopping in India.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://paytm.com/"
                },
                {
                    name: "BHIM",
                    description: "Government-backed UPI payment app developed by NPCI.",
                    why: "Official UPI app with direct bank account integration and widespread acceptance.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.npci.org.in/what-we-do/bhim/product-overview"
                },
                {
                    name: "Amazon Pay",
                    description: "Digital payment service integrated with Amazon's ecosystem.",
                    why: "Seamless payments for Amazon and partner merchants with cashback and EMI options.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.amazonpay.in/"
                }
            ],
            shopping: [
                {
                    name: "Flipkart",
                    description: "India's leading e-commerce platform with wide product range.",
                    why: "Extensive selection of products with competitive prices and reliable delivery.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.flipkart.com/"
                },
                {
                    name: "Amazon India",
                    description: "Online marketplace with millions of products and Prime benefits.",
                    why: "Huge selection with customer reviews and fast delivery with Prime membership.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.amazon.in/"
                },
                {
                    name: "Myntra",
                    description: "Fashion e-commerce platform with clothing, accessories, and footwear.",
                    why: "India's largest fashion platform with exclusive brands and personalized recommendations.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.myntra.com/"
                },
                {
                    name: "Meesho",
                    description: "Social commerce platform focused on small businesses and resellers.",
                    why: "Budget-friendly products with entrepreneurship opportunities for resellers.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://meesho.com/"
                },
                {
                    name: "Tata CLiQ",
                    description: "Multi-category e-commerce platform from the Tata Group.",
                    why: "Authentic products with brand guarantees and luxury shopping options.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.tatacliq.com/"
                }
            ],
            travel: [
                {
                    name: "MakeMyTrip",
                    description: "India's leading travel booking platform for flights, hotels, and packages.",
                    why: "Comprehensive travel booking with special deals and loyalty rewards for Indian travelers.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.makemytrip.com/"
                },
                {
                    name: "IRCTC Rail Connect",
                    description: "Official Indian Railways app for train ticket booking.",
                    why: "Authoritative source for train bookings with seat availability and PNR status.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.irctc.co.in/nget/train-search"
                },
                {
                    name: "Ola Cabs",
                    description: "Ride-hailing service with various transportation options.",
                    why: "India's homegrown alternative to Uber with extensive coverage in cities and towns.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.olacabs.com/"
                },
                {
                    name: "redBus",
                    description: "Bus ticket booking platform with extensive route coverage.",
                    why: "India's largest bus ticketing platform with interstate and intercity routes.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.redbus.in/"
                },
                {
                    name: "Yatra",
                    description: "Travel booking service for flights, hotels, holidays, and more.",
                    why: "Comprehensive travel platform with domestic focus and attractive offers.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.yatra.com/"
                }
            ],
            entertainment: [
                {
                    name: "Disney+ Hotstar",
                    description: "India's leading streaming platform with movies, TV shows, and live sports.",
                    why: "Access to Indian content, international shows, and live cricket matches including IPL.",
                    platforms: ["iOS", "Android", "Web", "Smart TVs"],
                    link: "https://www.hotstar.com/"
                },
                {
                    name: "JioTV",
                    description: "Live TV streaming app with 900+ channels across different languages.",
                    why: "Free for Jio users with extensive regional content and TV channel coverage.",
                    platforms: ["iOS", "Android"],
                    link: "https://www.jio.com/en-in/apps/jio-tv"
                },
                {
                    name: "MX Player",
                    description: "Video player and streaming platform with original content.",
                    why: "Free streaming service with strong regional content library and powerful video playback.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.mxplayer.in/"
                },
                {
                    name: "ZEE5",
                    description: "Indian streaming platform with original content and live TV.",
                    why: "Wide range of content in 12 Indian languages with ZEE originals and TV shows.",
                    platforms: ["iOS", "Android", "Web", "Smart TVs"],
                    link: "https://www.zee5.com/"
                },
                {
                    name: "SonyLIV",
                    description: "Streaming service with Sony network content and live sports.",
                    why: "Exclusive sports coverage including UEFA Champions League and original Indian content.",
                    platforms: ["iOS", "Android", "Web", "Smart TVs"],
                    link: "https://www.sonyliv.com/"
                }
            ],
            social: [
                {
                    name: "WhatsApp",
                    description: "Messaging app with end-to-end encryption for secure communication.",
                    why: "The most widely used messaging app in India for personal and business communication.",
                    platforms: ["iOS", "Android", "Web", "Desktop"],
                    link: "https://www.whatsapp.com/"
                },
                {
                    name: "ShareChat",
                    description: "Indian social media platform focused on regional content and languages.",
                    why: "Connect with others in 15+ Indian languages with content tailored to local interests.",
                    platforms: ["iOS", "Android"],
                    link: "https://sharechat.com/"
                },
                {
                    name: "Instagram",
                    description: "Photo and video sharing social networking platform.",
                    why: "Popular platform in India for following influencers, brands, and sharing personal content.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.instagram.com/"
                },
                {
                    name: "Moj",
                    description: "Short video creation and sharing platform with Indian content focus.",
                    why: "Create and discover trending short videos with special effects and music.",
                    platforms: ["iOS", "Android"],
                    link: "https://mojapp.in/"
                },
                {
                    name: "Telegram",
                    description: "Cloud-based messaging app with a focus on security and speed.",
                    why: "Feature-rich messaging with large group support, channels, and extensive customization.",
                    platforms: ["iOS", "Android", "Web", "Desktop"],
                    link: "https://telegram.org/"
                }
            ],
            "student essentials": [
                {
                    name: "Unacademy",
                    description: "Online learning platform for competitive exam preparation in India.",
                    why: "Comprehensive courses for JEE, NEET, UPSC, banking and other competitive exams with top educators.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://unacademy.com/"
                },
                {
                    name: "BYJU'S",
                    description: "Learning app with interactive video lessons and personalized learning journeys.",
                    why: "Visualized concepts with adaptive learning paths for K-12, JEE, NEET and other exams.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://byjus.com/"
                },
                {
                    name: "Doubtnut",
                    description: "Doubt-solving app using picture recognition for math and science problems.",
                    why: "Take a photo of any question and instantly get video solutions in multiple languages.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://doubtnut.com/"
                },
                {
                    name: "Chegg",
                    description: "Online tutoring, homework help, and textbook rental platform.",
                    why: "24/7 homework help, textbook solutions, and expert Q&A for challenging problems.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.chegg.com/"
                },
                {
                    name: "Scribd",
                    description: "Digital library with books, audiobooks, magazines, and documents.",
                    why: "Access millions of e-books, audiobooks, research papers, and academic documents.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.scribd.com/"
                }
            ],
            study: [
                {
                    name: "Vedantu",
                    description: "Live online tutoring platform with interactive learning experience.",
                    why: "Live classes with India's top teachers for JEE, NEET, Boards and other competitive exams.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.vedantu.com/"
                },
                {
                    name: "Extramarks",
                    description: "Digital learning platform with curriculum-based educational content.",
                    why: "Complete learning solutions aligned with CBSE, ICSE and State Boards curriculum in India.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.extramarks.com/"
                },
                {
                    name: "Toppr",
                    description: "Personalized learning app with adaptive practice questions and video lectures.",
                    why: "AI-based learning system that adapts to each student's strengths and weaknesses.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.toppr.com/"
                },
                {
                    name: "Khan Academy",
                    description: "Free educational platform with video lessons and practice exercises.",
                    why: "High-quality content from basic to advanced topics available in Hindi and English.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.khanacademy.org/"
                },
                {
                    name: "PracticeMock",
                    description: "Mock test platform for competitive exams in India.",
                    why: "Comprehensive test series for UPSC, Banking, SSC and other government exams.",
                    platforms: ["iOS", "Android", "Web"],
                    link: "https://www.practicemock.com/"
                }
            ]
        };
        
        // Return data for the requested category or empty array if not found
        return mockData[category] || [];
    }
});