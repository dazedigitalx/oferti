import React from 'react';
import Header from './Header';
import WinComponent from './WinComponent'; // Import the WinComponent for the slot machine
import './Win.css'; // Ensure you have the styles defined here
import './Common.css';

const Win = () => {
    return (
        <div className="content">
            {/* Main content area */}
            <div className="content-area-full">
                <header className="header">
                    <Header />
                </header>

                <div className="main-full">
                    <main className="content-container">
                        {/* Load the WinComponent here for the slot machine interface */}
                        <WinComponent />
                    </main>

                    <aside className="aside">
                        <p></p>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Win; // Ensure you're using default export
