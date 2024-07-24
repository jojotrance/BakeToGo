@extends('layouts.shop')

@section('body')
<div class="container">
    <h2 class="page-title">My Reviews</h2>

    <div class="review-status-tabs">
        <div class="tab active" data-status="not_reviewed">Not Reviewed</div>
        <div class="tab" data-status="reviewed">Reviewed</div>
    </div>
    
    <div class="review-status-sections">
        @foreach (['not_reviewed', 'reviewed'] as $status)
            <div class="review-section" id="review-section-{{ $status }}">
                <div class="reviews">
                    <!-- Reviews will be dynamically inserted here -->
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection

