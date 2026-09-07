/* =========================================================
   HỆ THỐNG XỬ LÝ GIAO DIỆN & TƯƠNG TÁC PORTFOLIO HOÀN CHỈNH
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. QUẢN LÝ THEME (SÁNG/TỐI) & ĐA NGÔN NGỮ (VI/EN)
    // ---------------------------------------------------------
    const savedTheme = localStorage.getItem('cv_theme') || 'light';
    const savedLang = localStorage.getItem('cv_lang') || 'vi';

    // Đặt theme ban đầu
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    // Cập nhật nút ngôn ngữ ban đầu
    const updateLangBtn = (lang) => {
        const langText = document.getElementById('langText');
        if (langText) {
            langText.textContent = lang === 'vi' ? 'EN' : 'VI';
        }
    };

    updateLangBtn(savedLang);
    applyLanguage(savedLang);

    // Bật/tắt Theme Sáng / Tối
    document.getElementById('themeToggle')?.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('cv_theme', newTheme);

        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    });

    // Bật/tắt Ngôn ngữ Anh / Việt
    document.getElementById('langToggle')?.addEventListener('click', (e) => {
        e.preventDefault();
        const currentLang = localStorage.getItem('cv_lang') || 'vi';
        const newLang = currentLang === 'vi' ? 'en' : 'vi';

        localStorage.setItem('cv_lang', newLang);
        updateLangBtn(newLang);
        applyLanguage(newLang);
    });

    // ---------------------------------------------------------
    // 2. HIỆU ỨNG CUỘN TỚI MỜ HIỆN DẦN (SCROLL REVEAL)
    // ---------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------------------------------------------------------
    // 3. TÍNH NĂNG 1-CHẠM SAO CHÉP (COPY TO CLIPBOARD)
    // ---------------------------------------------------------
    const toast = document.getElementById('copyToast');
    let toastTimeout;

    const copyTriggers = document.querySelectorAll('.copy-trigger, .contact-chip[data-copy]');

    copyTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const textToCopy = trigger.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                if (toast) {
                    clearTimeout(toastTimeout);
                    toast.classList.add('show');
                    toastTimeout = setTimeout(() => {
                        toast.classList.remove('show');
                    }, 2200);
                }
            }).catch(err => {
                console.error('Lỗi khi sao chép: ', err);
            });
        });
    });

    // ---------------------------------------------------------
    // 4. HIỆU ỨNG QUANG HỌC CON TRỎ & CẢM ỨNG (SPOTLIGHT)
    // ---------------------------------------------------------
    const cards = document.querySelectorAll('.glass-card, .project-pod');
    let isTicking = false;

    const setSpotlight = (card, clientX, clientY) => {
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    };

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    setSpotlight(card, e.clientX, e.clientY);
                    isTicking = false;
                });
                isTicking = true;
            }
        });

        card.addEventListener('touchmove', (e) => {
            if (!isTicking && e.touches && e.touches[0]) {
                window.requestAnimationFrame(() => {
                    setSpotlight(card, e.touches[0].clientX, e.touches[0].clientY);
                    isTicking = false;
                });
                isTicking = true;
            }
        }, { passive: true });
    });
});

/* ---------------------------------------------------------
   HÀM ÁP DỤNG DỮ LIỆU ĐA NGÔN NGỮ (I18N)
--------------------------------------------------------- */
function applyLanguage(lang) {
    const dict = window.translations || (typeof translations !== 'undefined' ? translations : null);
    if (!dict || !dict[lang]) return;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (dict[lang] && dict[lang][key] !== undefined) {
            element.innerHTML = dict[lang][key];
        }
    });

    document.documentElement.lang = lang;
}