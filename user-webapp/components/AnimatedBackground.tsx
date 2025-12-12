'use client';

import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
    const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; delay: string; duration: string }>>([]);

    useEffect(() => {
        // Generate random particles only on client side to avoid hydration mismatch
        const newParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            duration: `${10 + Math.random() * 20}s`,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Dynamic Gradient Background */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #4c1d95 0%, #0f172a 100%)',
                    animation: 'pulse-glow 8s infinite alternate'
                }}
            />

            {/* Floating Particles */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-white opacity-10"
                    style={{
                        left: particle.left,
                        top: particle.top,
                        width: Math.random() > 0.5 ? '4px' : '2px',
                        height: Math.random() > 0.5 ? '4px' : '2px',
                        animation: `float ${particle.duration} ease-in-out infinite`,
                        animationDelay: particle.delay,
                    }}
                />
            ))}

            {/* Overlay Gradient for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(15, 23, 42, 0.8) 100%)'
                }}
            />
        </div>
    );
}
