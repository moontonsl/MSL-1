import { Header, Footer } from '@/Components';
import './profile.css';
// import '../../../css/variables.css';
import { Head } from '@inertiajs/react';
import { Eye, EyeOff } from 'react-feather';

const Profile = () => {
  return (
    <>
      <Head title="Student Portal" />
      <Header />
      <main>
        <div className="portal-main-bg">
            <div className='portal-container'>
                <div class="portal-top">
                    <div className="portal-top-container">
                        <div class="portal-top-left">
                            <div className="avatar-border">
                                <img src="/images/Student Portal/AccountImage.png" alt="Avatar" className="avatar-img" />
                                <div className="divider"></div>
                            </div>
                        </div>
                        <div class="portal-top-middle">
                            <div className="profile-main-info">
                                <div className="profile-name">Account Name</div>
                                <div className="profile-username-container">
                                    <span className="username-text">username</span>
                                    <svg className="verify-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                        <path d="M8.99922 12.4991L10.9992 14.4991L14.9992 10.4991M3.84922 9.11912C3.70326 8.46165 3.72567 7.77796 3.91437 7.13146C4.10308 6.48496 4.45196 5.89657 4.92868 5.42084C5.40541 4.94512 5.99453 4.59747 6.64142 4.41012C7.28832 4.22277 7.97205 4.20179 8.62922 4.34912C8.99093 3.78342 9.48922 3.31788 10.0782 2.99541C10.6671 2.67293 11.3278 2.50391 11.9992 2.50391C12.6707 2.50391 13.3313 2.67293 13.9203 2.99541C14.5092 3.31788 15.0075 3.78342 15.3692 4.34912C16.0274 4.20114 16.7123 4.22203 17.3602 4.40983C18.0081 4.59764 18.598 4.94626 19.0751 5.42327C19.5521 5.90029 19.9007 6.49019 20.0885 7.13812C20.2763 7.78605 20.2972 8.47095 20.1492 9.12912C20.7149 9.49083 21.1805 9.98912 21.5029 10.5781C21.8254 11.167 21.9944 11.8277 21.9944 12.4991C21.9944 13.1706 21.8254 13.8312 21.5029 14.4202C21.1805 15.0091 20.7149 15.5074 20.1492 15.8691C20.2966 16.5263 20.2756 17.21 20.0882 17.8569C19.9009 18.5038 19.5532 19.0929 19.0775 19.5697C18.6018 20.0464 18.0134 20.3953 17.3669 20.584C16.7204 20.7727 16.0367 20.7951 15.3792 20.6491C15.018 21.217 14.5193 21.6845 13.9293 22.0084C13.3394 22.3324 12.6772 22.5022 12.0042 22.5022C11.3312 22.5022 10.669 22.3324 10.0791 22.0084C9.48914 21.6845 8.99045 21.217 8.62922 20.6491C7.97205 20.7965 7.28832 20.7755 6.64142 20.5881C5.99453 20.4008 5.40541 20.0531 4.92868 19.5774C4.45196 19.1017 4.10308 18.5133 3.91437 17.8668C3.72567 17.2203 3.70326 16.5366 3.84922 15.8791C3.27917 15.5184 2.80963 15.0193 2.48426 14.4283C2.1589 13.8374 1.98828 13.1737 1.98828 12.4991C1.98828 11.8245 2.1589 11.1609 2.48426 10.5699C2.80963 9.97895 3.27917 9.47988 3.84922 9.11912Z" stroke="#F3C718" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div className="profile-details">
                                    <div className="profile-details-left">
                                        <div><span className="profile-label">IGN: </span><span className="profile-label-white">HERO</span></div>
                                        <div><span className="profile-label">ML ID: </span><span className="profile-label-white"> 928374561</span> <span className="profile-id-extra">(2110)</span></div>
                                    </div>
                                    <div className="profile-details-right">
                                        <div><span className="profile-label">SQUAD: </span><span className="profile-label-white">Celestial Five</span></div>
                                        <div><span className="profile-label">YR. LVL: </span> <span className="profile-label-white">Masters</span></div>
                                    </div>
                                </div>
                                <div className="profile-icons">
                                    <span className="profile-slot">
                                        <span className="profile-gender">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                            <path d="M16 3.5H21M21 3.5V8.5M21 3.5L14.25 10.25M16 14.5C16 17.8137 13.3137 20.5 10 20.5C6.68629 20.5 4 17.8137 4 14.5C4 11.1863 6.68629 8.5 10 8.5C13.3137 8.5 16 11.1863 16 14.5Z" stroke="#F3C718" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </span>
                                    </span>
                                    <span className="profile-slot"></span>
                                    <span className="profile-slot"></span>
                                    <span className="profile-slot"></span>
                                    <span className="profile-slot"></span>
                                </div>
                            </div>
                            <div className="divider-middle"></div>
                        </div>
                        <div className="wrapper-center">
                            <div class="portal-top-right">
                                <img src="/images/Student Portal/MythicIcon.png" alt="Rank" className="profile-rank-img" />
                                <div className="profile-tournament-stats">
                                    <div className="profile-tournament-block">
                                        <div className="profile-tournament-label">Monthly Tournaments</div>
                                        <div className="profile-tournament-value">0%</div>
                                        <div className="profile-tournament-sub">Winrate</div>
                                    </div>
                                    <div className="profile-tournament-block">
                                        <div className="profile-tournament-label">MCC Tournaments</div>
                                        <div className="profile-tournament-value">0%</div>
                                        <div className="profile-tournament-sub">Winrate</div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className='portal-bottom'>
                    <div className='portal-bottom-left'>
                        <div className="portal-tabs">
                        <span className="portal-tab active">Recent MSL Tournament</span>
                        <span className="portal-tab">Monthly Tournaments</span>
                        <span className="portal-tab">MCC Appearance</span>
                        <span className="portal-tab">Followers</span>
                        </div>
                    </div>
                    <div className='portal-bottom-right'>
                        <div className="portal-bottom-title">MSL Hero Highlights</div>
                        <div className="hero-highlight-card">
                            <div className="hero-highlight-info">
                                <div className="hero-highlight-name">Layla</div>
                                <div className="hero-highlight-role">Main</div>
                            </div>
                            <img src="/images/Student Portal/layla.png" alt="Layla" className="hero-highlight-img" />
                        </div>
                        <div className="hero-highlight-card">
                            <div className="hero-highlight-info">
                                <div className="hero-highlight-name">Layla</div>
                                <div className="hero-highlight-role">Main</div>
                            </div>
                            <img src="/images/Student Portal/layla.png" alt="Layla" className="hero-highlight-img" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
