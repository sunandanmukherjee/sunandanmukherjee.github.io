// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('publications.json')
        .then(response => response.json())
        .then(data => {
            // --- Populate Metrics ---
            const metrics = data.metrics;
            document.getElementById('metric-papers').textContent = metrics.total_papers || 'N/A';
            document.getElementById('metric-citations').textContent = metrics.total_citations || 'N/A';
            document.getElementById('metric-h-index').textContent = metrics.h_index || 'N/A';
            document.getElementById('metric-if').textContent = metrics.cumulative_if || 'N/A';
            
            // --- Prepare Chart Data ---
            const publications = data.publications;
            const pubsByYear = {};
            publications.forEach(pub => {
                const year = pub.year;
                if (year) {
                    pubsByYear[year] = (pubsByYear[year] || 0) + 1;
                }
            });

            const sortedYears = Object.keys(pubsByYear).sort();
            const yearLabels = sortedYears;
            const yearData = sortedYears.map(year => pubsByYear[year]);

            // --- Render Chart ---
            const ctx = document.getElementById('publicationsChart').getContext('2d');
            new Chart(ctx, {
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
