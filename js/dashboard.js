document.addEventListener('DOMContentLoaded', () => {
    // We are now fetching the same file as the publications page
    fetch('publications.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(publications => {
            if (!Array.isArray(publications) || publications.length === 0) {
                console.error("Dashboard: No publications data found or data is not an array.");
                return;
            }

            // --- Calculate and Populate Metrics Dynamically ---
            // These are placeholders. You can manually set these or keep them simple.
            // For a truly dynamic solution, you'd need more data.
            document.getElementById('metric-papers').textContent = publications.length;
            document.getElementById('metric-citations').textContent = "1400+"; // Manually update this value
            document.getElementById('metric-h-index').textContent = "15"; // Manually update this value
            document.getElementById('metric-if').textContent = "302.8"; // Manually update this value
            
            // --- Prepare Chart Data ---
            const pubsByYear = {};
            publications.forEach(pub => {
                const year = pub.year;
                if (year) {
                    pubsByYear[year] = (pubsByYear[year] || 0) + 1;
                }
            });

            const sortedYears = Object.keys(pubsByYear).sort((a, b) => a - b);
            const yearLabels = sortedYears;
            const yearData = sortedYears.map(year => pubsByYear[year]);

            // --- Render Chart ---
            const ctx = document.getElementById('publicationsChart');
            if (!ctx) {
                console.error("Chart canvas element not found!");
                return;
            }
            new Chart(ctx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: yearLabels,
                    datasets: [{
                        label: 'Papers per Year',
                        data: yearData,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        })
        .catch(error => console.error("Error loading dashboard data:", error));
});