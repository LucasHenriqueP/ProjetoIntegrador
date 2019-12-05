import auth from "@react-native-firebase/auth";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid
} from "react-native";
import { showMessage } from "react-native-flash-message";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import Geocoder from "react-native-geocoding";
import Login from "../Login/Login";
import Loading from "../../components/Loading";
import MLoading from "../../components/ModalLoading";
import * as Service from "./Service";
import * as Verify from "../../utils/verificaLogin";
import firestore from "@react-native-firebase/firestore";

const ref = firestore().collection("cursosPresenciais");

const Page1 = ({ navigation }) => {
  // Set an loading state whilst Firebase connects
  const [loading, setLoading] = useState(true);
  //transferir para service e verificar, mudar toda a estrutura
  const [user, setUser] = useState(false);
  const [email, setEmail] = useState(false);
  const [ModalLoading, setModalLoading] = useState(false);
  const [Lat, setLat] = useState(-24.0417429);
  const [Long, setLong] = useState(-52.3839641);
  const [Cursos, setCursos] = useState([]); // Initial empty array of Cursos
  const [marcadores, setMarcadores] = useState([]);
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (loading) setLoading(false);
    if (user) {
      showMessage({
        message: "Autenticado com sucesso!",
        type: "success",
        icon: "success",
        duration: 2000
      });
    }
  }

  function trocaLocalizacaoUser(local) {
    local = local.nativeEvent.coordinate;
    setLat(local.latitude);
    setLong(local.longitude);
  }

  async function carregaMarcadores() {
    var arraylocalizacoes = [];
    // Ignorar esse erro
    Cursos.forEach(curso => {
      Geocoder.from(curso.local)
        .then(json => {
          var location = json.results[0].geometry.location;
          var localizacao = {
            key: curso.id,
            latlng: {
              latitude: "",
              longitude: ""
            },
            title: curso.nome,
            description: curso.descricao
          };
          localizacao.latlng.latitude = location.lat;
          localizacao.latlng.longitude = location.lng;
          arraylocalizacoes.push(localizacao);
        })
        .catch(error => console.warn(error));
      setMarcadores(arraylocalizacoes);
    });
  }

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "µCursos permissão para localização",
          message:
            "µCursos necessita de permissão de acesso a sua localização " +
            "para encontrar os cursos mais perto de você.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can use the Location");
        return true;
      } else {
        // console.log("Location permission denied");
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    var subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // Ignorar esse erro
    Geocoder.init("AIzaSyA_pPgl2oQwlyHVizFnCUajLUbAG0RXNvE", {
      language: "pt-BR"
    });

    if (user && !Verify.userVerified() && !email) {
      showMessage({
        message: "Não esqueça de verificar o seu email!",
        description: "Depois disso, é necessário relogar",
        type: "warning",
        icon: "warning",
        duration: 4500
      });
    }
    // Se começar a dar erro, migrar para
    // https://github.com/react-native-community/react-native-geolocation
    requestLocationPermission().then(result => {
      if (result) {
        Geolocation.getCurrentPosition(
          position => {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    });

    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { nome, descricao, local } = doc.data();
        list.push({
          id: doc.id,
          nome,
          descricao,
          local
        });
      });
      setCursos(list);
    });
  }, []);

  useEffect(() => {
    carregaMarcadores();
  }, [Cursos]);

  if (loading) return <Loading />;

  if (!Verify.verificaLogin()) {
    return <Login navigation={navigation} />;
  }

  async function sendEmail() {
    setEmail(true);
    setModalLoading(true);
    Service.sendEmail();
    setModalLoading(false);
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        initialRegion={{
          latitude: Lat,
          longitude: Long,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        showsUserLocation={true}
        onUserLocationChange={trocaLocalizacaoUser}
        customMapStyle={estilomapa}
      >
        {marcadores.map(marker => (
          <Marker
            key={marker.key}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
            onCalloutPress={() => navigation.navigate("CursosP")}
          />
        ))}
      </MapView>
      <MLoading ModalLoading={ModalLoading} />
      <View style={styles.container}>
        {user && !auth().currentUser.emailVerified && (
          <View style={styles.topcenter}>
            <Text>Enviamos um link de ativação para o seu e-mail</Text>
            <TouchableOpacity onPress={() => sendEmail()} style={styles.touch}>
              <Text style={{ fontWeight: "bold" }}>
                {} Não o recebeu? Clique aqui! {}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  auth: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  topcenter: {
    position: "absolute",
    alignItems: "center",
    top: 0,
    width: "100%",
    backgroundColor: "#dfc24a"
  },
  touch: {
    height: 42,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#202a31",
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    marginBottom: 5
  },
  load: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});

const estilomapa = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e"
      }
    ]
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855"
      }
    ]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e"
      }
    ]
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c"
      }
    ]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948"
      }
    ]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c"
      }
    ]
  }
];
export default Page1;
