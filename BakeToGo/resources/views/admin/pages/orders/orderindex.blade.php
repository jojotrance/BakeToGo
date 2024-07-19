@extends('layouts.app')

@section('content')
<div id="order-content">
    <div id="message"></div>
    <div class="container">
        <!-- Header -->
        <div class="info-bar card mb-3">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">Order Management</h5>
                    <p class="card-text">Manage your orders with ease.</p>
                </div>
                <div>
                    <button type="button" id="export_excel" class="btn btn-success btn-sm">Export to Excel</button>
                    <button type="button" id="create_order" class="btn btn-primary btn-sm">Create Order</button>
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

        <!-- Order Table -->
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>Orders</span>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table" id="order_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Payment Method</th>
                                <th>Courier</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
        <!-- End of Order Table -->

        <!-- Order Form Modal -->
        <div class="modal fade" tabindex="-1" id="order_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form method="post" id="order_form" enctype="multipart/form-data" novalidate>
                        @csrf
                        <div class="modal-header">
                            <h5 class="modal-title" id="modal_title">Add New Order</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Customer</label>
                                <input type="text" name="customer_id" id="customer_id" class="form-control" required />
                                <span id="customer_id_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select name="status" id="status" class="form-control" required>
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                                <span id="status_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Payment Method</label>
                                <select name="payment_method" id="payment_method" class="form-control" required>
                                    <option value="">Select Payment Method</option>
                                    <option value="gcash">GCash</option>
                                    <option value="cod">COD</option>
                                    <option value="credit">Credit</option>
                                    <option value="amazon pay">Amazon Pay</option>
                                    <option value="applepay">ApplePay</option>
                                </select>
                                <span id="payment_method_error" class="text-danger"></span>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Courier</label>
                                <select name="courier" id="courier" class="form-control" required>
                                    <option value="">Select Courier</option>
                                    <option value="FedEx">FedEx</option>
                                    <option value="DHL">DHL</option>
                                    <option value="Amazon">Amazon</option>
                                </select>
                                <span id="courier_error" class="text-danger"></span>
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
        <!-- End of Order Form Modal -->

        <!-- Confirm Modal for Delete -->
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

