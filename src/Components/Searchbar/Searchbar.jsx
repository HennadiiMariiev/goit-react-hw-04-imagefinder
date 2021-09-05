import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import styles from './Searchbar.module.scss';

function Searchbar({ value, onInputChange, onSubmit, onClear }) {
  const {
    Searchbar,
    Searchbar__title,
    SearchForm,
    SearchForm__button,
    SearchForm__label,
    SearchForm__input,
    Material__icon,
  } = styles;

  return (
    <>
      <header className={Searchbar}>
        <h1 className={Searchbar__title}>Image finder</h1>
        <form className={SearchForm} onSubmit={onSubmit}>
          <input
            className={SearchForm__input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={value}
            onChange={onInputChange}
          />

          <button type="submit" className={SearchForm__button} disabled={value.trim() === ''}>
            <SearchIcon className={Material__icon} />
            <span className={SearchForm__label}>Search</span>
          </button>
          <button type="button" className={SearchForm__button} onClick={onClear}>
            <ClearIcon className={Material__icon} />
            <span className={SearchForm__label}>Clear</span>
          </button>
        </form>
      </header>
    </>
  );
}

export { Searchbar };
