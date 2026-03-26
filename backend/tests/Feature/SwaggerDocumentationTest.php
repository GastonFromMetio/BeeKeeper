<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class SwaggerDocumentationTest extends TestCase
{
    public function test_swagger_ui_and_docs_routes_are_available(): void
    {
        Artisan::call('l5-swagger:generate');

        $this->get('/api/documentation')->assertOk();
        $this->get('/docs')->assertOk();
    }
}
