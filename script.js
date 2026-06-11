
        // DOM Nodes
        const navLinks = document.querySelectorAll('.nav-link');
        const tabPanels = document.querySelectorAll('.tab-panel');
        const panelTitle = document.getElementById('panel-title');
        const panelSubtitle = document.getElementById('panel-subtitle');
        const sidebar = document.getElementById('sidebar');
        const mobileToggle = document.getElementById('mobile-menu-toggle');

        // Page Subtitle Mapping
        const tabMeta = {
            overview: { title: "Overview Panel", subtitle: "Ethical Hacking Career Roadmap & Learning Dashboard" },
            roadmap: { title: "Timeline Roadmap", subtitle: "Interactive learning milestones. Check off skills as you learn!" },
            tools: { title: "Tool Finder", subtitle: "Searchable database of essential tools with quick tutorial links" },
            resources: { title: "Channel Directory", subtitle: "Curated learning portals, training hubs, and YouTube courses" }
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
                if (window.innerWidth <= 768) {
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
            if (window.innerWidth <= 768) {
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
            return string.replace(/[.*+?^${}()|[\/]]/g, '\$&');
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

        function updateToolItemDisplay(item, query, categoryTitle) {
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
                if (matchesName && query) highlightSearchText(nameEl, query, originalName);
                else nameEl.textContent = originalName;
                if (matchesDesc && query) highlightSearchText(descEl, query, originalDesc);
                else descEl.textContent = originalDesc;
                return true;
            } else {
                item.style.display = 'none';
                nameEl.textContent = originalName;
                descEl.textContent = originalDesc;
                return false;
            }
        }

        function filterTools() {
            const query = toolSearchInput.value.trim().toLowerCase();
            clearSearchBtn.style.display = query.length > 0 ? 'flex' : 'none';

            let visibleToolsCounter = 0;

            toolCategoryCards.forEach(category => {
                const categoryId = category.getAttribute('data-category');
                const categoryTitle = category.querySelector('h3').textContent.toLowerCase();
                const itemsInCat = category.querySelectorAll('.tool-card-item');
                let visibleItemsInCat = 0;

                if (activeFilter !== 'all' && categoryId !== activeFilter) {
                    category.style.display = 'none';
                    return;
                }

                itemsInCat.forEach(item => {
                    if (updateToolItemDisplay(item, query, categoryTitle)) {
                        visibleItemsInCat++;
                        visibleToolsCounter++;
                    }
                });

                if (visibleItemsInCat > 0 || (categoryTitle.includes(query) && itemsInCat.length > 0)) {
                    category.style.display = 'block';
                    if (categoryTitle.includes(query) && visibleItemsInCat === 0) {
                        itemsInCat.forEach(item => {
                            item.style.display = 'flex';
                            visibleToolsCounter++;
                            item.querySelector('.tool-lbl-name').textContent = item.getAttribute('data-name');
                            item.querySelector('.tool-lbl-desc').textContent = item.getAttribute('data-desc');
                        });
                    }
                } else {
                    category.style.display = 'none';
                }
            });

            if (visibleToolsCounter === 0 && (query.length > 0 || activeFilter !== 'all')) {
                noToolsResults.style.display = 'block';
                noToolsResultsText.textContent = query.length > 0 ? `No tools found matching "${toolSearchInput.value}".` : `No tools in this category match your current filters.`;
                ytToolsFallbackLink.style.display = query.length > 0 ? 'inline-flex' : 'none';
                if (query.length > 0) ytToolsFallbackLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(toolSearchInput.value + ' tutorial cybersecurity')}`;
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
    