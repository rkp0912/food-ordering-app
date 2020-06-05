import React, { Component } from 'react';
import './Header.css';
import SearchIcon from '@material-ui/icons/Search';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ReactDOM from 'react-dom';
import Home from '../home/Home';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            value: 0,
            usernameRequired: "dispNone",
            username: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            contactRequired: "dispNone",
            contact: "",
            registrationSuccess: false,
            emailHelperText: "required",
            passwordHelperText: "required",
            contactHelpText: "required",
            loginUsernameHelperText: "required",
            loginPasswordHelperText: "required",
            registrationHelperText: "",
            loginHelperText: "",
            searchString: "",
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
    }
    openModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            value: 0,
            usernameRequired: "dispNone",
            username: "",
            loginPasswordRequired: "dispNone",
            loginPassword: "",
            firstnameRequired: "dispNone",
            firstname: "",
            lastnameRequired: "dispNone",
            lastname: "",
            emailRequired: "dispNone",
            email: "",
            registerPasswordRequired: "dispNone",
            registerPassword: "",
            contactRequired: "dispNone",
            contact: "",
            emailHelperText: "required",
            passwordHelperText: "required",
            contactHelpText: "required",
            loginUsernameHelperText: "required",
            loginPasswordHelperText: "required",
            registrationHelperText: "",
            loginHelperText: "",
            searchString: ""
        });
    }

    closeModalHandler = () => {
        this.setState({ modalIsOpen: false });
    }

    tabChangeHandler = (event, value) => {
        this.setState({ value });
    }

    loginClickHandler = () => {
        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
        this.state.loginPassword === "" ? this.setState({ loginPasswordRequired: "dispBlock" }) : this.setState({ loginPasswordRequired: "dispNone" });

        if(this.state.username === "" || this.state.loginPassword === "" ){
            return;
        }

        var contactRegex = /^\d{10}$/
        if(contactRegex.test(this.state.username) === false){
            this.setState({ loginUsernameHelperText: "Invalid Contact" });
            this.setState({ usernameRequired: "dispBlock" });
            return;
        }

        let dataLogin = null;
        let xhrLogin = new XMLHttpRequest();
        let that = this;
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(this.status === 200){
                    sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                    sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));
                    that.setState({
                        loggedIn: true
                    });
                    that.setState({
                        username: JSON.parse(this.responseText).first_name
                    })
                    that.closeModalHandler();
                }
                else{
                    that.setState({
                        loginHelperText: JSON.parse(this.responseText).message
                    })
                }
            }
        });

        xhrLogin.open("POST", "http://localhost:8080/api/customer/login");
        xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.username + ":" + this.state.loginPassword));
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(dataLogin);
    }

    inputUsernameChangeHandler = (e) => {
        this.setState({ username: e.target.value });
    }

    inputLoginPasswordChangeHandler = (e) => {
        this.setState({ loginPassword: e.target.value });
    }

    registerClickHandler = () => {
        this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" });
        this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" });
        this.state.registerPassword === "" ? this.setState({ registerPasswordRequired: "dispBlock" }) : this.setState({ registerPasswordRequired: "dispNone" });
        this.state.contact === "" ? this.setState({ contactRequired: "dispBlock" }) : this.setState({ contactRequired: "dispNone" });
        this.setState({registrationSuccess: false})

        if(this.state.firstname === "" || this.state.email === "" || this.state.registerPassword === "" || this.state.contact === ""){
            return;
        }

        var emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if(emailRegex.test(this.state.email) === false){
            console.log("email regex");
            this.setState({ emailHelperText: "Invalid Email" });
            this.setState({ emailRequired: "dispBlock" });
            return;
        }

        var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
        if(passwordRegex.test(this.state.registerPassword) === false){
            this.setState({ passwordHelperText: "Password must contain atlease one capital letter, one small letter, one number and one special character" });
            this.setState({ registerPasswordRequired: "dispBlock" });
            return;
        }

        var contactRegex = /^\d{10}$/
        if(contactRegex.test(this.state.contact) === false){
            this.setState({ contactHelpText: "Contact No. must contain only numbers and must be 10 digits long" });
            this.setState({ contactRequired: "dispBlock" });
            return;
        }

        let dataSignup = JSON.stringify({
            "email_address": this.state.email,
            "first_name": this.state.firstname,
            "last_name": this.state.lastname,
            "contact_number": this.state.contact,
            "password": this.state.registerPassword
        });

        console.log(dataSignup);

        let xhrSignup = new XMLHttpRequest();
        let that = this;
        xhrSignup.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
               if(this.status === 201){
                    that.openModalHandler();
               }
               else{
                    that.setState({
                        registrationHelperText: JSON.parse(this.responseText).message
                    });
               }
               console.log(JSON.parse(this.responseText));
            }
        });

        xhrSignup.open("POST", "http://localhost:8080/api/customer/signup");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.setRequestHeader("Cache-Control", "no-cache");
        xhrSignup.send(dataSignup);
    }

    inputFirstNameChangeHandler = (e) => {
        this.setState({ firstname: e.target.value });
    }

    inputLastNameChangeHandler = (e) => {
        this.setState({ lastname: e.target.value });
    }

    inputEmailChangeHandler = (e) => {
        this.setState({ email: e.target.value });
    }

    inputRegisterPasswordChangeHandler = (e) => {
        this.setState({ registerPassword: e.target.value });
    }

    inputContactChangeHandler = (e) => {
        this.setState({ contact: e.target.value });
    }

    logoutHandler = (e) => {

        let dataLogout = null;
        let xhrLogout = new XMLHttpRequest();
        let that = this;
        xhrLogout.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                sessionStorage.removeItem("uuid");
                sessionStorage.removeItem("access-token");
        
                that.setState({
                    loggedIn: false,
                    username: ""
                });
                ReactDOM.render(<Home/>, document.getElementById('root'));
                console.log(JSON.parse(this.responseText))
            }
        });

        xhrLogout.open("POST", "http://localhost:8080/api/customer/logout");
        xhrLogout.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("access-token"));
        xhrLogout.setRequestHeader("Content-Type", "application/json");
        xhrLogout.setRequestHeader("Cache-Control", "no-cache");
        xhrLogout.send(dataLogout);

    }

    inputSearchStringChangeHandler = (e) => {
        this.setState({ searchString: e.target.value });
        console.log(this.state.searchString)
        this.props.restaurantSubString(this.state.searchString);    

        // let dataList = [];
        // for(let item of this.state.pageData){
        //     let post = item;
        //     post.filter="Normal";
        //     dataList.push(post);
        // }
        // this.setState({pageData:dataList})

        // if(this.state.searchString !== "")
        // {
        //     let dataList = [];
        //     for(let item of this.state.pageData){
        //         let post = item;
        //         if(post.caption.text.split("\n")[0].toLowerCase().includes(this.state.searchString.toLowerCase()) === false){
        //             post.filter = "";
        //         }
        //         dataList.push(post);
        //     }
        // }
    }


    render(){        
        return(
            <div>
                <header className="app-header">
                    <label className="app-text"><FastfoodIcon className="food-icon"/></label>
                    <div className="app-sub-header">
                        <div className="search-div">
                            <div className="search-icon">
                                <SearchIcon/>
                            </div>
                            <FormControl>
                                <Input id="username" className="search-text" type="text" placeholder="Search by Restaurant Name" onChange={this.inputSearchStringChangeHandler}/>
                            </FormControl>
                        </div>
                    </div>
                    {/* When no user user is logged in display login button */}
                    {this.state.loggedIn === false &&
                        <Button className="login-button" variant="contained" startIcon={<AccountCircleIcon />} onClick={this.openModalHandler}>
                            Login
                        </Button>
                    }
                    {/* When user loggedin display pop-up button */}
                    {this.state.loggedIn === true && 
                        <PopupState className = "popup-user-menu" variant="popover" popupId="demo-popup-menu">
                                {(popupState) => (
                                    <React.Fragment>
                                        <Button  className="popup-user-button" variant="contained" color="default" searchbar={this.state.searchString} startIcon={<AccountCircleIcon />} {...bindTrigger(popupState)}>
                                            {this.state.username}
                                        </Button>
                                        <Menu {...bindMenu(popupState)} className="menu-container">
                                            <MenuItem onClick={this.profile}>My Profile</MenuItem>
                                            <MenuItem onClick={this.logoutHandler}>Logout</MenuItem>
                                        </Menu>
                                    </React.Fragment>
                                )}
                        </PopupState>
                    }
                </header>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeModalHandler}
                    style={customStyles}
                >
                    <Tabs className="tabs" value={this.state.value} onChange={this.tabChangeHandler}>
                        <Tab label="Login" />
                        <Tab label="Signup" />
                    </Tabs>

                    {this.state.value === 0 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="username">Contact No.</InputLabel>
                                <Input id="username" type="text" username={this.state.username} onChange={this.inputUsernameChangeHandler} />
                                <FormHelperText className={this.state.usernameRequired}>
                                    <span className="red">{this.state.loginUsernameHelperText}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                                <Input id="loginPassword" type="password" loginpassword={this.state.loginPassword} onChange={this.inputLoginPasswordChangeHandler} />
                                <FormHelperText className={this.state.loginPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                                <FormControl>
                                    <FormHelperText>
                                        <span className="red">{this.state.loginHelperText}</span>
                                    </FormHelperText>
                                </FormControl>
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.loginClickHandler}>LOGIN</Button>
                        </TabContainer>
                    }

                    {this.state.value === 1 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="firstname">First Name</InputLabel>
                                <Input id="firstname" type="text" firstname={this.state.firstname} onChange={this.inputFirstNameChangeHandler} />
                                <FormHelperText className={this.state.firstnameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl>
                                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                                <Input id="lastname" type="text" lastname={this.state.lastname} onChange={this.inputLastNameChangeHandler} />
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="text" email={this.state.email} onChange={this.inputEmailChangeHandler} />
                                <FormHelperText className={this.state.emailRequired}>
                                    <span className="red">{this.state.emailHelperText}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="registerPassword">Password</InputLabel>
                                <Input id="registerPassword" type="password" registerpassword={this.state.registerPassword} onChange={this.inputRegisterPasswordChangeHandler} />
                                <FormHelperText className={this.state.registerPasswordRequired}>
                                    <span className="red">{this.state.passwordHelperText}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                                <Input id="contact" type="text" contact={this.state.contact} onChange={this.inputContactChangeHandler} />
                                <FormHelperText className={this.state.contactRequired}>
                                    <span className="red">{this.state.contactHelpText}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            {/* {this.state.registrationSuccess === true &&
                                <FormControl>
                                    <span className="successText">
                                        {this.state.registrationHelperText}
                                    </span>
                                </FormControl>
                            } */}
                            <FormControl>
                                <FormHelperText>
                                    <span className="red">{this.state.registrationHelperText}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={this.registerClickHandler}>SIGNUP</Button>
                        </TabContainer>
                    }
                </Modal>
            </div>
        )
    }
}

export default Header;
