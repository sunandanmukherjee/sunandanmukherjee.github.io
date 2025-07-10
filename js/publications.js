document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('publications-container');

    fetch('publications.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(publications => {
            if (!Array.isArray(publications) || publications.length === 0) {
                container.innerHTML = '<p class="has-text-centered has-text-danger">Could not load publications. Please check the JSON file.</p>';
                return;
            }

            // Clear the "Loading..." message
            container.innerHTML = '';

            // Sort publications by year, descending
            publications.sort((a, b) => {
                const yearA = parseInt(a.year, 10) || 0;
                const yearB = parseInt(b.year, 10) || 0;
                return yearB - yearA;
            });

            publications.forEach(entry => {
                // Use a key or id for graphical abstract filename; fallback to sanitized title if no key
                const key = entry.key || entry.id || entry.title?.replace(/\W+/g, '_').toLowerCase() || 'unknown';
                const graphicalAbstractUrl = `img/graphical_abstracts/${key}.png`;

                const publicationHTML = `
                    <div class="box publication-entry">
                        <article class="media">
                            <figure class="media-left">
                                <p class="image is-128x128">
                                    <img src="${graphicalAbstractUrl}" alt="Graphical Abstract for ${entry.title || 'No Title'}" onerror="this.onerror=null;this.src='https://via.placeholder.com/128x128.png?text=No+Image';">
                                </p>
                            </figure>
                            <div class="media-content">
                                <div class="content">
                                    <h4 class="title is-4">${entry.title || 'Title not found'}</h4>
                                    <p class="authors">${entry.authors || 'Author not found'}</p>
                                    <p class="journal">
                                        <em>${entry.journal || ''}</em>
                                        ${entry.volume ? `, vol. ${entry.volume}` : ''}
                                        ${entry.pages ? `, pp. ${entry.pages}` : ''}
                                        (${entry.year || 'Year not found'})
                                    </p>
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
                    </div>
                `;
                container.innerHTML += publicationHTML;
            });

            // Re-run Altmetrics embed script after adding new elements
            if (window._altmetric_embed_init) {
                window._altmetric_embed_init();
            }

        }).catch(error => {
            console.error('Error fetching or parsing JSON file:', error);
            container.innerHTML = '<p class="has-text-centered has-text-danger">Failed to load publications.</p>';
        });
});

