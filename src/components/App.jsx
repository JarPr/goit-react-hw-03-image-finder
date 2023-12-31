import { Component } from 'react';
import { Container, GlobalStyle } from './GlobalStyle';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { fetchImages } from './api';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { ErrorText } from './ErrorText/ErrorText';
import toast, { Toaster } from 'react-hot-toast';

export class App extends Component {
  state = {
    images: [],
    query: '',
    page: 1,
    isLoading: false,
    error: false,
    loadMore: false,
  };


  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      const clearQuery = this.state.query.split('/').pop();
      try {
        this.setState({ isLoading: true, error: false });

        const newImages = await fetchImages(clearQuery, this.state.page);

        if (newImages.length === 0) {
          toast.error('No more images available');
        } else {
          this.setState(prevState => ({
            images: [...prevState.images, ...newImages.hits],
            loadMore: this.state.page < Math.ceil(newImages.totalHits /12)
          }));
        }
      } catch (err) {
        this.setState({ error: true });
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }


   onSubmitClick = searchedQuery => {
if(!searchedQuery.trim()) return
    this.setState({
      query: `${Date.now()}/${searchedQuery}`,
      page: 1,
      images: [],
    });
  };

  onLoadMoreClick = () => {
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
      };
    });
  };

  render() {
    const { images, isLoading, error, loadMore } = this.state;

    return (
      <Container>
        <Searchbar submitClick={this.onSubmitClick} />
        {error && <ErrorText />}
        {images.length > 0 && <ImageGallery images={images} />}
        {isLoading && <Loader />}
        {loadMore && !isLoading && images.length > 0 && (
          <Button loadMoreBtnClick={this.onLoadMoreClick} />
        )}
        <GlobalStyle />
        <Toaster />
      </Container>
    );
  }
}