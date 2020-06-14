import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/Header';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faRupeeSign } from '@fortawesome/free-solid-svg-icons';

//Home page of the food ordering application.

class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurants1:[],
            restaurants: [{
                  address: {
                    city: "",
                    flat_building_name: "",
                    id: "",
                    locality: "",
                    pincode: "",
                    state: {
                      id: "",
                      state_name: ""
                    }
                  },
                  average_price: 0,
                  categories: "",
                  customer_rating: 0,
                  id: "",
                  number_customers_rated: 0,
                  photo_URL: "",
                  restaurant_name: ""
                }],
             searchString:"",
             noOfColumns: 4
        } 
        this.updateNoOfColumns = this.updateNoOfColumns.bind(this);
    }


    //Un register window resize event handler
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    //Method invokes the call to restaurants or restaurantByName depending on the search string
    //If search bar is empty, get all the restaurants other wise get the restaurant by name.
    getRestaurantSearchString = (searchStr) =>{
      this.setState({searchString : searchStr})
       if(this.state.searchString === "")
           this.getAllRestaurants();
        else
           this.getRestaurantByName();
    }

    //Sends GET request to /restaurant API
    getAllRestaurants() {
        let that = this;
        let data = null;
        let xhrRestaurant = new XMLHttpRequest();
        xhrRestaurant.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    restaurants: JSON.parse(this.responseText).restaurants
                });
            }
        });

        xhrRestaurant.open("GET", this.props.baseUrl + "restaurant");
        xhrRestaurant.setRequestHeader("Cache-Control", "no-cache");
        xhrRestaurant.send(data);
    }

    //Sends GET request to /restaurantByName API
    getRestaurantByName(){
        let that = this;
        let data = null;
        let xhrRestaurant = new XMLHttpRequest();
        xhrRestaurant.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(this.status === 200){
                    if(JSON.parse(this.responseText).restaurants === null){
                        that.setState({
                            restaurants: []
                        });  
                    }
                    else{
                        that.setState({
                            restaurants: JSON.parse(this.responseText).restaurants
                        });
                    }
                }
                else{
                    that.setState({
                        restaurants: []
                    });   
                }

                // that.getPageData();
                // console.log("getRestaurantByName :"+this.status)
                // console.log("getRestaurantByName :"+this.responseText)
                // console.log("getRestaurantByName :"+that.state.restaurants)
            }
        });

        xhrRestaurant.open("GET", this.props.baseUrl + "restaurant/name/"+this.state.searchString);
        xhrRestaurant.setRequestHeader("Cache-Control", "no-cache");
        xhrRestaurant.send(data);
    }

    //Changes the no of columns in the grid based on window size.
    //This method is called on resize event.
    updateNoOfColumns=()=>{
        if(window.innerWidth > 414 && window.innerWidth <= 1024 )
            this.setState({noOfColumns:2})
        else if(window.outerWidth <= 414)
            this.setState({noOfColumns:1})
        else
            this.setState({noOfColumns:4})
    }

    //On page gets renderd get the restaurants from API
    componentDidMount=()=>{

        let that = this;
        let data = null;
        let xhrRestaurant = new XMLHttpRequest();
        xhrRestaurant.addEventListener("readystatechange", function () {
            // console.log("Status "+this.status + " : "+this.readyState)
            if (this.readyState === 4) {
                that.setState({
                    restaurants: JSON.parse(this.responseText).restaurants
                });
            }
        });

        xhrRestaurant.open("GET", this.props.baseUrl + "restaurant");
        xhrRestaurant.setRequestHeader("Cache-Control", "no-cache");
        xhrRestaurant.send(data);

        //Register updateNoOfColumns method on resize event.
        this.updateNoOfColumns();
        window.addEventListener("resize", this.updateNoOfColumns);
    }

    //Open restaurant details when clicked    
    goToDetailsPage = (retaurant) =>{
        // this.props.history.push({test : false})
        this.props.history.push('/restaurant/' + retaurant.id);
        // console.log(retaurant.id);
    }
    

    render(){ 
        return(
            <div>
                <Header baseUrl={this.props.baseUrl} restaurantSubString={this.getRestaurantSearchString}/>
                <div>
                    {/* If there are no restaurants found with the given name display a message otherwise display grid layout */}
                    {this.state.restaurants.length === 0 
                    ?<div>No restaurant with the given name.</div>
                    :<GridList className="grid-list-cards" cellHeight={500} cols={this.state.noOfColumns}>
                        {this.state.restaurants.map(data => (
                            <GridListTile className="grid-item" key={"grid" + data.id} style={{ height: 'auto' }}  onClick={()=>this.goToDetailsPage(data)}>
                                <Card className="restaurantCard">
                                    <CardMedia className="restaurantCardMedia">
                                        <img src={data.photo_URL} className="restaurant-image" alt="test" />
                                    </CardMedia>
                                    <CardContent>
                                        <div>
                                            <h2 className="restaurantName-heading">{data.restaurant_name}</h2>
                                        </div>
                                        <div>
                                            {data.categories}
                                        </div>
                                    </CardContent>
                                    <CardActions className="restaurant-card-actions">
                                        <Button className="like-button" variant="contained">
                                            <span> <FontAwesomeIcon icon={faStar} /> {data.customer_rating}  ({data.number_customers_rated})</span>
                                        </Button>
                                        <span>
                                            <FontAwesomeIcon icon={faRupeeSign} /><span className="avg-price-span-style">{data.average_price} for two</span>
                                        </span>
                                    </CardActions>
                                </Card>
                            </GridListTile>
                        ))}
                    </GridList>
                    }
                </div>
            </div>
        );
    }
}

export default Home;