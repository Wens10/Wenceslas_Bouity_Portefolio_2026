    
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    }
    window.addEventListener('resize', resize);

    const stars = [];
    const STAR_COUNT = Math.floor(120 * 1.3); // Augmenté de 30%
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.2 + 0.3,
            dx: (Math.random() - 0.5) * 0.05,
            dy: (Math.random() - 0.5) * 0.05,
            twinkle: Math.random() * Math.PI * 2
        });
    }

    let shootingStar = null;
    let lastShootingStar = Date.now();

    function drawStars() {
        ctx.clearRect(0, 0, w, h);
        for (const star of stars) {
            star.x += star.dx;
            star.y += star.dy;
            if (star.x < 0) star.x = w;
            if (star.x > w) star.x = 0;
            if (star.y < 0) star.y = h;
            if (star.y > h) star.y = 0;
            star.twinkle += 0.02;
            const alpha = 0.7 + Math.sin(star.twinkle) * 0.3;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fill();
        }
        drawSun(); // Ajout du soleil après les étoiles
    }




    function drawShootingStar() {
        if (!shootingStar) return;
        ctx.save();
        ctx.globalAlpha = shootingStar.alpha;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle),
                   shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle));
        ctx.stroke();
        ctx.restore();
        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.alpha -= 0.01;
        if (shootingStar.alpha <= 0) shootingStar = null;
    }

    function spawnShootingStar() {
        const angle = Math.random() * Math.PI / 3 + Math.PI / 6;
        shootingStar = {
            x: Math.random() * w * 0.8 + w * 0.1,
            y: Math.random() * h * 0.3 + h * 0.1,
            vx: Math.cos(angle) * 8,
            vy: Math.sin(angle) * 8,
            length: 120 + Math.random() * 40,
            angle: angle,
            alpha: 1
        };
    }

    function animate() {
        drawStars();
        drawShootingStar();
        if (Date.now() - lastShootingStar > 30000) {
            spawnShootingStar();
            lastShootingStar = Date.now();
        }
        requestAnimationFrame(animate);
    }
    animate();
    function drawMoon() {
        // Position de la lune (en haut à gauche)
        const moonX = 100;
        const moonY = 100;
        const moonRadius = 22;

        // Halo doux autour de la lune
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(moonX, moonY, moonRadius + i * 8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 220, 255, ${0.07 - i * 0.012})`;
            ctx.fill();
        }

        // Lune principale
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 230, 255, 0.95)';
        ctx.shadowColor = 'rgba(220, 230, 255, 0.7)';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Croissant (ombre)
        ctx.beginPath();
        ctx.arc(moonX + 7, moonY - 2, moonRadius * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40, 50, 80, 0.45)';
        ctx.fill();
    }

