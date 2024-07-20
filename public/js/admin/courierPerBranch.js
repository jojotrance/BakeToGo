// public/js/admin/courierPerBranch.js

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('courierPerBranchChart').getContext('2d');

    fetch('/api/admin/charts/courier-per-branch')
        .then(response => response.json())
        .then(data => {
            const branches = data.map(item => item.branch);
            const totals = data.map(item => item.total);

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: branches,
                    datasets: [{
                        label: 'Number of Couriers',
                        data: totals,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
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
        .catch(error => console.error('Error:', error));
});
