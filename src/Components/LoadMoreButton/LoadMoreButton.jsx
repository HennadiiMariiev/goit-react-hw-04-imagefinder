import React from 'react';

import styles from './LoadMoreButton.module.scss';

export default function LoadMoreButton({ loadMoreImages }) {
  return (
    <button type="button" onClick={loadMoreImages} className={styles.LoadMoreButton}>
      Load More
    </button>
  );
}
