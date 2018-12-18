# flickr-vuejs

> A Vue project to fetch the latest photos from Flickr based on tag input in batches of 20. When the user scrolls to the bottom of the page it loads the next 20 photos.

## Frontend Template
I've used Vuetify as a frontend Template. The main reasons for this were for the grid, input fields and cards. Why reinvent the wheel?

I've decided to go with the Dark version of the template. Theres no real reason for this other than I want it to be the "one thats just that little bit different"


## Infinate Scroll
Upon reaching the end of current loaded photos an API call will attempt to load the next batch or 20.


## Store Items

### loading: 
Bool - Sets initial loading state

### searchText: 
Contains the input from the search bar. If it is null then a message is shown

### photos:
Contains the photo object updated by the API call

### photoPage:
Contains the page number from the latest API response

### perPage:
Sets how many photos to get per API call

### hasError:
Bool - if true it is used to show an error div

### errorMsg:
Contains Error Message. If flickr returns a status of "fail" this will be populated from the response. If response is OK but yeilds 0 results it will be "No Photos found for TAG_NAME"



## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```