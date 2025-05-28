// resources/js/Layouts/MainLayout.jsx
import { Footer, Header } from '@/Components/index.js';

export default function MainLayout({ children }) {
    return (
        <div className="app">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
