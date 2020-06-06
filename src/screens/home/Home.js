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

    }

    UNSAFE_componentWillMount() {
        let that = this;
        let data = null;
        let xhrMovie = new XMLHttpRequest();
        xhrMovie.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                    that.setState({
                        restaurants: JSON.parse(this.responseText).restaurants
                    });

                // that.getPageData();
                //console.log("componentWillMount :"+this.responseText)
            }
        });

        xhrMovie.open("GET", "http://localhost:8080/api/restaurant");
        xhrMovie.setRequestHeader("Cache-Control", "no-cache");
        xhrMovie.send(data);
    }


    getRestaurantSearchString = (searchStr) =>{
      this.setState({searchString : searchStr})
       if(this.state.searchString === "")
           this.getAllRestaurants();
        else
           this.getRestaurantByName();
    }

    getAllRestaurants() {
        let that = this;
        let data = null;
        let xhrMovie = new XMLHttpRequest();
        xhrMovie.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    restaurants: JSON.parse(this.responseText).restaurants
                });

                // that.getPageData();
               // console.log("getAllRestaurants :"+ this.responseText)
            }
        });

        xhrMovie.open("GET", "http://localhost:8080/api/restaurant");
        xhrMovie.setRequestHeader("Cache-Control", "no-cache");
        xhrMovie.send(data);
    }

    getRestaurantByName(){
        let that = this;
        let data = null;
        let xhrMovie = new XMLHttpRequest();
        xhrMovie.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(this.status === 200){
                    console.log("RKP: "+JSON.parse(this.responseText).restaurants)
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
                console.log("getRestaurantByName :"+this.status)
                console.log("getRestaurantByName :"+this.responseText)
                console.log("getRestaurantByName :"+that.state.restaurants)
            }
        });

        xhrMovie.open("GET", "http://localhost:8080/api/restaurant/name/"+this.state.searchString);
        xhrMovie.setRequestHeader("Cache-Control", "no-cache");
        xhrMovie.send(data);
    }

    componentDidMount=()=>{
        console.log("Window outer width :" +window.outerWidth)

        if(window.outerWidth > 414 && window.outerWidth <= 1024 )
            this.setState({noOfColumns:2})
        else if(window.outerWidth <= 414)
            this.setState({noOfColumns:1})
        else
            this.setState({noOfColumns:4})
    }

    render(){ 
        return(
            <div>
                <Header restaurantSubString={this.getRestaurantSearchString}/>
                <div>
                <GridList className="grid-list-cards" cellHeight={500} cols={this.state.noOfColumns}>
                    {this.state.restaurants.map(data => (
                        <GridListTile className="grid-item" key={"grid" + data.id} style={{ height: 'auto' }}>
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
                </div>
            </div>
        );
    }
}

export default Home;