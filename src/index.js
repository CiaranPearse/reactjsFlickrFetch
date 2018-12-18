import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import request from "superagent";
import Masonry from 'react-masonry-component';
import Moment from 'react-moment';

import './styles.css';

Moment.globalFormat = 'D/MMM/YYYY hh:mm A';
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
      errorMsg: '',
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
          let hasMore = true
          let isError = false
          let errorMsg = ''
          console.log(results.body.stat)
          if (results.body.stat === 'fail') {
            isError = true
            errorMsg = results.body.message
            console.log('Should be FAIL')
          }
          const photoBatch = results.body.photos
          console.log(photoBatch)
          if (photoBatch.pages === this.state.currentPage) {
            hasMore = false
          }
          console.log ('photos Found: ', photoBatch.total)
          if (photoBatch.total === "0") {
            isError = true
            errorMsg = 'No Photos found'
          }
          console.log(isError)
          console.log(photoBatch.photo[1].dateupload)
          console.log(photoBatch.photo[1].dateupload.getFullYear)
          // Creates a massaged array of user data
          const nextPhotos = photoBatch.photo.map(photo => ({
            photoId: photo.id,
            owner: photo.owner,
            thumb: photo.url_n,
            full: photo.url_o,
            title: photo.title,
            tags: photo.tags.split(" ").join(', '),
            date: photo.dateupload
          }));

          this.setState({
            hasMore: hasMore,
            error: isError,
            errorMsg: errorMsg,
            isLoading: false,
            photos: [
              ...this.state.photos,
              ...nextPhotos,
            ],
          });
        })
        // .catch((err) => {
        //   this.setState({
        //     error: true,
        //     errorMsg: err.message,
        //     isLoading: false,
        //    });
        // })
    });
  }


  render() { 
    const {
      error,
      hasMore,
      isLoading,
      photos,
      errorMsg,
    } = this.state;


    const childElements = this.state.photos.map(function(photo){
      return (
        
        <div className="photoBox">
          <img src={photo.thumb} />
          <div class="photoContent">
            <p>{photo.owner}</p>
            <p><a href={photo.full} target="_blank">View Photo</a></p>
            <p>{photo.title}</p>
            <p>{photo.tags}</p>
            <p><Moment unix>{photo.date}</Moment></p>
            </div>
        </div>
      );
    });
    
    return (
      <div>
        <div className="container-fluid">

        <form onSubmit={this.handleSubmit}>
              <input type="text" value={this.state.inputvalue} onChange={this.handleChange} className="form-control" placeholder="type tag and press enter" />
              
          </form>

          {this.state.photos.length === 0 && (
            <div class="row">
            <div class="col-xs-12">
              <div class="alert alert-warning" role="alert">
                <p>Start your search and press enter</p>
              </div>
              </div>
            </div>
          )}

          {this.state.error && (
            <div class="alert alert-danger" role="alert">
              <p>{this.state.errorMsg}</p>
            </div>
          )}


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
        {this.state.isLoading && (
          <div id="loading">
            <div className="hollow-dots-spinner">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <p>Loading ...</p>
          </div>
        )}
        {!this.state.hasMore && (
          <div class="alert alert-warning" role="alert">
            <p>NO MORE RESULTS</p>
          </div>
        )}
      </div>
      </div>
      
      );
    }
  }

const container = document.createElement("div");
document.body.appendChild(container);
render(<FlickrPhotos />, container);