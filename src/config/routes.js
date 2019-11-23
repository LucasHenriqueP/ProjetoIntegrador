import React from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import IOSIcon from "react-native-vector-icons/Ionicons";

//import Example from "./Example";
import SideMenu from "../components/SideMenu";
import Main from "../screens/Main/Main";
import Cursos from "../screens/Cursos/Cursos";
import CursosEditar from "../screens/Cursos/Editar";
import CursosRegistrar from "../screens/Cursos/Registrar";
import CursosP from "../screens/CursosPresenciais/Cursos";
import CursosEditarP from "../screens/CursosPresenciais/Editar";
import CursosRegistrarP from "../screens/CursosPresenciais/Registrar";
import User from "../screens/User/User";
import CursosADM from "../screens/Admin/Cursos/Cursos";
import UsersADM from "../screens/Admin/Users/Users";
import Login from "../screens/Login/Login";
import Registrar from "../screens/Login/Registrar";
import ResetaSenha from "../screens/Login/ResetaSenha";

const SettingsStack = createStackNavigator(
  {
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
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.toggleDrawer}>
            <IOSIcon
              name="ios-menu"
              size={30}
              color="#fff"
              style={{ marginLeft: 20 }}
            />
          </TouchableOpacity>
        ),
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      })
    },
    CursosADM: {
      screen: CursosADM,
      navigationOptions: ({ navigation }) => ({
        title: "Lista de Cursos(Admin)",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      })
    },
    UsersADM: {
      screen: UsersADM,
      navigationOptions: ({ navigation }) => ({
        title: "Lista de Usuários(Admin)",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      })
    },
    User: {
      screen: User,
      navigationOptions: {
        headerTitle: "Perfil"
      }
    },
    Cursos: {
      screen: Cursos,
      navigationOptions: ({ navigation }) => ({
        title: "Lista de Cursos",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      })
    },
    CursosRegistrar: {
      screen: CursosRegistrar,
      navigationOptions: {
        headerTitle: "Criar Curso",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      }
    },
    CursosEditar: {
      screen: CursosEditar,
      navigationOptions: {
        headerTitle: "Editar Curso",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      }
    },
    CursosP: {
      screen: CursosP,
      navigationOptions: ({ navigation }) => ({
        title: "Lista de Cursos",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      })
    },
    CursosRegistrarP: {
      screen: CursosRegistrarP,
      navigationOptions: {
        headerTitle: "Criar Curso",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      }
    },
    CursosEditarP: {
      screen: CursosEditarP,
      navigationOptions: {
        headerTitle: "Editar Curso",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      }
    }
  },
  { headerLayoutPreset: "center" }
);

const AuthStack = createStackNavigator(
  {
    Landing: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    Registrar: {
      screen: Registrar,
      navigationOptions: {
        headerTitle: "Criar Conta",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      }
    },
    Senha: {
      screen: ResetaSenha,
      navigationOptions: {
        headerTitle: "Esqueceu a Senha?",
        headerStyle: {
          backgroundColor: "#000000"
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold"
        }
      }
    }
  },
  { headerLayoutPreset: "center" }
);

const MainDrawer = createDrawerNavigator(
  {
    Perfil: SettingsStack
  },
  {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get("window").width - 150
  }
);

const App = createSwitchNavigator({
  Auth: {
    screen: AuthStack
  },
  App: {
    screen: MainDrawer
  }
});

export default createAppContainer(App);
