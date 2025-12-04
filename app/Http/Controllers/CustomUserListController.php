<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class CustomUserListController extends Controller
{
    /**
     * Display the custom user list
     */
    public function index(Request $request)
    {
        $targetEmails = $this->getTargetEmails();
        
        // Fetch users matching the emails
        $users = User::whereIn('email', $targetEmails)
                    ->paginate(25);

        return view('admin.custom-user-list', compact('users'));
    }

    /**
     * Define the list of target emails here
     */
    private function getTargetEmails(): array
    {
        return [
            'floresmarcangelo9@gmail.com',
            'johnrafaelespino563@gmail.com',
            'devildigital161@gmail.com',
            'juniocrisreyver@gmail.com',
            'challejah@gmail.com',
            'justinemarino656@gmail.com',
            'melvvperalta@gmail.com',
            'gabsantipolo@gmail.com',
            'aellamaecabahug.yahoo.com@gmail.com',
            'noelito.ymas@evsu.edu.ph',
            'gericgwapo12@gmail.com',
            'juliomiguelcamantesabesamis@gmail.com',
            'pjbustane@gmail.com',
            'jayzcartas17@gmail.com',
            'telebricoshamir@gmail.com',
            'jameboylabiste58@gmail.com',
            'jimboylucero16@gmail.com',
            'leovyfavilajr@gmail.com',
            'capistranoacads@gmail.com',
            'wyngardatienza11@gmail.com',
            'ivanpaca17@gmail.com',
            'bantilesjoephilipjr@gmail.com',
            'yaonvince@gmail.com',
            'yarennary@gmail.com',
            'pauledar2008@gmail.com',
            'miagacharls60@gmail.com',
            'kentjahrein@gmail.com',
            'jenbertnuique03@gmail.com',
            'gian.roosevelt14@gmail.com',
            'franzindalumpines7@gmail.com',
            'ninioruaya14@gmail.com',
            'mendolajhaymark@gmail.com',
            'celestinocubijr@gmail.com',
            'akherlopez1027@gmail.com',
            'jibreelatomar2@gmail.com',
            'justinelee.fs@gmail.com',
            'cunananalliyahdennise@gmail.com',
            'edmarkbryandaps@gmail.com',
            'william.delosreyes2006@gmail.com',
            'francis.lamberte@evsu.edu.ph',
            'giomerfeliciano11@gmail.com',
            'budzathrunskey14356@gmail.com',
            'renzosode22@gmail.com',
            'leemaro509@gmail.com',
            'drylleignacio17@gmail.com',
            'faermadjad@gmail.com',
            'sorianoandrielloyd13@gmail.com',
            'edwardarroyo1122@gmail.com',
            'geraldalegre712@gmail.com',
            'jasaldavia@pcu.edu.ph',
            'stevenfactor75@gmail.com',
            'domsclarence@gmail.com',
            'princecarlobrina16@gmail.com',
            'ranlidacalos738@gmail.com',
            'jaybelbes123@gmail.com',
            'hevveya@gmail.com',
            'richardsangines2@gmail.com',
            'deanloydverde4@gmail.com',
            'kobzakmad@gmail.com',
            'johnpatrickdeuna8@gmail.com',
            'lloydgolondrina5@gmail.com',
            'baguioanthony009@gmail.com',
            'wcaguilar@paterostechnologicalcollege.edu.ph',
            'polangcojuniel45@gmail.com',
            'tapayanjaybee@gmail.com',
            'karlbugaling@gmail.com',
            'andriealonzo84@gmail.com',
            'bagares.gemar09@gmail.com',
            'datumohirjack24@gmail.com',
            'aljasserrahaman7@gmail.com',
            'rhaiedabubakar@gmail.com',
            'jokksamia@gmail.com',
            'pelinoalexander354@gmail.com',
            'lylematandog3@gmail.com',
            'kentasleyborres492@gmail.com',
            'danahiezernasayao@gmail.com',
            'earlaahm@gmail.com',
            'dalisaymaclaurence@gmail.com',
            'aljamelsultan@gmail.com',
            'macatumbaskylle12@gmail.com',
            'geraldezcyril16@gmail.com',
            'jeroldrojas2004@gmail.com',
            'davebenedictdevera@gmail.com',
            'egieedpalina8@gmail.com',
            'babiarachelanne@gmail.com',
            'markrenzodelacruz36@gmail.com',
            'dranrebkimvryle@gmail.com',
            'brianrussellepadilla13@gmail.com',
            'jaminaranzel@gmail.com',
            'seiseiseisensei3@gmail.com',
            'edrickpintor@gmail.com',
            'matiradranreb9@gmail.com',
            '22-09746@g.batstate-u.edu.ph',
            'josephlenonlamit@gmail.com',
            'cndlrmatt@gmail.com',
            'regiecasas30@gmail.com',
            'kiannoche4@gmail.com',
            'torrescharleskent8@gmail.com',
            'lanceoliverd@gmail.com',
            'jhustine619@gmail.com',
            'yuuftliampier@gmail.com',
            'alfredrodillo19@gmail.com',
            'kingjanuadumpa@gmail.com',
            'andreivaldeztamonabrina@gmail.com',
            'cantillerjotherezyaeljan@gmail.com',
            'akosipelayo@gmail.com',
            'argilgreg7@gmail.com',
            'segmundvelasco@gmail.com',
            'ceballosalf33@gmail.com',
            'richelle.laurizen@gmail.com',
            'arnarniele@gmail.com',
            'julianrossholgado3rd@gmail.com',
            'janusgratiae15@gmail.com',
            'johnwilfredamoguis@gmail.com',
            'taniojameer@gmail.com',
            'mjarcilla12@gmail.com',
            'morandantemattjireh@gmail.com',
            'tidzkie332211@gmail.com',
            'astriancastro93@gmail.com',
            'sicnarfd16@gmail.com',
            'fritzzyyy.centillas13@gmail.com',
            'bobsboby583@gmail.com',
            'charlesklanas08@gmail.com',
            'angelojayvee23@gmail.com',
            'eryllecompanero20@gmail.com',
            'zephyrisnotgood@gmail.com',
            'josephmontuyamina@gmail.com',
            'jhonalideligadz@gmail.com',
            's2025100604@firstasia.edu.ph',
            'radjethroy@gmail.com',
            'wayneclarkz29@gmail.com',
            'jaev.astillero.swu@phinmaed.com',
            'tristancarldelapena@gmail.com',
            'acemontas538@gmail.com',
            's2025109504@firstasia.edu.ph',
            's2025108755@firstasia.edu.ph',
            'clarencedeleus126@gmail.com',
            'betacurabambam@gmail.com',
            'ellaferolin@gmail.com',
            'esperatyrn@gmail.com',
            'encinakhennmikkel@gmail.com',
            'fmiguelmontesco@gmail.com',
            's2024107623@firstasia.edu.ph',
            'abraoyanex@gmail.com',
            'abdulzamad.an864@s.msumain.edu.ph',
            'jashleesohandsome@gmail.com',
            'kristianregiea@gmail.com',
            'samerdimaarig@gmail.com',
            'jakebrandon.mercado17@gmail.com',
            'alucardyuzuke123@gmail.com',
            'jhonbenedicttorresruba@gmail.com',
            'mohammadraffipiang12@gmail.com',
            'hnor.alhusnie@gmail.com',
            'knoxbullies.ml@gmail.com',
            'bea133862@gmail.com',
            'lharky7@gmail.com',
            'mendoza.dp36@s.msumain.edu.ph',
            'nasifimam303@gmail.com',
            'ralphsabandal563@gmail.com',
            'ismad.as05@s.msumain.edu.ph',
            'aiciepadogdog6@gmail.com',
            'stephenchadjuagpao@gmail.com',
            'shainna.kim16@gmail.com',
            'uttoarraofdalgan@gmail.com',
            'sairadatuimam423@gmail.com',
            'suamenjustine2005@gmail.com',
            'botoys36@gmail.com',
            'kizamaurinmonte@gmail.com',
            'deanonalfred@gmail.com',
            'rani972005@gmail.com',
            'salapejohncarl@gmail.com',
            'nilloahsley8@gmail.com',
            'angeljazleenliquiran12345@gmail.com',
            'esposajohan@gmail.com',
            'advinculae098@gmail.com',
            'sanchezhannanicole03@gmail.com',
            'reypuenleona@gmail.com',
            'bstm.hermosillaja@gmail.com',
            'kyleyambao79@gmail.com',
            'jonasmacusi4@gmail.com',
            'neillagunay716@gmail.com',
            'jelee2162val@student.fatima.edu.ph',
            'garciajohnmichael894@gmail.com',
            'jmlee8139@gmail.com',
            'roljohnkentflores@gmail.com',
            'christianelielpailma@gmail.com',
            'kevinkurtdeguzman20@gmail.com',
            'pastolerojayson09@gmail.com',
            'jielofernandez32@gmail.com',
            'johnrobertocruz02@gmail.com',
            'bsentrep.salinojrp@gmail.com',
            'aarondeblois96@gmail.com',
            'johnrichplaza12@gmail.com',
            'bsemc.lobitanajayl@gmail.com',
            'egeecampusano@gmail.com',
            'tamayojamesrusty18@gmail.com',
            'jodieannemeterio@gmail.com',
            'lhestertaperla@gmail.com',
            'christianmagayones123@gmail.com',
            'frickzwenzeleder@gmail.com',
            'jameseichi139@gmail.com',
            'westleecatalan3@gmail.com',
            'reynaldlauzon14@gmail.com',
            'bsemc.villarazajohnbrylel@gmail.com',
            'sethleonardsanpedro@gmail.com',
            'vincentsanpascual4@gmail.com',
            'jrmanarang14@gmail.com',
            'gremiorich3@gmail.com',
            'ortinerojumong@gmail.com',
            'aldwinedison16@gmail.com',
            'pgreroma.ccsjdm@gmail.com',
            'carltumanda5@gmail.com',
            'johncarldomina@gmail.com',
            'franzzenbenitez@gmail.com',
            'markkenneth0914@gmail.com',
            'jeovasalomon27@gmail.com',
            'nyorksn@gmail.com',
        ];
    }

    /**
     * Send email to selected users
     */
    public function sendSelectedEmails(Request $request)
    {
        $userIds = $request->input('user_ids', []);
        
        if (empty($userIds)) {
            return response()->json(['success' => false, 'message' => 'No users selected']);
        }

        $successCount = 0;
        $errorCount = 0;

        foreach ($userIds as $userId) {
            try {
                $user = User::find($userId);
                if ($user) {
                    // Use FaultyUsernameMail with a generic issue type
                    Mail::to($user->email)->send(new \App\Mail\FaultyUsernameMail($user, 'Manual Update Required'));
                    $successCount++;
                }
            } catch (\Exception $e) {
                $errorCount++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Sent emails to {$successCount} users. {$errorCount} failed."
        ]);
    }

    /**
     * Delete selected users
     */
    public function deleteSelected(Request $request)
    {
        $userIds = $request->input('user_ids', []);
        
        if (empty($userIds)) {
            return response()->json(['success' => false, 'message' => 'No users selected']);
        }

        try {
            User::whereIn('id', $userIds)->delete();
            
            return response()->json([
                'success' => true,
                'message' => "Successfully deleted " . count($userIds) . " users."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
            ]);
        }
    }

    /**
     * Show login form
     */
    public function showLogin()
    {
        if (session('custom_user_list_auth')) {
            return redirect()->route('admin.custom-user-list');
        }
        return view('admin.custom-user-list-login');
    }

    /**
     * Handle login
     */
    public function login(Request $request)
    {
        if ($request->password === 'jabuadmin') {
            session(['custom_user_list_auth' => true]);
            return redirect()->route('admin.custom-user-list');
        }

        return back()->with('error', 'Invalid password');
    }

    /**
     * Handle logout
     */
    public function logout()
    {
        session()->forget('custom_user_list_auth');
        return redirect()->route('admin.custom-user-list.login');
    }
}
