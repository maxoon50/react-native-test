// Components/Search.js

import React from 'react'
import {StyleSheet, View, TextInput, Button, FlatList, ActivityIndicator} from 'react-native'
import FilmItem from './FilmItem';
import FilmList from './FilmList';

import {getFilmsFromApiWithSearchedText} from '../API/TMDBApi';
import {connect} from "react-redux";

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.movieSearched = "";
        this.page = 1;
        this.totalPages = 2;
        this.state = {
            films: [],
            isLoading: false
        };
        this._loadFilms = this._loadFilms.bind(this);
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                </View>
            )
        }
    }



    _searchTextInputChanged(text) {
        this.movieSearched = text;
    }

    _searchFilms() {
        this.setState({films: []}, () => {
            this._loadFilms();
        });

    }

    _loadFilms() {
        if (this.movieSearched.length > 0) {
            this.setState({isLoading: true});
            getFilmsFromApiWithSearchedText(this.movieSearched, this.page + 1).then(res => {
                this.setState({
                    films: [...this.state.films, ...res.results],
                    isLoading: false
                });
                this.totalPages = res.total_pages;
                this.page++;
                console.log(this.totalPages)
            });
        }
    }

    render() {

        return (
            <View style={styles.mainContainer}>
                <TextInput style={styles.textinput}
                           placeholder='Titre du film'
                           onChangeText={(text) => this._searchTextInputChanged(text)}
                           onSubmitEditing={() => this._searchFilms()}
                />
                <Button style={{height: 50}}
                        title='Rechercher'
                        onPress={() => this._searchFilms()}
                />
                <FilmList
                    films={this.state.films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
                    navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
                    loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
                    page={this.page}
                    totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
                />
   {/*             <FlatList
                    data={this.state.films}
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
                        if (this.state.films.length > 0 && this.page < this.totalPages) { // On vérifie également qu'on n'a pas atteint la fin de la pagination (totalPages) avant de charger plus d'éléments
                            this._loadFilms()
                        }
                    }}
                />*/}
                {this._displayLoading()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    mainContainer: {
        flex: 1,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

//connect the props filmDetail with application global states
const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
};

export default connect(mapStateToProps)(Search)