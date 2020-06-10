import React, { Component } from 'react';
import './Details.css'
import Header from '../../common/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faRupeeSign, faCircle} from '@fortawesome/free-solid-svg-icons';
import { faStopCircle } from '@fortawesome/free-regular-svg-icons'
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Button from '@material-ui/core/Button';


class Details extends Component {
    
    constructor() {
        super();
        this.state = {
            restaurant1:[],
            restaurant: {
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
                },
            restaurantDetails:{
                id: "",
                restaurant_name: "",
                photo_URL: "",
                customer_rating: 0,
                average_price: 0,
                number_customers_rated: 0,
                address: {
                  id: "",
                  flat_building_name: "",
                  locality: "Khar",
                  city: "Mumbai",
                  pincode: "400058",
                  state: {
                    id: "",
                    state_name: ""
                  }
                },
                categories: [
                  {
                    id: "",
                    category_name: "",
                    item_list: [
                      {
                        id: "",
                        item_name: "",
                        price: 0,
                        item_type: ""
                      }
                    ]
                  }
                 ]
            },
            categoryList: "",
            searchString:"",
            snackbarStatus: false,
            snackbarText: "",
            cartList:[],
            cartList1:[{
                id: "",
                item_type: "",
                item_name: "",
                quantity: 0,
                price: 0
            }],
            cartItemsCount: 0,
            cartTotalAmount: 0.00
        } 
    }

    UNSAFE_componentWillMount() {
        let that = this;
        let data = null;
        let xhrRestaurant = new XMLHttpRequest();
        xhrRestaurant.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(this.status === 200){
                    that.setState({
                        restaurantDetails: JSON.parse(this.responseText)
                    });
                    that.getRestaurantCategoryList();
                }
                // that.getPageData();
                // console.log("componentWillMount :"+this.responseText)
                // console.log("componentWillMount :"+that.state.restaurant)
            }
        });

        // xhrMovie.open("GET", "http://localhost:8080/api/restaurant");
        //console.log(this.props.match.params.test);
        xhrRestaurant.open("GET", this.props.baseUrl + "restaurant/"+this.props.match.params.id);
        xhrRestaurant.setRequestHeader("Cache-Control", "no-cache");
        xhrRestaurant.send(data);
    }

    getRestaurantCategoryList = () =>{
        // this.setState({categoryList: ""})
        for(let category of this.state.restaurantDetails.categories){
            // console.log(this.state.restaurantDetails.categories)
            if(this.state.categoryList === "")
                this.setState({categoryList : category.category_name});
            else
            {
                this.setState({categoryList : this.state.categoryList +", "+ category.category_name});
            }
        }
    }

    addItemToCart = (addItem, value) => {
        console.log(addItem);

        let tempCartList = [];
        let itemAdded = false;
        let total = 0.00;

        console.log(this.state.cartList + this.state.cartList.length);
        //List is empty
        // if(this.state.cartList[0].id === ""){
        //     let itemToBeAdded = this.state.cartList[0];
        //     itemToBeAdded.id = addItem.id;
        //     itemToBeAdded.item_type = addItem.item_type;
        //     itemToBeAdded.item_name = addItem.item_name;
        //     itemToBeAdded.quantity = 1;
        //     itemToBeAdded.price = addItem.price;
        //     total = addItem.price;
        //     tempCartList.push(itemToBeAdded);
        // }
        if(this.state.cartList.length === 0){
            let newItem = {
                id: "",
                item_type: "",
                item_name: "",
                quantity: 0,
                price: 0
            }
            newItem.id = addItem.id;
            newItem.item_type = addItem.item_type;
            newItem.item_name = addItem.item_name;
            newItem.quantity = 1;
            newItem.price = addItem.price;
            total = total + newItem.price;
            tempCartList.push(newItem);
        }
        else{
            //Increment existing item
            for(let item of this.state.cartList){
                let itemToBeAdded = item;
                if(itemToBeAdded.id === addItem.id){
                    itemAdded = true;
                    //Get per unit price.
                    let perUnitPrice = itemToBeAdded.price / itemToBeAdded.quantity;

                    itemToBeAdded.quantity = itemToBeAdded.quantity + 1;
                    itemToBeAdded.price = itemToBeAdded.quantity * perUnitPrice;
                }
                total = total + itemToBeAdded.price;
                tempCartList.push(itemToBeAdded);
            }
            if(itemAdded === false){
                let newItem = {
                    id: "",
                    item_type: "",
                    item_name: "",
                    quantity: 0,
                    price: 0
                }
                newItem.id = addItem.id;
                newItem.item_type = addItem.item_type;
                newItem.item_name = addItem.item_name;
                newItem.quantity = 1;
                newItem.price = addItem.price;
                total = total + newItem.price;
                tempCartList.push(newItem);
            }
        }

        this.setState({cartList: tempCartList})
        //Increament cart item count
        this.setState({cartItemsCount : this.state.cartItemsCount + 1});
        //Get total cost of items in the cart
        // this.totalCartValue();
        this.setState({cartTotalAmount: total});

        console.log(this.state.cartList);

        this.setState({ snackbarText: value});
        this.setState({ snackbarStatus: true });

    };
    

    removeItemFromCart = (removeItem, value) => {
        console.log(removeItem);

        let tempCartList = [];
        let total = 0.00;

        console.log(this.state.cartList);
        //List is empty
        //Decrement existing item
        for(let item of this.state.cartList){
            let itemToBeRemoved = item;
            if(itemToBeRemoved.id === removeItem.id){
                if(itemToBeRemoved.quantity >= 1){
                    //Get per unit price
                    let perUnitPrice = itemToBeRemoved.price / itemToBeRemoved.quantity;
                    //Decrement the quantity
                    itemToBeRemoved.quantity = itemToBeRemoved.quantity - 1;
                    itemToBeRemoved.price = itemToBeRemoved.quantity * perUnitPrice;
                }
            }
            total = total + itemToBeRemoved.price;
            if(itemToBeRemoved.quantity > 0)
                tempCartList.push(itemToBeRemoved);
        }

        this.setState({cartList: tempCartList})
        //Increament cart item count
        this.setState({cartItemsCount : this.state.cartItemsCount - 1});
        //Get total cost of items in the cart
        // this.totalCartValue();
        this.setState({cartTotalAmount: total});

        console.log(this.state.cartList);

        this.setState({ snackbarText: value});
        this.setState({ snackbarStatus: true });

    };




    closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }

    this.setState({ snackbarStatus: false });
    }
    

    render(){ 

        return(
            <div>
                <Header showSearchBar="false"/>
                <div>
                    <div className="restaurant-details">
                        <img src={this.state.restaurantDetails.photo_URL} className="restaurant-image-thumbnail" alt="test" />
                        <div className="restaurant-details-info">
                            <label className="restaurant-name-label">{this.state.restaurantDetails.restaurant_name}</label>
                            <div className="restaurant-locality-div">
                                {this.state.restaurantDetails.address.locality}
                            </div>
                            <br/>
                            <div className="restaurant-category-div">
                                {this.state.categoryList}
                            </div>
                            <br/>
                            <div className="rating-price-div-container">
                                <div className="rating-price-div">
                                    <span><FontAwesomeIcon icon={faStar} /> {this.state.restaurantDetails.customer_rating}</span>
                                    <label className="rating-price-label">AVERAGE RATING BY <b>{this.state.restaurantDetails.number_customers_rated}</b> CUSTOMERS</label>
                                </div>
                                <div className="rating-price-div">
                                    <span> <FontAwesomeIcon icon={faRupeeSign} /> {this.state.restaurantDetails.average_price} </span>
                                    <label className="rating-price-label">AVERAGE COST FOR TWO PEOPLE</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="restaurant-menu-cart-container">
                        <div className = "restaurant-menu">
                            {this.state.restaurantDetails.categories.map( (catagory, index) =>(
                                <div  key={"div" + catagory.id}>
                                    <div className="item-category">{catagory.category_name}</div>
                                    <Divider />
                                    {this.state.restaurantDetails.categories[index].item_list.map( item =>(
                                        <div className="menu-item" key={"div" + item.id}>
                                            {item.item_type === "VEG"
                                                ?<div className="menu-item-type"> 
                                                    <FontAwesomeIcon className="circle-size" icon={faCircle} style={{ color: 'green' }}/> 
                                                    <span className="item-name-text-span">{item.item_name}</span>
                                                </div>
                                                :<div  className="menu-item-type"> 
                                                    <FontAwesomeIcon className="circle-size" icon={faCircle} style={{ color: 'red' }}/> 
                                                    <span className="item-name-text-span">{item.item_name}</span>
                                                </div>
                                            }
                                            <span> <FontAwesomeIcon icon={faRupeeSign} />{item.price}</span>
                                            <span> <IconButton onClick={() => this.addItemToCart(item, "Item added to cart!")}> <AddIcon/> </IconButton> </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="cart">
                            <Card className="cartCard">
                                <div className="cart-heading-div">
                                    <Badge badgeContent={this.state.cartItemsCount} color="primary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                    <span className="cart-name-span">My Cart</span>
                                </div>
                                {this.state.cartList.map( cartItem =>(

                                    <div className="cart-item" key={"div"+cartItem.id}>
                                        {cartItem.item_type === "VEG"
                                        ?<span className="cart-item-name-span"><FontAwesomeIcon icon={faStopCircle} style={{ color: 'green' }}/> {cartItem.item_name}</span>
                                        :<span className="cart-item-name-span"><FontAwesomeIcon icon={faStopCircle} style={{ color: 'red' }}/> {cartItem.item_name}</span>
                                        }
                                        <div className="cart-item-qunatity-div">
                                            <IconButton className="cart-item-remove-button" onClick={() => this.removeItemFromCart(cartItem, "Item quantity decreased by 1!")}> <RemoveIcon/></IconButton>
                                            <label className="cart-item-quantity-label">{cartItem.quantity}</label>
                                            <IconButton className="cart-item-add-button" onClick={() => this.addItemToCart(cartItem, "Item quantity increased by 1!")}> <AddIcon/></IconButton>
                                        </div>
                                        <span className="cart-item-price-span"><FontAwesomeIcon icon={faRupeeSign}/> {cartItem.price}</span>
                                    </div>
                                ))}
                                <div className="bill-amount-div">
                                    <span>TOTAL AMOUNT</span>
                                    <span> <FontAwesomeIcon icon={faRupeeSign}/> {this.state.cartTotalAmount}</span>
                                </div>
                                <br/>
                                <Button className="checkout-button" variant="contained" color="primary" onClick={this.registerClickHandler}>CHECKOUT</Button>
                            </Card>
                        </div>
                    </div>
                </div>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackbarStatus}
                    autoHideDuration={3000}
                    onClose={this.closeSnackBar}
                    // ContentProps={{
                    //     'aria-describedby': 'message-id',
                    // }}
                    message={<span id="message-id">{this.state.snackbarText}</span>}
                    action={[
                        <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.closeSnackBar}
                        >
                        <CloseIcon />
                    </IconButton>,
                    ]}
                />

            </div>
        )
    }
}
export default Details;