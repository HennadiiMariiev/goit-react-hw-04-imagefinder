import styles from './ImageGallery.module.scss';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';

export default function ImageGallery({ imagesArray, onClick }) {
  const { ImageGallery } = styles;

  return (
    <ul className={ImageGallery}>
      {imagesArray.map(({ id, webformatURL, tags, largeImageURL, likes, views, comments, downloads }) => (
        <ImageGalleryItem
          webformatURL={webformatURL}
          tags={tags}
          largeImageURL={largeImageURL}
          likes={likes}
          views={views}
          comments={comments}
          downloads={downloads}
          key={id}
          onClick={onClick}
        />
      ))}
    </ul>
  );
}
