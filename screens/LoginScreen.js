import React from 'react';
import { Button, TextInput, Appbar, TouchableRipple } from 'react-native-paper';
import {
    StatusBar,
    KeyboardAvoidingView,
    Alert,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from "react-redux";
import {setToken, setName, setDOB, setEmail} from "../utility/Store";

const mapStateToProps = (state) => {
    return {
        u_name: state.u_name,
        u_token: state.u_token
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setToken(token) {
            dispatch(setToken(token))
        },
        setName(name) {
            dispatch(setName(name))
        },

        setDOB(dob) {
            dispatch(setDOB(dob))
        },
        setEmail(email) {
            dispatch(setEmail(email))
        },
        
    }
}

class LoginScreen extends React.Component {
    
    constructor(props) {
		super(props);
        this.state = {
            userid: '',
            password: '',
            isLoading:false
        };
    }

    sendCred = async () => {
        this.setState({
            isLoading:true
        }, ()=>{
            try {
                //Not sending params in GET request since it was not asked in document
                fetch("https://run.mocky.io/v3/87ea4e8e-0adf-41db-84fd-0b328e1aeb3f", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(res => res.json())
                .then(async (data) => {
                    await AsyncStorage.setItem('token', data.token);
                    this.props.setToken(data.token);
                    this.setState({
                        isLoading:false
                    },()=>{
                        this.props.navigation.navigate("Home");
                    });
                })
                .catch((err) => {
                    this.setState({
                        isLoading:false
                    },()=>{
                        console.log("Error login" + err);
                    });
                })
            } catch (error) {
                this.setState({
                    isLoading:false
                },()=>{
                    console.log("Error login again" + error);
                });
            }
        })
    }
    
    validateFields = () => {
        let decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (decimal.test(this.state.password) && reg.test(this.state.userid)) {
            this.sendCred();
            return true;
        } else if (!decimal.test(this.state.password) && !reg.test(this.state.userid)) {
            Alert.alert('Please enter valid email & password');
            return false;
        }
        else if (!decimal.test(this.state.password) ) {
            Alert.alert('Please enter valid password');
            return false;
        } else if (!reg.test(this.state.userid)) {
            Alert.alert('Please enter valid email');
            return false;
        }
    };
    
    
    fieldUpdate = (key, value) => {
        this.setState({ [key] : value });
    };

    render() {
        console.log("isLoading", this.state.isLoading);
        return (
            <>
                <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignContent:'center', backgroundColor:'#fffff0'}}>
                    <KeyboardAvoidingView behavior="position">
                    <StatusBar hidden={true} />
                    {/*<Appbar.Header style={{ backgroundColor: "blue" }} >
                        <Appbar.Content title="Login" color="#fff" />
                    </Appbar.Header>*/}

                        <Text style={{fontSize:48, alignSelf:'center', color:'#ffa500'}}>
                            Demo App
                        </Text>
                        <TextInput
                            label='User Id'
                            mode="outlined"
                            value={this.state.userid}
                            style={{ marginLeft: 18, marginRight: 18, marginTop: 18 }}
                            theme={{ colors: { primary: "#f08e25" } }}
                            onChangeText={(text)=>this.fieldUpdate('userid', text)}
                            />
                        <TextInput
                            label='Password'
                            mode="outlined"
                            secureTextEntry={true}
                            value={this.state.password}
                            theme={{ colors: { primary: "#f08e25" } }}
                            style={{ marginLeft: 18, marginRight: 18, marginTop: 18 }}
                            onChangeText={(text)=>this.fieldUpdate('password', text)}
                            />
                        <TouchableRipple
                            style={{ marginLeft: 18, marginRight: 18, marginTop: 38, marginBottom:20, padding:8, justifyContent: 'center',
                                backgroundColor:'#ffa500', borderRadius:10
                            }}
                            rippleColor="white"
                            onPress={() => this.validateFields()}>
                            {this.state.isLoading 
                                ?
                                    (<ActivityIndicator size="large" color="white" />)
                                :
                                    (<Text style={{fontSize:28, alignSelf:'center', color:'white'}}>
                                        Login
                                    </Text>)
                            }
                        </TouchableRipple>
                    </KeyboardAvoidingView>
                </View>
            </>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen); 