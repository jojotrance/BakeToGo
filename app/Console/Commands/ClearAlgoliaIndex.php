<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Algolia\AlgoliaSearch\SearchClient;
class ClearAlgoliaIndex extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-algolia-index';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $client = SearchClient::create(config('scout.algolia.id'), config('scout.algolia.secret'));
        $index = $client->initIndex('products');
        $index->clearObjects();
        $this->info('Algolia index cleared.');

        return 0;
    }
}
