import React, { useEffect, useState } from 'react';
import { Searchbar } from './Components/Searchbar/Searchbar.jsx';
import ImageApiService from './apiService/apiService.js';
import { ImageGallery } from './Components/ImageGallery/ImageGallery.jsx';
import { ToastContainer } from 'react-toastify';
import Loader from 'react-loader-spinner';

import notificate from './utils/notification.js';
import { LoadMoreButton } from './Components/LoadMoreButton/LoadMoreButton.jsx';
import scrollDown from './utils/scrollDown.js';
import Modal from './Components/Modal/Modal.jsx';
import ScrollToTop from 'react-scroll-up';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import 'react-toastify/dist/ReactToastify.css';
import styles from './Components/AppComponent/App.module.scss';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const imageApiService = new ImageApiService();

export default function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(null);

  const [page, setPage] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!inputValue) {
      return;
    }

    toggleLoader();

    imageApiService
      .fetchRequest(inputValue)
      .then((response) => response.hits)
      .then((imagesArray) => {
        setImages((images) => [...images, ...imagesArray]);
        showNotification(page, imagesArray);
      })
      .then(() => {
        toggleLoader();
        if (page > 1) scrollDown();
      })
      .catch((error) => notificate('error', error));
  }, [page]);

  useEffect(() => {
    if (inputValue === '') {
      setImages([]);
      setPage(imageApiService.resetPage());
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

    setPage(imageApiService.page);
  };

  const switchNextPage = () => {
    setPage(imageApiService.nextPage());
  };

  const showNotification = (page, responseArray) => {
    let type = null;
    let message = null;

    if (responseArray.length === 0) {
      type = 'warning';
      message = page > 1 ? 'No more images found on your query' : 'No images found on your query';
    } else if (responseArray.length > 0) {
      type = 'success';
      message = `${responseArray.length} new images loaded on "${imageApiService.query}" query. Total: ${
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
      <Searchbar value={inputValue} onInputChange={onInputChange} onSubmit={onSubmit} onClear={onClear} />

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
