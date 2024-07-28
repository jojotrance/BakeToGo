@extends('layouts.app')

@section('content')
<div id="order-content">
    <div id="message"></div>
    <div class="container">
        <!-- Info Bar -->
        <div class="info-bar card mb-3">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">Welcome to User Management</h5>
                    <p class="card-text">Here you can select the roles and active status of the user accounts.</p>
                </div>
                <div class="d-flex align-items-center">
                    <div class="card me-3">
                        <div class="card-body">
                            <form method="POST" enctype="multipart/form-data" action="{{ route('imports.usermanagement') }}" class="d-flex align-items-center">
                                @csrf
                                <input type="file" id="uploadName" name="item_upload" class="form-control me-2" required>
                                <button id="import-form-submit" type="submit" class="btn btn-primary">Import Excel File</button>
                            </form>
                        </div>
                    </div>
                    <button type="button" id="create_courier" class="btn btn-primary btn-sm">Create User</button>
                </div>
            </div>
        </div>
        <!-- End of Info Bar -->

        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col col-sm-12">Manage Users</div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-bordered" id="datatable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Profile Image</th>
                                <th>Username</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Address</th>
                                <th>Role</th>
                                <th>Active Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Data Rows Go Here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Add/Edit -->
    <div class="modal" tabindex="-1" id="action_modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="post" id="sample_form">
                    <div class="modal-header">
                        <h5 class="modal-title" id="dynamic_modal_title"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Username</label>
                            <input type="text" name="name" id="name" class="form-control" required disabled />
                            <span id="name_error" class="text-danger"></span>
                        </div>
                        <div class="mb-3">
                            <label for="role" class="form-label">Role</label>
                            <select class="form-select" id="role" name="role">
                                <option value="admin">Admin</option>
                                <option value="customer">Customer</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Active Status</label>
                            <select class="form-select" id="active_status" name="active_status">
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                            <span id="active_status_error" class="text-danger"></span>
                        </div>
                        <!-- Hidden method field -->
                        <input type="hidden" name="_method" value="PUT" id="form_method">
                    </div>
                    <div class="modal-footer">
                        <input type="hidden" name="id" id="id" />
                        <input type="hidden" name="action" id="action" value="Add" />
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" id="action_button">Edit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Import Modal -->
    <div class="modal fade" id="import_modal" tabindex="-1" aria-labelledby="importModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="post" id="import_form" enctype="multipart/form-data">
                    <div class="modal-header">
                        <h5 class="modal-title" id="importModalLabel">Import Users from Excel</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="file" class="form-label">Choose Excel File</label>
                            <input type="file" class="form-control" id="file" name="file" required accept=".xls,.xlsx">
                        </div>
                        <div id="import_message"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Import</button>
                        <button type="button" id="clear_import_data" class="btn btn-danger">Clear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection


@push('scripts')
    <script src="{{ asset('js/components/builds/header.js') }}"></script>

@endpush
