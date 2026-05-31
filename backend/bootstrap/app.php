<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
<<<<<<< HEAD
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php', // DÒNG NÀY LÀ BẮT BUỘC PHẢI CÓ
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
=======
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // CỰC KỲ QUAN TRỌNG: Bạn gõ thêm dòng này vào nhé!
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
>>>>>>> 850014e7c93576d4c5831768d2a492695014519a
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
