import React, { Component } from 'react';
import './Checkout.css'
import Header from '../../common/Header';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from '@material-ui/core/StepContent';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faRupeeSign, faCircle} from '@fortawesome/free-solid-svg-icons';
import { faStopCircle } from '@fortawesome/free-regular-svg-icons';
import Card from '@material-ui/core/Card';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Divider from '@material-ui/core/Divider';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from '@material-ui/icons/Close';
  
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 3.8 + ITEM_PADDING_TOP,
        width: 250,
        marginTop: 50,
        },
    },
};


class Checkout extends Component {

    constructor(){
        super();
        this.state = {
            noOfCols: 3,
            steps:[
                "Delivery", "Payment"
            ],
            stepperActiveStep: 0,
            value: 0,
            address:[],
            addressSelected:{
                id:""
            },
            cartItemsCount:0,
            cartList:[],
            cartTotalAmount:0.00,
            restaurant_name: "",
            state_names:[],
            flatNameRequired:"dispNone",
            flat_building_name:"",
            flatNameHelperText:"required",
            localityRequired:"dispNone",
            locality:"",
            localityHelperText:"required",
            cityRequired:"dispNone",
            city:"",
            cityHelperText:"required",
            stateNameRequired:"dispNone",
            state_name:"",
            stateNameHelperText:"required",
            state_uuid:"",
            pincodeRequired:"dispNone",
            pincode:"",
            pincodeHelperText:"required",
            paymentModes:[],
            paymentSelected:{
                id:""
            },
            coupon:{
                id:""
            },
            snackbarText:"",
            snackbarStatus: false,
            discountValue:0,
            amountPayable:0
        }
    }

    clearAddressTable= () =>{
        this.setState({
            flatNameRequired:"dispNone",
            flat_building_name:"",
            flatNameHelperText:"required",
            localityRequired:"dispNone",
            locality:"",
            localityHelperText:"required",
            cityRequired:"dispNone",
            city:"",
            cityHelperText:"required",
            stateNameRequired:"dispNone",
            state_name:"",
            stateNameHelperText:"required",
            state_uuid:"",
            pincodeRequired:"dispNone",
            pincode:"",
            pincodeHelperText:"required"
        })
    }

    componentDidMount() {
        if(this.props.location.orderSummary == null)
            return; 
        console.log(this.props.location.orderSummary.cartList);
        this.setState({restaurant_name: this.props.location.orderSummary.restaurantDetails.restaurant_name})
        this.setState({cartList: this.props.location.orderSummary.cartList})
        this.setState({cartTotalAmount: this.props.location.orderSummary.cartTotalAmount})
        //Get Coupon
        this.getCoupon();
    }

    switchAddressTabs = (event, value) => {
        this.setState({ value });
        if(value === 1){
            this.getAllStates();
        }
    }


    componentWillMount(){
        let dataAddress = null;
        let xhrAddress = new XMLHttpRequest();
        let that = this;
        xhrAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(this.status === 200){
                    that.setState({
                        address: JSON.parse(this.responseText).addresses
                    })   
                    console.log(that.state.address.length);
                }
            }
        });

        xhrAddress.open("GET", this.props.baseUrl + "address/customer");
        xhrAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrAddress.setRequestHeader("Content-Type", "application/json");
        xhrAddress.setRequestHeader("Cache-Control", "no-cache");
        xhrAddress.send(dataAddress);
    }


    getAddressOfCustomer = () =>{
        let dataAddress = null;
        let xhrAddress = new XMLHttpRequest();
        let that = this;
        xhrAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(this.status === 200){
                    that.setState({
                        address: JSON.parse(this.responseText).addresses
                    })   
                    console.log(that.state.address.length);
                }
            }
        });

        xhrAddress.open("GET", this.props.baseUrl + "address/customer");
        xhrAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrAddress.setRequestHeader("Content-Type", "application/json");
        xhrAddress.setRequestHeader("Cache-Control", "no-cache");
        xhrAddress.send(dataAddress);
    }



    addressSelectionHandler = (addressSelected) =>{
        this.setState({addressSelected})
    }


    getAllStates(){
        let dataStates = null;
        let xhrStates = new XMLHttpRequest();
        let that = this;
        xhrStates.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText)
                if(this.status === 200){
                    that.setState({
                        state_names: JSON.parse(this.responseText).states
                    })   
                    console.log(that.state.state_names);
                }
            }
        });

        // xhrStates.open("GET", this.props.baseUrl + "states/");
        xhrStates.open("GET", "http://localhost:8080/api/states");
        // xhrStates.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrStates.setRequestHeader("Content-Type", "application/json");
        xhrStates.setRequestHeader("Cache-Control", "no-cache");
        xhrStates.send(dataStates);
    }

    getPaymentModes(){
        let dataPayment = null;
        let xhrPaymentMode = new XMLHttpRequest();
        let that = this;
        xhrPaymentMode.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText)
                if(this.status === 200){
                    that.setState({
                        paymentModes: JSON.parse(this.responseText).paymentMethods
                    })   
                    console.log(that.state.paymentModes);
                }
            }
        });

        // xhrStates.open("GET", this.props.baseUrl + "payment/");
        xhrPaymentMode.open("GET", "http://localhost:8080/api/payment");
        // xhrStates.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrPaymentMode.setRequestHeader("Content-Type", "application/json");
        xhrPaymentMode.setRequestHeader("Cache-Control", "no-cache");
        xhrPaymentMode.send(dataPayment);
    }


    saveAddressHandler = () => {

        this.state.flat_building_name === "" ? this.setState({ flatNameRequired: "dispBlock" }) : this.setState({ flatNameRequired: "dispNone" });
        this.state.locality === "" ? this.setState({ localityRequired: "dispBlock" }) : this.setState({ localityRequired: "dispNone" });
        this.state.city === "" ? this.setState({ cityRequired: "dispBlock" }) : this.setState({ cityRequired: "dispNone" });
        this.state.state_name === "" ? this.setState({ stateNameRequired: "dispBlock" }) : this.setState({ stateNameRequired: "dispNone" });
        this.state.pincode === "" ? this.setState({ pincodeRequired: "dispBlock" }) : this.setState({ pincodeRequired: "dispNone" });
        // this.setState({registrationSuccess: false})

        if(this.state.flat_building_name  === "" || this.state.locality === "" || this.state.city === "" || this.state.state_name === "" || this.state.pincode === ""){
            return;
        }

        // var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        // if(emailRegex.test(this.state.email) === false){
        //     console.log("email regex");
        //     this.setState({ emailHelperText: "Invalid Email" });
        //     this.setState({ emailRequired: "dispBlock" });
        //     return;
        // }

        // var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
        // if(passwordRegex.test(this.state.registerPassword) === false){
        //     this.setState({ passwordHelperText: "Password must contain atlease one capital letter, one small letter, one number and one special character" });
        //     this.setState({ registerPasswordRequired: "dispBlock" });
        //     return;
        // }
        console.log(this.state.pincode)
        var contactRegex = /^\d{6}$/
        if(contactRegex.test(this.state.pincode) === false){
            this.setState({ pincodeHelperText: "Pincode must contain only numbers and must be 6 digits long" });
            this.setState({ pincodeRequired: "dispBlock" });
            return;
        }

        //Get UUID of the state
        // this.getStateUuidFromName()

        let dataAddress = JSON.stringify({
            "city": this.state.city,
            "flat_building_name": this.state.flat_building_name,
            "locality": this.state.locality,
            "pincode": this.state.pincode,
            "state_uuid": this.state.state_name.id
        });

        console.log(dataAddress);

        let xhrSaveAddress = new XMLHttpRequest();
        let that = this;
        xhrSaveAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
               if(this.status === 201){
                    // that.openModalHandler();
                    // that.switchAddressTabs(0);
                    that.setState({value : 0});
                    that.getAddressOfCustomer();
                    that.clearAddressTable();
                    
               }
               console.log(JSON.parse(this.responseText));
            }
        });

        xhrSaveAddress.open("POST", "http://localhost:8080/api/address");
        //xhrSaveAddress.open("GET", this.props.baseUrl + "states/");
        xhrSaveAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
        xhrSaveAddress.setRequestHeader("Cache-Control", "no-cache");
        xhrSaveAddress.send(dataAddress);
    } 

    getStateUuidFromName = () => {
        console.log(this.state.state_name.id)
        for(let stateEntity of this.state.state_names){
                if(stateEntity.state_name === this.state.state_name){
                    this.setState({ state_uuid : stateEntity.id })
                }
        }
    }


    inputFlatBuildingNameHandler = (e) => {
        this.setState({ flat_building_name: e.target.value });
    }

    inputLocalityHandler = (e) => {
        this.setState({ locality: e.target.value });
    }

    inputCityHandler = (e) => {
        this.setState({ city: e.target.value });
    }

    inputStateChangeHandler = (e) =>{
        this.setState({state_name : e.target.value})
    }

    inputPincodeHandler = (e) => {
        console.log(e.target.value)
        this.setState({ pincode: e.target.value });
    }

    handleStepper = (stepIndex) => {
        console.log(this.state.addressSelected)
        if(this.state.addressSelected.id === ""){
            alert("Selected valid address")
            return;
        }
        if(stepIndex === 2){
            if(this.state.paymentSelected.id === ""){
                alert("Select payment method")
                return;
            }
        }
        this.setState({stepperActiveStep : stepIndex });
        if(stepIndex === 1){
             this.getPaymentModes();
        }
    }

    // handleBack = (stepIndex) => {
    //     this.setState({stepperActiveStep : stepIndex });
    //     if(stepIndex === 1){
    //         // this.getPaymentModes();
    //     }
    // }


    paymentModeSelectionHandler = (event) =>{

        // paymentSelected

        let mode = {
            id:""
        }
        mode.id = event.target.value;
        // this.setState({...this.state.paymentSelected, id: event.target.value });
        this.setState({paymentSelected : event.target.value})
        sessionStorage.setItem("payment_id", event.target.value);
        console.log(sessionStorage.getItem("payment_id"))
    }


    getCoupon = () =>{
        let dataCoupon = null;
        let xhrCoupon = new XMLHttpRequest();
        let that = this;
        xhrCoupon.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(this.status === 200){
                    that.setState({
                        coupon: JSON.parse(this.responseText)
                    })   
                    console.log(that.state.coupon);
                    //calculate discount @ 50%
                    let discAmt = that.state.cartTotalAmount * .5;
                    that.setState({discountValue : discAmt})
                    that.setState({amountPayable : discAmt})
                }
            }
        });

        xhrCoupon.open("GET", this.props.baseUrl + "order/coupon/FLAT50");
        xhrCoupon.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        // xhrCoupon.setRequestHeader("coupon_name", "FLAT50");
        xhrCoupon.setRequestHeader("Content-Type", "application/json");
        xhrCoupon.setRequestHeader("Cache-Control", "no-cache");
        xhrCoupon.send(dataCoupon);

    }

    orderHander = () => {

        // this.setState({ snackbarStatus: true });

        if(this.state.addressSelected.id === ""){
            alert("Selected valid address")
            return;
        }
        
        if(this.state.paymentSelected.id === ""){
            alert("Select payment method")
            return;
        }

        // {
        //     "address_id": "string",
        //     "bill": 0,
        //     "coupon_id": "string",
        //     "discount": 0,
        //     "item_quantities": [
        //       {
        //         "item_id": "string",
        //         "price": 0,
        //         "quantity": 0
        //       }
        //     ],
        //     "payment_id": "string",
        //     "restaurant_id": "string"
        //   }

         let cartList=[];
        //  let item = {
        //      item_id:"",
        //      price:0,
        //      quantity:0
        //  }

        for(let item of this.props.location.orderSummary.cartList){
            let cartItem = {
                item_id:"",
                price:0,
                quantity:0
            }
   
            cartItem.item_id = item.id;
            cartItem.price = item.price;
            cartItem.quantity = item.quantity;
            cartList.push(cartItem);
        }

      //this.props.location.orderSummary.cartList
        let dataOrder = JSON.stringify({
            "address_id": this.state.addressSelected.id,
            "bill": this.state.cartTotalAmount,
            "coupon_id": this.state.coupon.id,
            "discount": 0,
            "item_quantities":  cartList,
            "payment_id": sessionStorage.getItem("payment_id"),
            "restaurant_id": this.props.location.orderSummary.restaurantDetails.id
        });

        console.log(dataOrder);

        let xhrSaveAddress = new XMLHttpRequest();
        let that = this;
        xhrSaveAddress.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
               if(this.status === 201){
                    that.setState({snackbarText : "Order placed successfully! Your order ID is " +JSON.parse(this.responseText).id });
                    that.setState({snackbarStatus : true});
                    
               }
               else{
                
                that.setState({snackbarText : "Unable to place your order! Please try again!"});
                that.setState({snackbarStatus : true});
               }
               console.log(JSON.parse(this.responseText));
            }
        });

        xhrSaveAddress.open("POST", "http://localhost:8080/api/order");
        //xhrSaveAddress.open("GET", this.props.baseUrl + "states/");
        xhrSaveAddress.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
        xhrSaveAddress.setRequestHeader("Cache-Control", "no-cache");
        xhrSaveAddress.send(dataOrder);
    } 

    closeSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    
        this.setState({ snackbarStatus: false });
    }
    

    
    openSnackar = (value) => {
        this.setState({ snackbarText: value});
        this.setState({ snackbarStatus: true });
    };



    render(){
        return(
            <div>
                <Header showSearchBar="false"/>
                <div className="checkout-div">
                    <div className="address-div">
                        <Stepper activeStep={this.state.stepperActiveStep}  orientation="vertical">
                            {this.state.steps.map((label, index) => (
                                <Step>
                                    <StepLabel>{label}</StepLabel>
                                    <StepContent>
                                        <div style={{display: this.state.stepperActiveStep === 0 ? "block" : "none"}}>
                                            <AppBar position="static">
                                                <Tabs value={this.state.value} onChange={this.switchAddressTabs} aria-label="simple tabs example">
                                                    <Tab label="EXISTING ADDRESS"/>
                                                    <Tab label="NEW ADDRESS"/>
                                                </Tabs>
                                            </AppBar>
                                            {this.state.value === 0
                                                ?<div className="delivery-address-div" value={this.state.value} index={0}>
                                                    {this.state.address.length > 0 
                                                    ?<GridList className="address-grid-list" cols={this.state.noOfCols} style={{flexWrap: 'nowrap'}}>
                                                    {this.state.address.map((add) => (
                                                        <GridListTile key={add.id} 
                                                            style={{ border : this.state.addressSelected.id === add.id ? "1px solid  rgba(245, 0, 87, 0.84)" : "0px solid",
                                                                     boxShadow: this.state.addressSelected.id === add.id ? "5px 5px rgba(245, 0, 87, 0.84)" : "0px 0px",
                                                                    //  marginTop:"10px",
                                                                     margin:"10px 0px",
                                                                     borderRadius: "3px",
                                                                     width:"33%"
                                                                  }}
                                                            //box-shadow: 5px 5px rgba(245, 0, 87, 0.84);
                                                            className = "addSelector"
                                                            >
                                                            <div className="address-card">
                                                            <div>{add.flat_building_name}</div>
                                                            <div>{add.locality}</div>
                                                            <div>{add.city}</div>
                                                            <div>{add.state.state_name}</div>
                                                            <div>{add.pincode}</div>
                                                            <IconButton className="selection-btn" onClick={() => this.addressSelectionHandler(add)}>
                                                                {this.state.addressSelected.id === add.id
                                                                    ?<CheckCircleIcon style={{ color:"green" }} />
                                                                    :<CheckCircleIcon/>
                                                                }
                                                            </IconButton>
                                                            </div>
                                                        </GridListTile>
                                                    ))}
                                                    </GridList>
                                                    :<div className="no-address-msg-div">There are no saved addresses! You can save an address using the 'New Address' tab or using your ‘Profile’ menu option.</div>
                                                    }
                                                </div>
                                                :<div>
                                                    <div className="address-form-control">
                                                        <FormControl required>
                                                            <InputLabel htmlFor="flatBuildingName">Flat / Building No.</InputLabel>
                                                            <Input id="flatBuildingName" type="text" flatBuildingName={this.state.flat_building_name} value={this.state.flat_building_name} onChange={this.inputFlatBuildingNameHandler} />
                                                            <FormHelperText className={this.state.flatNameRequired}>
                                                                <span className="red">{this.state.flatNameHelperText}</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <FormControl required>
                                                            <InputLabel htmlFor="locality">Locality</InputLabel>
                                                            <Input id="locality" type="text" locality={this.state.locality} value={this.state.locality} onChange={this.inputLocalityHandler} />
                                                            <FormHelperText className={this.state.localityRequired}>
                                                                <span className="red">{this.state.localityHelperText}</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <FormControl required>
                                                            <InputLabel htmlFor="city">City</InputLabel>
                                                            <Input id="city" type="text" city={this.state.city} value={this.state.city} onChange={this.inputCityHandler} />
                                                            <FormHelperText className={this.state.cityRequired}>
                                                                <span className="red">{this.state.cityHelperText}</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <FormControl required>
                                                            <InputLabel htmlFor="stateName">State</InputLabel>
                                                            {/* <Input id="stateName" type="list" stateName={this.state.state} value={this.state.state_name} onChange={this.stateNameHandler} /> */}
                                                            <Select
                                                             value = {this.state.state_name}
                                                             onChange = {this.inputStateChangeHandler}
                                                             MenuProps={MenuProps}>
                                                            {this.state.state_names.map((name) => (
                                                                    <MenuItem key={name.id} value={name}>
                                                                        {name.state_name}
                                                                    </MenuItem>
                                                            ))}
                                                            </Select>
                                                            <FormHelperText className={this.state.stateNameRequired}>
                                                                <span className="red">{this.state.stateNameHelperText}</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <FormControl required>
                                                            <InputLabel htmlFor="pincode">Pincode</InputLabel>
                                                            <Input id="pincode" type="text" pincode={this.state.pincode} value={this.state.pincode} onChange={this.inputPincodeHandler} />
                                                            <FormHelperText className={this.state.pincodeRequired}>
                                                                <span className="red">{this.state.pincodeHelperText}</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br /><br />
                                                        <Button variant="contained" color="secondary" onClick={this.saveAddressHandler}>SAVE ADDRESS</Button>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div style={{display: this.state.stepperActiveStep === 1 ? "block" : "none"}}>
                                            <div className="payment-div">
                                                <div>
                                                    <label className="payment-mode-header">Select Mode of Payment</label>
                                                    <br/>
                                                    {this.state.paymentModes.length > 0
                                                    ?<RadioGroup value={this.state.paymentMode} onChange={this.paymentModeSelectionHandler}>
                                                        {this.state.paymentModes.map((mode) =>(
                                                            <FormControlLabel className="payment-mode-form-label" value={mode.id} control={<Radio />}  label={mode.payment_name} />
                                                        ))}
                                                    </RadioGroup>
                                                    :""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Button
                                                disabled={this.state.stepperActiveStep === 0}
                                                onClick={() => this.handleStepper(0)}
                                                // className={classes.button}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={ this.state.stepperActiveStep === 0 ? () => this.handleStepper(1) : () => this.handleStepper(2)}
                                                // className={classes.button}
                                            >
                                                {this.state.stepperActiveStep === 1? 'Finish' : 'Next'}
                                            </Button>
                                        </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                        <div  className="end-msg-div" style={{display: this.state.stepperActiveStep === 2 ? "block" : "none"}}>
                                <span className="end-message-span">View the summary & place your order now!</span>
                                <br></br>
                                <Button className="change-order-button">Change</Button>
                        </div>
                    </div>
                    <div className="final-cart">
                        <Card className="cartCard">
                            <div className="cart-heading-div">
                                <span className="summary-cart-name-span">Summary</span>
                            </div>
                            <br/>
                            <div className="summary-cart-resturant-name-div">
                                <span className="summary-cart-resturant-name-span">{this.state.restaurant_name}</span>
                            </div>
                            {this.state.cartList.map( cartItem =>(

                                <div className="summary-cart-item" key={"div"+cartItem.id}>
                                    {cartItem.item_type === "VEG"
                                    ?<span className="cart-item-name-span"><FontAwesomeIcon icon={faStopCircle} style={{ color: 'green' }}/> {cartItem.item_name}</span>
                                    :<span className="cart-item-name-span"><FontAwesomeIcon icon={faStopCircle} style={{ color: 'red' }}/> {cartItem.item_name}</span>
                                    }
                                    <div className="cart-item-qunatity-div">
                                        <label className="summary-cart-item-quantity-label">{cartItem.quantity}</label>
                                    </div>
                                    <span className="cart-item-price-span"><FontAwesomeIcon icon={faRupeeSign}/> {cartItem.price}</span>
                                </div>
                            ))}

                            {this.state.coupon.id === "" ? <div/>
                            :<div>
                                <div className="coupon-container-div">
                                    <div className="coupon-details-div">
                                        <label className="coupon-heading-label">Coupon Code</label>
                                        <label className="coupon-code-value">FLAT 50</label>
                                    </div>
                                    <Button className="apply-button">
                                        Apply
                                    </Button>
                                </div>
                                <div className="net-amount-div">
                                    <span className="sub-total-label">Sub Total</span>
                                    <span> <FontAwesomeIcon className="inr-icon-color" icon={faRupeeSign}/> {this.state.cartTotalAmount}</span>
                                </div>
                                <div className="net-amount-div">
                                    <span className="sub-total-label">Discount</span>
                                    <span> <FontAwesomeIcon className="inr-icon-color" icon={faRupeeSign}/> {this.state.discountValue}</span>
                                </div>
                            </div>
                            }
                            <Divider />
                            <div className="net-amount-div">
                                <span>Net Amount</span>
                                <span> <FontAwesomeIcon className="inr-icon-color" icon={faRupeeSign}/> {this.state.amountPayable}</span>
                            </div>
                            <br/>
                            <Button className="checkout-button" variant="contained" color="primary" onClick={this.orderHander}>PLACE ORDER</Button>
                        </Card>
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
    };
}
export default Checkout;