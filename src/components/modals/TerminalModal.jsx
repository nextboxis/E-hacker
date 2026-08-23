import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function TerminalModal() {
    const { isTerminalModalOpen, setIsTerminalModalOpen, activeProfile, setActiveTab } = useAuth();
    const [history, setHistory] = useState([
        { type: 'system', text: 'E-HACKER Cyber Sandbox Terminal v3.0 (React Core)' },
        { type: 'system', text: 'Type "help" for a list of available cybersecurity commands.' }
    ]);
    const [input, setInput] = useState('');
    const endRef = useRef(null);

    useEffect(() => {
        if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    if (!isTerminalModalOpen) return null;

    const handleCommand = (e) => {
        if (e.key !== 'Enter') return;
        const cmd = input.trim();
        if (!cmd) return;

        const newHist = [...history, { type: 'cmd', text: `root@nextboxis:~# ${cmd}` }];

        const parts = cmd.toLowerCase().split(' ');
        const mainCmd = parts[0];

        switch (mainCmd) {
            case 'help':
                newHist.push({ type: 'output', text: 'Available commands: whoami, nmap, sqlmap, hashid, cve, python, tools, xp, clear, exit' });
                break;
            case 'whoami':
                newHist.push({ type: 'output', text: `Operative: ${activeProfile.callsign} | Clearance: ${activeProfile.clearance} | Domain: ${activeProfile.domain}` });
                break;
            case 'nmap':
                newHist.push({ type: 'output', text: 'Starting Nmap 7.94 scan on localhost: 22/tcp OPEN (ssh), 80/tcp OPEN (http), 443/tcp OPEN (https).' });
                break;
            case 'sqlmap':
                newHist.push({ type: 'output', text: 'sqlmap identified target is vulnerable: boolean-based blind, error-based, UNION query (5 columns).' });
                break;
            case 'hashid':
                newHist.push({ type: 'output', text: '5d41402abc4b2a76b9719d911017c592 -> MD5 (Hashcat: -m 0, John: raw-md5)' });
                break;
            case 'python':
            case 'tools':
                setActiveTab('toolkit');
                setIsTerminalModalOpen(false);
                break;
            case 'xp':
                newHist.push({ type: 'output', text: `Total Experience: ${activeProfile.xp || 0} XP | Level: ${activeProfile.level || 1}` });
                break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'exit':
                setIsTerminalModalOpen(false);
                return;
            default:
                newHist.push({ type: 'error', text: `Command not recognized: ${cmd}. Type "help".` });
        }

        setHistory(newHist);
        setInput('');
    };

    return (
        <div className="terminal-overlay active" onClick={() => setIsTerminalModalOpen(false)}>
            <div className="terminal-window" onClick={(e) => e.stopPropagation()}>
                <div className="terminal-topbar">
                    <div className="terminal-traffic-lights">
                        <span className="traffic-dot close-dot" onClick={() => setIsTerminalModalOpen(false)}></span>
                        <span className="traffic-dot min-dot"></span>
                        <span className="traffic-dot max-dot"></span>
                    </div>
                    <span className="terminal-title">root@nextboxis:~ (E-HACKER CLI SANDBOX)</span>
                    <button className="terminal-close-x" onClick={() => setIsTerminalModalOpen(false)}>×</button>
                </div>

                <div className="terminal-screen">
                    {history.map((h, i) => (
                        <div key={i} className={`terminal-line terminal-${h.type}`}>
                            {h.text}
                        </div>
                    ))}
                    <div className="terminal-input-row">
                        <span className="terminal-prompt">root@nextboxis:~#</span>
                        <input
                            type="text"
                            className="terminal-input"
                            autoFocus
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleCommand}
                        />
                    </div>
                    <div ref={endRef}></div>
                </div>
            </div>
        </div>
    );
}
