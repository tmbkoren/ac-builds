import {
  Button,
  Select,
  Input,
  HStack,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { SearchParams, PostType, Platform } from '~/utils/types';
import { FaSearch } from 'react-icons/fa';

interface SearchFormProps {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchParams,
  setSearchParams,
}) => {
  const [inputState, setInputState] = useState(searchParams.search);
  const [category, setCategory] = useState<PostType | 'ALL'>('ALL');
  const [platform, setPlatform] = useState<Platform | 'ALL'>('ALL');

  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    setInputState(inputValue);
  };

  const handleCategoryChange = (e) => {
    const categoryValue = e.target.value;
    setCategory(categoryValue);
  };

  const handlePlatformChange = (e) => {
    const platformValue = e.target.value;
    setPlatform(platformValue);
  };

  const handleSearch = () => {
    setSearchParams({
      search: inputState,
      type: category,
      platform: platform,
    });
  };

  const handleReset = () => {
    setInputState('');
    setCategory('ALL');
    setPlatform('ALL');
    setSearchParams({
      search: '',
      type: 'ALL',
      platform: 'ALL',
    });
  };

  return (
    <VStack
      w={{
        base: '99%',
        md: '70%',
        lg: '50%',
      }}
    >
      <Input
        value={inputState}
        onChange={handleSearchChange}
        placeholder='Title or tag'
        size='sm'
      />
      <HStack>
        <Select
          placeholder='Select category'
          onChange={handleCategoryChange}
        >
          <option value='ALL'>All</option>
          <option value='AC'>AC</option>
          <option value='EMBLEM'>Emblem</option>
        </Select>
        <Select
          placeholder='Select platform'
          onChange={handlePlatformChange}
        >
          <option value='ALL'>All</option>
          <option value='STEAM'>STEAM</option>
          <option value='PLAYSTATION'>PLAYSTATION</option>
          <option value='XBOX'>XBOX</option>
        </Select>
      </HStack>
      <HStack
        justify={'center'}
      >
        <IconButton
          icon={<FaSearch />}
          aria-label='Search'
          onClick={handleSearch}
        />
        <Button onClick={handleReset}>Reset</Button>
      </HStack>
    </VStack>
  );
};

export default SearchForm;
