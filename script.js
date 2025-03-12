const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SITE_URL = window.location.origin;
const SITE_NAME = 'Penjana Artikel AI';
const LOCAL_STORAGE_KEYS = {
    API_KEY: 'openRouterApiKey',
    THEME: 'theme',
    SAVED_ARTICLES: 'savedArticles',
    MODEL: 'selectedModel',
    TEMPERATURE: 'temperature',
    WORD_COUNT: 'wordCountTarget'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    try {
        // Load saved settings
        loadSavedSettings();
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Load saved articles
        loadSavedArticles();
        
        // Update theme toggle button text
        updateThemeToggleText();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Ralat semasa memulakan aplikasi. Sila muat semula halaman.');
    }
}

function loadSavedSettings() {
    // Load API key
    const cachedApiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.API_KEY);
    if (cachedApiKey) {
        document.getElementById('apiKey').value = cachedApiKey;
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, 'dark');
    }
    
    // Load model preference
    const savedModel = localStorage.getItem(LOCAL_STORAGE_KEYS.MODEL);
    if (savedModel && document.getElementById('modelSelect')) {
        document.getElementById('modelSelect').value = savedModel;
    }
    
    // Load temperature preference
    const savedTemperature = localStorage.getItem(LOCAL_STORAGE_KEYS.TEMPERATURE);
    if (savedTemperature && document.getElementById('temperatureSlider')) {
        document.getElementById('temperatureSlider').value = savedTemperature;
        document.getElementById('temperatureValue').textContent = savedTemperature;
    }
    
    // Load word count target
    const savedWordCount = localStorage.getItem(LOCAL_STORAGE_KEYS.WORD_COUNT);
    if (savedWordCount && document.getElementById('wordCountTarget')) {
        document.getElementById('wordCountTarget').value = savedWordCount;
    }
}

function initializeEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Generate button
    document.getElementById('generateButton').addEventListener('click', generateBlog);
    
    // Clear cache button
    document.getElementById('clearCacheButton').addEventListener('click', clearCache);
    
    // Copy button
    document.getElementById('copyButton').addEventListener('click', copyContent);
    
    // Print button
    document.getElementById('printButton').addEventListener('click', printArticle);
    
    // Download button
    document.getElementById('downloadButton').addEventListener('click', downloadArticle);
    
    // Password toggle
    document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);
    
    // Temperature slider
    const temperatureSlider = document.getElementById('temperatureSlider');
    if (temperatureSlider) {
        temperatureSlider.addEventListener('input', (e) => {
            document.getElementById('temperatureValue').textContent = e.target.value;
            localStorage.setItem(LOCAL_STORAGE_KEYS.TEMPERATURE, e.target.value);
        });
    }
    
    // Model select
    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) {
        modelSelect.addEventListener('change', (e) => {
            localStorage.setItem(LOCAL_STORAGE_KEYS.MODEL, e.target.value);
        });
    }
    
    // Word count target
    const wordCountTarget = document.getElementById('wordCountTarget');
    if (wordCountTarget) {
        wordCountTarget.addEventListener('change', (e) => {
            localStorage.setItem(LOCAL_STORAGE_KEYS.WORD_COUNT, e.target.value);
        });
    }
    
    // Modal close button
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            document.getElementById('saveModal').classList.remove('visible');
        });
    }
    
    // Save article button
    const saveArticleButton = document.getElementById('saveArticleButton');
    if (saveArticleButton) {
        saveArticleButton.addEventListener('click', saveArticle);
    }
}

function updateThemeToggleText() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeText = themeToggle.querySelector('span');
    const themeIcon = themeToggle.querySelector('i');
    
    if (currentTheme === 'dark') {
        themeText.textContent = 'Tukar ke Mod Cerah';
        themeIcon.className = 'fas fa-sun';
    } else {
        themeText.textContent = 'Tukar ke Mod Gelap';
        themeIcon.className = 'fas fa-moon';
    }
}

function toggleTheme() {
    try {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
        
        updateThemeToggleText();
    } catch (error) {
        console.error('Theme toggle error:', error);
        showError('Gagal menukar tema');
    }
}

function togglePasswordVisibility() {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleButton = document.getElementById('togglePassword');
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        apiKeyInput.type = 'password';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function clearCache() {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.API_KEY);
        document.getElementById('apiKey').value = '';
        showSuccess('Kunci API berjaya dipadamkan!');
    } catch (error) {
        console.error('Clear cache error:', error);
        showError('Gagal memadam kunci API tersimpan');
    }
}

function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 100);
}

function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 100);
}

function getWordCount(text) {
    return text.trim().split(/\s+/).length;
}

function createSegmentPrompt(topic, section, wordCount) {
    const prompts = {
        introduction: `Tuliskan pengenalan yang menarik (tepat ${wordCount} patah perkataan) untuk artikel mengenai "${topic}". 
            Masukkan kata kunci utama secara semula jadi, tarik minat pembaca, dan gariskan apa yang akan dibincangkan dalam artikel.
            Format dalam markdown.`,
            
        mainContent: `Tuliskan bahagian kandungan utama yang terperinci (tepat ${wordCount} patah perkataan) untuk artikel mengenai "${topic}".
            Fokus pada memberikan maklumat yang bernilai dan boleh dilaksanakan dengan tajuk H2 dan H3 yang sesuai.
            Sertakan statistik, contoh, dan pandangan pakar. Format dalam markdown.`,
            
        conclusion: `Tuliskan kesimpulan yang kukuh (tepat ${wordCount} patah perkataan) untuk artikel mengenai "${topic}".
            Ringkaskan perkara-perkara utama dan sertakan seruan untuk bertindak. Format dalam markdown.`,
            
        faq: `Tuliskan bahagian FAQ (tepat ${wordCount} patah perkataan) dengan 5 soalan lazim dan jawapan terperinci mengenai "${topic}".
            Format dalam markdown dengan H2 untuk "Soalan Lazim" dan setiap soalan dalam H3.`
    };
    
    return prompts[section];
}

async function generateBlog() {
    const topic = document.getElementById('topic').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    
    // Validate inputs
    if (!validateInputs(topic, apiKey)) {
        return;
    }

    // Save API key
    localStorage.setItem(LOCAL_STORAGE_KEYS.API_KEY, apiKey);
    
    // Get model and temperature settings
    const model = document.getElementById('modelSelect')?.value || 'google/learnlm-1.5-pro-experimental:free';
    const temperature = parseFloat(document.getElementById('temperatureSlider')?.value || 0.7);
    const targetWordCount = parseInt(document.getElementById('wordCountTarget')?.value || 2000);
    
    // Save preferences
    localStorage.setItem(LOCAL_STORAGE_KEYS.MODEL, model);
    localStorage.setItem(LOCAL_STORAGE_KEYS.TEMPERATURE, temperature);
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORD_COUNT, targetWordCount);
    
    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressBar').style.display = 'block';
    document.getElementById('blogContent').innerHTML = '';
    document.getElementById('copyButton').style.display = 'none';
    document.getElementById('printButton').style.display = 'none';
    document.getElementById('downloadButton').style.display = 'none';
    
    // Set article title
    document.getElementById('articleTitle').textContent = `Artikel: ${topic}`;
    
    startProgressAnimation();

    try {
        // Calculate word counts for each section based on target total
        const totalWords = targetWordCount;
        const introWords = Math.round(totalWords * 0.1);
        const mainContentWords = Math.round(totalWords * 0.7);
        const conclusionWords = Math.round(totalWords * 0.1);
        const faqWords = Math.round(totalWords * 0.1);
        
        // Generate content in segments
        const segments = [
            { type: 'introduction', words: introWords, status: 'Menjana pengenalan...' },
            { type: 'mainContent', words: mainContentWords, status: 'Menjana kandungan utama...' },
            { type: 'conclusion', words: conclusionWords, status: 'Menjana kesimpulan...' },
            { type: 'faq', words: faqWords, status: 'Menjana soalan lazim...' }
        ];

        let fullContent = '';
        let currentProgress = 0;

        for (const segment of segments) {
            // Update status
            document.getElementById('generationStatus').textContent = segment.status;
            
            const prompt = createSegmentPrompt(topic, segment.type, segment.words);
            const content = await generateSegment(prompt, apiKey, model, temperature);
            fullContent += content + '\n\n';
            
            // Update progress
            currentProgress += (100 / (segments.length + 1)); // +1 for metadata
            updateProgress(Math.min(currentProgress, 95));
        }

        // Update status for metadata generation
        document.getElementById('generationStatus').textContent = 'Menjana metadata SEO...';
        
        // Generate SEO metadata
        const metadataPrompt = `Untuk artikel mengenai "${topic}", jana:
            - Kata Kunci Fokus: (kata kunci utama + 2-3 kata kunci sekunder)
            - Tajuk SEO: (50-60 aksara, sertakan kata kuasa + nombor)
            - Slug: (3-4 perkataan dengan kata kunci utama)
            - Penerangan Meta: (150-155 aksara, sertakan seruan untuk bertindak)
            - Cadangan Teks Alt Imej: (2-3 contoh)`;

        const metadata = await generateSegment(metadataPrompt, apiKey, model, temperature);
        
        // Display content
        displayContent(fullContent, metadata, topic);
        
        // Show success message
        showSuccess('Artikel berjaya dijana!');
    } catch (error) {
        console.error('Generation Error:', error);
        showError('Ralat menjana kandungan: ' + error.message);
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

function validateInputs(topic, apiKey) {
    let isValid = true;
    
    // Validate topic
    if (!topic) {
        document.getElementById('topicError').textContent = 'Sila masukkan topik artikel';
        document.getElementById('topicError').classList.add('visible');
        isValid = false;
    } else {
        document.getElementById('topicError').classList.remove('visible');
    }
    
    // Validate API key
    if (!apiKey) {
        document.getElementById('apiKeyError').textContent = 'Sila masukkan kunci API OpenRouter';
        document.getElementById('apiKeyError').classList.add('visible');
        isValid = false;
    } else {
        document.getElementById('apiKeyError').classList.remove('visible');
    }
    
    return isValid;
}

async function generateSegment(prompt, apiKey, model, temperature) {
    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [{
                    role: 'user',
                    content: `Sila jawab dalam Bahasa Malaysia yang formal dan betul: ${prompt}`
                }],
                temperature: temperature,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Gagal menjana segmen');
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error('Format respons tidak sah dari API');
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error('API Error:', error);
        throw new Error(`Ralat API: ${error.message}`);
    }
}

function updateProgress(progress) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
    progressText.textContent = `${Math.round(progress)}%`;
}

function startProgressAnimation() {
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
}

function stopProgressAnimation() {
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }
    
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    progressBar.style.width = '100%';
    progressBar.setAttribute('aria-valuenow', 100);
    progressText.textContent = '100%';
    
    setTimeout(() => {
        document.getElementById('loadingSpinner').style.display = 'none';
    }, 500);
}

function displayContent(articleContent, metadata, topic) {
    stopProgressAnimation();
    
    const blogContent = document.getElementById('blogContent');
    const seoMetadata = document.getElementById('seoMetadataContent');
    const wordCountElement = document.getElementById('wordCount');
    
    // Calculate word count
    const wordCount = getWordCount(articleContent);
    const targetWordCount = parseInt(document.getElementById('wordCountTarget')?.value || 2000);
    
    // Display word count with appropriate styling
    wordCountElement.textContent = `Jumlah Perkataan: ${wordCount} perkataan`;
    wordCountElement.className = 'word-count';
    
    if (Math.abs(wordCount - targetWordCount) > targetWordCount * 0.1) {
        wordCountElement.classList.add('warning');
    } else {
        wordCountElement.classList.add('success');
    }

    // Configure marked options
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
        sanitize: false
    });

    // Display main article content
    try {
        blogContent.innerHTML = marked.parse(articleContent);
    } catch (error) {
        console.error('Markdown parsing error:', error);
        blogContent.innerHTML = articleContent; // Fallback to plain text
    }

    // Parse and display metadata
    const metadataLines = metadata.split('\n').filter(line => line.trim());
    const metadataHtml = metadataLines.map(line => `<div>${line}</div>`).join('');
    seoMetadata.innerHTML = metadataHtml;

    // Show control buttons
    document.getElementById('copyButton').style.display = 'block';
    document.getElementById('printButton').style.display = 'block';
    document.getElementById('downloadButton').style.display = 'block';
    
    // Store current article in session storage for potential saving
    sessionStorage.setItem('currentArticle', JSON.stringify({
        topic: topic,
        content: articleContent,
        metadata: metadata,
        wordCount: wordCount,
        date: new Date().toISOString()
    }));
}

function copyContent() {
    const blogContent = document.getElementById('blogContent').innerText;
    const seoMetadata = document.getElementById('seoMetadataContent').innerText;
    
    const fullContent = `${blogContent}\n\n--- SEO Metadata ---\n${seoMetadata}`;
    
    navigator.clipboard.writeText(fullContent)
        .then(() => showSuccess('Kandungan telah disalin ke papan keratan!'))
        .catch(err => showError('Gagal menyalin kandungan: ' + err));
}

function printArticle() {
    window.print();
}

function downloadArticle() {
    const blogContent = document.getElementById('blogContent').innerText;
    const seoMetadata = document.getElementById('seoMetadataContent').innerText;
    const topic = document.getElementById('topic').value.trim();
    
    const fullContent = `# ${topic}\n\n${blogContent}\n\n## SEO Metadata\n\n${seoMetadata}`;
    
    // Create a blob and download link
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Create filename from topic
    const filename = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'artikel';
    
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    showSuccess('Artikel telah dimuat turun!');
}

function loadSavedArticles() {
    const savedArticles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SAVED_ARTICLES) || '[]');
    const articlesList = document.getElementById('articlesList');
    
    if (savedArticles.length === 0) {
        articlesList.innerHTML = '<p class="empty-state">Tiada artikel tersimpan.</p>';
        return;
    }
    
    // Sort articles by date (newest first)
    savedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate HTML for each article
    const articlesHtml = savedArticles.map((article, index) => `
        <div class="article-card" data-index="${index}">
            <h4>${article.topic}</h4>
            <div class="article-meta">
                <span>${new Date(article.date).toLocaleDateString()}</span>
                <span>${article.wordCount} perkataan</span>
            </div>
        </div>
    `).join('');
    
    articlesList.innerHTML = articlesHtml;
    
    // Add event listeners to article cards
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            loadArticle(savedArticles[index]);
        });
    });
}

function loadArticle(article) {
    // Set topic
    document.getElementById('topic').value = article.topic;
    
    // Set article title
    document.getElementById('articleTitle').textContent = `Artikel: ${article.topic}`;
    
    // Display content
    displayContent(article.content, article.metadata, article.topic);
    
    // Scroll to output section
    document.querySelector('.output-section').scrollIntoView({ behavior: 'smooth' });
    
    showSuccess('Artikel dimuat!');
}

function saveArticle() {
    const currentArticle = JSON.parse(sessionStorage.getItem('currentArticle') || 'null');
    if (!currentArticle) {
        showError('Tiada artikel untuk disimpan');
        return;
    }
    
    const articleName = document.getElementById('articleName').value.trim() || currentArticle.topic;
    currentArticle.topic = articleName;
    
    // Get existing saved articles
    const savedArticles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SAVED_ARTICLES) || '[]');
    
    // Add new article
    savedArticles.push(currentArticle);
    
    // Save to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify(savedArticles));
    
    // Close modal
    document.getElementById('saveModal').classList.remove('visible');
    
    // Reload saved articles list
    loadSavedArticles();
    
    showSuccess('Artikel berjaya disimpan!');
}

// Add CSS for toast notifications
(function addToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            max-width: 90%;
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast.error {
            background-color: var(--error-color);
        }
        
        .toast.success {
            background-color: var(--success-color);
        }
        
        .toast i {
            font-size: 1.2rem;
        }
        
        @media (max-width: 768px) {
            .toast {
                left: 20px;
                right: 20px;
                text-align: center;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
})(); 
