$(document).ready(function() {
    fetchReviews();

    function fetchReviews() {
        $.ajax({
            url: "/api/customer/reviews/history", // Ensure this matches the route definition
            type: "GET",
            success: function(response) {
                if (response.reviews) {
                    renderReviews(response.reviews);
                }
            },
            error: function(xhr) {
                console.error("Error fetching reviews:", xhr.responseText);
            }
        });
    }

    function renderReviews(reviews) {
        const reviewTabs = ['not_reviewed', 'reviewed'];
        reviewTabs.forEach(status => {
            const reviewSection = $('#review-section-' + status + ' .reviews');
            reviewSection.empty(); // Clear previous content
            let reviewsExist = false;
            reviews.forEach(review => {
                if (review.status === status) {
                    reviewsExist = true;
                    reviewSection.append(`
                        <div class="review-card" data-review-id="${review.id}">
                            <div class="product-image">
                                <img src="${review.product[0].image_url}" alt="${review.product[0].name}">
                            </div>
                            <div class="review-info">
                                <h4>${review.product[0].name}</h4>
                                <p>${review.product[0].description}</p>
                                ${status === 'not_reviewed' ? '<button class="review-button">Review</button>' : ''}
                            </div>
                        </div>
                    `);
                }
            });
            if (!reviewsExist) {
                reviewSection.append(`<p class="no-reviews">No reviews found for this status.</p>`);
            }
        });
    }

    $('.tab').click(function() {
        $('.tab').removeClass('active');
        $(this).addClass('active');
        
        var status = $(this).data('status');
        $('.review-section').removeClass('active');
        $('#review-section-' + status).addClass('active');

        // Check if the target element exists before using offset().top
        var targetSection = $('#review-section-' + status);
        if (targetSection.length) {
            $('html, body').animate({
                scrollTop: targetSection.offset().top - 100
            }, 500);
        }
    });

    // Initially show the 'Not Reviewed' tab
    $('.tab[data-status="not_reviewed"]').click();

    // Add hover effect to review cards
    $(document).on('mouseenter', '.review-card', function() {
        $(this).addClass('hover');
    }).on('mouseleave', '.review-card', function() {
        $(this).removeClass('hover');
    });

    // Review button click event
    $(document).on('click', '.review-button', function() {
        // Implement your review functionality here
        alert('Review functionality to be implemented');
    });
});
