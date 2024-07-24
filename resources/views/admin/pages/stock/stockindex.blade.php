@extends('layouts.app')

@section('content')
<div id="stock-content">
    <div id="message"></div>
    <div class="container">
        <!-- Header -->
        <div class="info-bar card mb-3">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">Stock Management</h5>
                    <p class="card-text">Manage your stock with ease.</p>
                </div>
                <div>
                    <button type="button" id="export_excel" class="btn btn-success btn-sm">Export to Excel</button>
                    <button type="button" id="create_stock" class="btn btn-primary btn-sm">Create Stock</button>
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

        <!-- Stock Table -->
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Stock</span>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table" id="stock_table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Supplier</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
        <!-- End of Stock Table -->

        <!-- Stock Form Modal -->
        <div class="modal fade" tabindex="-1" id="stock_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form method="post" id="stock_form" novalidate>
                        @csrf
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal_title">Add New Stock</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Product</label>
                                <select name="product_id" id="product_id" class="form-control" required></select>
                                <span id="product_id_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Quantity</label>
                                <input type="number" name="quantity" id="quantity" class="form-control" required />
                                <span id="quantity_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Supplier</label>
                                <select name="supplier_id" id="supplier_id" class="form-control"></select>
                                <span id="supplier_id_error" class="text-danger"></span>
                            </div>
                            <input type="hidden" name="hidden_id" id="hidden_id" />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" id="action_button">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- End of Stock Form Modal -->

        <!-- Confirm Modal -->
        <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p id="confirm_message"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirm_button">Confirm</button>
                    </div>
                </div>  
            </div>
        </div>
        <!-- End of Confirm Modal -->

    </div>
</div>
@endsection


@push('scripts')
    <script src="{{ asset('js/components/builds/header.js') }}"></script>

@endpush