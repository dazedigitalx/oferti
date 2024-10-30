import React, { useEffect, useState } from 'react';
import './WinComponent.css';
import { fetchRssUrls } from '../utils/fetchRssUrls';
import spinning from '../assets/images/spinning.gif';

const WinComponent = () => {
    const [articles, setArticles] = useState([]);
    const [reels, setReels] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);

    // Fetch articles and set default reel state
    useEffect(() => {
        const loadArticles = async () => {
            const fetchedArticles = await fetchRssUrls();

            if (fetchedArticles.length > 0) {
                setArticles(fetchedArticles);
                setReels(fetchedArticles.slice(0, 3)); // Display first three by default
                console.log('Loaded articles into reels:', fetchedArticles.slice(0, 3));
            } else {
                console.error('No articles loaded.');
            }
        };

        loadArticles();
    }, []);

    const spinReels = () => {
        if (isSpinning || articles.length === 0) return;

        setIsSpinning(true);
        const spinDuration = 10000;
        const stopInterval = 2000;

        const spinTimers = reels.map((_, index) => {
            return setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * articles.length);
                setReels((prevReels) => {
                    const newReels = [...prevReels];
                    newReels[index] = articles[randomIndex];
                    return newReels;
                });
            }, index * stopInterval);
        });

        setTimeout(() => {
            setIsSpinning(false);
            spinTimers.forEach(timer => clearTimeout(timer));
        }, spinDuration);
    };

    return (
        <div className="slot-machine">
            <div className="reels">
                {reels.length > 0 ? (
                    reels.map((reel, index) => (
                        <div key={index} className="reel">
                            {isSpinning ? (
                                <img src={spinning} alt="Spinning..." className="spinning-gif" />
                            ) : (
                                reel && (
                                    <div className="card-container">
                                        <a href={reel.url} target="_blank" rel="noopener noreferrer">
                                            <div className="card-image">
                                                <img src={reel.image} alt={`Article ${index}`} className="slot-image" />
                                            </div>
                                            <div className="card-title">{reel.title}</div>
                                        </a>
                                    </div>
                                )
                            )}
                        </div>
                    ))
                ) : (
                    <p>Error loading articles. Please try again later.</p>
                )}
            </div>
            <button className="spin-button" onClick={spinReels} disabled={isSpinning || articles.length === 0}>
                Spin
            </button>
        </div>
    );
};

export default WinComponent;
