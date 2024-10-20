import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from "react"
import dynamicTextImage from './DynamicTextToImage';

export default function DynamicOGMeta({group}) {
    //{ title, description, image, url }
    const [title, setTitle] = useState("SearchDeck")
    const [description, setDescription] = useState("Search Deck is a powerful research tool that lets you search across multiple engines simultaneously, view and save results, and explore snapshots from the web archive—all in one intuitive interface. Re-imagine how you conduct research with streamlined tools and enhanced search capabilities.")
    const [img, setImg] = useState("")
    const [url, setUrl] = useState("https://search-deck.com")
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (group?.name) {
            const url = dynamicTextImage({text: group.name})
            setImg(url)
            setTitle(`View ${group.numberResources} ${group.name} Resources`)
            setUrl(`https://search-deck.com/group/share/${group.shareUrl}`)
            setLoaded(true)
        }
        else {setLoaded(true)}
    },[group])
    if (loaded) {

        return (
            <Helmet>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={img} />
                <meta property="og:url" content={url} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={img} />
            </Helmet>
        );
    }
}
