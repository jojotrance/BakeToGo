<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render the exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof ModelNotFoundException) {
            // Handle model not found exception
            return response()->json(['error' => 'Resource not found'], 404);
        }

        if ($this->isHttpException($exception)) {
            // Handle 404 error
            if ($exception->getStatusCode() == 404) {
                return response()->json(['error' => 'Page not found'], 404);
            }
            
            // Handle other HTTP exceptions
            return response()->json(['error' => 'An error occurred'], $exception->getStatusCode());
        } elseif ($exception instanceof \Illuminate\Auth\Access\AuthorizationException) {
            // Handle 403 error
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Handle all other exceptions
        return parent::render($request, $exception);
    }
}
