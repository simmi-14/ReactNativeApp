import 'react-native-gesture-handler';
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './screens/LoginScreen'
import ProfileScreen from './screens/ProfileScreen'
import AsyncStorage from '@react-native-community/async-storage';

import { createStore } from 'redux';
import appReducer from './utility/Reducer';
import { Provider } from 'react-redux'
const store = createStore(appReducer);
store.subscribe(() => console.log("Store Updated:", store.getState()));

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isloggedin: null
		};
	}

	detectLogin = async () => {
		const token = await AsyncStorage.getItem('token');
		if (token) {
			this.setState({
				isloggedin: true
			})

		} else {
			this.setState({
				isloggedin: false
			})
		}
	}

	async componentDidMount() {
		this.detectLogin()
	}

	render() {
		const AuthStack = createStackNavigator(
			{
				Login: {
					screen: props => <LoginScreen {...props} />
				},
			},
			{
				swipeEnabled: true,
				initialRouteName:  'Login',
				defaultNavigationOptions: {
					header: null
				},
			}
		); 
		const ProfileStack = createStackNavigator(
			{
				Profile: {
					screen: props => <ProfileScreen {...props} />
				},
			},
			{
				swipeEnabled: true,
				initialRouteName:  'Profile',
				defaultNavigationOptions: {
					header: null
				},
			}
		); 
		const FullContainer = createSwitchNavigator(
			{
				Auth: {
					screen: AuthStack,
				},
				Home: {
					screen: ProfileStack,
					path: '',
				}
			},
			{
				initialRouteName:  this.state.isloggedin?'Home':'Auth',
			}
		);

		const AppFinal = createAppContainer(FullContainer);
		
		return (
			<Provider store={store} >
				<AppFinal/>
			</Provider>
		);
	};
};

export default App;