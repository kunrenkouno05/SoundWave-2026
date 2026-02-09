// ==========================================
// SoundWave - JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks?.classList.toggle('active');
            navButtons?.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .artist-card, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // Audio Player Functionality
    // ==========================================
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');

    if (audioPlayer && playBtn) {
        // Set initial volume
        audioPlayer.volume = 0.8;

        // Format time (seconds to m:ss)
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Update progress bar and time display
        function updateProgress() {
            if (audioPlayer.duration) {
                const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressFill.style.width = `${percent}%`;
                currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            }
        }

        // Play/Pause toggle
        playBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play().then(() => {
                    playBtn.textContent = '⏸';
                }).catch(err => {
                    console.log('再生エラー:', err);
                    alert('音楽ファイルが見つかりません。\naudio/sample.mp3 を配置してください。');
                });
            } else {
                audioPlayer.pause();
                playBtn.textContent = '▶';
            }
        });

        // Audio events
        audioPlayer.addEventListener('loadedmetadata', () => {
            durationTimeEl.textContent = formatTime(audioPlayer.duration);
        });

        const playerAlbum = document.getElementById('player-album');

        audioPlayer.addEventListener('timeupdate', updateProgress);

        audioPlayer.addEventListener('ended', () => {
            playBtn.textContent = '▶';
            progressFill.style.width = '0%';
            audioPlayer.currentTime = 0;
            playerAlbum.classList.remove('playing');
        });

        audioPlayer.addEventListener('play', () => {
            playBtn.textContent = '⏸';
            playerAlbum.classList.add('playing');
        });

        audioPlayer.addEventListener('pause', () => {
            playBtn.textContent = '▶';
            playerAlbum.classList.remove('playing');
        });

        // Click on progress bar to seek
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;
        });

        // Previous button (10 seconds back)
        prevBtn.addEventListener('click', () => {
            audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
        });

        // Next button (10 seconds forward)
        nextBtn.addEventListener('click', () => {
            audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
        });

        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            audioPlayer.volume = volume;
            updateVolumeIcon(volume);
        });

        // Volume icon click to mute/unmute
        let previousVolume = 0.8;
        volumeIcon.addEventListener('click', () => {
            if (audioPlayer.volume > 0) {
                previousVolume = audioPlayer.volume;
                audioPlayer.volume = 0;
                volumeSlider.value = 0;
                volumeIcon.textContent = '🔇';
            } else {
                audioPlayer.volume = previousVolume;
                volumeSlider.value = previousVolume * 100;
                updateVolumeIcon(previousVolume);
            }
        });

        function updateVolumeIcon(volume) {
            if (volume === 0) {
                volumeIcon.textContent = '🔇';
            } else if (volume < 0.5) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const email = input.value;

            if (email) {
                // Show success message
                const btn = newsletterForm.querySelector('.btn');
                const originalText = btn.textContent;
                btn.textContent = '登録完了！';
                btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                input.value = '';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // Control buttons hover effect
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.15)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            const floatingPlayer = document.querySelector('.floating-player');

            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }

            if (floatingPlayer && scrolled < window.innerHeight) {
                floatingPlayer.style.transform = `translateY(calc(-50% + ${scrolled * 0.2}px))`;
            }
        });
    }

    // Stagger animation for artist cards
    document.querySelectorAll('.artist-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Stagger animation for feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Store buttons hover effect
    document.querySelectorAll('.store-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.3)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.boxShadow = 'none';
        });
    });

    // Console easter egg
    console.log('%c🎵 SoundWave', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%c音楽で、世界が変わる。', 'font-size: 14px; color: #94a3b8;');
});
