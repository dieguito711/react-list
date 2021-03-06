import React from 'react';
import './index.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button } from "react-bulma-components";

const DeleteButton = props => {
    const {
        id,
        handleDeleteEmployee
    } = props;

    return (
        <Button className='button is-outlined is-danger' onClick={() => handleDeleteEmployee(id)}>
            <span>Eliminar</span>
            <span className='icon is-small'>
                <i className='fas fa-trash' />
            </span>
        </Button>
    )
}

export default DeleteButton;