import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Alert, Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { styled } from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_ITEM_MUTATION, DELETE_ITEM_MUTATION, GET_TODO_LIST } from "./queries";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { getOperationName } from "@apollo/client/utilities";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContainerTop = styled.form`
  display: flex;
  background-color: #dcdcdc;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  border-radius: 5px;
`;

const ContainerList = styled.div`
  display: flex;
  width: 600px;
  background-color: #dcdcdc;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  border-radius: 5px;
`;
const ContainerListItem = styled.div`
  background-color: #efefef;
  padding: 10px;
  border-radius: 5px;
  max-height: 400px;
  overflow: auto;
`;

const ContainerButton = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
`;

const INITIAL_EDITING_STATE = {
  currentOpen: '',
  value: '',
  error: '',
  loadingDel: '',
  loadingSave: false,
}

export default function CheckboxList() {
  const { data } = useQuery(GET_TODO_LIST);
  const [addItem] = useMutation(ADD_ITEM_MUTATION);
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);
  const [editing, setEditing] = useState(INITIAL_EDITING_STATE);
  const [alert, setAlert] = useState({ visible: false, message: "", severity: "" });

  const onSubmit = async (event) => {
    setEditing((prevState) => ({ ...prevState, loadingSave: true }))// Define o estado de carregamento para true
    event.preventDefault();
    
    try {
      // Simula um atraso de 2 segundos antes de executar
      await new Promise((resolve) => setTimeout(resolve, 2000))

      await addItem({
        variables: {
          values: {
            name: editing.value,
          },
        },
        awaitRefetchQueries: true,
        refetchQueries: [getOperationName(GET_TODO_LIST)],
      })

      setAlert({ visible: true, message: "Item Adicionado!", severity: "success" })
    } catch (error) {
      setAlert({ visible: true, message: "Erro ao Adicionar o item!", severity: "error" })
    } finally {
      setEditing((prevState) => ({ ...prevState, loadingSave: false, value: '' })) // Limpa os estados
      setTimeout(() => {
        setAlert({ ...alert, visible: false })
      }, 2000) // Reseta o estado do alerta após 2 segundos
    }
  }

  const onDelete = async (idItem) => {
    setEditing((prevState) => ({ ...prevState, loadingDel: idItem })) // Define o ID do item que está sendo deletado
    
    try {
      // Simula um atraso de 2 segundos antes de executar
      await new Promise((resolve) => setTimeout(resolve, 2000))

      await deleteItem({
        variables: {
          id: idItem, // Passa o ID do item para a mutação
        },
        awaitRefetchQueries: true, // Garante que a lista será atualizada
        refetchQueries: [getOperationName(GET_TODO_LIST)], // Reexecuta a query para buscar a lista atualizada
      })
          
        setAlert({ visible: true, message: "Item deletado com sucesso!", severity: "success" })
      } catch (error) {
        setAlert({ visible: true, message: "Erro ao deletar o item!", severity: "error" })
      } finally {
        setTimeout(() => {
          setAlert({ ...alert, visible: false })
        }, 2000) // Reseta o estado do alerta após 2 segundos
    }
  }

  const onUpdate = async (event) => {
    console.log(onUpdate);
    // Aqui você irá implementar a chamada para o backend de edição de item
  };

  const onFilter = async (event) => {
    console.log(onFilter);
    // Aqui você irá implementar a chamada para o backend para fazer o filtro
  };

  return (
    <Container>
      <ContainerList>
        <Title>TODO LIST</Title>
        <ContainerTop onSubmit={onSubmit}>
          <TextField
            id="item"
            label="Digite aqui"
            value={ editing.value }
            type="text"
            variant="standard"
            onChange={(e) => setEditing((prevState) => ({ ...prevState, value: e?.target?.value }))}
          />
          <ContainerButton>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              color="info"
              onClick={onFilter}
            >
              Filtrar
            </Button>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              color="success"
              type="submit"
              disabled={ editing.value?.length === 0 || editing.value?.trim() === '' } // Desabilita o botão se o campo estiver vazio
            >
              { editing.loadingSave ? <CircularProgress color="primary" size={ '25px' } /> : 'Salvar' }
            </Button>
          </ContainerButton>
        </ContainerTop>
        <List sx={{ width: "100%" }}>
          { data?.todoList?.length > 0 && 
            <ContainerListItem>
              { data?.todoList?.map((value, index) => {
                return (
                  <ListItem
                    key={index}
                    disablePadding
                    sx={{
                      borderRadius: "5px",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  > 
                    {/* <ListItemButton dense> */}
                      <ListItemText id={index} primary={value?.name} />
                      <IconButton onClick= { onUpdate }>
                        <Edit/>
                      </IconButton>
                      <IconButton onClick={ () => onDelete(value.id) } /* Passa o ID do item para a função de deletar */ > 
                        { editing.loadingDel === value.id ? <CircularProgress color="error" size={ '25px' } /> : <Delete color="error"  /> } 
                      </IconButton>
                    {/* </ListItemButton> */}
                  </ListItem>
                );
              })}
            </ContainerListItem>
          }
        </List>
      </ContainerList>
      { alert.visible && (
        <Alert 
          severity={ alert.severity }  
          sx={{ position: "absolute", bottom: 0, margin: "10px" }}
        >
          { alert.message }
        </Alert>
      )}
    </Container>
  );
}
