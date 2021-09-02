import React, { useState } from 'react';
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

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(null);

  const toggleLoader = () => {
    setIsLoading((isLoading) => !isLoading);
  };

  const proceedFetch = async (query, warnMessage, isFirstTimeFetch) => {
    try {
      const response = await imageApiService.fetchRequest(query);

      const imagesArray = await response.hits;

      isFirstTimeFetch ? setImages([...imagesArray]) : setImages([...images, ...imagesArray]);

      if (imagesArray.length === 0) {
        notificate('warning', warnMessage);
      } else {
        notificate('success', `${imagesArray.length} new images loaded on "${query}" query. Total: ${images.length}`);
      }
    } catch (error) {
      notificate('error', error);
    } finally {
      toggleLoader();
      if (!isFirstTimeFetch) scrollDown();
    }
  };

  const onSubmit = async (query) => {
    toggleLoader();

    proceedFetch(query, 'No images found on your query', true);

    console.log('images.length: ', images.length);
  };

  const loadMoreImages = async () => {
    toggleLoader();
    imageApiService.nextPage();

    const currentQuery = imageApiService.query;

    proceedFetch(currentQuery, 'No more images found on your query', false);
    console.log('images.length: ', images.length);
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
      <Searchbar onSubmit={onSubmit} onClear={() => setImages([])} />

      <ImageGallery imagesArray={images} onClick={onGalleryListClick} />

      {isLoading && <Loader type="Circles" color="#00BFFF" height={100} width={100} />}

      {!!images.length && !isLoading && <LoadMoreButton loadMoreImages={loadMoreImages} />}

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

export default App;
