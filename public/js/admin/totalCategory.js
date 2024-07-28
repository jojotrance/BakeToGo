// public/js/admin/totalCategory.js

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('totalCategoryChart').getContext('2d');

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    fetch('/api/admin/charts/total-category')
        .then(response => response.json())
        .then(data => {
            const categories = data.map(item => item.category);
            const totals = data.map(item => item.total);

            const backgroundColors = categories.map(() => getRandomColor());
            const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: categories,
                    datasets: [{
                        label: 'Number of Products per Category',
                        data: totals,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Number of Products per Category'
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error:', error));
});
