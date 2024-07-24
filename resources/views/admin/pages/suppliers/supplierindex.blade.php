@extends('layouts.app')

@section('content')
<div id="supplier-content">
    <div id="message"></div>
    <div class="container">
        <!-- Header -->
        <div class="info-bar card mb-3">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">Supplier Management</h5>
                    <p class="card-text">Manage suppliers with ease.</p>
                </div>
                <div>
                    <button type="button" id="export_excel" class="btn btn-success btn-sm">Export to Excel</button>
                    <button type="button" id="create_supplier" class="btn btn-primary btn-sm">Create Supplier</button>
                </div>
            </div>
        </div>
        <!-- Success Notification -->
        <div id="supplier_success-alert" class="alert alert-success alert-dismissible fade show" role="alert" style="display: none;">
            <span id="supplier_success-message"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <!-- End of Success Notification -->

        <!-- Error Notification -->
        <div id="supplier_error-alert" class="alert alert-danger alert-dismissible fade show" role="alert" style="display: none;">
            <span id="supplier_error-message"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <!-- Supplier Table -->
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Suppliers</span>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table" id="supplier_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
        <!-- Supplier Form Modal -->
        <div class="modal fade" tabindex="-1" id="supplier_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form method="post" id="supplier_form" enctype="multipart/form-data" novalidate>
                        @csrf
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal_title_supplier">Add New Supplier</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" name="supplier_name" id="supplier_name" class="form-control" required />
                                <span id="supplier_name_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Image</label>
                                <input type="file" name="image" id="supplier_image" class="form-control" accept="image/*" required />
                                <span id="supplier_image_error" class="text-danger"></span>
                            </div>
                            <input type="hidden" name="hidden_id" id="hidden_id_supplier" />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" id="action_button_supplier">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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
    </div>
</div>
@endsection


@push('scripts')
    <script src="{{ asset('js/components/builds/header.js') }}"></script>

@endpush
