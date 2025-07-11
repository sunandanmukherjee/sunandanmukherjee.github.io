document.addEventListener('DOMContentLoaded', () => {
    const pubContainer = document.getElementById('publications-container');
    const tagsContainer = document.getElementById('filter-tags-container');
    const myName = "Sunandan Mukherjee";

    const tagColors = {
        "Molecular modeling": "is-primary",
        "Data mining": "is-link",
        "Software": "is-info",
        "Database": "is-success",
        "AI/ML": "is-warning",
        "Analysis": "is-danger",
        "Review": "is-dark",
        "Book chapter": "is-light",
    };

    let allPublications = [];
    let allTags = new Set();

    function formatAuthors(authorString) {
        if (!authorString) return 'Author not found';
        let formattedString = authorString.replace(myName, `<strong>${myName}</strong>`);
        const authors = formattedString.split(', ');
        if (authors.length > 10) {
            const first = authors.slice(0, 9).join(', ');
            const last = authors[authors.length - 1];
            formattedString = `${first} ... et al. ... and ${last}`;
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

                const abstractHTML = entry.abstract ? `...` : ''; // Kept for brevity, add your abstract logic here if needed

                const pubElement = document.createElement('div');
                pubElement.className = 'box publication-entry';
                pubElement.innerHTML = `
                    <article class="media">
                        <figure class="media-left"><p class="image is-128x128"><img src="img/graphical_abstracts/${entry.id}.jpg" ...></p></figure>
                        <div class="media-content">
                            <div class="content">
                                <h4 class="title is-4">${entry.title}</h4>
                                <p class="authors">${formatAuthors(entry.author)}</p>
                                <p class="journal"><em>${entry.journal || ''}</em>...</p>
                                <div class="tags mt-2">${tagsHTML}</div>
                                ${abstractHTML}
                            </div>
                            <div class="level is-mobile">...</div>
                        </div>
                    </article>
                `;
                 // Note: I've truncated the HTML for brevity. Copy the full structure from your previous script.
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

                if (selectedTag === 'all') {
                    renderPublications(allPublications);
                } else {
                    const filteredPubs = allPublications.filter(pub => pub.tags && pub.tags.includes(selectedTag));
                    renderPublications(filteredPubs);
                }
            }
        });
    }

    fetch('publications.json')
        .then(response => response.json())
        .then(data => {
            allPublications = data.publications;
            allPublications.forEach(pub => {
                if (pub.tags) {
                    pub.tags.forEach(tag => allTags.add(tag));
                }
            });
            renderTags();
            renderPublications(allPublications);
        })
        .catch(error => {
            pubContainer.innerHTML = `<p class="has-text-centered has-text-danger">Failed to load publications.</p>`;
            console.error(error);
        });
});