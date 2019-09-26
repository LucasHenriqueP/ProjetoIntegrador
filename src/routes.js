import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main'
import cursos from './pages/Cursos'

const AppNavigator = createStackNavigator({
    // For each screen that you can navigate to, create a new entry like this:
    Main: {
        // `MainScreen` is a React component that will be the main content of the screen.
        screen: Main,
        // When `MainScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            title: "µCursos",
            headerStyle: {
                backgroundColor: "#000000"
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
            }
        }),
    },
    Cursos: {
        // `MainScreen` is a React component that will be the main content of the screen.
        screen: cursos,
        // When `MainScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            title: "Lista de Cursos(Admin)",
            headerStyle: {
                backgroundColor: "#000000"
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: "bold",
            }
        }),
    },
}, { headerLayoutPreset: 'center' });

export default createAppContainer(AppNavigator);