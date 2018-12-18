import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import request from "superagent";
import Masonry from 'react-masonry-component';

import './styles.css';


const masonryOptions = {
    transitionDuration: 0
};

const imagesLoadedOptions = { background: '.my-bg-image-el' }

class FlickrPhotos extends Component {
  constructor(props) {
    super(props);

    
    // Sets up our initial state
    this.state = {
      error: false,
      hasMore: true,
      isLoading: false,
      photos: [],
      currentPage: 0,
      searchTerm: 'belvelly'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // Binds our scroll event handler
    window.onscroll = () => {
      const {
        loadPhotos,
        state: {
          error,
          isLoading,
          hasMore,
        },
      } = this;


      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || isLoading || !hasMore) return;

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        loadPhotos();
      }
    };
  }

  handleChange (event) {
    this.setState({
        searchTerm: event.target.value
    })
  }

  handleSubmit (event) {
      console.log('Form value: ' + this.state.searchTerm);
      event.preventDefault();
      this.setState({
        currentPage: 1,
        photos: []
      })
      this.loadPhotos()
  }


  loadPhotos = () => {
    this.setState({ currentPage: this.state.currentPage + 1 }) 
    this.setState({ isLoading: true }, () => {
      request
        .get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6347d99644f5a2b060c5559e70ecbfbd&tags=' + this.state.searchTerm + '&extras=description%2C+license%2C+date_upload%2C+date_taken%2C+owner_name%2C+icon_server%2C+original_format%2C+last_update%2C+geo%2C+tags%2C+o_dims%2C+views%2C+media%2C+path_alias%2C+url_sq%2C+url_t%2C+url_s%2C+url_q%2C+url_m%2C+url_n%2C+url_z%2C+url_c%2C+url_l%2C+url_o&per_page=20&page=' + this.state.currentPage + '&format=json&nojsoncallback=1')
        .then((results) => {          
          console.log(results)
          const photoBatch = results.body.photos
          console.log(photoBatch)
          // Creates a massaged array of user data
          const nextPhotos = photoBatch.photo.map(photo => ({
            photoId: photo.id,
            owner: photo.owner,
            farm: photo.farm,
            thumb: photo.url_n,
            full: 'fullPhoto',
            title: 'title',
            tags: 'tags',
            tagLength: 'tagLength',
            owner: 'owner',
            date: 'dateTaken'
          }));

          // Merges the next photos into our existing photos
          this.setState({
            // Note: Depending on the API you're using, this value may be
            // returned as part of the payload to indicate that there is no
            // additional data to be loaded
            hasMore: (this.state.photos.length < 100),
            isLoading: false,
            photos: [
              ...this.state.photos,
              ...nextPhotos,
            ],
          });
        })
        .catch((err) => {
          this.setState({
            error: err.message,
            isLoading: false,
           });
        })
    });
  }


  render() { 
    const {
      error,
      hasMore,
      isLoading,
      photos,
    } = this.state;


    const childElements = this.state.photos.map(function(photo){
      return (
        <div className="photoBox">
          <img src={photo.thumb} />
          <p>{photo.owner}</p>
          <p>{photo.farm}</p>
          <p>{photo.full}</p>
          <p>{photo.title}</p>
          <p>{photo.tags}</p>
          <p>{photo.tagLength}</p>
          <p>{photo.date}</p>
        </div>
      );
    });
    
    return (
      <div>

        <form onSubmit={this.handleSubmit}>
              <input type="text" value={this.state.inputvalue} onChange={this.handleChange} />
              <input type="submit" value="Submit"/>
          </form>
        <Masonry
          className={'photoContainer'} // default ''
          elementType={'div'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          imagesLoadedOptions={imagesLoadedOptions} // default {}
        >
          {childElements}
        </Masonry>
      </div>
      );
    }
  }

const container = document.createElement("div");
document.body.appendChild(container);
render(<FlickrPhotos />, container);