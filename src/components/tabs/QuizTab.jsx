import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const QUESTIONS = [
    {
        q: "Which Nmap scan flag initiates a TCP SYN Stealth Scan without completing the 3-way handshake?",
        opts: ["-sT", "-sS", "-sU", "-sA"],
        ans: 1,
        exp: "-sS performs a SYN stealth scan by sending a SYN packet and awaiting SYN-ACK without completing the handshake."
    },
    {
        q: "In Active Directory, what attack targets service account tickets to crack NTLM hashes offline?",
        opts: ["Pass-the-Hash", "Kerberoasting", "DCSync", "AS-REP Roasting"],
        ans: 1,
        exp: "Kerberoasting requests TGS service tickets for SPNs and attempts offline dictionary cracking on the RC4/AES encrypted hash."
    },
    {
        q: "What CVSS v3.1 Attack Vector (AV) metric represents an attack requiring physical access to target hardware?",
        opts: ["Network (N)", "Adjacent (A)", "Local (L)", "Physical (P)"],
        ans: 3,
        exp: "Physical (AV:P) denotes vulnerabilities that require physical device interaction, e.g. malicious USB implants."
    }
];

export default function QuizTab() {
    const { addXp, playChime } = useAuth();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const q = QUESTIONS[currentIdx];

    const handleSelect = (idx) => {
        if (selectedOpt !== null) return;
        setSelectedOpt(idx);
        if (idx === q.ans) {
            setScore(prev => prev + 1);
            addXp(25);
            playChime();
        }
    };

    const handleNext = () => {
        if (currentIdx + 1 < QUESTIONS.length) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOpt(null);
        } else {
            setShowResults(true);
        }
    };

    return (
        <div className="tab-panel active">
            <div className="glass-card">
                <h3 className="tool-section-title">🎯 Certification Practice Exam & Concept Drills</h3>
                {!showResults ? (
                    <div className="mt-20">
                        <span className="channel-badge mb-10">Question {currentIdx + 1} of {QUESTIONS.length}</span>
                        <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: '12px 0' }}>{q.q}</h4>

                        <div className="quiz-options-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {q.opts.map((opt, idx) => {
                                let btnClass = "site-btn tool-btn";
                                if (selectedOpt !== null) {
                                    if (idx === q.ans) btnClass = "site-btn";
                                    else if (selectedOpt === idx) btnClass = "site-btn text-danger";
                                }
                                return (
                                    <button
                                        key={idx}
                                        className={btnClass}
                                        style={{ textAlign: 'left', padding: '12px 18px', width: '100%' }}
                                        onClick={() => handleSelect(idx)}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedOpt !== null && (
                            <div className="ai-code-output-card mt-20">
                                <p style={{ color: 'var(--color-accent)' }}><strong>Explanation:</strong> {q.exp}</p>
                                <button className="site-btn mt-10" onClick={handleNext}>Next Question →</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center mt-20">
                        <h2>Exam Drill Complete!</h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>You scored {score} / {QUESTIONS.length} (+{score * 25} XP Claimed)</p>
                        <button className="site-btn mt-15" onClick={() => { setShowResults(false); setCurrentIdx(0); setSelectedOpt(null); setScore(0); }}>
                            ↻ Retake Exam
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
