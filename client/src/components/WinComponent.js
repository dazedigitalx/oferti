import React, { useEffect, useState } from 'react';
import './WinComponent.css';
import axios from 'axios';
import spinImage from '../assets/images/vacationMode.gif'; // Path to your spin image
import loadingGif from '../assets/images/loading.gif'; // Path to your loading GIF
import spinningGif from '../assets/images/loading.gif'; // Path to your spinning GIF

// Function to dynamically require all gifs from a specified directory
const importAll = (r) => {
    return r.keys().map((file) => ({
        path: r(file),
        filename: file.replace('./', '') // Extracting the filename from the path
    }));
};

// Dynamically require all gifs from the images directory
const randomGifs = importAll(require.context('../assets/images/vacationGifs', false, /\.(gif|png|jpe?g)$/));

// Function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
};

const WinComponent = () => {
    const [article, setArticle] = useState(null); // Current article state
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const [spinning, setSpinning] = useState(false); // Spinning state
    const [articles, setArticles] = useState([]); // Articles state
    const [backgroundGifs, setBackgroundGifs] = useState(shuffleArray([...randomGifs])); // Shuffle gifs on initial load
    const [currentGifIndex, setCurrentGifIndex] = useState(0); // Index for current GIF

    let intervalId; // To hold the interval ID for cleanup

    const loadArticles = async () => {
        setLoading(true);
        setSpinning(true);
        selectNextGif(); // Select the next GIF before loading articles
        
        try {
            const response = await axios.get('http://localhost:5000/api/rss');
            const articlesArray = response.data.articles;

            if (articlesArray.length > 0) {
                setArticles(articlesArray);
                selectRandomArticle(articlesArray); // Display a random article initially
                
                // Change the background to spinning GIF
                setBackgroundGifs([spinningGif, ...backgroundGifs]); // Add spinning GIF to the start of the array

                // Start rotating through articles every 100 ms
                intervalId = setInterval(() => {
                    selectRandomArticle(articlesArray);
                }, 100);

                // Stop rotation after 5 seconds
                setTimeout(() => {
                    clearInterval(intervalId);
                    selectRandomArticle(articlesArray); // Show final article
                    setSpinning(false);
                    
                    // Select the next GIF after spinning ends
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

    // Function to select the next GIF in order
    const selectNextGif = () => {
        setCurrentGifIndex((prevIndex) => (prevIndex + 1) % backgroundGifs.length);
    };

    const handleSpinImageClick = () => {
        loadArticles(); // Re-fetch articles when spin image is clicked
    };

    const handleCardClick = () => {
        resetToDefault(); // Reset everything to default
    };

    const resetToDefault = () => {
        setArticle(null);
        setLoading(false);
        setError(null);
        setSpinning(false);
        selectNextGif(); // Move to the next gif
        if (intervalId) clearInterval(intervalId); // Clear any existing intervals
    };

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <div className="card-display" style={{ backgroundImage: `url(${backgroundGifs[currentGifIndex].path})`, backgroundSize: 'cover', height: '100vh' }}>
            <div className="cards">
                {loading ? (
                    <img
                        src={loadingGif}
                        alt="Loading..."
                        style={{ display: 'block', margin: '0 auto', width: '100px', height: '100px' }} // Adjust size as needed
                    />
                ) : error ? (
                    <p>{error}</p>
                ) : !article ? (
                    <div className="spin-image-container">
                        <img
                            src={spinImage}
                            alt="Spin"
                            className="spin-image"
                            onClick={handleSpinImageClick}
                            style={{ cursor: 'pointer', width: '300px', height: 'auto', display: 'block', margin: '0 auto' }} // Center the spin image
                        />
                    </div>
                ) : (
                    <div className="card-container" onClick={handleCardClick}>
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
                {spinning && (
                    <img
                        src={spinningGif}
                        alt="Spinning..."
                        style={{ display: 'block', margin: '0 auto', width: '100px', height: '100px' }} // Adjust size as needed
                    />
                )}
                {/* Display the filename of the currently loaded article GIF */}
                <div className="gif-filename" style={{ textAlign: 'center', marginTop: '10px', color: '#fff' }}>
                    {article && article.image ? `Article GIF: ${article.image}` : `Article GIF: None`}
                </div>
                {/* Display the filename of the currently loaded background GIF */}
                <div className="gif-filename" style={{ textAlign: 'center', marginTop: '10px', color: '#fff' }}>
                    {`Background GIF: ${backgroundGifs[currentGifIndex]?.filename}`}
                </div>
            </div>
        </div>
    );
};

export default WinComponent;
