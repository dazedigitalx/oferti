import React, { useEffect, useState } from 'react';
import './WinComponent.css';

// Utility function to import all images from a directory
const importAll = (r) => r.keys().map((file) => ({
    path: r(file),
    filename: file.replace('./', '')
}));

// Import random GIFs
const randomGifs = importAll(require.context('../assets/images/vacationGifs', false, /\.(gif|png|jpe?g)$/));

// Import placeholder image
import placeholderImage from '../assets/images/spin_side.gif';

// Utility function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
};

const WinComponent = () => {
    const [articles, setArticles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cycling, setCycling] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const maxCycles = 100; // Maximum number of cycles through articles
    const intervalDuration = 10; // Hardcoded interval duration in milliseconds
    const [randomGif, setRandomGif] = useState('');
    const [isClicked, setIsClicked] = useState(false); // Track if user has clicked
    const [shuffledArticles, setShuffledArticles] = useState([]); // State for shuffled articles

    // Function to fetch RSS feed data
    const fetchRSS = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/rss');
            const data = await response.json();
            setArticles(data.articles); // Set the articles in the state
        } catch (error) {
            console.error("Error fetching RSS feed:", error);
        }
    };

    // Fetch the RSS feed data on component mount
    useEffect(() => {
        fetchRSS();
        loadRandomGif(); // Load a random GIF when the component mounts
    }, []);

    // Function to load a random GIF
    const loadRandomGif = () => {
        const randomIndex = Math.floor(Math.random() * randomGifs.length);
        setRandomGif(randomGifs[randomIndex].path); // Set a random GIF path
    };

    // Effect to handle cycling through articles
    useEffect(() => {
        let intervalId;

        if (cycling) {
            intervalId = setInterval(() => {
                // Cycle through shuffled articles
                setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledArticles.length); // Wrap around to the start
                setCycleCount((prevCount) => prevCount + 1);
            }, intervalDuration); // Use the hardcoded interval duration

            // Stop cycling after reaching maxCycles
            if (cycleCount >= maxCycles) {
                clearInterval(intervalId);
                setCycling(false); // Stop cycling
            }
        }

        return () => clearInterval(intervalId); // Cleanup interval on unmount or when cycling changes
    }, [cycling, shuffledArticles.length, cycleCount]);

    // Function to start cycling through articles in random order on card click
    const handleCardClick = () => {
        if (!isClicked) {
            setIsClicked(true); // Set clicked to true
            setCurrentIndex(0); // Reset to first article
            setCycleCount(0); // Reset cycle count
            setShuffledArticles(shuffleArray([...articles])); // Shuffle articles and set state
            setCycling(true); // Start cycling
        } else if (!cycling) { // Check if cycling has stopped
            // Ensure shuffledArticles is not empty
            if (shuffledArticles.length > 0 && currentIndex < shuffledArticles.length) {
                const currentArticle = shuffledArticles[currentIndex];
                if (currentArticle && currentArticle.url) { // Check if currentArticle and its URL are valid
                    window.open(currentArticle.url, '_blank');
                } else {
                    console.error("Current article is undefined or does not have a valid URL:", currentArticle);
                }
            } else {
                console.error("Shuffled articles are empty or currentIndex is out of bounds.");
            }

            // Reset to default state after redirection
            setIsClicked(false); // Show placeholder on next view
            setCurrentIndex(0); // Reset article index
            setCycleCount(0); // Reset cycle count
            loadRandomGif(); // Load a new random GIF background
        }
    };

    return (
        <div className="container" style={{ backgroundImage: `url(${randomGif})` }}>
            <div id="articles" className="articles">
                <div className="article-card" onClick={handleCardClick} style={{ position: 'relative' }}>
                    {/* Placeholder Card */}
                    <div className="placeholder-card" style={{ opacity: isClicked ? 0.5 : 1 }}>
                        <img src={placeholderImage} alt="Placeholder" className="placeholder-image" />
                        <p>Click to win </p>
                    </div>
                    {/* Article Content Overlay */}
                    {isClicked && (
                        <div className="article-content" style={{
                            position: 'absolute',
                            top: '0', left: '0', width: '100%', height: '100%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            padding: '1rem',
                            borderRadius: '8px',
                            pointerEvents: 'none' // Prevent clicks during cycling
                        }}>
                            <div className="cycling-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
                                {shuffledArticles.map((article, index) => (
                                    <div key={index} className="cycling-article" style={{
                                        height: '100%', // Each article takes full height
                                        transition: 'transform 0.5s ease',
                                        transform: `translateY(-${currentIndex * 100}%)`, // Shift up according to current index
                                        opacity: cycling ? 0.5 : 1 // Slightly transparent during cycling
                                    }}>
                                        {article.mediaContent && (
                                            <img 
                                                src={article.mediaContent} 
                                                alt="Image"  // Updated alt text
                                                className="cycling-image"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WinComponent;
