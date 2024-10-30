import React, { useEffect, useState } from 'react';
import './WinComponent.css';  // Ensure this imports your CSS file
import axios from 'axios';
import spinImage from '../assets/images/vacationMode.gif';
import loadingGif from '../assets/images/loading.gif';
import sideGifPath from '../assets/images/spin_side.gif';
import titleBackgroundGif from '../assets/images/titleBackground.gif'; // Import the background GIF for the title

const importAll = (r) => r.keys().map((file) => ({
    path: r(file),
    filename: file.replace('./', '')
}));

const randomGifs = importAll(require.context('../assets/images/vacationGifs', false, /\.(gif|png|jpe?g)$/));

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const WinComponent = () => {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [articles, setArticles] = useState([]);
    const [backgroundGifs, setBackgroundGifs] = useState(shuffleArray([...randomGifs]));
    const [currentGifIndex, setCurrentGifIndex] = useState(0);
    const [spinEnded, setSpinEnded] = useState(false);
    const [rssLink, setRssLink] = useState(''); // New state for RSS link

    let intervalId;

    const loadArticles = async () => {
        setLoading(true);
        setSpinning(true);
        setSpinEnded(false);
        selectNextGif();

        try {
            const response = await axios.get('https://oferti-server.vercel.app/api/rss');
            const articlesArray = response.data.articles;

            if (articlesArray.length > 0) {
                setArticles(articlesArray);
                selectRandomArticle(articlesArray);
                setRssLink(response.data.link); // Set the RSS link

                // Adding background GIF to the array (optional)
                setBackgroundGifs([sideGifPath, ...backgroundGifs]);

                intervalId = setInterval(() => {
                    selectRandomArticle(articlesArray);
                }, 100);

                setTimeout(() => {
                    clearInterval(intervalId);
                    selectRandomArticle(articlesArray);
                    setSpinning(false);
                    setSpinEnded(true);
                    selectNextGif();
                }, 5000);
            } else {
                setError('No articles available.');
            }
        } catch (error) {
            console.error('Error fetching RSS feed:', error.message || error);
            setError('Error loading articles. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const selectRandomArticle = (articlesArray) => {
        const randomIndex = Math.floor(Math.random() * articlesArray.length);
        setArticle(articlesArray[randomIndex]);
    };

    const selectNextGif = () => {
        setCurrentGifIndex((prevIndex) => (prevIndex + 1) % backgroundGifs.length);
    };

    const handleSpinImageClick = () => {
        loadArticles();
    };

    const handleCardClick = () => {
        resetToDefault();
    };

    const resetToDefault = () => {
        setArticle(null);
        setLoading(false);
        setError(null);
        setSpinning(false);
        setSpinEnded(false);
        setRssLink(''); // Reset RSS link
        selectNextGif();
        if (intervalId) clearInterval(intervalId);
    };

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    // Extract the media content URL
    const getMediaContentUrl = (article) => {
        return article.mediaContent ? article.mediaContent.url : ''; // Updated to access URL directly
    };

    return (
        <div className="card-display" style={{ backgroundImage: `url(${backgroundGifs[currentGifIndex].path})` }}>
            {/* Title Section - only show when not spinning */}
            {!spinning && (
                <h2 className="initial-title">Spin below to win!</h2>
            )}

            {/* Left Spinning GIF */}
            <div className="gif-container">
                {spinning && (
                    <img src={sideGifPath} alt="Left Spin" className="side-gif-left" />
                )}
            </div>

            {/* Title Section for prize claim */}
            {spinEnded && (
                <div className="title-container">
                    {/* Left Div for GIF Image */}
                    <div className="title-gif-container">
                        {/* Background will be set in CSS, no need for inline styles */}
                    </div>
                    {/* Right Div for Title */}
                    <div className="text-container">
                        <h2>Click the link below to claim your prize!</h2>
                    </div>
                </div>
            )}

            {/* Main Card Section */}
            <div className="cards">
                {loading ? (
                    <img src={loadingGif} alt="Loading..." className="loading-gif" />
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : !article ? (
                    <div className="spin-image-container">
                        <img src={spinImage} alt="Spin" className="spin-image" onClick={handleSpinImageClick} />
                    </div>
                ) : (
                    <div 
                        className="card-container" 
                        onClick={handleCardClick} 
                        style={{ backgroundImage: `url(${getMediaContentUrl(article)})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} // Set background image for the card
                    >
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <div className="card-content">
                                <div className="card-title">{article.title}</div>
                                <div className="card-url">{article.url}</div>
                                {/* Display media content as an image */}
                                {getMediaContentUrl(article) && (
                                    <img 
                                        src={getMediaContentUrl(article)} 
                                        alt={article.title} 
                                        className="card-image" 
                                        style={{ width: '100%', height: 'auto' }} // Adjust as needed
                                    />
                                )}
                            </div>
                        </a>
                    </div>
                )}
            </div>

            {/* Display RSS link at the end of the spin */}
            {spinEnded && rssLink && (
                <div className="rss-link-container">
                    <p>Direct RSS Link: <a href={rssLink} target="_blank" rel="noopener noreferrer">{rssLink}</a></p>
                </div>
            )}

            {/* Right Spinning GIF */}
            <div className="gif-container">
                {spinning && (
                    <img src={sideGifPath} alt="Right Spin" className="side-gif-right" />
                )}
            </div>
        </div>
    );
};

export default WinComponent;
