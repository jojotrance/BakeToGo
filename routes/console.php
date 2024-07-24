<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Algolia\AlgoliaSearch\SearchClient;
/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Artisan::command('algolia:clear', function () {
    $client = SearchClient::create(config('scout.algolia.id'), config('scout.algolia.secret'));
    $index = $client->initIndex('products');
    $index->clearObjects();
    $this->info('Algolia index cleared.');
})->describe('Clear the Algolia index');
