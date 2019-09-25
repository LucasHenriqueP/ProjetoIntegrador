import React from 'react';
import { List } from 'react-native-paper';

function Todo({ id, nome, descricao, rating }) {
    nome = 'Nome "' + nome + '" ID: ' + id;
    descricao = 'Descrição: "' + descricao + '"' + ' Rating: ' + rating
    return (
        <List.Item
            title={nome}
            description={descricao}
        />
    );
}

export default React.memo(Todo);