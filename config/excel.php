<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Excel Export Options
    |--------------------------------------------------------------------------
    |
    | Here you can define all the options that are used when exporting Excel files.
    |
    */

    'export' => [
        'autosize' => true,
        'autosize-method' => 'approx',
        'chunk' => [
            'size' => 1000
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Excel Import Options
    |--------------------------------------------------------------------------
    |
    | Here you can define all the options that are used when importing Excel files.
    |
    */

    'import' => [
        'heading' => 'slugged', // original|slugged|slugged_with_count|ascii|numeric
        'to_collection' => false,
        'chunk' => [
            'size' => 1000
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | View Options
    |--------------------------------------------------------------------------
    |
    | Here you can define all the options that are used when rendering Excel files
    | as views.
    |
    */

    'view' => [
        'styles' => [
            'default' => [
                'font' => [
                    'name' => 'Calibri',
                    'size' => 11,
                    'bold' => false,
                    'italic' => false,
                    'underline' => false,
                    'strikethrough' => false,
                    'color' => [
                        'rgb' => '000000'
                    ]
                ]
            ]
        ]
    ]
];
