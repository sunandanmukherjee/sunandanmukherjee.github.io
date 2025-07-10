document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('publications-container');
    const myName = "Mukherjee, Sunandan"; // Your name as it appears in the JSON

    // --- Helper function to format authors ---
    function formatAuthors(authorString) {
        if (!authorString) return 'Author not found';

        // Highlight your name
        let formattedString = authorString.replace(myName, `<strong>${myName}</strong>`);

        // Truncate long author lists
        const authors = formattedString.split(' and ');
        if (authors.length > 10) {
            const firstAuthors = authors.slice(0, 9).join(' and ');
            const lastAuthor = authors[authors.length - 1];
            formattedString = `${firstAuthors} ... et al. ... and ${lastAuthor}`;
        }
        
        return formattedString;
    }

    // --- Main fetch logic ---
    fetch('publications.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(publicationsData => {
            if (!Array.isArray(publicationsData) || publicationsData.length === 0) {
                container.innerHTML = '<p class="has-text-centered has-text-danger">No publications found.</p>';
                return;
            }

            container.innerHTML = '';
            publicationsData.sort((a, b) => (b.year || 0) - (a.year || 0));

            publicationsData.forEach(entry => {
                const graphicalAbstractUrl = `img/graphical_abstracts/${entry.id}.jpg`;
                const formattedAuthors = formatAuthors(entry.author);
                
                // Conditionally create the abstract block
                const abstractHTML = entry.abstract ? `
                    <details class="abstract-details mt-3">
                        <summary>View Abstract</summary>
                        <p class="pt-2 has-text-justified">${entry.abstract}</p>
                    </details>
                ` : '';

                const publicationHTML = `
                    <div class="box publication-entry">
                        <article class="media">
                            <figure class="media-left">
                                <p class="image is-128x128">
                                    <img src="${graphicalAbstractUrl}" alt="Graphical Abstract" onerror="this.onerror=null;this.src='https://via.placeholder.com/128x128.png?text=No+Image';">
                                </p>
                            </figure>
                            <div class="media-content">
                                <div class="content">
                                    <h4 class="title is-4">${entry.title || 'Title not found'}</h4>
                                    <p class="authors">${formattedAuthors}</p>
                                    <p class="journal">
                                        <em>${entry.journal || ''}</em>
                                        ${entry.volume ? `, vol. ${entry.volume}` : ''}
                                        ${entry.pages ? `, pp. ${entry.pages}` : ''}
                                        (${entry.year || 'Year not found'})
                                    </p>
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
                    </div>
                `;
                container.innerHTML += publicationHTML;
            });

            if (window._altmetric_embed_init) {
                window._altmetric_embed_init();
            }

        }).catch(error => {
            console.error('Error fetching or parsing publications.json:', error);
            container.innerHTML = `<p class="has-text-centered has-text-danger">Failed to load publications. Check the browser console (F12).</p>`;
        });
});