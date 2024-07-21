@extends('layouts.app')

@section('content')
<div class="profile-page">
    <div class="profile-container">
        <div class="profile-header">
            <div class="profile-info-container">
                <div class="profile-pic-container">
                    <img src="{{ Auth::user()->profile_image }}" alt="Profile Picture" class="profile-pic" id="profile-pic">
                    <div class="profile-pic-overlay">
                        <i class="fas fa-camera"></i>
                        <span>Change Photo</span>
                    </div>
                </div>
                <div class="profile-info">
                    <h1 class="profile-name">{{ Auth::user()->customer->fname }} {{ Auth::user()->customer->lname }}</h1>
                    <p class="profile-email">{{ Auth::user()->email }}</p>
                </div>
            </div>
            <button type="submit" form="profile-form" class="btn btn-primary">Save Changes</button>
        </div>
        
        <form method="POST" action="{{ route('customer.profile.edit') }}" enctype="multipart/form-data" id="profile-form">
            @csrf
            <div id="error-messages"></div>
            <div class="form-layout">
                <div class="form-group">
                    <label for="fname" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="fname" name="fname" value="{{ Auth::user()->customer->fname }}" required>
                </div>
                <div class="form-group">
                    <label for="lname" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lname" name="lname" value="{{ Auth::user()->customer->lname }}" required>
                </div>
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" name="email" value="{{ Auth::user()->email }}" required>
                </div>
                <div class="form-group">
                    <label for="contact" class="form-label">Contact</label>
                    <input type="text" class="form-control" id="contact" name="contact" value="{{ Auth::user()->customer->contact }}" required>
                </div>
                <div class="form-group">
                    <label for="address" class="form-label">Address</label>
                    <input type="text" class="form-control" id="address" name="address" value="{{ Auth::user()->customer->address }}" required>
                </div>
                <div class="form-group">
                    <label for="profile_image" class="form-label">Profile Image</label>
                    <input type="file" class="form-control" id="profile_image" name="profile_image" accept="image/*">
                </div>
            </div>
        </form>
    </div>
</div>
@endsection