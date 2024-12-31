class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.rockets = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.render();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createRocket(endX, endY) {
        const startX = endX;
        const startY = this.canvas.height;
        
        this.rockets.push({
            x: startX,
            y: startY,
            endX: endX,
            endY: endY,
            speed: 15 + Math.random() * 5,
            angle: Math.atan2(endY - startY, endX - startX),
            color: '#ffeb3b',
            trail: [],
            trailLength: 10
        });
    }

    createFirework(x, y) {
        this.createRocket(x, y);
    }

    render() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.rockets.length - 1; i >= 0; i--) {
            const r = this.rockets[i];
            
            const dx = r.endX - r.x;
            const dy = r.endY - r.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < r.speed) {
                this.createFireworkParticles(r.endX, r.endY);
                this.rockets.splice(i, 1);
                continue;
            }
            
            r.x += Math.cos(r.angle) * r.speed;
            r.y += Math.sin(r.angle) * r.speed;
            
            r.trail.push({ x: r.x, y: r.y });
            if (r.trail.length > r.trailLength) {
                r.trail.shift();
            }
            
            this.ctx.beginPath();
            this.ctx.moveTo(r.trail[0].x, r.trail[0].y);
            for (let j = 1; j < r.trail.length; j++) {
                this.ctx.lineTo(r.trail[j].x, r.trail[j].y);
            }
            this.ctx.strokeStyle = r.color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = r.color;
            this.ctx.fill();
        }

        this.renderParticles();
        requestAnimationFrame(() => this.render());
    }

    createFireworkParticles(x, y) {
        const particleCount = 150;
        const angleIncrement = (Math.PI * 2) / particleCount;
        const colors = ['#ff0000', '#ffd700', '#ff69b4', '#ff1493', '#ff4500', '#ffa500'];

        for (let i = 0; i < particleCount; i++) {
            const angle = angleIncrement * i;
            const velocity = 8 + Math.random() * 7;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                radius: 2 + Math.random() * 2,
                color,
                alpha: 1,
                decay: 0.015 + Math.random() * 0.02
            });
        }
    }

    renderParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.alpha -= p.decay;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${p.alpha})`;
            this.ctx.fill();

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
            '255, 255, 255';
    }
} 