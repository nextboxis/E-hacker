import React, { useEffect, useRef } from 'react';

export default function MatrixRain({ opacity = 0.45, speed = 33 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const characters = '0123456789ABCDEF01日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
        const fontSize = 14;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        let columns = Math.floor(width / fontSize);
        let drops = Array(columns).fill(1);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            drops = Array(columns).fill(1);
        };

        window.addEventListener('resize', handleResize);

        let lastTime = 0;
        const render = (time) => {
            if (time - lastTime > speed) {
                lastTime = time;

                ctx.fillStyle = 'rgba(2, 6, 4, 0.08)';
                ctx.fillRect(0, 0, width, height);

                ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length));
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;

                    // Lead character is brighter/whiter
                    ctx.fillStyle = drops[i] * fontSize < 50 ? '#e2fbe8' : '#00ff66';
                    ctx.fillText(text, x, y);

                    if (y > height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }
            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [speed]);

    return (
        <canvas
            ref={canvasRef}
            className="matrix-rain-canvas"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: opacity,
                zIndex: 1
            }}
        />
    );
}
