// public/js/admin/courierPerBranch.js

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('courierPerBranchChart').getContext('2d');

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    fetch('/api/admin/charts/get-courier-per-branch')
        .then(response => response.json())
        .then(data => {
            const branches = data.map(item => item.branch);
            const totals = data.map(item => item.total);

            const backgroundColors = branches.map(() => getRandomColor());
            const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: branches,
                    datasets: [{
                        label: 'Number of Couriers',
                        data: totals,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
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
                            text: 'Number of Couriers Per Branch'
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error:', error));
});
