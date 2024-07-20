document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/admin/charts/total-role')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(role => role.role);
            const counts = data.map(role => role.total);

            const ctx = document.getElementById('totalRoleChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# of Roles',
                        data: counts,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching role data:', error));
});
