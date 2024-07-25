@extends('layouts.app')

@section('content')
<div id="product-content">
    <div id="message"></div>
    <div class="container">
        <!-- Header -->
        <div class="info-bar card mb-3">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">Product Management</h5>
                    <p class="card-text">Manage your product inventory with ease.</p>
                </div>
                <div>
                    <button type="button" id="export_excel" class="btn btn-success btn-sm">Export to Excel</button>
                    <button type="button" id="create_product" class="btn btn-primary btn-sm">Create Product</button>
                </div>
            </div>
        </div>
        <!-- End of Header -->

        <!-- Success Notification -->
        <div id="success-alert" class="alert alert-success alert-dismissible fade show" role="alert" style="display: none;">
            <span id="success-message"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <!-- End of Success Notification -->

        <!-- Error Notification -->
        <div id="error-alert" class="alert alert-danger alert-dismissible fade show" role="alert" style="display: none;">
            <span id="error-message"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <!-- End of Error Notification -->
        <div id="loading-indicator" style="display: none;">
    Processing... Please wait.
</div>

        <!-- Product Table -->
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Products</span>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table" id="product_datatable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
        <!-- End of Product Table -->

        <!-- Product Form Modal -->
        <div class="modal fade" tabindex="-1" id="product_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form method="post" id="product_form" enctype="multipart/form-data" novalidate>
                        @csrf
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal_title">Add New Product</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" name="name" id="name" class="form-control" required />
                                <span id="name_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea name="description" id="description" class="form-control" rows="4" required></textarea>
                                <span id="description_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Price</label>
                                <input type="number" name="price" id="price" class="form-control" required />
                                <span id="price_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Category</label>
                                <select name="category" id="category" class="form-control" required>
                                    <option value="">Select Category</option>
                                    <option value="Cake">Cake</option>
                                    <option value="Pastries">Pastries</option>
                                    <!-- Add more categories as needed -->
                                </select>
                                <span id="category_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Stock</label>
                                <input type="number" name="stock" id="stock" class="form-control" value="0" readonly />
                                <span id="stock_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Image</label>
                                <input type="file" name="image" id="image" class="form-control" />
                                <span id="image_error" class="text-danger"></span>
                            </div>
                            <input type="hidden" id="hidden_id" name="hidden_id" />
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary" id="action_button">Save</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- End of Product Form Modal -->

        <!-- Confirm Delete Modal -->
        <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmModalLabel">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p id="confirm_message"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" id="confirm_button" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End of Confirm Delete Modal -->
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/components/builds/header.js') }}"></script>

@endpush