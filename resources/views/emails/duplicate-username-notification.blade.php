<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MSL Username Update Required</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dee2e6;
            border-radius: 5px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 14px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>MSL Website</h1>
    </div>
    
    <div class="content">
        <h2>Immediate Action Required: Update Your MSL Username</h2>
        
        <p>Hi {{ $user->name }},</p>
        
        <p>Your current MSL username does not meet our updated requirements. You are required to change your username immediately in order to continue using your MSL account.</p>
        
        <div style="text-align: center;">
            <a href="{{ $changeUsernameUrl }}" class="button">Change Username</a>
        </div>
        
        <div class="warning">
            <strong>⚠️ Important:</strong> Failure to take action within 15 days will result in the permanent deletion of your MSL account. Once deleted, your account and all associated data cannot be recovered.
        </div>
        
        <p>Thank you!</p>
        
        <p><strong>Regards,<br>MSL Website Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>If you have any questions, please contact our support team.</p>
    </div>
</body>
</html> 