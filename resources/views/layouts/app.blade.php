<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bake To Go</title>

    @vite(['resources/css/app.css', 'public/js/app.js'])    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- DataTables CSS -->
    <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/buttons/2.4.2/css/buttons.bootstrap5.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

    <!-- Select2 CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
    <!--Toastr-->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet"/>
    <!-- Custom CSS Files -->
    <link rel="stylesheet" href="{{ asset('css/orderindex.css') }}">
    <link rel="stylesheet" href="{{ asset('css/user-datatable.css') }}">
    <link rel="stylesheet" href="{{ asset('css/profile.css') }}">
    <link rel="stylesheet" href="{{ asset('css/header.css') }}">
    <link rel="stylesheet" href="{{ asset('css/admin-sidebar.css') }}">
    <link rel="stylesheet" href="{{ asset('css/product-table.css') }}">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <div id="app-root" 
         data-user="{{ json_encode(Auth::user()) }}" 
         data-role="{{ Auth::user()->is_admin ? 'admin' : 'customer' }}"
         data-hide-components="{{ isset($hideReactComponents) && $hideReactComponents ? 'true' : 'false' }}">
    </div>
    <div id="header"></div>
    <div id="content">
        @yield('content')
    </div>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <!-- DataTables JS -->
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>

    <!-- DataTables Buttons JS -->
    <script src="https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.bootstrap5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js"></script>

    <!-- Select2 JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>

    <!-- Custom JS Files -->
    <script src="{{ asset('js/header.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
    
    <!--Toastr? Wth is this-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>

    <!--Xlxs JS-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>

    <!-- Other custom JS files -->
     
    <script src="{{ asset('js/components/builds/header.js') }}"></script>
    <script src="{{ asset('js/admin/user-datatable.js') }}"></script>
    <script src="{{ asset('js/admin/product-datatable.js') }}"></script>
    <script src="{{ asset('js/admin/courier-datatable.js') }}"></script>
    <script src="{{ asset('js/admin/order-datatable.js') }}"></script>
    <script src="{{ asset('js/admin/stock-datatable.js') }}"></script>
    <script src="{{ asset('js/admin/supplier-datatable.js') }}"></script>
    <script src="{{ asset('js/customer/profile.js') }}"></script>
    <script src="{{ asset('js/SidebarData.js') }}"></script>
    <script src="{{ asset('js/admin/admin-sidebar.js') }}"></script>
    <script src="{{ asset('js/admin/payment-method-table.js') }}"></script>
    @include('layouts.script')

<script src="{{ asset('js/app.js') }}" defer></script>

<!--<script src="{{ asset('vendor/datatables/buttons.server-side.js') }}"></script>-->
    


    @stack('scripts')

    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    </script>
</body>
</html>
