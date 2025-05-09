// 等待页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化轮播图
    initCarousel();
    
    // 初始化技能进度条
    initSkillLevels();
    
    // 初始化表单提交
    initContactForm();
    
    // 添加平滑滚动效果
    initSmoothScroll();
    
    // 添加导航菜单高亮效果
    initNavHighlight();
    
    // 初始化联系方式功能
    initContactFeatures();
    addCopyFeature();

    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // 滚动监听
    window.addEventListener('scroll', () => {
        // 导航栏背景效果
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 导航链接高亮
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 移动端菜单
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // 点击导航链接时关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // 深色模式切换
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 检查本地存储中的主题设置
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme === 'dark');
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    }
    
    themeToggle.addEventListener('click', () => {
        let theme = 'light';
        if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            theme = 'dark';
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme === 'dark');
    });

    // 更新主题图标
    function updateThemeIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // 滚动动画
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // 技能进度条动画
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        bar.style.width = percentage + '%';
    });
});

// 轮播图功能
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    const totalItems = items.length;
    let autoPlayTimer;
    
    // 更新轮播图显示
    function updateCarousel(index) {
        const offset = -index * 100;
        carousel.style.transform = `translateX(${offset}%)`;
        
        // 更新指示器状态
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // 切换到下一张图片
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % totalItems;
        updateCarousel(nextIndex);
    }
    
    // 切换到上一张图片
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel(prevIndex);
    }
    
    // 自动播放控制
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }
    
    // 绑定事件
    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
    });
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            updateCarousel(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });
    
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // 触摸事件处理
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoPlay();
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startAutoPlay();
    });
    
    // 开始自动播放
    startAutoPlay();
}

// 初始化技能进度条
function initSkillLevels() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    // 创建Intersection Observer来检测元素是否可见
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.setProperty('--level', level);
                // 只触发一次动画
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // 观察所有技能进度条
    skillLevels.forEach(skill => {
        observer.observe(skill);
    });
}

// 初始化表单提交
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // 这里可以添加表单验证逻辑
            if (!validateForm(data)) {
                return;
            }
            
            // 模拟表单提交
            alert('消息已发送！我们会尽快回复您。');
            form.reset();
        });
    }
}

// 表单验证
function validateForm(data) {
    if (!data.name || data.name.trim() === '') {
        alert('请输入您的姓名');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        alert('请输入有效的邮箱地址');
        return false;
    }
    
    if (!data.message || data.message.trim() === '') {
        alert('请输入留言内容');
        return false;
    }
    
    return true;
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 导航菜单高亮
function initNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // 创建Intersection Observer来检测当前可见的section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateNavHighlight(id);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // 观察所有section
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // 更新导航菜单高亮状态
    function updateNavHighlight(sectionId) {
        navLinks.forEach(link => {
            link.classList.toggle('active',
                link.getAttribute('href') === `#${sectionId}`);
        });
    }
}

// 初始化联系方式功能
function initContactFeatures() {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // 微信二维码弹窗功能
    const wechatBtn = document.getElementById('wechatBtn');
    const wechatQR = document.getElementById('wechatQR');
    
    if (wechatBtn && wechatQR) {
        wechatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            wechatQR.classList.add('active');
            overlay.classList.add('active');
        });

        // 点击遮罩层关闭弹窗
        overlay.addEventListener('click', function() {
            wechatQR.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // 电话号码点击处理
    const phoneLink = document.querySelector('a[data-type="phone"]');
    if (phoneLink) {
        phoneLink.addEventListener('click', function(e) {
            // 检查是否是移动设备
            if (!isMobileDevice()) {
                e.preventDefault();
                alert('请使用手机访问此链接以直接拨打电话');
            }
        });
    }
}

// 检查是否是移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 添加复制功能
function addCopyFeature() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        if (link.dataset.type !== 'wechat') {
            link.addEventListener('click', function(e) {
                if (this.dataset.type === 'phone' && !isMobileDevice()) {
                    e.preventDefault();
                    copyToClipboard(this.textContent);
                    showToast('电话号码已复制到剪贴板');
                } else if (this.dataset.type === 'email') {
                    copyToClipboard(this.textContent);
                    showToast('邮箱地址已复制到剪贴板');
                }
            });
        }
    });
}

// 复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('复制失败:', err);
    });
}

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 添加显示类名触发动画
    setTimeout(() => toast.classList.add('show'), 10);

    // 3秒后移除提示
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
} 