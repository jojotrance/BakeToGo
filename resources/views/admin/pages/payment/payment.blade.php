@extends('layouts.app')

@section('content')
<div id="payment-method-content">
    <div id="message"></div>
    <div class="container">
        <!-- Header -->
        <div class="info-bar card mb-3">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">Payment Method Management</h5>
                    <p class="card-text">Manage your payment methods with ease.</p>
                </div>
                <div class="d-flex align-items-center">
                    <div class="card me-3">
                        <div class="card-body">
                            <form method="POST" enctype="multipart/form-data" action="{{ route('imports.paymentmethod') }}" class="d-flex align-items-center">
                                @csrf
                                <input type="file" id="uploadName" name="item_upload" class="form-control me-2" required>
                                <button id="import-form-submit" type="submit" class="btn btn-primary">Import Excel File</button>
                            </form>
                        </div>
                    </div>
                    <button type="button" id="create_courier" class="btn btn-primary btn-sm">Create Payment Method</button>
                </div>
            </div>
        </div>
        <!-- End of Header -->

        <!-- Success Notification -->
        <div id="success_alert_payment_method" class="alert alert-success alert-dismissible fade show" role="alert" style="display: none;">
            <span id="success_message_payment_method"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <!-- End of Success Notification -->

        <!-- Error Notification -->
        <div id="error_alert_payment_method" class="alert alert-danger alert-dismissible fade show" role="alert" style="display: none;">
            <span id="error_message_payment_method"></span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <!-- End of Error Notification -->

        <!-- Payment Method Table -->
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Payment Methods</span>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table" id="payment_method_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Payment Method Name</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
        <!-- End of Payment Method Table -->

        <!-- Payment Method Form Modal -->
        <div class="modal fade" tabindex="-1" id="payment_method_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form method="post" id="payment_method_form" enctype="multipart/form-data" novalidate>
                        @csrf
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal_title_payment_method">Add New Payment Method</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Payment Method Name</label>
                                <input type="text" name="payment_name" id="payment_method_name" class="form-control" required />
                                <span id="payment_method_name_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Image</label>
                                <input type="file" name="image" id="payment_method_image" class="form-control" accept="image/*" required />
                                <span id="payment_method_image_error" class="text-danger"></span>
                            </div>
                            <input type="hidden" name="hidden_id" id="hidden_id_payment_method" />
                            <img id="image_preview" class="img-thumbnail" style="display:none; width: 100px;" />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" id="action_button_payment_method">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- End of Payment Method Form Modal -->

        <!-- Confirm Modal -->
        <div class="modal fade" id="confirm_modal_payment_method" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p id="confirm_message_payment_method"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirm_button_payment_method">Confirm</button>
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
