import { useEffect, useState } from 'react';

import { fetchImagesWithQuery } from 'services/api';

import { AppCss } from './App.styled';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { toast } from 'react-toastify';

const toastConfig = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isShowLoadMore, setIsShowLoadMore] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState('');

  useEffect(() => {
    async function getImages() {
      try {
        setIsShowLoader(true);
        const fetchImages = await fetchImagesWithQuery(query, page);
        setImages([...images, ...fetchImages.response]);
        setIsShowLoadMore(true);
        if (
          Math.ceil(fetchImages.totalHits / 12) / page === 1 ||
          fetchImages.totalHits === 0
        ) {
          setIsShowLoadMore(false);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message, toastConfig);
      } finally {
        setIsShowLoader(false);
      }
    }
    query && getImages();
  }, [query, page]);

  const onSubmit = e => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const inputQuery = input.value.trim();
    if (inputQuery && inputQuery !== query) {
      setQuery(inputQuery);
      setPage(1);
      setImages([]);
    }
    input.value = '';
  };

  const onClick = () => {
    setPage(page + 1);
  };

  const escListener = e => {
    if (e.key === 'Escape') {
      setIsShowModal(false);
      setLargeImage('');
    }
  };

  const openModal = e => {
    const largeImage = e.target.getAttribute('data-large-image-url');
    setIsShowModal(true);
    setLargeImage(largeImage);
    window.addEventListener('keydown', escListener);
  };

  const closeModal = e => {
    if (e.target === e.currentTarget) {
      setIsShowModal(false);
      setLargeImage('');
      window.removeEventListener('keydown', escListener);
    }
  };

  return (
    <AppCss>
      <Searchbar onSubmit={onSubmit} />
      <ImageGallery images={images} openModal={openModal} />
      {isShowLoader && <Loader />}
      {isShowLoadMore && <Button onClick={onClick} />}
      {isShowModal && <Modal closeModal={closeModal} largeImage={largeImage} />}
    </AppCss>
  );
};
