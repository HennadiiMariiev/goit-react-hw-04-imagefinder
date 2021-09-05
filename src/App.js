import React, { useEffect, useState } from 'react';
import Searchbar from './Components/Searchbar/Searchbar';
import SearchBox from './Components/SearchBox/SearchBox';
import ImageApiService from './apiService/apiService';
import ImageGallery from './Components/ImageGallery/ImageGallery';
import notificate from './utils/notification';
import LoadMoreButton from './Components/LoadMoreButton/LoadMoreButton';
import scrollDown from './utils/scrollDown';
import Modal from './Components/Modal/Modal';

import { ToastContainer } from 'react-toastify';
import Loader from 'react-loader-spinner';
import ScrollToTop from 'react-scroll-up';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import 'react-toastify/dist/ReactToastify.css';
import styles from './Components/AppComponent/App.module.scss';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const imageApiService = new ImageApiService();

const useLocalStorage = () => {
  const [state, setState] = useState(JSON.parse(localStorage.getItem('search')) || []);

  useEffect(() => {
    localStorage.setItem('search', JSON.stringify(state));
  }, [state]);

  return [state, setState];
};

export default function App() {
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(null);

  const [images, setImages] = useState([]);
  const [searched, setSearched] = useLocalStorage();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(null);

  useEffect(() => {
    if (query === '') {
      return;
    }

    toggleLoader();

    imageApiService
      .fetchRequest(query)
      .then((response) => response.hits)
      .then((imagesArray) => {
        setImages((images) => [...images, ...imagesArray]);
        showNotification(page, imagesArray);
      })
      .then(() => {
        toggleLoader();

        if (page > 1) {
          scrollDown();
        }

        if (!searched.includes(query)) {
          setSearched((searched) => [...searched, query]);
        }
      })
      .catch((error) => notificate('error', error));
  }, [page, query]);

  useEffect(() => {
    if (inputValue === '') {
      setImages([]);
      setQuery('');
    }
  }, [inputValue]);

  const toggleLoader = () => {
    setIsLoading((isLoading) => !isLoading);
  };

  const onInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const onClear = () => {
    setImages([]);
    setInputValue('');
    imageApiService.resetQuery();
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (inputValue !== imageApiService.query) {
      setImages([]);
      imageApiService.resetQuery();
    }

    setQuery(inputValue);
  };

  const switchNextPage = () => {
    setPage(imageApiService.nextPage());
  };

  const onSearchedClick = (event) => {
    if (event.target.value === query) return;

    onClear();
    setInputValue(event.target.value);
    setQuery(event.target.value);
    setPage(1);
  };

  const isDisabled = () => {
    if (inputValue.trim() === '' || query === inputValue) return true;
    return false;
  };

  const showNotification = (page, responseArray) => {
    let type = null;
    let message = null;

    if (responseArray.length === 0) {
      type = 'warning';
      message = page > 1 ? 'No more images found on your query' : 'No images found on your query';
    } else if (responseArray.length > 0) {
      type = 'success';
      message = `${responseArray.length} new images loaded on "${query}" query. Total: ${
        images.length + responseArray.length
      }`;
    }

    return notificate(type, message);
  };

  const onGalleryListClick = (event) => {
    if (event.target.nodeName === 'IMG') {
      const index = images.findIndex((el) => el.webformatURL === event.target.src);

      setModalImageIndex(index);
    }

    setIsModalOpen(!isModalOpen);
  };

  const showNextImage = () => {
    const nextIndex = modalImageIndex + 1;

    setModalImageIndex(nextIndex >= images.length ? 0 : nextIndex);
  };

  const showPrevImage = () => {
    const prevIndex = modalImageIndex - 1;

    setModalImageIndex(prevIndex < 0 ? images.length - 1 : prevIndex);
  };

  return (
    <div className={styles.App}>
      <Searchbar
        value={inputValue}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        onClear={onClear}
        isDisabled={isDisabled()}
      />

      {<SearchBox searched={searched} onSearchedClick={onSearchedClick} onSearchedClear={() => setSearched([])} />}

      <ImageGallery imagesArray={images} onClick={onGalleryListClick} />

      {isLoading && <Loader type="Circles" color="#00BFFF" height={100} width={100} />}

      {!!images.length && !isLoading && <LoadMoreButton loadMoreImages={switchNextPage} />}

      {isModalOpen && (
        <Modal
          images={images}
          photoIndex={modalImageIndex}
          onClose={() => setIsModalOpen(!isModalOpen)}
          nextImage={showNextImage}
          prevImage={showPrevImage}
        />
      )}

      <ScrollToTop showUnder={160}>
        <button type="button" className={styles.icon}>
          <ExpandLessIcon />
        </button>
      </ScrollToTop>
      <ToastContainer />
    </div>
  );
}
