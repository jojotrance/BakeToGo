@extends('layouts.app')

@section('content')
<div id="courier-content">
    <div id="message"></div>
    <div class="container">
        <!-- Header -->
        <div class="info-bar card mb-3">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">Courier Management</h5>
                    <p class="card-text">Manage your couriers with ease.</p>
                </div>
                <div>
                    <button type="button" id="export_excel" class="btn btn-success btn-sm">Export to Excel</button>
                    <button type="button" id="create_courier" class="btn btn-primary btn-sm">Create Courier</button>
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

        <!-- Courier Table -->
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Couriers</span>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table" id="courier_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Courier Name</th>
                                <th>Branch</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
        <!-- End of Courier Table -->

        <!-- Courier Form Modal -->
        <div class="modal fade" tabindex="-1" id="courier_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form method="post" id="courier_form" enctype="multipart/form-data" novalidate>
                        @csrf
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal_title_courier">Add New Courier</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Courier Name</label>
                                <input type="text" name="courier_name" id="courier_name" class="form-control" required />
                                <span id="courier_name_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Branch</label>
                                <input type="text" name="branch" id="branch" class="form-control" required />
                                <span id="branch_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Image</label>
                                <input type="file" name="image" id="image" class="form-control" accept="image/*" required />
                                <span id="image_error" class="text-danger"></span>
                            </div>
                            <input type="hidden" name="hidden_id" id="hidden_id_courier" />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" id="action_button_courier">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- End of Courier Form Modal -->

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