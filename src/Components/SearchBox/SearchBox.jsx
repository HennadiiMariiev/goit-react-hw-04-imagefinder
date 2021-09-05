import styles from './SearchBox.module.scss';

export default function SearchBox({ searched, onSearchedClick, onSearchedClear }) {
  return (
    <>
      <div className={styles.SearchBox}>
        {searched.map((el, index) => (
          <button type="button" className={styles.SearchBoxButton} key={index} onClick={onSearchedClick} value={el}>
            {el}
          </button>
        ))}
      </div>
      <div className={styles.SearchBox}>
        {searched.length > 0 && (
          <button type="button" className={styles.SearchBoxClear} onClick={onSearchedClear}>
            Clear all
          </button>
        )}
      </div>
    </>
  );
}
