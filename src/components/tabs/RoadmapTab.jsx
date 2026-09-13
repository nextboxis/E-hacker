import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TOPIC_RESOURCES } from '../../data/resourcesData';
import { STAGES } from '../../data/roadmapData';

export { STAGES };

export default function RoadmapTab() {
    const { activeProfile, toggleSkill, playChime, setActiveTab } = useAuth();
    const checked = activeProfile.checkedSkills || [];
    const totalSkills = STAGES.reduce((acc, s) => acc + s.skills.length, 0);
    const masteredSkills = checked.length;
    const overallProgress = Math.round((masteredSkills / totalSkills) * 100);

    const [selectedTrack, setSelectedTrack] = useState('all');
    const [searchTopic, setSearchTopic] = useState('');
    const [inspectedTopicKey, setInspectedTopicKey] = useState(null);
    const [copiedCmd, setCopiedCmd] = useState(false);

    const tracks = [
        { id: 'all', label: 'Full Spectrum (All Stages)', color: 'var(--color-accent)' },
        { id: 'web', label: 'Web Pentest', color: '#eab308' },
        { id: 'network', label: 'Infrastructure & AD', color: '#22c55e' },
        { id: 'soc', label: 'SOC Defense', color: '#a855f7' },
        { id: 'malware', label: 'Malware & Reversing', color: '#ec4899' },
        { id: 'osint', label: 'OSINT Recon', color: '#38bdf8' }
    ];

    const inspectedData = inspectedTopicKey ? TOPIC_RESOURCES[inspectedTopicKey] : null;

    const handleCopyCommand = (cmd) => {
        if (!cmd) return;
        navigator.clipboard.writeText(cmd);
        setCopiedCmd(true);
        playChime();
        setTimeout(() => setCopiedCmd(false), 2000);
    };

    return (
        <div className="tab-panel active">
            {/* Header Card */}
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(124, 58, 237, 0.06) 100%)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag">CYBERSECURITY CURRICULUM & CAREER TREE</div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>6-Stage Specialization & Skill Mastery Roadmap</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Comprehensive progression tree with verified learning resources, official specs, cheatsheets, and hands-on wargames for every skill title.
                        </p>
                    </div>

                    {/* Overall Progress Stat Box */}
                    <div className="stat-box" style={{ minWidth: '180px', textAlign: 'center' }}>
                        <div className="stat-value" style={{ color: 'var(--color-accent)' }}>{overallProgress}%</div>
                        <div className="stat-lbl">{masteredSkills} / {totalSkills} Skills Mastered</div>
                        <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${overallProgress}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                        </div>
                    </div>
                </div>

                {/* Filter Track Buttons & Search */}
                <div className="mt-20 flex-space-between-center flex-wrap gap-10">
                    <div className="flex-gap-8 flex-wrap">
                        {tracks.map(t => (
                            <button
                                key={t.id}
                                className={`filter-chip ${selectedTrack === t.id ? 'active' : ''}`}
                                style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                                onClick={() => { setSelectedTrack(t.id); playChime(); }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search skill titles or topics..."
                        style={{ maxWidth: '320px' }}
                        value={searchTopic}
                        onChange={(e) => setSearchTopic(e.target.value)}
                    />
                </div>
            </div>

            {/* Stages Grid */}
            <div className="roadmap-stages-grid">
                {STAGES.map(stage => {
                    // Filter skills by track and search
                    const visibleSkills = stage.skills.filter(sk => {
                        const matchTrack = selectedTrack === 'all' || sk.track === selectedTrack || stage.track === selectedTrack;
                        const matchSearch = !searchTopic || sk.name.toLowerCase().includes(searchTopic.toLowerCase());
                        return matchTrack && matchSearch;
                    });

                    if (visibleSkills.length === 0 && (selectedTrack !== 'all' || searchTopic)) {
                        return null;
                    }

                    const stageSkillIds = stage.skills.map(s => s.id);
                    const stageMastered = stageSkillIds.filter(id => checked.includes(id)).length;
                    const stagePct = Math.round((stageMastered / stage.skills.length) * 100);
                    const isStageComplete = stageMastered === stage.skills.length;

                    return (
                        <div
                            key={stage.num}
                            className="glass-card mb-20"
                            style={{
                                borderColor: isStageComplete ? 'rgba(34, 197, 94, 0.4)' : `${stage.color}33`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Top Stage Header */}
                            <div className="flex-space-between-center flex-wrap gap-10 mb-10">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className="channel-badge" style={{ background: `${stage.color}20`, color: stage.color, border: `1px solid ${stage.color}40` }}>
                                        {stage.code}
                                    </span>
                                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                                        {stage.title}
                                    </h3>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="projects-badge-tag" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                                        {stage.cert}
                                    </span>
                                    <span className="operative-clearance-tag" style={{ color: isStageComplete ? '#22c55e' : stage.color }}>
                                        {stageMastered}/{stage.skills.length} ({stagePct}%)
                                    </span>
                                </div>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '15px' }}>
                                {stage.desc}
                            </p>

                            {/* Stage Progress Bar */}
                            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '5px', overflow: 'hidden', marginBottom: '15px' }}>
                                <div style={{ width: `${stagePct}%`, height: '100%', background: isStageComplete ? '#22c55e' : stage.color, borderRadius: '4px', transition: 'width 0.4s ease' }}></div>
                            </div>

                            {/* Skills Checklist with Dedicated Resource Triggers */}
                            <div className="skills-checklist" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '10px' }}>
                                {visibleSkills.map(sk => {
                                    const isChecked = checked.includes(sk.id);
                                    const resInfo = TOPIC_RESOURCES[sk.id];

                                    return (
                                        <div
                                            key={sk.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '9px 12px',
                                                borderRadius: '8px',
                                                background: isChecked ? 'rgba(34, 197, 94, 0.07)' : 'rgba(255,255,255,0.02)',
                                                border: isChecked ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(255,255,255,0.05)',
                                                transition: 'all 0.2s ease',
                                                gap: '8px'
                                            }}
                                        >
                                            {/* Checkbox and Skill Title */}
                                            <label
                                                className="checkbox-container"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    flex: 1,
                                                    margin: 0
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => { toggleSkill(sk.id); playChime(); }}
                                                />
                                                <span className="checkmark"></span>
                                                <div style={{ marginLeft: '10px' }}>
                                                    <span style={{ fontSize: '0.86rem', color: isChecked ? '#22c55e' : 'var(--text-primary)', fontWeight: 500, display: 'block' }}>
                                                        {sk.name}
                                                    </span>
                                                    <span style={{ fontSize: '0.72rem', color: isChecked ? '#22c55e' : 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                        +{sk.xp} XP {isChecked ? '• Mastered' : ''}
                                                    </span>
                                                </div>
                                            </label>

                                            {/* Interactive Resources Action Button */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <button
                                                    type="button"
                                                    className="resource-badge-btn"
                                                    style={{
                                                        background: 'rgba(6, 182, 212, 0.1)',
                                                        border: '1px solid rgba(6, 182, 212, 0.3)',
                                                        color: '#38bdf8',
                                                        borderRadius: '6px',
                                                        padding: '4px 8px',
                                                        fontSize: '0.74rem',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontWeight: 600,
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                    onClick={() => {
                                                        setInspectedTopicKey(sk.id);
                                                        playChime();
                                                    }}
                                                    title={`Explore resources and learning guide for ${sk.name}`}
                                                >
                                                    <span>📖 Resources</span>
                                                    {resInfo?.resources?.length && (
                                                        <span style={{ background: 'rgba(56, 189, 248, 0.25)', padding: '1px 5px', borderRadius: '10px', fontSize: '0.68rem' }}>
                                                            {resInfo.resources.length}
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* TOPIC LEARNING RESOURCE MODAL / FLYOUT */}
            {inspectedData && (
                <div className="modal-backdrop active" onClick={() => setInspectedTopicKey(null)}>
                    <div
                        className="modal-container glass-card"
                        style={{ maxWidth: '640px', width: '92%', maxHeight: '85vh', overflowY: 'auto', border: '1px solid var(--border-focus)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="modal-header">
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <span className="channel-badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                                        {inspectedData.stage}
                                    </span>
                                    <span className="projects-badge-tag" style={{ textTransform: 'uppercase' }}>
                                        {inspectedData.track} TRACK
                                    </span>
                                </div>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                                    {inspectedData.title}
                                </h2>
                            </div>
                            <button
                                className="modal-close-btn"
                                onClick={() => setInspectedTopicKey(null)}
                                title="Close Resources Modal"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body" style={{ padding: '20px 24px' }}>
                            {/* Technical Concept Summary */}
                            <div className="mb-20">
                                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Core Concept & Objectives
                                </h4>
                                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                                    {inspectedData.summary}
                                </p>
                            </div>

                            {/* Quick Study / Cheat Command */}
                            {inspectedData.commandTip && (
                                <div className="tool-dir-cmd-box mb-20" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px' }}>
                                    <div className="flex-space-between-center mb-6">
                                        <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 600 }}>
                                            TACTICAL CLI CHEAT:
                                        </span>
                                        <button
                                            type="button"
                                            className="copy-btn"
                                            style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                                            onClick={() => handleCopyCommand(inspectedData.commandTip)}
                                        >
                                            {copiedCmd ? '✔ COPIED' : 'COPY'}
                                        </button>
                                    </div>
                                    <code style={{ fontSize: '0.84rem', color: '#4ade80', wordBreak: 'break-all', display: 'block' }}>
                                        {inspectedData.commandTip}
                                    </code>
                                </div>
                            )}

                            {/* Curated External Resources & Links */}
                            <div className="mb-20">
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Verified Documentation & Learning Labs
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {inspectedData.resources?.map((r, idx) => (
                                        <a
                                            key={idx}
                                            href={r.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '10px 14px',
                                                borderRadius: '6px',
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                textDecoration: 'none',
                                                color: 'var(--text-primary)',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '1rem' }}>
                                                    {r.type === 'lab' ? '🧪' : r.type === 'cheatsheet' ? '⚡' : r.type === 'video' ? '🎥' : r.type === 'tool' ? '🛠️' : '📄'}
                                                </span>
                                                <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>
                                                    {r.name}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                                                OPEN ↗
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    className={`btn ${checked.includes(inspectedTopicKey) ? 'btn-danger' : 'btn-success'}`}
                                    style={{ fontSize: '0.85rem' }}
                                    onClick={() => {
                                        toggleSkill(inspectedTopicKey);
                                        playChime();
                                    }}
                                >
                                    {checked.includes(inspectedTopicKey) ? '✖ Mark Incomplete' : '✔ Mark Completed (+25 XP)'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={{ fontSize: '0.85rem' }}
                                    onClick={() => {
                                        setInspectedTopicKey(null);
                                        setActiveTab('projects');
                                        playChime();
                                    }}
                                >
                                    Open Related Lab 🚀
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
