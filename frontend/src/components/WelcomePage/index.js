const filterImg = require('../../assets/images/filters.png')
const savedSearches = require('../../assets/images/saved-searches.png')
const resultHistory = require('../../assets/images/result-history.png')

export default async function WelcomePage() {

    const response = await window.fetch("https://www.reddit.com/r/opendirectories/search.json?q=python&restrict_sr=on&sort=new&t=all");
    const data = await response.text();
console.log(data)
    return (
        <div className="text-white p-2 flex flex-col w-full align-items-center h-fit">

            <div className="text-lg w-full flex justify-content-center items-center h-40">
                <h1>Welcome to Search Deck!</h1>
            </div>
            <div className="flex w-1/3 justify-self-center rounded">
                <p>
                Welcome to SearchDeck – the all-in-one tool to make your web searching smoother and more organized. With SearchDeck, you can easily manage your search queries, see results side by side, and save your favorite finds. Whether you’re diving into research, hunting for the best deals, or just browsing around, SearchDeck keeps everything tidy and at your fingertips. Say goodbye to clutter and hello to a smarter way to search!

                </p>

            </div>
            <span className='h-20'/>
            <div className="w-full flex flex-row justify-content-around align-items-center">
                <p className="w-1/3">
                SearchDeck's advanced search feature utilizes advanced search operators, also known as Google dorking. These filters allow you to specify sites, keywords, and text to include or exclude, and to refine searches by language, country, and search engine. This enables precise, tailored searches, ensuring you quickly find the most relevant information.
                </p>
                <img src={filterImg} className='w-1/3'/>
            </div>
            <span className='h-20'/>
            <div className="w-full flex flex-row justify-content-around align-items-center bg-slate-700">
                <img src={savedSearches} className='w-1/3'/>
                <p className='w-1/3'>
                The Saved Searches feature allows you to keep track of and revisit your previous search queries. Each saved search displays key details, including the query text, date and time of the search, and the search engine used (e.g., Google, Bing). You can filter through saved searches using the search bar at the top, making it easy to find specific queries. This feature ensures that important searches are easily accessible for future reference and analysis.
                </p>
            </div>
            <span className='h-20'/>
            <div className="w-full flex flex-row justify-content-around align-items-center">
                <p className='w-1/3'>
                You can view your recent search results and bookmark important links for future reference. Each entry displays the title, URL, and a brief description of the webpage. You can filter through all results or just your saved ones using the search bar at the top. This feature ensures that valuable information is never lost and can be quickly retrieved, providing a seamless and efficient search experience.
                </p>
                <img src={resultHistory} className='w-1/3'/>
            </div>
        </div>
    )
}
