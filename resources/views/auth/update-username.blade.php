<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Username - MSL</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card {
            max-width: 500px;
            width: 100%;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .requirements-list {
            font-size: 0.9rem;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card border-0">
                    <div class="card-header bg-danger text-white py-3">
                        <h4 class="mb-0 text-center">Update Your Username</h4>
                    </div>
                    <div class="card-body p-4">
                        <div class="text-center mb-4">
                            <p class="text-muted">
                                Hello <strong>{{ $user->name }}</strong>,<br>
                                Your current username <code>{{ $user->username }}</code> does not meet our requirements.
                                Please choose a new username to continue using your account.
                            </p>
                        </div>

                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <ul class="mb-0">
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <form method="POST" action="{{ route('username.update.submit', $user->id) }}">
                            @csrf
                            
                            <div class="mb-3">
                                <label for="username" class="form-label">New Username</label>
                                <input type="text" class="form-control @error('username') is-invalid @enderror" 
                                       id="username" name="username" value="{{ old('username') }}" required autofocus>
                                <div class="form-text text-muted">
                                    <ul class="requirements-list ps-3 mb-0">
                                        <li>Must be between 4 and 15 characters</li>
                                        <li>Must not contain spaces</li>
                                        <li>Must be unique</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary">
                                    Update Username
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
