// 深色模式管理
const darkModeManager = {
    // 存储深色模式状态的键名
    DARK_MODE_KEY: 'darkMode',
    
    // 初始化深色模式
    init() {
        // 获取深色模式按钮
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            // 检查本地存储中的深色模式状态
            const isDarkMode = localStorage.getItem(this.DARK_MODE_KEY) === 'true';
            // 应用深色模式状态
            this.setDarkMode(isDarkMode);
            // 添加切换事件
            darkModeToggle.addEventListener('click', () => this.toggle());
        }
    },

    // 切换深色模式
    toggle() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        this.setDarkMode(!isDarkMode);
    },

    // 设置深色模式状态
    setDarkMode(isDarkMode) {
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem(this.DARK_MODE_KEY, isDarkMode);
    }
};

// 多语言支持管理
const languageManager = {
    // 当前语言
    currentLang: 'zh',
    // 支持的语言
    supportedLangs: ['zh', 'en'],
    // 语言包
    translations: {
        zh: {
            'nav.home': '首页',
            'nav.projects': '项目',
            'nav.skills': '技能',
            'nav.blog': '博客',
            'nav.contact': '联系我'
            // 其他翻译内容
        },
        en: {
            'nav.home': 'Home',
            'nav.projects': 'Projects',
            'nav.skills': 'Skills',
            'nav.blog': 'Blog',
            'nav.contact': 'Contact'
            // 其他翻译内容
        }
    },

    // 初始化语言设置
    init() {
        // 获取语言选择器
        const langSelector = document.getElementById('langSelector');
        if (langSelector) {
            // 设置初始语言
            this.setLanguage(this.currentLang);
            // 添加语言切换事件
            langSelector.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    },

    // 设置语言
    setLanguage(lang) {
        if (this.supportedLangs.includes(lang)) {
            this.currentLang = lang;
            this.updateContent();
            localStorage.setItem('preferredLanguage', lang);
        }
    },

    // 更新页面内容
    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translations[this.currentLang][key] || key;
        });
    }
};

// 博客功能管理
const blogManager = {
    // 博客文章列表
    posts: [],
    
    // 初始化博客功能
    init() {
        this.loadPosts();
        this.setupBlogUI();
    },

    // 加载博客文章
    async loadPosts() {
        try {
            // 这里可以替换为实际的API调用
            const response = await fetch('js/blog-posts.json');
            this.posts = await response.json();
            this.displayPosts();
        } catch (error) {
            console.error('加载博客文章失败:', error);
        }
    },

    // 设置博客界面
    setupBlogUI() {
        const blogContainer = document.getElementById('blogContainer');
        if (blogContainer) {
            // 添加文章过滤和排序功能
            const filterInput = document.createElement('input');
            filterInput.type = 'text';
            filterInput.placeholder = '搜索文章...';
            filterInput.addEventListener('input', (e) => this.filterPosts(e.target.value));
            blogContainer.prepend(filterInput);
        }
    },

    // 显示博客文章
    displayPosts(posts = this.posts) {
        const blogList = document.getElementById('blogList');
        if (blogList) {
            blogList.innerHTML = posts.map(post => `
                <article class="blog-post">
                    <h2>${post.title}</h2>
                    <div class="post-meta">
                        <span class="date">${new Date(post.date).toLocaleDateString()}</span>
                        <span class="tags">${post.tags.join(', ')}</span>
                    </div>
                    <p>${post.excerpt}</p>
                    <a href="blog/${post.id}" class="read-more">阅读更多</a>
                </article>
            `).join('');
        }
    },

    // 过滤博客文章
    filterPosts(keyword) {
        const filtered = this.posts.filter(post => 
            post.title.toLowerCase().includes(keyword.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
        );
        this.displayPosts(filtered);
    }
};

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    darkModeManager.init();
    languageManager.init();
    blogManager.init();
}); 