import React, { useState } from "react";

interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = "Ad, soyad və ya qrup nömrəsi ilə axtar...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex items-center border-b border-indigo-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
        >
          Axtar
        </button>
        {searchTerm && (
          <button
            className="flex-shrink-0 border-transparent border-4 text-indigo-500 hover:text-indigo-800 text-sm py-1 px-2 ml-2"
            type="button"
            onClick={() => {
              setSearchTerm("");
              onSearch("");
            }}
          >
            Təmizlə
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchInput;
