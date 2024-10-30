import React, { useEffect, useState } from 'react';
import './WinComponent.css';  // Ensure this imports your CSS file
import axios from 'axios';
import spinImage from '../assets/images/vacationMode.gif';
import loadingGif from '../assets/images/loading.gif';
import spinningGif from '../assets/images/loading.gif';

const importAll = (r) => r.keys().map((file) => ({
    path: r(file),
    filename: file.replace('./', '')
}));

const randomGifs = importAll(require.context('../assets/images/vacationGifs', false, /\.(gif|png|jpe?g)$/));
const sideGifPath = require('../assets/images/spin_side.gif');

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

    let intervalId;

    const loadArticles = async () => {
        setLoading(true);
        setSpinning(true);
        selectNextGif();

        try {
            const response = await axios.get('https://oferti-server.vercel.app/api/rss');
            const articlesArray = response.data.articles;

            if (articlesArray.length > 0) {
                setArticles(articlesArray);
                selectRandomArticle(articlesArray);
                setBackgroundGifs([spinningGif, ...backgroundGifs]);

                intervalId = setInterval(() => {
                    selectRandomArticle(articlesArray);
                }, 100);

                setTimeout(() => {
                    clearInterval(intervalId);
                    selectRandomArticle(articlesArray);
                    setSpinning(false);
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
        selectNextGif();
        if (intervalId) clearInterval(intervalId);
    };

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <div className="card-display" style={{ backgroundImage: `url(${backgroundGifs[currentGifIndex].path})` }}>
            {/* Left Spinning GIF */}
            <div className="gif-container">
                {spinning && (
                    <img src={sideGifPath} alt="Left Spin" className="side-gif-left" />
                )}
            </div>

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
                    <div className="card-container" onClick={handleCardClick}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <div className="card-content">
                                <div className="card-image">
                                    <img src={article.image} alt="So Lucky 🍀🍀🍀" className="slot-image" />
                                </div>
                                <div className="card-title">{article.title}</div>
                                <div className="card-url">{article.url}</div>
                            </div>
                        </a>
                    </div>
                )}
                {spinning && (
                    <img src={spinningGif} alt="Spinning..." className="spinning-gif" />
                )}
                <div className="gif-filename">
                    {article && article.image ? `Article: ${article.image}` : `Article: None`}
                </div>
                {spinning && (
                    <div className="gif-filename">{`Left GIF: spin_side.gif | Right GIF: spin_side.gif`}</div>
                )}
            </div>

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
