
import React from 'react';
import { TouchableRipple, Button, Appbar } from 'react-native-paper';
import {
    KeyboardAvoidingView,
    StatusBar,
    Text,
    View
} from 'react-native';
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import {setToken, setName, setDOB, setEmail} from "../utility/Store";

const mapStateToProps = (state) => {
    return {
        u_name: state.u_name,
        u_dob: state.u_dob,
        u_email: state.u_email,
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

class ProfileScreen extends React.Component {

    constructor(props) {
		super(props);
        this.state = {
            eamil: '',
            name: '',
            dob:'',
            isLoading:false
        };
    }

    async componentDidMount() { 
        const token = await AsyncStorage.getItem('token');
        if(token)
        {
            this.props.setToken(token);
            this.getProfile();
        }
        else
            this.logout();
    }

    getProfile = async () => {
        this.setState({
            isLoading:true
        }, ()=>{
            try
            {
                fetch("https://run.mocky.io/v3/45a55679-d823-458b-95bc-29fc5f5c8e59", {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + this.props.u_token,
                        'Content-Type': 'application/json'
                    },
                })
                .then(res => res.json())
                .then(async (data) => {
                    this.setState({
                        isLoading:false
                    },()=>{
                        this.props.setName(data.name);
                        this.props.setDOB(data.dob);
                        this.props.setEmail(data.email);
                    });
                })
                .catch((err) => {
                    this.setState({
                        isLoading:false
                    },()=>{
                        console.log("Error fetching data" + err);
                    });
                })
            } catch (error) {
                this.setState({
                    isLoading:false
                },()=>{
                    console.log("Error fetching data again" + error);
                });
            }
        })
    }

    logout = () => {
        AsyncStorage.clear().then(() => {
            this.props.navigation.navigate('Auth');
        })
    }

    render(){
        return (
            <>
                <View style={{flex:1, flexDirection:'column', alignContent:'center', marginTop:30, backgroundColor:'#fffff0'}}>
                    <KeyboardAvoidingView behavior="position">
                        <StatusBar hidden={true} /> 
                        <Text style={{fontSize:32, alignSelf:'center', color:'#ffa500'}}>
                            {this.state.isLoading?'Loading':'Welcome ' + this.props.u_name}
                        </Text>
                        <Text style={{ fontSize:18, marginLeft: 18, marginRight: 18, marginTop: 38, color:'#ffa500' }}>
                            Profile Details
                        </Text>
                        <Text style={{ marginLeft: 18, marginRight: 18, marginTop: 18 }}>
                            Your DOB is - {(this.props.u_dob && !this.state.isLoading)?this.props.u_dob:'Loading'}
                        </Text>
                        <Text style={{ marginLeft: 18, marginRight: 18, marginTop: 18 }}>
                            Your Email is - {(this.props.u_email && !this.state.isLoading)?this.props.u_email:'Loading'}
                        </Text>
                        {/*
                            <Button
                                mode="contained"
                                color="#FF69B4"
                                contentStyle={{ height: 50 }}
                                labelStyle={{ color: "white", fontSize: 18 }}
                                style={{ marginLeft: 18, marginRight: 18, marginTop: 18, }}
                                onPress={() => this.logout()}>
                                Logout
                            </Button>
                        */}
                        <TouchableRipple
                            style={{ marginLeft: 18, marginRight: 18, marginTop: 38, marginBottom:20, padding:8, justifyContent: 'center',
                                backgroundColor:'#ffa500', borderRadius:10
                            }}
                            rippleColor="white"
                            onPress={() => this.logout()}>
                                <Text style={{fontSize:28, alignSelf:'center', color:'white'}}>
                                    Logout
                                </Text>
                        </TouchableRipple>
                    </KeyboardAvoidingView>
                </View>
            </>
        );
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);