document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('publications-container');

    // Fetch the JSON file instead of the bib file
    fetch('publications.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(publicationsData => {
            // Check if the data is a non-empty array
            if (!Array.isArray(publicationsData) || publicationsData.length === 0) {
                container.innerHTML = '<p class="has-text-centered has-text-danger">No publications found or data is not in the correct format.</p>';
                return;
            }

            // Clear the "Loading..." message
            container.innerHTML = '';

            // Sort publications by year, descending
            publicationsData.sort((a, b) => (b.year || 0) - (a.year || 0));

            // Loop through the array of publications and create HTML for each one
            publicationsData.forEach(entry => {
                // Construct the image path using the entry's 'id'
                // You can add more supported extensions here if needed
                const graphicalAbstractUrl = `img/graphical_abstracts/${entry.id}.jpg`;

                const publicationHTML = `
                    <div class="box publication-entry">
                        <article class="media">
                            <figure class="media-left">
                                <p class="image is-128x128">
                                    <img src="${graphicalAbstractUrl}" alt="Graphical Abstract for ${entry.title}" onerror="this.onerror=null;this.src='https://via.placeholder.com/128x128.png?text=No+Image';">
                                </p>
                            </figure>
                            <div class="media-content">
                                <div class="content">
                                    <h4 class="title is-4">${entry.title || 'Title not found'}</h4>
                                    <p class="authors">${entry.author || 'Author not found'}</p>
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
            console.error('Error fetching or parsing publications.json:', error);
            container.innerHTML = `<p class="has-text-centered has-text-danger">Failed to load publications. Check the browser console (F12) for more details.</p>`;
        });
});
