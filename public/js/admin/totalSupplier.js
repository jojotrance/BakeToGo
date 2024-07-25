// public/js/admin/totalSupplier.js

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('totalSupplierChart').getContext('2d');

    fetch('/api/admin/charts/total-supplier')
        .then(response => response.json())
        .then(data => {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Total Suppliers'],
                    datasets: [{
                        label: 'Number of Suppliers',
                        data: [data.total],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
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
