// resources/js/Layouts/MainLayout.jsx

import { Footer, Header } from '@/Components/index.js';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
