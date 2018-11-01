import React from "react";
import { StyleSheet, FlatList } from 'react-native'
import FilmItem from './FilmItem';
import {connect} from "react-redux";

class FilmList extends React.Component {

/*    films={this.state.films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
page={this.page}
totalPages={this.totalPages}*/
    constructor(props) {
        super(props);
        this.state = {
            films: [],
        };
    }
    _isFavorite(film) {
        if (this.props.favoritesFilm.findIndex(item => item.id === film.id) !== -1) {
            return true;
        }
        return false;
    }

    _displayFilmDetails = (id) => {
        this.props.navigation.navigate("FilmDetail", {filmId : id});
    };

    render(){
        return(
        <FlatList
            data={this.props.films}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) =>
                <FilmItem film={item}
                          displayDetail={this._displayFilmDetails}
                          favorite={this._isFavorite(item)}
                >
                    {item.title}
                </FilmItem>}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                console.log(this.props)
                if (this.props.films.length > 0 && this.props.page < this.props.totalPages) {
                    console.log(this.props);
                    // On appelle la méthode loadfilm du component Search pour charger plus de film
                    this.props.loadFilms()
                }
            }}
        />
        )
    }


}

const styles = StyleSheet.create({
    list: {
        flex: 1
    }
})
const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
};

export default connect(mapStateToProps)(FilmList)
