document.addEventListener('DOMContentLoaded', () => {
    const pubContainer = document.getElementById('publications-container');
    const tagsContainer = document.getElementById('filter-tags-container');
    const myName = "Sunandan Mukherjee"; // Your name as it appears in the JSON

    const tagColors = {
        "Molecular modeling": "is-primary",
        "Data mining": "is-link",
        "Software": "is-info",
        "Database": "is-success",
        "AI/ML": "is-warning",
        "Analysis": "is-danger",
        "Review": "is-dark",
        "Book chapter": "is-light is-black-ter", // Light with dark text
    };

    let allPublications = [];
    let allTags = new Set();

    function formatAuthors(authorString) {
        if (!authorString) return 'Author not found';
        let formattedString = authorString.replace(new RegExp(myName, 'g'), `<strong>${myName}</strong>`);

        const authors = formattedString.split(', ');
        if (authors.length > 10) {
            const firstAuthors = authors.slice(0, 5).join(', ');
            const lastAuthor = authors[authors.length - 1];
            formattedString = `${firstAuthors}, ..., ${lastAuthor}`;
        }
        
        return formattedString;
    }

    function renderPublications(publicationsToRender) {
        pubContainer.innerHTML = '';
        if (publicationsToRender.length === 0) {
            pubContainer.innerHTML = '<p class="has-text-centered">No publications match the selected filter.</p>';
            return;
        }

        const groupedByYear = publicationsToRender.reduce((acc, pub) => {
            const year = pub.year || 'Undated';
            if (!acc[year]) acc[year] = [];
            acc[year].push(pub);
            return acc;
        }, {});

        const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

        sortedYears.forEach(year => {
            const yearSection = document.createElement('div');
            yearSection.innerHTML = `<h2 class="title is-3 year-heading">${year}</h2>`;
            pubContainer.appendChild(yearSection);

            groupedByYear[year].forEach(entry => {
                const tagsHTML = (entry.tags || []).map(tag => 
                    `<span class="tag ${tagColors[tag] || 'is-light'}">${tag}</span>`
                ).join('');

                const abstractHTML = entry.abstract ? `
                    <details class="abstract-details mt-3">
                        <summary>View Abstract</summary>
                        <p class="pt-2 has-text-justified">${entry.abstract}</p>
                    </details>
                ` : '';

                const pubElement = document.createElement('div');
                pubElement.className = 'box publication-entry';
                pubElement.innerHTML = `
                    <article class="media">
                        <figure class="media-left">
                            <p class="image is-128x128">
                                <img src="img/graphical_abstracts/${entry.id}.jpg" alt="Graphical Abstract for ${entry.title}" onerror="this.onerror=null;this.src='https://via.placeholder.com/128x128.png?text=No+Image';">
                            </p>
                        </figure>
                        <div class="media-content">
                            <div class="content">
                                <h4 class="title is-4">${entry.title || 'Title not found'}</h4>
                                <p class="authors">${formatAuthors(entry.author)}</p>
                                <p class="journal">
                                    <em>${entry.journal || ''}</em>
                                    ${entry.volume ? `, vol. ${entry.volume}` : ''}
                                    ${entry.pages ? `, pp. ${entry.pages}` : ''}
                                    (${entry.year || 'Year not found'})
                                </p>
                                <div class="tags mt-2">${tagsHTML}</div>
                                ${abstractHTML}
                            </div>
                            <div class="level is-mobile">
                                <div class="level-left">
                                    ${entry.doi ? `
                                    <a href="https://doi.org/${entry.doi}" target="_blank" class="button is-small is-primary">
                                        <span class="icon"><i class="fas fa-link"></i></span>
                                        <span>DOI</span>
                                    </a>` : ''}
                                    ${entry.doi ? `
                                    <div class="altmetric-embed" data-doi="${entry.doi}" data-hide-no-mentions="true" data-link-target="_blank" style="margin-left: 10px;"></div>` : ''}
                                </div>
                            </div>
                        </div>
                    </article>
                `;
                pubContainer.appendChild(pubElement);
            });
        });
        
        if (window._altmetric_embed_init) window._altmetric_embed_init();
    }

    function renderTags() {
        tagsContainer.innerHTML = '<div class="control"><button class="button is-small is-dark is-active" data-tag="all">Show All</button></div>';
        [...allTags].sort().forEach(tag => {
            tagsContainer.innerHTML += `<div class="control"><button class="button is-small ${tagColors[tag] || 'is-light'}" data-tag="${tag}">${tag}</button></div>`;
        });

        tagsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const selectedTag = e.target.dataset.tag;
                
                tagsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('is-dark', 'is-active'));
                e.target.classList.add('is-dark', 'is-active');

                const filteredPubs = (selectedTag === 'all') 
                    ? allPublications 
                    : allPublications.filter(pub => pub.tags && pub.tags.includes(selectedTag));
                
                renderPublications(filteredPubs);
            }
        });
    }

    fetch('publications.json')
        .then(response => response.json())
        .then(data => {
            allPublications = data; // Directly use the data array
            allPublications.forEach(pub => {
                if (pub.tags) {
                    pub.tags.forEach(tag => allTags.add(tag));
                }
            });
            renderTags();
            renderPublications(allPublications);
        })
        .catch(error => {
            pubContainer.innerHTML = `<p class="has-text-centered has-text-danger">Failed to load publications. Check the console (F12) and ensure publications.json is valid.</p>`;
            console.error(error);
        });
});