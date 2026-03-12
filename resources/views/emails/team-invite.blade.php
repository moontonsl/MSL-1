<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Montserrat', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .header { text-align: center; background: #1a1a1a; padding: 20px; border-radius: 10px 10px 0 0; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #F2C21A; color: black; text-decoration: none; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #F2C21A;">MSL Campus Tournament</h1>
        </div>
        <h2>Hello, {{ $user->username }}!</h2>
        <p>Thank you for being part of the MSL community!</p>
        <p>You have been invited by <strong>{{ $captain->username }}</strong> to join the team <strong>{{ $team->team_name }}</strong> for the upcoming Campus Tournament.</p>

        <p>To accept this invite, please log in to the MSL portal and navigate to the Campus Tournament section.</p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ url('/Tournament/CampusTournament') }}" class="button">Go to Tournament Page</a>
        </div>

        <p>Good luck and have fun!</p>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Mobile Legends: Bang Bang Student Leader Philippines. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
