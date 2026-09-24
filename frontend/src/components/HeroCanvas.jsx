import React, { useEffect, useRef } from 'react';

export const HeroCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 45;
    const particles = [];
    const keywords = ['#AI', '#Agents', 'Propagation', 'Sentiment', 'PageRank', 'Viral', '#Cyber', 'Clusters', 'Cascade'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 1.5,
        color: i % 3 === 0 ? '#6366F1' : (i % 3 === 1 ? '#06B6D4' : '#8B5CF6'),
        label: i < keywords.length ? keywords[i] : null,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.18 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw particles & labels
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Glow circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#6366F1' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(6, 182, 212, 0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.label) {
          ctx.font = '10px Inter, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillText(p.label, p.x + 8, p.y + 3);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 pointer-events-none z-0" />;
};
