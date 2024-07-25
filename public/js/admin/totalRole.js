// public/js/admin/totalRole.js

document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/admin/charts/total-role')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(role => capitalizeFirstLetter(role.role));
            const counts = data.map(role => role.total);

            const backgroundColors = labels.map(() => getRandomColor());
            const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

            const ctx = document.getElementById('totalRoleChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# of Roles',
                        data: counts,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
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
                            text: 'Number of Users by Role'
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching role data:', error));
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color + '33'; // Add transparency
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
