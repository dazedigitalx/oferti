import React, { useEffect, useState } from 'react';
import './WinComponent.css';
import axios from 'axios';
import spinImage from '../assets/images/spin-image.png'; // Adjust this path to your image file

const WinComponent = () => {
    const [article, setArticle] = useState(null); // Single article state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [showSpinImage, setShowSpinImage] = useState(true); // State for showing spin image
    const [articles, setArticles] = useState([]); // State to hold articles
    let intervalId; // To hold the interval ID for cleanup

    const loadArticles = async () => {
        setLoading(true);
        setSpinning(true);
        setShowSpinImage(false); // Hide spin image during loading

        try {
            const response = await axios.get('http://localhost:5000/api/rss');
            const articlesArray = response.data.articles; // Adjust to reflect new structure
            
            if (articlesArray.length > 0) {
                setArticles(articlesArray); // Store the articles in state
                
                // Start rotating through articles every 100 ms
                selectRandomArticle(articlesArray); // Display a random article initially
                intervalId = setInterval(() => {
                    selectRandomArticle(articlesArray); // Change article every 100 ms
                }, 100); // Rapidly spin every 100 milliseconds
                
                // Stop the rotation after 5 seconds and show one final article
                setTimeout(() => {
                    clearInterval(intervalId); // Stop the rotation
                    selectRandomArticle(articlesArray); // Select a final article
                    setSpinning(false); // Stop spinning
                    setShowSpinImage(true); // Show spin image after loading
                }, 5000); // Spin for 5 seconds before stopping
            } else {
                setArticle(null); // No articles available
            }
        } catch (error) {
            console.error('Error fetching RSS feed:', error.message || error);
            setError('Error loading articles. Please try again later.');
        } finally {
            setLoading(false);
            // No need to set spinning here, it will be handled in the spinning logic
        }
    };

    const selectRandomArticle = (articlesArray) => {
        const randomIndex = Math.floor(Math.random() * articlesArray.length);
        setArticle(articlesArray[randomIndex]);
    };

    const handleSpinImageClick = () => {
        loadArticles(); // Re-fetch articles when spin image is clicked
    };

    return (
        <div className="card-display">
            <div className="cards">
                {loading ? (
                    <p>Loading articles...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : !article ? (
                    <p></p>
                ) : (
                    // Display the randomly selected article
                    <div className="card-container">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <div className="card-content">
                                <div className="card-image">
                                    <img src={article.image} alt="You Are So Lucky 🍀🍀🍀" className="slot-image" />
                                </div>
                                <div className="card-title">{article.title}</div>
                                <div className="card-url">{article.url}</div>
                            </div>
                        </a>
                    </div>
                )}
                {spinning && <p>Spinning...</p>} {/* Optional spinning message */}
            </div>
            {showSpinImage && (
                <img
                    src={spinImage} // Path to your spin image
                    alt="Spin"
                    className="spin-image" // Optional CSS class for styling
                    onClick={handleSpinImageClick} // Trigger spin on click
                    style={{ cursor: 'pointer', width: '300px', height: 'auto' }} // Adjust size as needed
                />
            )}
        </div>
    );
};

export default WinComponent;
