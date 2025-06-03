import React, { useState } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CarouselWrapper = styled.div`
  .slick-slide {
    transform: scale(0.8);
    transition: transform 0.5s ease;
    opacity: 0.6;
  }

  .slick-center {
    transform: scale(1.1) !important;
    opacity: 1 !important;
  }

  .slick-prev:before,
  .slick-next:before {
    color: white; /* Arrows color */
  }

  .slick-dots li button:before {
    color: white; /* Dots color */
  }

  .slick-dots li.slick-active button:before {
    color: white; /* Active dot color */
    opacity: 1;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 400px; /* Fixed width */
    height: 400px; /* Fixed height */
    object-fit: cover; /* Maintain aspect ratio */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ExpandedImageModal = styled.div`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 1000;

  img {
    max-width: 90%;
    max-height: 80%;
  }

  .caption {
    color: white;
    margin-top: 1rem;
    margin-left: 2rem;
    font-size: 1.5rem;
    text-align: center;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
`;

const CarouselComponent = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    focusOnSelect: true,
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <>
      <CarouselWrapper>
        <Slider {...settings}>
          {images.map((image, index) => (
            <ImageContainer key={index} onClick={() => handleImageClick(image)}>
              <img src={image.src} alt={image.caption} />
            </ImageContainer>
          ))}
        </Slider>
      </CarouselWrapper>

      {selectedImage && (
        <ExpandedImageModal show={showModal}>
          <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          <img src={selectedImage.src} alt={selectedImage.caption} />
          <div className="caption">{selectedImage.caption}</div>
        </ExpandedImageModal>
      )}
    </>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slick-arrow slick-next" onClick={onClick}>
      <i className="fa fa-chevron-right" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slick-arrow slick-prev" onClick={onClick}>
      <i className="fa fa-chevron-left" />
    </div>
  );
};

export default CarouselComponent;
