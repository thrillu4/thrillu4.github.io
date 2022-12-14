import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>
        case 'confirmed':
            return <Component/>
        case 'error':
            return <ErrorMessage/>
        default:
            throw new Error('Unexpected char state')
    }
}

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const {getAllComics, process, setProcess} = useMarvelService();

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
          .then(onComicListLoaded)
          .then(() => setProcess('confirmed'));
    }
    
    const onComicListLoaded = (newComicsList) => {
        let ended = false;
        if(newComicsList.length < 8) {
            ended = true;
        }
        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }


    function renderItems(arr) {
        const items = arr.map((item, i) => {
            return (
            <li className="comics__item" key={i}>
                <Link to={`/comics/${item.id}`}>
                    <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                    <div className="comics__item-name">{item.title}</div>
                    <div className="comics__item-price">{item.prices}</div>
                </Link>
            </li>
            )
        });
        return (
        <ul className="comics__grid">
            {items}
        </ul>
        )
    }

    // const items = renderItems(comicsList);

    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {/* {errorMessage}
            {spinner}
            {items} */}
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            <button
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': comicsEnded ? "none" : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;