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
      users: [],
      pageNumber: 1,
      searchTerm: 'belvelly'
    };

    // Binds our scroll event handler
    window.onscroll = () => {
      const {
        loadUsers,
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
        loadUsers();
      }
    };
  }

  componentWillMount() {
    // Loads some users on initial load
    this.loadUsers();
  }

  loadUsers = () => {
    this.setState({ isLoading: true }, () => {
      request
        .get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6347d99644f5a2b060c5559e70ecbfbd&tags=' + this.state.searchTerm + '&extras=description%2C+license%2C+date_upload%2C+date_taken%2C+owner_name%2C+icon_server%2C+original_format%2C+last_update%2C+geo%2C+tags%2C+o_dims%2C+views%2C+media%2C+path_alias%2C+url_sq%2C+url_t%2C+url_s%2C+url_q%2C+url_m%2C+url_n%2C+url_z%2C+url_c%2C+url_l%2C+url_o&per_page=20&page=' + this.state.pageNumber + '&format=json&nojsoncallback=1')
        .then((results) => {          
          console.log(results)
          const photoBatch = results.body.photos
          console.log(photoBatch)
          // Creates a massaged array of user data
          const nextUsers = photoBatch.photo.map(user => ({
            photoId: user.id,
            owner: user.owner,
            farm: user.farm,
            thumb: user.url_n,
            full: 'fullPhoto',
            title: 'title',
            tags: 'tags',
            tagLength: 'tagLength',
            owner: 'owner',
            date: 'dateTaken'
          }));

          // Merges the next users into our existing users
          this.setState({
            // Note: Depending on the API you're using, this value may be
            // returned as part of the payload to indicate that there is no
            // additional data to be loaded
            hasMore: (this.state.users.length < 100),
            isLoading: false,
            users: [
              ...this.state.users,
              ...nextUsers,
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
    this.setState({ pageNumber: this.state.pageNumber + 1 })
  }

  render() { 
    const {
      error,
      hasMore,
      isLoading,
      users,
    } = this.state;

    const childElements = this.state.users.map(function(user){
      return (
        <div className="photoBox">
          <img src={user.thumb} />
          <p>{user.owner}</p>
          <p>{user.farm}</p>
          <p>{user.full}</p>
          <p>{user.title}</p>
          <p>{user.tags}</p>
          <p>{user.tagLength}</p>
          <p>{user.date}</p>
        </div>
      );
    });
    
    return (
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
      );
    }
  }

const container = document.createElement("div");
document.body.appendChild(container);
render(<FlickrPhotos />, container);