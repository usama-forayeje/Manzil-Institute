'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchInput() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className='relative'>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="h-9 w-64 rounded-md border border-input bg-background px-9 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-sidebar-ring"
      />
    </div>
  );
}