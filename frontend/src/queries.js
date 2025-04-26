import { gql } from "@apollo/client";

export const GET_TODO_LIST = gql`
  query todoList {
    todoList {
      id
      name
    }
  }
`;

export const ADD_ITEM_MUTATION = gql`
  mutation addItem($values: ItemInput) {
    addItem(values: $values)
  }
`;


// Esta mutação é usada para excluir um item da lista de tarefas
export const DELETE_ITEM_MUTATION = gql`
  mutation deleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

// Esta mutação é usada para atualizar um item da lista de tarefas
export const UPDATE_ITEM_MUTATION = gql`
  mutation updateItem($values: ItemInput) {
    updateItem(values: $values)
  }
`;