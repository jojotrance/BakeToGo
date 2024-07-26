document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('totalSupplierChart').getContext('2d');

    fetch('/api/admin/charts/total-supplier')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.total !== undefined) {
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
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Total Suppliers'
                            }
                        }
                    }
                });
            } else {
                console.error('Invalid data format:', data);
                alert('Failed to load total supplier data. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load total supplier data. Please try again.');
        });
});
