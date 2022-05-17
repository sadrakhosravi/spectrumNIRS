import * as React from 'react';

// Styles
import * as styles from './searchInput.module.scss';

// Icons
import { FiSearch } from 'react-icons/fi';

type SearchInputType = {
  placeholder?: string;
};

export const SearchInput = ({ placeholder }: SearchInputType) => {
  return (
    <div className="relative">
      <span className={styles.SearchIcon}>
        <FiSearch size="18px" />
      </span>
      <input
        type="search"
        className={styles.SearchInput}
        placeholder={placeholder || 'Search...'}
        tabIndex={2}
      />
    </div>
  );
};
