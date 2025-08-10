<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Renewal Required</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .title {
            color: #e74c3c;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .highlight {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 14px;
        }
        .warning {
            color: #e74c3c;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MSL Team</div>
            <div class="title">Account Renewal Required</div>
        </div>

        <div class="content">
            <p>Dear <strong>{{ $user->name }} {{ $user->surname }}</strong>,</p>

            <p>Your MSL account has been marked for renewal. This means your account status has been reset and requires re-verification.</p>

            <div class="highlight">
                <p><strong>What you need to do:</strong></p>
                <ul>
                    <li>Log in to your MSL account</li>
                    <li>Upload your proof of enrollment documents again (previous documents have been cleared)</li>
                    <li>Wait for verification from your Student Leader or Regional Admin</li>
                </ul>
            </div>

            <p><span class="warning">Important:</span> Your account is currently in "New" status and you will need to go through the verification process again to regain access to all platform features.</p>

            <p><strong>Account Details:</strong></p>
            <ul>
                <li><strong>Username:</strong> {{ $user->username }}</li>
                <li><strong>Email:</strong> {{ $user->email }}</li>
                <li><strong>Current Status:</strong> New (Pending Verification)</li>
            </ul>

            <p>If you have any questions or need assistance, please contact your Student Leader or Regional Admin.</p>

            <p>Thank you for your cooperation.</p>

            <p>Best regards,<br>
            <strong>MSL Team</strong></p>
        </div>

        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; {{ date('Y') }} MSL Team. All rights reserved.</p>
        </div>
    </div>
</body>
</html> 