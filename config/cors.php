<?php

$frontendUrls = array_values(array_unique(array_filter(array_map(
   fn($url) => rtrim(trim($url), '/'),
   explode(',', env('FRONTEND_URL', ''))
))));

$frontendUrls[] = 'http://localhost:5173';
$frontendUrls[] = 'http://localhost:3000';
$frontendUrls[] = 'http://localhost:8000';

return [
   'paths' => ['api/*', 'sanctum/csrf-cookie'],
   'allowed_methods' => ['*'],
   'allowed_origins' => $frontendUrls ?: ['*'],
   'allowed_origins_patterns' => [],
   'allowed_headers' => ['*'],
   'exposed_headers' => [],
   'max_age' => 0,
   'supports_credentials' => false,
];
